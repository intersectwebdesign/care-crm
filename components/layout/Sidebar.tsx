import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { UserRole } from '@/types'
import { navItemsForRole } from './nav-items'
import { LogoutButton } from './LogoutButton'

export function Sidebar({ role, fullName }: { role: UserRole; fullName: string | null }) {
  const items = navItemsForRole(role)
  const name = fullName ?? 'Unnamed user'

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="border-b border-gray-100 px-4 py-4">
        <span className="text-sm font-semibold text-gray-900">Care CRM</span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Avatar name={name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{name}</p>
            <p className="truncate text-xs capitalize text-gray-500">{role.replace('_', ' ')}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  )
}
