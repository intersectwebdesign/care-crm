'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className={cn('flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800', className)}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}
