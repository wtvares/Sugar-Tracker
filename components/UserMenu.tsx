'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="text-sm text-warmgray-500">Loading...</div>
  }

  if (!session) {
    return (
      <Link href="/auth/signin" className="btn btn-primary text-sm">
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-warmgray-600">{session.user?.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="btn btn-ghost text-sm"
      >
        Sign Out
      </button>
    </div>
  )
}
