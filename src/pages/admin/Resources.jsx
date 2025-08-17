import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import RichEditor from "../../components/admin/RichEditor";

export default function Resources(){
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id:null, title:'', content:'', tags:'' });

  const load = async ()=>{ const { data } = await supabase.from('resources').select('*').order('updated_at',{ascending:false}); setRows(data||[]) };
  useEffect(()=>{ load() },[]);

  const save = async (e)=>{
    e.preventDefault();
    const payload = {
      title: form.title, content: form.content,
      tags: form.tags ? form.tags.split(',').map(s=>s.trim()) : []
    };
    if (form.id) await supabase.from('resources').update(payload).eq('id', form.id);
    else await supabase.from('resources').insert(payload);
    setForm({ id:null, title:'', content:'', tags:'' }); load();
  };

  const edit = (r)=> setForm({ id:r.id, title:r.title, content:r.content, tags:(r.tags||[]).join(', ') });
  const del  = async (id)=>{ await supabase.from('resources').delete().eq('id',id); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold mb-3">Add / Edit Resource</h3>
        <form onSubmit={save} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))}/>
          <RichEditor value={form.content} onChange={(html)=>setForm(s=>({...s,content:html}))}/>
          <input className="w-full border rounded px-3 py-2" placeholder="tags, comma,separated" value={form.tags} onChange={e=>setForm(s=>({...s,tags:e.target.value}))}/>
          <button className="btn btn-gradient">{form.id?'Update':'Publish'}</button>
        </form>
      </section>

      <section className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold mb-3">Library</h3>
        <div className="space-y-3">
          {rows.map(r=>(
            <article key={r.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-gray-500">{new Date(r.updated_at||r.created_at).toLocaleString()} {r.tags?.length?`• ${r.tags.join(' • ')}`:''}</div>
                </div>
                <div className="flex gap-2">
                  <button className="border rounded px-2 py-1" onClick={()=>edit(r)}>Edit</button>
                  <button className="border rounded px-2 py-1" onClick={()=>del(r.id)}>Delete</button>
                </div>
              </div>
              <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: r.content }} />
            </article>
          ))}
          {!rows.length && <div className="text-gray-600">No resources yet.</div>}
        </div>
      </section>
    </div>
  );
}
