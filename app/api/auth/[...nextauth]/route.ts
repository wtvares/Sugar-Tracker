import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Check environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set!')
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    return null
  }
  
  try {
    return createClient(url, key)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const supabase = getSupabaseClient()
        if (!supabase) {
          console.error('Supabase not configured')
          return null
        }

        try {
          const parsed = loginSchema.parse(credentials)
          
          const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', parsed.email)
            .single()

          if (fetchError || !user) {
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                email: parsed.email,
                password_hash: parsed.password,
                created_at: new Date().toISOString()
              })
              .select()
              .single()

            if (createError || !newUser) {
              return null
            }

            if (newUser.password_hash === parsed.password) {
              return {
                id: newUser.id,
                email: newUser.email,
              }
            }
            return null
          }

          if (user.password_hash === parsed.password) {
            return {
              id: user.id,
              email: user.email,
            }
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Only export handler if NEXTAUTH_SECRET exists
if (!process.env.NEXTAUTH_SECRET) {
  console.error('ERROR: NEXTAUTH_SECRET environment variable is not set!')
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
