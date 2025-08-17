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
          <Item to="/admin">Overview</Item>
          <Item to="/admin/directory">Directory</Item>
          <Item to="/admin/applications">Ambassador Applications</Item>
          <Item to="/admin/resources">Resources</Item>
          <Item to="/admin/press">Press Creation</Item>
          <Item to="/admin/executive">Executive Home</Item>

          <button
            className="w-full text-left px-3 py-2 rounded-lg font-semibold hover:bg-zinc-100 flex items-center justify-between mt-2"
            onClick={()=>setOpen(v=>!v)}
          >
            <span>Settings</span><span>{open ? "▾" : "▸"}</span>
          </button>
          {open && (
            <div className="pl-3 space-y-1">
              <Item to="/admin/settings/profile">Profile</Item>
              <Item to="/admin/settings/account">Account</Item>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pt-3 border-t">
          <a href="#/" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">View website</a>
          <a href="#/admin/login?signout=1" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Sign out</a>
        </div>
      </nav>
    </aside>
  );
}
