import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const authOptions = {
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

        try {
          const parsed = loginSchema.parse(credentials)
          
          // Check if user exists
          const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', parsed.email)
            .single()

          if (fetchError || !user) {
            // Try to create new user
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                email: parsed.email,
                password_hash: parsed.password, // In production, hash this!
                created_at: new Date().toISOString()
              })
              .select()
              .single()

            if (createError || !newUser) {
              return null
            }

            // Verify password (in production, use bcrypt)
            if (newUser.password_hash === parsed.password) {
              return {
                id: newUser.id,
                email: newUser.email,
              }
            }
            return null
          }

          // Verify password (in production, use bcrypt)
          if (user.password_hash === parsed.password) {
            return {
              id: user.id,
              email: user.email,
            }
          }

          return null
        } catch {
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
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
