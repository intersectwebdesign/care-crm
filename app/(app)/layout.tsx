import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { MobileHeader } from '@/components/layout/MobileHeader'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name, contractor_id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={profile.role} fullName={profile.full_name} />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader fullName={profile.full_name} />
        <main className="flex-1 px-4 py-4 pb-20 md:px-8 md:py-8 md:pb-8">{children}</main>
      </div>
      <BottomNav role={profile.role} />
    </div>
  )
}
