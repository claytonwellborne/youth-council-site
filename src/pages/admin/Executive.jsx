import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";

const TEAM_ROLES = ['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator'];

export default function Executive(){
  const { profile } = useAdmin();
  const [pending, setPending] = useState([]);
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ email:'', role:'chief_of_staff', committee:'', is_admin:false });
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    const { data: p } = await supabase.from('staff_pending').select('*').order('created_at', { ascending:false });
    setPending(p||[]);
    const { data: profs } = await supabase.rpc('list_team_profiles');
    setTeam((profs||[]).filter(r=>TEAM_ROLES.includes((r.role||'').toLowerCase())));
  };

  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    const row = {
      email: (form.email||'').trim().toLowerCase(),
      role: form.role,
      committee: form.committee || null,
      is_admin: !!form.is_admin
    };
    await supabase.from('staff_pending').upsert(row);
    setForm({ email:'', role:'chief_of_staff', committee:'', is_admin:false });
    setMsg('Saved. Ask them to visit /#/admin/login and sign in (Google or magic link). Their role is applied automatically.');
    load();
  };

  const remove = async (email)=>{ await supabase.from('staff_pending').delete().eq('email', email); load(); };

  const title = s => (s||'').split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-2">Executive Home</h2>
      <p className="text-gray-600 mb-6">Welcome, {profile?.email}. Create staff, set roles, and manage access.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-3">Add / Update Staff Role</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))}
                className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="person@org.com" />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}
                className="mt-1 w-full rounded-lg border px-3 py-2">
                {['chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator','ambassador','creative_team'].map(r=>
                  <option key={r} value={r}>{title(r)}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Committee (optional)</label>
              <input value={form.committee} onChange={e=>setForm(f=>({...f, committee:e.target.value}))}
                className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="policy, outreach, ..." />
            </div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.is_admin} onChange={e=>setForm(f=>({...f, is_admin:e.target.checked}))} />
              <span className="text-sm">Admin privileges</span>
            </label>
            <button className="btn btn-gradient">Save</button>
            {msg && <div className="text-sm text-green-700 mt-2">{msg}</div>}
          </form>
        </section>

        <section className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-3">Pending Assignments</h3>
          <div className="space-y-2">
            {(pending||[]).length ? pending.map(p=>(
              <div key={p.email} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium">{p.email}</div>
                  <div className="text-sm text-gray-600">{title(p.role)}{p.committee ? ` • ${p.committee}` : ''}{p.is_admin ? ' • Admin' : ''}</div>
                </div>
                <button onClick={()=>remove(p.email)} className="text-sm px-3 py-1 rounded-md border">Remove</button>
              </div>
            )) : <div className="text-gray-600">None.</div>}
          </div>
          <p className="text-xs text-gray-500 mt-3">Send them to <code>/#/admin/login</code> to sign in. Their role is applied automatically on first login.</p>
        </section>
      </div>

      <section className="border rounded-xl p-4 bg-white mt-6">
        <h3 className="font-semibold mb-3">Current Team</h3>
        <div className="space-y-2">
          {(team||[]).length ? team.map(t=>(
            <div key={t.email} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">{t.email}</div>
                <div className="text-sm text-gray-600">{title(t.role)}{t.committee ? ` • ${t.committee}` : ''}{t.is_admin ? ' • Admin' : ''}</div>
              </div>
            </div>
          )) : <div className="text-gray-600">No team members yet.</div>}
        </div>
      </section>
    </div>
  );
}
