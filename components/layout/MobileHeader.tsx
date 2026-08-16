import { Avatar } from '@/components/ui/Avatar'
import { LogoutButton } from './LogoutButton'

export function MobileHeader({ fullName }: { fullName: string | null }) {
  const name = fullName ?? 'Unnamed user'

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
      <span className="text-sm font-semibold text-gray-900">Care CRM</span>
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <LogoutButton className="text-xs" />
      </div>
    </header>
  )
}
