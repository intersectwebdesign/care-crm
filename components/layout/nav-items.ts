import { LayoutDashboard, Users, UserCog, Inbox, FolderKanban, Headset, Settings, LucideIcon } from 'lucide-react'
import { NAV_ROLES, UserRole } from '@/types'

export interface NavItem {
  key: keyof typeof NAV_ROLES
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'intake', href: '/intake', label: 'Intake', icon: Inbox },
  { key: 'clients', href: '/clients', label: 'Clients', icon: Users },
  { key: 'contractors', href: '/contractors', label: 'Staff', icon: UserCog },
  { key: 'projects', href: '/projects', label: 'Projects', icon: FolderKanban },
  { key: 'helpdesk', href: '/helpdesk', label: 'Helpdesk', icon: Headset },
  { key: 'settings', href: '/settings', label: 'Settings', icon: Settings },
]

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => NAV_ROLES[item.key]?.includes(role))
}
