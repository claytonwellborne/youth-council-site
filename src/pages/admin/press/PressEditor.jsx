import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import EditorLite from "../../../components/editor/EditorLite";

const parseTags = (s) => Array.from(new Set((s||"").split(",").map(t=>t.trim()).filter(Boolean)
  .map(t=>t[0].toUpperCase()+t.slice(1).toLowerCase())));

export default function PressEditor(){
  const nav = useNavigate();
  const [params] = useSearchParams();
  const postId = params.get('id');

  const [post, setPost] = useState({
    title:"", subtitle:"", summary:"", cover_url:"",
    content_html:"", status:"draft", scheduled_at:null, tags:[],
    primary_tag:"Update", primary_tag_color:"#8fa8ff", display_date:null
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    (async ()=>{
      if(!postId) return;
      const { data, error } = await supabase.from('press_posts').select('*').eq('id', postId).maybeSingle();
      if (error) { alert(error.message); return; }
      if (data){
        setPost({
          ...data,
          display_date: data.display_date ? data.display_date : null,
          primary_tag: data.primary_tag || "Update",
          primary_tag_color: data.primary_tag_color || "#8fa8ff"
        });
        setTagInput((data.tags||[]).join(", "));
      }
    })();
  }, [postId]);

  const onChange = (k,v)=> setPost(p=>({...p, [k]: v}));
  const displayDate = useMemo(()=>{
    const d = post.display_date ? new Date(post.display_date)
      : (post.published_at ? new Date(post.published_at) : (post.scheduled_at ? new Date(post.scheduled_at) : null));
    return d ? d.toLocaleDateString() : "";
  },[post]);

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
    if (!payload.title?.trim()) { setSaving(false); return alert("Title is required"); }
    if (status === 'published') payload.scheduled_at = null;

    const q = postId
      ? supabase.from('press_posts').update(payload).eq('id', postId).select('id').maybeSingle()
      : supabase.from('press_posts').insert(payload).select('id').maybeSingle();

    const { data, error } = await q;
    setSaving(false);
    if (error) return alert(error.message);
    nav('/admin/press?justSaved=1');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/press" className="text-sm text-zinc-600 hover:text-zinc-900">← Back to Hub</Link>
          <h1 className="text-2xl font-bold">{postId ? "Edit Press Post" : "Create Press Post"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>save('draft')} disabled={saving} className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button onClick={()=>save('published')} disabled={saving} className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Content column */}
        <section className="md:col-span-2 space-y-4">
          <div className="card p-4 space-y-3">
            <input dir="ltr" className="border rounded-lg px-3 py-2 text-xl font-bold w-full"
                   placeholder="Title" value={post.title} onChange={e=>onChange('title', e.target.value)} />
            <input dir="ltr" className="border rounded-lg px-3 py-2 w-full"
                   placeholder="Subtitle" value={post.subtitle||''} onChange={e=>onChange('subtitle', e.target.value)} />
            <textarea dir="ltr" className="border rounded-lg px-3 py-2 w-full" rows={3}
                      placeholder="Summary" value={post.summary||''} onChange={e=>onChange('summary',e.target.value)} />
          </div>

          <div className="card p-4 space-y-3">
            <label className="block text-sm font-medium">Content</label>
            <EditorLite value={post.content_html} onChange={(html)=>onChange('content_html', html)} />
          </div>
        </section>

        {/* Meta + Preview */}
        <aside className="space-y-4">
          <div className="card p-4 space-y-3">
            <label className="block text-sm font-medium">Cover image</label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={uploadCover} />
              {post.cover_url && <img src={post.cover_url} alt="" className="h-12 rounded" />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mt-3">Primary tag</label>
                <input dir="ltr" className="border rounded-lg px-3 py-2 w-full"
                       value={post.primary_tag||''} onChange={e=>onChange('primary_tag', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mt-3">Tag color</label>
                <input type="color" className="border rounded-lg px-2 py-2 w-full h-[42px]"
                       value={post.primary_tag_color||'#8fa8ff'} onChange={e=>onChange('primary_tag_color', e.target.value)} />
              </div>
            </div>

            <label className="block text-sm font-medium mt-3">Tags (comma separated)</label>
            <input dir="ltr" className="border rounded-lg px-3 py-2 w-full"
                   placeholder="Updates, Policy, Research"
                   value={tagInput} onChange={e=>setTagInput(e.target.value)} />

            <label className="block text-sm font-medium mt-3">Display date (shows on the site)</label>
            <input type="date" className="border rounded-lg px-3 py-2 w-full"
                   value={post.display_date || ''}
                   onChange={e=>onChange('display_date', e.target.value || null)} />

            <label className="block text-sm font-medium mt-3">Schedule publish (optional)</label>
            <div className="flex items-center gap-2">
              <input type="datetime-local"
                     value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0,16) : ''}
                     onChange={e=>onChange('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                     className="border rounded-lg px-3 py-2 w-full" />
              <button onClick={()=>save('scheduled')} className="px-3 py-2 border rounded-lg">Schedule</button>
            </div>
          </div>

          {/* Preview */}
          <div className="card p-4">
            <div className="flex items-center gap-3 text-sm text-zinc-600 mb-2">
              {post.primary_tag && (
                <span className="px-3 py-1 rounded-full text-sm text-zinc-900"
                      style={{backgroundColor: post.primary_tag_color || '#e6ecff'}}>{post.primary_tag}</span>
              )}
              <span>{displayDate}</span>
              <span>• Project 18</span>
            </div>
            <h3 className="text-2xl font-extrabold">{post.title || 'Post title…'}</h3>
            {post.subtitle && <p className="text-lg text-zinc-700 mt-1">{post.subtitle}</p>}
            <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{__html: post.content_html || ''}} />
          </div>
        </aside>
      </div>
    </main>
  );
}
