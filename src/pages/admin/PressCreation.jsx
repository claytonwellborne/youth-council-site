import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";

export default function PressCreation(){
  const { session } = useAdmin();
  const [form, setForm] = useState({ id:null, title:'', slug:'', excerpt:'', content:'', cover_url:'', status:'draft' });
  const [rows, setRows] = useState([]);

  const load = async ()=>{ const { data } = await supabase.from('press_posts').select('*').order('updated_at',{ascending:false}); setRows(data||[]) };
  useEffect(()=>{ load() },[]);

  const save = async (e)=>{
    e.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || (await supabase.rpc('slugify', { t: form.title })).data || form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
      author_id: session?.user?.id,
      published_at: form.status==='published' ? (form.published_at || new Date().toISOString()) : null
    };
    if (form.id) await supabase.from('press_posts').update(payload).eq('id', form.id);
    else await supabase.from('press_posts').insert(payload);
    setForm({ id:null, title:'', slug:'', excerpt:'', content:'', cover_url:'', status:'draft' }); load();
  };

  const edit = (r)=> setForm({ ...r });
  const del  = async (id)=>{ await supabase.from('press_posts').delete().eq('id', id); load(); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={save} className="border rounded-xl p-4 bg-white space-y-3">
        <h3 className="font-semibold">Create / Edit Post</h3>
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Slug (optional)" value={form.slug||''} onChange={e=>setForm(s=>({...s,slug:e.target.value}))}/>
        <textarea className="w-full border rounded px-3 py-2" placeholder="Short excerpt" value={form.excerpt||''} onChange={e=>setForm(s=>({...s,excerpt:e.target.value}))}/>
        <textarea className="w-full border rounded px-3 py-2 h-64 font-mono" placeholder="Content (markdown or plain)" value={form.content} onChange={e=>setForm(s=>({...s,content:e.target.value}))}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Cover image URL (optional)" value={form.cover_url||''} onChange={e=>setForm(s=>({...s,cover_url:e.target.value}))}/>
        <select className="border rounded px-3 py-2" value={form.status} onChange={e=>setForm(s=>({...s,status:e.target.value}))}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button className="btn btn-gradient">{form.id?'Update':'Publish'}</button>
      </form>

      <section className="border rounded-xl p-4 bg-white">
        <h3 className="font-semibold mb-3">Posts</h3>
        <div className="space-y-3">
          {rows.map(r=>(
            <article key={r.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div><div className="font-semibold">{r.title}</div><div className="text-xs text-gray-500">{r.status}{r.published_at?` • ${new Date(r.published_at).toLocaleDateString()}`:''}</div></div>
                <div className="flex gap-2">
                  <button className="border rounded px-2 py-1" onClick={()=>edit(r)}>Edit</button>
                  <button className="border rounded px-2 py-1" onClick={()=>del(r.id)}>Delete</button>
                </div>
              </div>
              {r.excerpt && <p className="text-gray-700 mt-1">{r.excerpt}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
