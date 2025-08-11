import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/chapters', label: 'Chapters' },
  { to: '/apply', label: 'Apply' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar(){
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/about" className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center text-white text-sm">YC</div>
          <span>Youth Council</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({isActive}) => `text-sm ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/apply" className="inline-flex items-center rounded-xl border px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700">
            Join
          </Link>
        </nav>
        <button className="md:hidden p-2" aria-label="Menu" onClick={()=>setOpen(v=>!v)}>☰</button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={()=>setOpen(false)} className="py-1 text-gray-700">{l.label}</Link>
            ))}
            <Link to="/apply" onClick={()=>setOpen(false)} className="inline-flex items-center justify-center rounded-xl border px-3 py-2 bg-blue-600 text-white">
              Join
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}