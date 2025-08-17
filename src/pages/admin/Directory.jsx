import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabase";

const TEAM_ROLES = ['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator'];

export default function Directory(){
  const [team, setTeam] = useState([]);
  const [amb, setAmb] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async ()=>{
    setLoading(true);

    // team
    const { data: profs } = await supabase.from('profiles').select('email,role,committee,created_at').limit(2000);
    const teamRows = (profs||[])
      .filter(p => TEAM_ROLES.includes((p.role||'').toLowerCase()))
      .map(p => ({ id:p.email, full_name:p.email?.split('@')[0] ?? 'Team', email:p.email, role:p.role, created_date:p.created_at, status:'staff' }));

    // ambassadors (accepted)
    const { data: apps } = await supabase.from('applications').select('*').order('created_at', { ascending:false }).limit(2000);
    const ambRows = (apps||[])
      .filter(a=>a.status==='accepted')
      .map(a => ({
        id:a.id, full_name:a.full_name || a.name || 'Unnamed', email:a.email||'', phone:a.phone||'',
        created_date:a.created_at, status:'active', join_reason:a.notes||''
      }));

    setTeam(teamRows);
    setAmb(ambRows);
    setLoading(false);
  };

  useEffect(()=>{ load() },[]);

  const update = async (id, status)=>{ const map={active:'accepted', inactive:'rejected'}; await supabase.from('applications').update({ status: map[status]||status }).eq('id', id); load(); };
  const statusCls = s => s==='active'?'bg-green-100 text-green-800': s==='pending'?'bg-yellow-100 text-yellow-800': s==='staff'?'bg-purple-100 text-purple-800':'bg-gray-100 text-gray-800';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Member Management</h2>

      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/>Team</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {team.length ? team.map(m=>(
              <div key={m.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{m.full_name}</div>
                      <Badge className={statusCls('staff')}>Staff</Badge>
                      <Badge variant="outline">{(m.role||'').split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">{m.email}</div>
                  </div>
                </div>
              </div>
            )) : <div className="text-gray-600">No team members yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/>Ambassadors ({amb.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading? <div>Loading…</div> : amb.length ? amb.map(m=>(
              <div key={m.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{m.full_name}</h3>
                      <Badge className={statusCls(m.status)}>{m.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {m.email && <div className="flex items-center gap-1"><Mail className="w-4 h-4"/>{m.email}</div>}
                      {m.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4"/>{m.phone}</div>}
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/>Joined: {new Date(m.created_date).toLocaleDateString()}</div>
                    </div>
                    {m.join_reason && <p className="text-sm text-gray-700 italic">"{m.join_reason.slice(0,150)}{m.join_reason.length>150?'…':''}"</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={()=>update(m.id,'inactive')}>Deactivate</Button>
                  </div>
                </div>
              </div>
            )) : <div className="text-gray-600">No ambassadors yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
