import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import EditorLite from "../../../components/editor/EditorLite";
import { useNavigate, useSearchParams } from "react-router-dom";

const parseTags = (s) => Array.from(new Set(
  (s||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=>t[0].toUpperCase()+t.slice(1).toLowerCase())
));

export default function PressEditor(){
  const [params] = useSearchParams();
  const postId = params.get('id');
  const nav = useNavigate();

  const [post, setPost] = useState({
    title: "", subtitle: "", summary: "", cover_url: "",
    content_html: "", status: "draft", scheduled_at: null, tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [saving,setSaving]=useState(false);

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
  }, [postId]);

  const onChange = (k,v)=> setPost(p=>({...p, [k]: v}));

  const uploadCover = async (e)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const path = \`covers/\${crypto.randomUUID()}-\${f.name}\`;
    const { error } = await supabase.storage.from('press-assets').upload(path, f);
    if (error) { alert(error.message); return; }
    const { data:pub } = supabase.storage.from('press-assets').getPublicUrl(path);
    onChange('cover_url', pub.publicUrl);
  };

  const upsertContributors = async (savedId, status) => {
    const { data: u } = await supabase.auth.getUser();
    const me = u?.user?.id;
    if (!me || !savedId) return;

    const rows = [{ post_id: savedId, profile_id: me, role: 'editor' }];
    if (status === 'published') rows.push({ post_id: savedId, profile_id: me, role: 'publisher' });
    if (!post.author_id) rows.push({ post_id: savedId, profile_id: me, role: 'author' });

    await supabase.from('press_post_contributors')
      .upsert(rows, { onConflict: 'post_id,profile_id,role' });
  };

  const save = async (status = post.status) =>{
    setSaving(true);
    const payload = { ...post, status, tags: parseTags(tagInput) };
    if (!payload.title?.trim()) { alert("Title is required"); setSaving(false); return; }
    if (status === 'published') { payload.scheduled_at = null; }

    const q = postId
      ? supabase.from('press_posts').update(payload).eq('id', postId).select('id').maybeSingle()
      : supabase.from('press_posts').insert(payload).select('id').maybeSingle();

    const { data, error } = await q;
    setSaving(false);
    if (error) { alert(error.message); return; }

    await upsertContributors(data?.id || postId, status);
    nav(`/admin/press?justSaved=1`);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{postId ? "Edit Press Post" : "Create Press Post"}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>save('draft')} disabled={saving} className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button onClick={()=>save('published')} disabled={saving} className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      <div className="grid gap-4">
        <input className="border rounded-lg px-3 py-2 text-xl font-bold" placeholder="Title"
               value={post.title} onChange={e=>onChange('title', e.target.value)} />
        <input className="border rounded-lg px-3 py-2" placeholder="Subtitle"
               value={post.subtitle||''} onChange={e=>onChange('subtitle', e.target.value)} />
        <textarea className="border rounded-lg px-3 py-2" rows={3} placeholder="Summary (one or two sentences)"
                  value={post.summary||''} onChange={e=>onChange('summary', e.target.value)} />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cover image</label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={uploadCover}/>
              {post.cover_url && <img src={post.cover_url} alt="" className="h-12 rounded" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="border rounded-lg px-3 py-2 w-full"
                   placeholder="Updates, Policy, Research"
                   value={tagInput} onChange={e=>setTagInput(e.target.value)} />
            <p className="text-xs text-zinc-600 mt-1">Press Hub filters by these.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Schedule publish (optional)</label>
            <input type="datetime-local"
                   value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0,16) : ''}
                   onChange={e=>onChange('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                   className="border rounded-lg px-3 py-2" />
            <button onClick={()=>save('scheduled')} className="ml-2 px-3 py-2 border rounded-lg">Schedule</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <EditorLite value={post.content_html} onChange={(html)=>onChange('content_html', html)} />
        </div>
      </div>
    </div>
  );
}
