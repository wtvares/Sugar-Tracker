import './globals.css'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import { Providers } from './providers'
import UserMenu from '@/components/UserMenu'

export const metadata = {
  title: 'Cravings & Emotions Tracker',
  description: 'Daily sugar cravings and emotional routine tracker'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="bg-white border-b border-warmgray-200 sticky top-0 z-10">
            <div className="container py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold text-lavender-700">Cravings Tracker</Link>
              <div className="hidden md:flex gap-4 text-sm items-center">
                <Link href="/daily" className="hover:underline">Daily</Link>
                <Link href="/weekly" className="hover:underline">Weekly</Link>
                <Link href="/settings" className="hover:underline">Settings</Link>
                <UserMenu />
              </div>
            </div>
          </header>
          <main className="container py-4 mb-20 md:mb-8">{children}</main>
          <NavBar />
        </Providers>
      </body>
    </html>
  )
}
