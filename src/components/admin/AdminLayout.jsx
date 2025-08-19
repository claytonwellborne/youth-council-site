import React, { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { supabase } from '../../lib/supabase'

export default function AdminLayout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) setUser(session?.user ?? null)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription?.unsubscribe()
  }, [])

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'Admin'

  const title =
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    'Member'

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-4">
          <div>
            <div className="text-xl font-extrabold bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
              {displayName}
            </div>
            <div className="text-sm italic text-zinc-600 -mt-1">{title}</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-900">View site</Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-blue-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white overflow-hidden grid place-items-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" className="w-5 h-5 text-zinc-700">
                    <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 1.5c-3.038 0-9 1.522-9 4.5V21h18v-3c0-2.978-5.962-4.5-9-4.5z"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
