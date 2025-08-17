import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Inbox, BookOpenText, FolderOpen, ExternalLink, LogOut, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from './AdminContext';

function titleCaseRole(r){
  return (r||'').split('_').map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
}

function Item({ to, icon:Icon, children }) {
  return (
    <NavLink to={to}
      className={({isActive}) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
         ${isActive ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`
      }>
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </NavLink>
  );
}

export default function Sidebar(){
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAdmin();
  const role = (profile?.role || 'ambassador').toLowerCase();
  const committee = (profile?.committee || '').toLowerCase();
  const isExec = ['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr'].includes(role) || (profile?.is_admin ?? false);
  const canDirectory = isExec || ['regional_coordinator'].includes(role);
  const canApplications = isExec || ['regional_coordinator'].includes(role);
  const canReleases = isExec || (role==='ambassador' && committee==='policy');
  const canResources = isExec || ['regional_coordinator','ambassador'].includes(role);

  useEffect(()=>{ setCollapsed(localStorage.getItem('adminCollapsed')==='1') },[]);
  useEffect(()=>{ localStorage.setItem('adminCollapsed', collapsed?'1':'0') },[collapsed]);

  const logout = async () => { await supabase.auth.signOut(); window.location.hash = '#/admin/login?signout=1'; };

  return (
    <aside className={`h-screen sticky top-0 border-r bg-white ${collapsed?'w-[68px]':'w-64'} transition-all`}>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-900 text-white grid place-items-center font-bold">18</div>
          {!collapsed && <div className="text-sm">
            <div className="font-semibold">Project 18</div>
            <div className="text-gray-500">{titleCaseRole(role)}</div>
          </div>}
        </div>
        <button onClick={()=>setCollapsed(v=>!v)} className="text-gray-500 hover:text-gray-800 text-sm">{collapsed?'»':'«'}</button>
      </div>

      <nav className="px-3 space-y-1">
        <Item to="/admin" icon={LayoutGrid}>Overview</Item>
        {canDirectory && <Item to="/admin/directory" icon={Users}>Directory</Item>}
        {canReleases && <Item to="/admin/releases" icon={BookOpenText}>Research & Policy</Item>}
        {canApplications && <Item to="/admin/applications" icon={Inbox}>Ambassador Applications</Item>}
        {canResources && <Item to="/admin/resources" icon={FolderOpen}>Resources</Item>}
        {['executive_director','chief_of_staff'].includes(role) && <Item to="/admin/executive" icon={Shield}>Executive Home</Item>}
      </nav>

      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <a href="#/" className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <ExternalLink className="w-4 h-4" /><span>View website</span>
        </a>
        <button onClick={logout} className="w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className="w-4 h-4" /><span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}