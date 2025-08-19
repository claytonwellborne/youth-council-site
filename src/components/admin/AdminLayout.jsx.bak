import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Admin</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-900">View site</Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-blue-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white grid place-items-center">
                {/* person icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="currentColor" className="w-5 h-5 text-zinc-700">
                  <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 1.5c-3.038 0-9 1.522-9 4.5V21h18v-3c0-2.978-5.962-4.5-9-4.5z"/>
                </svg>
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
