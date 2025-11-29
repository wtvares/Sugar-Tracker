'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, CalendarDaysIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid, CalendarDaysIcon as CalendarDaysIconSolid, ClockIcon as ClockIconSolid, Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'

const Tab = ({ href, icon: Icon, iconSolid: IconSolid, label }: { href: string, icon: any, iconSolid: any, label: string }) => {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))
  const IconComponent = active ? IconSolid : Icon
  
  return (
    <Link 
      href={href} 
      className={`flex-1 flex flex-col items-center py-2.5 transition-all duration-200 ${
        active 
          ? 'text-lavender-700' 
          : 'text-warmgray-500 hover:text-warmgray-700'
      }`}
    >
      <IconComponent className={`w-6 h-6 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  )
}

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warmgray-200 md:hidden z-50 shadow-lg">
      <div className="flex items-center justify-between px-2 pb-safe">
        <Tab href="/" icon={HomeIcon} iconSolid={HomeIconSolid} label="Home" />
        <Tab href="/daily" icon={ClockIcon} iconSolid={ClockIconSolid} label="Daily" />
        <Tab href="/weekly" icon={CalendarDaysIcon} iconSolid={CalendarDaysIconSolid} label="Weekly" />
        <Tab href="/settings" icon={Cog6ToothIcon} iconSolid={Cog6ToothIconSolid} label="Settings" />
      </div>
    </nav>
  )
}
