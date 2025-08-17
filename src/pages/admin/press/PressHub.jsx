import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";

const Status = ({s})=>{
  const m={draft:'bg-zinc-100 text-zinc-800', scheduled:'bg-yellow-100 text-yellow-800', published:'bg-green-100 text-green-800', archived:'bg-gray-100 text-gray-700'};
  return <span className={`px-2 py-0.5 rounded-full text-xs ${m[s]||m.draft}`}>{s}</span>;
};

export default function PressHub(){
  const [rows,setRows]=useState(null);
  const [q,setQ]=useState("");
  const [tab,setTab]=useState("all");

  const load = async ()=>{
    const { data, error } = await supabase
      .from('press_posts')
      .select('id, title, status, slug, tags, scheduled_at, published_at, updated_at')
      .order('updated_at', { ascending:false });
    if (!error) setRows(data||[]);
    else alert(error.message);
  };
  useEffect(()=>{ load() },[]);

  const filtered = useMemo(()=>{
    let x = rows||[];
    if (tab!=='all') x = x.filter(r=>r.status===tab);
    if (q.trim()) {
      const k=q.toLowerCase();
      x = x.filter(r=>(r.title||'').toLowerCase().includes(k) || (r.slug||'').toLowerCase().includes(k) || (r.tags||[]).join(',').toLowerCase().includes(k));
    }
    return x;
  },[rows,tab,q]);

  const publish   = async (r)=>{ const { error } = await supabase.from('press_posts').update({ status:'published', scheduled_at:null }).eq('id', r.id); if (error) alert(error.message); else load(); };
  const unpublish = async (r)=>{ const { error } = await supabase.from('press_posts').update({ status:'draft', is_published:false }).eq('id', r.id);  if (error) alert(error.message); else load(); };
  const remove    = async (r)=>{ if(!confirm('Delete this post?')) return; const { error } = await supabase.from('press_posts').delete().eq('id', r.id); if (error) alert(error.message); else load(); };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Press Hub</h1>
        <div className="flex items-center gap-2">
          <input className="border rounded-lg px-3 py-2" placeholder="Search title, slug, or tag…" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="inline-flex rounded-lg border overflow-hidden">
            {['all','draft','scheduled','published','archived'].map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-3 py-2 text-sm ${tab===t ? "bg-gradient-to-r from-brandRed to-brandBlue text-white" : "bg-white"}`}>{t[0].toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          <Link to="/admin/press/create" className="btn btn-gradient rounded-lg">New Post</Link>
        </div>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Tags</th>
              <th className="text-left p-3">Scheduled</th>
              <th className="text-left p-3">Published</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!rows && <tr><td className="p-3" colSpan={6}>Loading…</td></tr>}
            {rows && filtered.length===0 && <tr><td className="p-3" colSpan={6}>No posts.</td></tr>}
            {rows && filtered.map(r=>(
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-zinc-600">{r.slug}</div>
                </td>
                <td className="p-3"><Status s={r.status}/></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {(r.tags||[]).map(t=> <span key={t} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">{t}</span>)}
                  </div>
                </td>
                <td className="p-3 text-zinc-600">{r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : '—'}</td>
                <td className="p-3 text-zinc-600">{r.published_at ? new Date(r.published_at).toLocaleString() : '—'}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
