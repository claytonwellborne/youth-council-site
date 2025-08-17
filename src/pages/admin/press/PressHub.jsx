import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";

const Status = ({s})=>{
  const m={draft:'bg-zinc-100 text-zinc-800', scheduled:'bg-yellow-100 text-yellow-800', published:'bg-green-100 text-green-800', archived:'bg-gray-100 text-gray-700'};
  return <span className={`px-2 py-0.5 rounded-full text-xs ${m[s]||m.draft}`}>{s}</span>;
};

function MonthCalendar({items}) {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const byDay = {};
  (items||[]).forEach(r=>{
    if(!r.scheduled_at) return;
    const d = new Date(r.scheduled_at);
    if (d.getMonth()!==now.getMonth() || d.getFullYear()!==now.getFullYear()) return;
    const day = d.getDate();
    byDay[day] = (byDay[day]||0)+1;
  });
  const cells = [];
  for (let i=0;i<startDay;i++) cells.push(<div key={`e${i}`} />);
  for (let d=1; d<=daysInMonth; d++){
    const n = byDay[d]||0;
    cells.push(
      <div key={d} className="aspect-square rounded-lg border grid place-items-center text-sm relative">
        <span>{d}</span>
        {n>0 && <span className="absolute -top-1 -right-1 text-[10px] px-1 rounded-full bg-blue-600 text-white">{n}</span>}
      </div>
    );
  }
  return <div className="grid grid-cols-7 gap-1">{cells}</div>;
}

export default function PressHub(){
  const [rows,setRows]=useState(null);
  const [q,setQ]=useState("");
  const [tab,setTab]=useState("all");

  const load = async ()=>{
    const { data, error } = await supabase
      .from('press_posts')
      .select('id, title, status, slug, tags, primary_tag, primary_tag_color, scheduled_at, published_at, updated_at, display_date')
      .order('updated_at', { ascending:false });
    if (!error) setRows(data||[]);
  };
  useEffect(()=>{ load() },[]);

  const counts = useMemo(()=>{
    const c = { all: (rows||[]).length, draft:0, scheduled:0, published:0, archived:0 };
    (rows||[]).forEach(r=>{ if (c[r.status]!=null) c[r.status]++; });
    return c;
  },[rows]);

  const filtered = useMemo(()=>{
    let x = rows||[];
    if (tab!=='all') x = x.filter(r=>r.status===tab);
    if (q.trim()) {
      const k=q.toLowerCase();
      x = x.filter(r=>(r.title||'').toLowerCase().includes(k) || (r.slug||'').toLowerCase().includes(k) || (r.tags||[]).join(',').toLowerCase().includes(k));
    }
    return x;
  },[rows,tab,q]);

  const publish = async (r)=>{ await supabase.from('press_posts').update({ status:'published', scheduled_at:null }).eq('id', r.id); load(); };
  const unpublish = async (r)=>{ await supabase.from('press_posts').update({ status:'draft', is_published:false }).eq('id', r.id); load(); };
  const remove = async (r)=>{ if(!confirm('Delete this post?')) return; await supabase.from('press_posts').delete().eq('id', r.id); load(); };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Press Hub</h1>
        <div className="flex items-center gap-2">
          <input className="border rounded-lg px-3 py-2" placeholder="Search title, slug, or tag…" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="inline-flex rounded-lg border overflow-hidden">
            {['all','draft','scheduled','published','archived'].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-3 py-2 text-sm ${tab===t ? "bg-gradient-to-r from-brandRed to-brandBlue text-white" : "bg-white"}`}>
                {t[0].toUpperCase()+t.slice(1)} {counts[t] ? `(${counts[t]})` : ''}
              </button>
            ))}
          </div>
          <Link to="/admin/press/create" className="btn btn-gradient rounded-lg">New Post</Link>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows && <tr><td className="p-3" colSpan={4}>Loading…</td></tr>}
              {rows && filtered.length===0 && <tr><td className="p-3" colSpan={4}>No posts.</td></tr>}
              {rows && filtered.map(r=>{
                const when = r.display_date || (r.published_at ? new Date(r.published_at).toISOString().slice(0,10) : '');
                return (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {r.primary_tag && (
                          <span className="px-2 py-0.5 rounded-full text-xs text-zinc-900"
                                style={{backgroundColor: r.primary_tag_color || '#e6ecff'}}>{r.primary_tag}</span>
                        )}
                        <div className="font-medium">{r.title}</div>
                      </div>
                      <div className="text-xs text-zinc-600">{r.slug}</div>
                    </td>
                    <td className="p-3"><Status s={r.status}/></td>
                    <td className="p-3 text-zinc-600">{when || '—'}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/press/create?id=${r.id}`} className="px-2 py-1 border rounded">Edit</Link>
                        {r.status!=='published'
                          ? <button onClick={()=>publish(r)} className="px-2 py-1 border rounded">Publish</button>
                          : <button onClick={()=>unpublish(r)} className="px-2 py-1 border rounded">Unpublish</button>}
                        <button onClick={()=>remove(r)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Scheduled (this month)</h3>
            <MonthCalendar items={rows||[]} />
          </div>
        </aside>
      </div>
    </main>
  );
}
