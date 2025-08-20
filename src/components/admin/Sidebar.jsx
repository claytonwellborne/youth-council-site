import { NavLink } from "react-router-dom";
import { useState } from "react";

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({isActive}) =>
      "block px-3 py-2 rounded-lg font-semibold transition-colors " +
      (isActive ? "text-white bg-gradient-to-r from-brandRed to-brandBlue" : "hover:bg-zinc-100")
    }
  >{children}</NavLink>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(true);

  return (
    <aside className={"border-r bg-white " + (collapsed ? "w-[64px]" : "w-[240px]")}>
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide">Admin</span>
        <button className="text-xs underline" onClick={()=>setCollapsed(!collapsed)}>{collapsed ? "»" : "«"}</button>
      </div>
      <nav className="px-2 space-y-1 flex flex-col h-[calc(100vh-48px)]">
        <div className="space-y-1">

          <button
            className="w-full text-left px-3 py-2 rounded-lg font-semibold hover:bg-zinc-100 flex items-center justify-between mt-2"
            onClick={()=>setOpen(v=>!v)}
          >
            <span>Settings</span><span>{open ? "▾" : "▸"}</span>
          </button>
          {open && (
            <div className="pl-3 space-y-1">
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pt-3 border-t">
          <NavLink to="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">View website</NavLink>
        </div>
      </nav>
    </aside>
  );
}
