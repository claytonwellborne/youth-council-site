import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Applications(){
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState({ first:'', last:'', email:'' });
  const [view, setView] = useState(null); // modal row

  const load = async ()=>{
    const { data } = await supabase.from('applications')
      .select('*').order('created_at',{ascending:false}).limit(500);
    setRows(data||[]);
  };
  useEffect(()=>{ load() },[]);

  const search = (r)=>{
    const [first,last] = (r.full_name||'').toLowerCase().split(' ');
    const okFirst = q.first ? (first||'').includes(q.first.toLowerCase()) : true;
    const okLast  = q.last  ? (last||'').includes(q.last.toLowerCase())   : true;
    const okEmail = q.email ? (r.email||'').toLowerCase().includes(q.email.toLowerCase()) : true;
    return okFirst && okLast && okEmail;
  };

  const del = async (id)=>{ await supabase.from('applications').delete().eq('id', id); setRows(rows=>rows.filter(r=>r.id!==id)); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ambassador Applications</h2>
        <details className="border rounded-lg p-2 bg-white">
          <summary className="cursor-pointer font-medium">Advanced search</summary>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <input className="border rounded px-2 py-1" placeholder="First" value={q.first} onChange={e=>setQ(s=>({...s, first:e.target.value}))}/>
            <input className="border rounded px-2 py-1" placeholder="Last" value={q.last} onChange={e=>setQ(s=>({...s, last:e.target.value}))}/>
            <input className="border rounded px-2 py-1" placeholder="Email" value={q.email} onChange={e=>setQ(s=>({...s, email:e.target.value}))}/>
          </div>
        </details>
      </div>

      <div className="space-y-3">
        {rows.filter(search).map(r=>(
          <div key={r.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{r.full_name || 'Unnamed'}</div>
                <div className="text-sm text-gray-600">{r.email}</div>
              </div>
              <div className="text-sm text-gray-600">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            {r.notes && <p className="text-sm text-gray-700 mt-2 line-clamp-2">{r.notes}</p>}
            <div className="mt-2 flex gap-2">
              <button className="border rounded px-3 py-1" onClick={()=>setView(r)}>Expand</button>
              <button className="border rounded px-3 py-1" onClick={()=>del(r.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!rows.length && <div className="text-gray-600">No applications yet.</div>}
      </div>

      {view && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" onClick={()=>setView(null)}>
          <div className="bg-white max-w-2xl w-[92vw] rounded-xl p-4" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{view.full_name}</h3>
              <button onClick={()=>setView(null)} className="border rounded px-2 py-1">Close</button>
            </div>
            <div className="text-sm text-gray-600">{view.email}</div>
            <div className="text-sm text-gray-600 mb-2">{new Date(view.created_at).toLocaleString()}</div>
            {view.school && <div className="mb-1"><b>School:</b> {view.school}</div>}
            {view.city && <div className="mb-1"><b>City:</b> {view.city}</div>}
            {view.state && <div className="mb-1"><b>State:</b> {view.state}</div>}
            {view.committee && <div className="mb-1"><b>Committee:</b> {view.committee}</div>}
            <pre className="whitespace-pre-wrap text-sm bg-zinc-50 border rounded p-3 mt-2">{view.notes || '—'}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
