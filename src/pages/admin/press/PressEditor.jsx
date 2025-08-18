import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import EditorLite from "../../../components/editor/EditorLite";

const parseTags = (s) => Array.from(new Set(
  (s||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=>t[0].toUpperCase()+t.slice(1).toLowerCase())
));

export default function PressEditor(){
  const nav = useNavigate();
  const [params] = useSearchParams();
  const postId = params.get('id');

  const [post, setPost] = useState({
    title:"", subtitle:"", summary:"", cover_url:"",
    primary_tag:"", primary_tag_color:"#E6ECFF",
    tags:[], display_date:"", content_html:"",
    status:"draft", scheduled_at:null
  });
  const [tagInput,setTagInput] = useState("");
  const [saving,setSaving] = useState(false);

  useEffect(()=>{
    const load = async ()=>{
      if(!postId) return;
      const { data, error } = await supabase.from('press_posts').select('*').eq('id', postId).maybeSingle();
      if (!error && data) {
        setPost(data);
        setTagInput((data.tags||[]).join(", "));
      }
    };
    load();
  },[postId]);

  const onChange = (k,v)=> setPost(p=>({...p, [k]: v}));

  const uploadCover = async (e)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const path = `covers/${crypto.randomUUID()}-${f.name}`;
    const { error } = await supabase.storage.from('press-assets').upload(path, f);
    if (error) { alert(error.message); return; }
    const { data:pub } = supabase.storage.from('press-assets').getPublicUrl(path);
    onChange('cover_url', pub.publicUrl);
  };

  const save = async (status = post.status) =>{
    setSaving(true);
    const payload = { ...post, status, tags: parseTags(tagInput) };
    if (!payload.title?.trim()) { alert("Title is required"); setSaving(false); return; }
    if (status === 'published') payload.scheduled_at = null;

    let q;
    if (postId) q = supabase.from('press_posts').update(payload).eq('id', postId).select('id').maybeSingle();
    else q = supabase.from('press_posts').insert(payload).select('id').maybeSingle();

    const { data, error } = await q;
    setSaving(false);
    if (error) { alert(error.message); return; }
    nav('/admin/press');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <Link to="/admin/press" className="text-sm text-zinc-600 hover:underline">← Back to Hub</Link>
      </div>

      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{postId ? "Edit Press Post" : "Create Press Post"}</h1>
        <div className="flex gap-2">
          <button onClick={()=>save('draft')} disabled={saving} className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button onClick={()=>save('published')} disabled={saving} className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column: meta */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="border rounded-lg px-3 py-2 w-full" value={post.title} onChange={e=>onChange('title', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input className="border rounded-lg px-3 py-2 w-full" value={post.subtitle||''} onChange={e=>onChange('subtitle', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea className="border rounded-lg px-3 py-2 w-full" rows={3}
                      value={post.summary||''} onChange={e=>onChange('summary', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Primary tag</label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="Update / Policy"
                     value={post.primary_tag||''} onChange={e=>onChange('primary_tag', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tag color</label>
              <input type="color" className="border rounded-lg px-2 py-2 w-full h-10"
                     value={post.primary_tag_color||'#E6ECFF'} onChange={e=>onChange('primary_tag_color', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="border rounded-lg px-3 py-2 w-full" placeholder="Updates, Policy, Research"
                   value={tagInput} onChange={e=>setTagInput(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Display date (shown to readers)</label>
            <input type="date" className="border rounded-lg px-3 py-2 w-full"
                   value={post.display_date || ''} onChange={e=>onChange('display_date', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover image</label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={uploadCover}/>
              {post.cover_url && <img src={post.cover_url} alt="" className="h-12 rounded" />}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Schedule publish (optional)</label>
            <div className="flex items-center gap-2">
              <input type="datetime-local" className="border rounded-lg px-3 py-2"
                     value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0,16) : ''}
                     onChange={e=>onChange('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : null)} />
              <button onClick={()=>save('scheduled')} className="px-3 py-2 border rounded-lg">Schedule</button>
            </div>
          </div>
        </div>

        {/* Right column: editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <EditorLite value={post.content_html} onChange={(html)=>onChange('content_html', html)} />
        </div>
      </div>
    </main>
  );
}
