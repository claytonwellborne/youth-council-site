import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const titleCase = s => (s||'').split('_').map(x=>x[0]?.toUpperCase()+x.slice(1)).join(' ');

export default function Directory(){
  const [team, setTeam] = useState([]);
  const [amb, setAmb] = useState([]);
  const [q, setQ] = useState('');

  const load = async ()=>{
    const t = await supabase.rpc('list_team_profiles');
    const a = await supabase.rpc('list_ambassador_profiles');
    setTeam(t.data||[]); setAmb(a.data||[]);
  };
  useEffect(()=>{ load() },[]);

  const filter = (rows)=> rows.filter(r=>{
    const hay = `${r.full_name||''} ${r.email||''} ${r.location||''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Member Directory</h2>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, email, location…" className="border rounded-lg px-3 py-2 w-72"/>
      </div>

      <Section title="Team (Exec/VP/RC)" rows={filter(team)} badge={(r)=>titleCase(r.role)} />
      <Section title={`Ambassadors (${amb.length})`} rows={filter(amb)} />
    </div>
  );
}

function Section({ title, rows, badge }){
  return (
    <section className="border rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {rows.length ? rows.map(r=>(
          <div key={r.email} className="border rounded-lg p-3 flex gap-3">
            <img src={r.avatar_url || 'https://placehold.co/64x64'} alt="" className="w-14 h-14 rounded-full object-cover"/>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{r.full_name || r.email}</div>
                {badge && <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800">{badge(r)}</span>}
              </div>
              <div className="text-sm text-gray-600">{r.email}</div>
              {r.location && <div className="text-sm text-gray-600">{r.location}</div>}
              {r.bio && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{r.bio}</p>}
            </div>
          </div>
        )) : <div className="text-gray-600">No profiles yet.</div>}
      </div>
    </section>
  )
}
