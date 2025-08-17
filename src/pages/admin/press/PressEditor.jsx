import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import EditorLite from "../../../components/editor/EditorLite";
import { useNavigate, useSearchParams } from "react-router-dom";

const parseTags = (s) => Array.from(new Set(
  (s||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=>t[0].toUpperCase()+t.slice(1).toLowerCase())
));

export default function PressEditor(){
  const [params] = useSearchParams();
  const postId = params.get("id");
  const nav = useNavigate();

  const [post, setPost] = useState({
    title: "", subtitle: "", summary: "",
    cover_url: "", content_html: "",
    status: "draft", scheduled_at: null, tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(()=>{
    (async ()=>{
      if(!postId) return;
      const { data, error } = await supabase.from("press_posts").select("*").eq("id", postId).maybeSingle();
      if (!error && data){
        setPost(data);
        setTagInput((data.tags||[]).join(", "));
      }
    })();
  }, [postId]);

  const onChange = (k,v)=> setPost(p=>({...p, [k]: v}));

  const uploadCover = async (e)=>{
    const f = e.target.files?.[0]; if(!f) return;
    const path = `covers/${crypto.randomUUID()}-${f.name}`;
    const { error } = await supabase.storage.from("press-assets").upload(path, f);
    if (error) { alert(error.message); return; }
    const { data } = supabase.storage.from("press-assets").getPublicUrl(path);
    onChange("cover_url", data.publicUrl);
  };

  const logContrib = async (savedId, status) => {
    const { data: u } = await supabase.auth.getUser();
    const me = u?.user?.id;
    if (!me || !savedId) return;
    const rows = [{ post_id: savedId, profile_id: me, role: "editor" }];
    if (status === "published") rows.push({ post_id: savedId, profile_id: me, role: "publisher" });
    await supabase.from("press_post_contributors").upsert(rows, { onConflict: "post_id,profile_id,role" });
  };

  const save = async (status = post.status) => {
    setSaving(true);
    const payload = { ...post, status, tags: parseTags(tagInput) };
    if (!payload.title?.trim()) { alert("Title is required"); setSaving(false); return; }
    if (status === "published") payload.scheduled_at = null;

    const q = postId
      ? supabase.from("press_posts").update(payload).eq("id", postId).select("id").maybeSingle()
      : supabase.from("press_posts").insert(payload).select("id").maybeSingle();

    const { data, error } = await q;
    setSaving(false);
    if (error) { alert(error.message); return; }

    await logContrib(data?.id || postId, status);
    nav("/admin/press");
  };

  return (
    <div className="space-y-6">
      <header className="sticky top-16 z-10 bg-white/80 backdrop-blur py-3 flex flex-wrap items-center justify-between gap-3 border-b">
        <h1 className="text-xl md:text-2xl font-bold">{postId ? "Edit Press Post" : "Create Press Post"}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>save("draft")} disabled={saving} className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button onClick={()=>setShowPreview(v=>!v)} className="px-3 py-2 border rounded-lg">{showPreview ? "Hide Preview" : "Preview"}</button>
          <button onClick={()=>save("published")} disabled={saving} className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Meta (left) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5">
            <label className="block text-sm font-medium">Title</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2 font-semibold"
                   value={post.title} onChange={e=>onChange("title", e.target.value)} />
            <label className="block text-sm font-medium mt-4">Subtitle</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2"
                   value={post.subtitle||""} onChange={e=>onChange("subtitle", e.target.value)} />
            <label className="block text-sm font-medium mt-4">Summary</label>
            <textarea rows={3} className="mt-1 w-full border rounded-lg px-3 py-2"
                      value={post.summary||""} onChange={e=>onChange("summary", e.target.value)} />
          </div>

          <div className="card p-5">
            <label className="block text-sm font-medium">Cover image</label>
            <div className="mt-1 flex items-center gap-3">
              <input type="file" onChange={uploadCover}/>
              {post.cover_url && <img src={post.cover_url} alt="" className="h-12 rounded" />}
            </div>

            <label className="block text-sm font-medium mt-4">Tags (comma separated)</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2"
                   placeholder="Updates, Policy, Research"
                   value={tagInput} onChange={e=>setTagInput(e.target.value)} />

            <label className="block text-sm font-medium mt-4">Schedule publish (optional)</label>
            <div className="flex gap-2">
              <input type="datetime-local" className="border rounded-lg px-3 py-2"
                value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0,16) : ""}
                onChange={e=>onChange("scheduled_at", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              <button onClick={()=>save("scheduled")} className="px-3 py-2 border rounded-lg">Schedule</button>
            </div>
          </div>
        </div>

        {/* Editor (right) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <label className="block text-sm font-medium mb-2">Content</label>
            <EditorLite value={post.content_html} onChange={(html)=>onChange("content_html", html)} />
          </div>

          {showPreview && (
            <div className="card p-5">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: post.content_html || ""}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
