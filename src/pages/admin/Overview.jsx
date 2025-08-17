import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";
import RichEditor from "../../components/admin/RichEditor";

export default function Overview(){
  const { session, profile } = useAdmin();
  const canPost = ['executive_director','chief_of_staff'].includes((profile?.role||'').toLowerCase());
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title:'', body:'', pinned:false });

  const load = async ()=>{
    const { data } = await supabase
      .from('announcements')
      .select('id,title,body,pinned,created_at,created_by,profiles:created_by(full_name,email)')
      .order('pinned',{ascending:false})
      .order('created_at',{ascending:false})
      .limit(100);
    setList(data||[]);
  };
  useEffect(()=>{ load() },[]);

  const post = async (e)=>{
    e.preventDefault();
    await supabase.from('announcements').insert({
      title: f.title, body: f.body, pinned: f.pinned, created_by: session?.user?.id
    });
    setF({ title:'', body:'', pinned:false }); load();
  };
  const del = async (id)=>{ await supabase.from('announcements').delete().eq('id', id); load(); };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Directory" to="/admin/directory" />
        <Stat label="Applications" to="/admin/applications" />
        <Stat label="Resources" to="/admin/resources" />
      </div>

      {canPost && (
        <form onSubmit={post} className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-2">Post announcement</h3>
          <input required className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Title"
                 value={f.title} onChange={e=>setF(s=>({...s, title:e.target.value}))}/>
          <label className="inline-flex items-center gap-2 mb-3">
            <input type="checkbox" checked={f.pinned} onChange={e=>setF(s=>({...s, pinned:e.target.checked}))}/> Pin to top
          </label>
          <RichEditor value={f.body} onChange={(html)=>setF(s=>({...s, body: html}))}/>
          <div className="mt-3"><button className="btn btn-gradient">Publish</button></div>
        </form>
      )}

      <section className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold mb-3">Announcements</h3>
        <div className="space-y-3">
          {(list||[]).map(a=>(
            <article key={a.id} className="border rounded-lg p-3">
              <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                <span>{new Date(a.created_at).toLocaleString()}</span>
                <span>•</span>
                <span>by {a.profiles?.full_name || a.profiles?.email || '—'}</span>
                {a.pinned && <span>• Pinned</span>}
              </div>
              <h4 className="font-semibold">{a.title}</h4>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: a.body }} />
              {canPost && (
                <div className="mt-2">
                  <button onClick={()=>del(a.id)} className="border rounded px-3 py-1">Delete</button>
                </div>
              )}
            </article>
          ))}
          {!list.length && <div className="text-gray-600">No announcements yet.</div>}
        </div>
      </section>
    </div>
  );
}

function Stat({label, to}) {
  return (
    <Link to={to} className="block border rounded-xl p-4 bg-white hover:shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold mt-1">Open</div>
    </Link>
  );
}
