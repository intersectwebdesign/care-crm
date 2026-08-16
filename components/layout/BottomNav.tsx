import Link from 'next/link'
import { UserRole } from '@/types'
import { navItemsForRole } from './nav-items'

export function BottomNav({ role }: { role: UserRole }) {
  // Cap at 5 items on the phone tab bar — coordinators/admins with full nav
  // access still get everything via the desktop Sidebar at md: and up.
  const items = navItemsForRole(role).slice(0, 5)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-gray-500 hover:text-blue-600"
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
