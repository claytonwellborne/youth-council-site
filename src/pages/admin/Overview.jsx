import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";
import { Link } from "react-router-dom";

export default function Overview(){
  const { profile } = useAdmin();
  const canPost = ['executive_director','chief_of_staff'].includes((profile?.role||'').toLowerCase());
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title:'', body:'', pinned:false });

  const load = async ()=>{
    const { data } = await supabase.from('announcements')
      .select('id,title,body,pinned,created_at')
      .order('pinned',{ascending:false})
      .order('created_at',{ascending:false}).limit(50);
    setList(data||[]);
  };

  useEffect(()=>{ load() },[]);

  const post = async (e)=>{
    e.preventDefault();
    await supabase.from('announcements').insert({ ...f });
    setF({ title:'', body:'', pinned:false }); load();
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Team" to="/admin/directory" />
        <Stat label="Applications" to="/admin/applications" />
        <Stat label="Resources" to="/admin/resources" />
      </div>

      {canPost && (
        <form onSubmit={post} className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-2">Post announcement</h3>
          <input required className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Title" value={f.title} onChange={e=>setF(s=>({...s, title:e.target.value}))}/>
          <textarea required className="w-full border rounded-lg px-3 py-2 h-28 mb-2" placeholder="Write something…" value={f.body} onChange={e=>setF(s=>({...s, body:e.target.value}))}/>
          <label className="inline-flex items-center gap-2 mb-3"><input type="checkbox" checked={f.pinned} onChange={e=>setF(s=>({...s, pinned:e.target.checked}))}/> Pin to top</label>
          <div><button className="btn btn-gradient">Publish</button></div>
        </form>
      )}

      <section className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold mb-3">Announcements</h3>
        <div className="space-y-3">
          {(list||[]).map(a=>(
            <article key={a.id} className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()} {a.pinned && '• Pinned'}</div>
              <h4 className="font-semibold">{a.title}</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{a.body}</p>
            </article>
          ))}
          {!list.length && <div className="text-gray-600">No announcements yet.</div>}
        </div>
      </section>
    </div>
  );
}

function Stat({label,to}) {
  return (
    <Link to={to} className="block border rounded-xl p-4 bg-white hover:shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold mt-1">Open</div>
    </Link>
  )
}
