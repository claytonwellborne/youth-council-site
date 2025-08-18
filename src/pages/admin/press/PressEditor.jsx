import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import EditorLite from "../../../components/editor/EditorLite";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const parseTags = (s) => Array.from(new Set((s || "").split(",").map(t => t.trim()).filter(Boolean)));

export default function PressEditor() {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const nav = useNavigate();

  const [post, setPost] = useState({
    title: "", subtitle: "", summary: "", cover_url: "",
    content_html: "", status: "draft", scheduled_at: null, tags: [],
    primary_tag: "", primary_tag_color: "#e6ecff", display_date: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!postId) return;
      const { data, error } = await supabase.from("press_posts").select("*").eq("id", postId).maybeSingle();
      if (!error && data) {
        setPost(data);
        setTagInput((data.tags || []).join(", "));
      }
    };
    load();
  }, [postId]);

  const onChange = (k, v) => setPost(p => ({ ...p, [k]: v }));

  const uploadCover = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const path = `covers/${crypto.randomUUID()}-${f.name}`;
    const { error } = await supabase.storage.from("press-assets").upload(path, f);
    if (error) { alert(error.message); return; }
    const { data: pub } = supabase.storage.from("press-assets").getPublicUrl(path);
    onChange("cover_url", pub.publicUrl);
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
    nav("/admin/press");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="text-sm">
        <Link to="/admin/press" className="text-zinc-600 hover:text-zinc-900">← Back to Hub</Link>
      </div>

      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{postId ? "Edit Press Post" : "Create Press Post"}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => save("draft")} disabled={saving} className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button onClick={() => save("published")} disabled={saving} className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input className="border rounded-lg px-3 py-2 text-xl font-bold w-full" placeholder="Title" value={post.title} onChange={e => onChange("title", e.target.value)} />
          <input className="border rounded-lg px-3 py-2 w-full" placeholder="Subtitle" value={post.subtitle || ""} onChange={e => onChange("subtitle", e.target.value)} />
          <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Summary" value={post.summary || ""} onChange={e => onChange("summary", e.target.value)} />

          <div>
            <label className="block text-sm font-medium mb-1">Cover image</label>
            <div className="flex items-center gap-3">
              <input type="file" onChange={uploadCover} />
              {post.cover_url && <img src={post.cover_url} alt="" className="h-12 rounded" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Primary tag</label>
              <input className="border rounded-lg px-3 py-2 w-full" placeholder="Update / Policy" value={post.primary_tag || ""} onChange={e => onChange("primary_tag", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tag color</label>
              <input type="color" className="border rounded-lg w-full h-[42px] p-1" value={post.primary_tag_color || "#e6ecff"} onChange={e => onChange("primary_tag_color", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="border rounded-lg px-3 py-2 w-full" placeholder="Updates, Policy, Research" value={tagInput} onChange={e => setTagInput(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Display date (what readers see)</label>
            <input className="border rounded-lg px-3 py-2 w-full" placeholder="January 14, 2024" value={post.display_date || ""} onChange={e => onChange("display_date", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <EditorLite value={post.content_html} onChange={(html) => onChange("content_html", html)} />
        </div>
      </div>
    </main>
  );
}
