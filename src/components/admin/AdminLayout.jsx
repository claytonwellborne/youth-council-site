import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";
import Sidebar from "./Sidebar";

export default function AdminLayout(){
  const { session, profile, signOut } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();

  useEffect(()=>{
    const url = new URL(window.location.href);
    if (url.searchParams.get('signout') === '1') {
      signOut().finally(()=> nav('/admin/login', { replace:true }));
    }
  },[]);

  return (
    <div className="min-h-screen grid" style={{gridTemplateColumns: collapsed ? "64px 1fr" : "240px 1fr"}}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col">
        <header className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Signed in as</div>
              </div>
            </div>
            <img
              src={profile?.avatar_url || "https://placehold.co/40x40"}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>
        <main className="flex-1 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// derive display data with safe fallbacks
function p18UserMeta(user){
  const displayName = user?.user_metadata?.name || user?.email || "Admin";
  const role = user?.user_metadata?.role || user?.app_metadata?.role || "Member";
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  return {displayName, role, avatarUrl};
}

