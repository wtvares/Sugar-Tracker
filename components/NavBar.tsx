'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, CalendarDaysIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const Tab = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))
  return (
    <Link href={href} className={`flex-1 flex flex-col items-center py-2 ${active ? 'text-lavender-700' : 'text-warmgray-500'}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  )
}

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warmgray-200 md:hidden">
      <div className="flex items-center justify-between px-2">
        <Tab href="/" icon={HomeIcon} label="Home" />
        <Tab href="/daily" icon={ClockIcon} label="Daily" />
        <Tab href="/weekly" icon={CalendarDaysIcon} label="Weekly" />
        <Tab href="/settings" icon={Cog6ToothIcon} label="Settings" />
      </div>
    </nav>
  )
}
