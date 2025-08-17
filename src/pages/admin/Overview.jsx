import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAdmin } from "../../components/admin/AdminContext";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

const TEAM_ROLES = ['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator'];

export default function Overview(){
  const { profile } = useAdmin();
  const [stats, setStats] = useState({ team:0, ambassadors:0, pending:0 });

  useEffect(()=>{ (async ()=>{
    // ambassadors
    const { data: apps } = await supabase.from('applications').select('id,status').limit(2000);
    const accepted = (apps||[]).filter(a=>a.status==='accepted').length;
    const pending = (apps||[]).filter(a=>!a.status || a.status==='reviewing').length;

    // team (exec/vps/rc)
    let teamCount = 0;
    const { data: profs, error } = await supabase.from('profiles').select('role').limit(2000);
    if (!error && profs) teamCount = profs.filter(p=>TEAM_ROLES.includes((p.role||'').toLowerCase())).length;

    setStats({ team: teamCount, ambassadors: accepted, pending });
  })(); },[]);

  const tiles = [
    { label:'Team (Exec/VP/RC)', value:stats.team, ring:'bg-purple-100', icon:'🛡️' },
    { label:'Active Ambassadors', value:stats.ambassadors, ring:'bg-green-100', icon:'🧑‍🤝‍🧑' },
    { label:'Pending Applications', value:stats.pending, ring:'bg-yellow-100', icon:'⏳' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome{profile?.email ? `, ${profile.email}` : ''}.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map(t=>(
          <Card key={t.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.label}</p>
                  <p className="text-3xl font-bold">{t.value}</p>
                </div>
                <div className={`w-12 h-12 ${t.ring} rounded-lg grid place-items-center text-xl`}>{t.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/admin/directory"><Button>Open Member Management</Button></Link>
        <Link to="/admin/applications"><Button variant="outline">View Applications</Button></Link>
      </div>
    </div>
  );
}
