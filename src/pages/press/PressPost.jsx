import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const fmt = (d) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});

export default function PressPost(){
  const { slug } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(()=>{ (async()=>{
    const { data, error } = await supabase
      .from("press_posts")
      .select("id,title,subtitle,content_html,category,author_name,cover_url,published_at,is_published")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data || data.is_published === false) { nav("/press", { replace:true }); return; }
    setPost(data);
  })(); },[slug, nav]);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24">
        <div className="h-8 w-40 bg-zinc-200 rounded mb-3 animate-pulse" />
        <div className="h-6 w-80 bg-zinc-200 rounded mb-4 animate-pulse" />
        <div className="h-64 w-full bg-zinc-200 rounded animate-pulse" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <Link to="/admin/press" className="text-sm text-zinc-600 hover:text-zinc-900">← Back to Press</Link>
      <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{post.title}</h1>
      {post.subtitle && <p className="text-lg text-zinc-700 mt-1">{post.subtitle}</p>}
      <div className="mt-3 text-sm text-zinc-600 flex flex-wrap items-center gap-2">
        {post.category && <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">{post.category}</span>}
        <span>{fmt(post.published_at)}</span>
        {post.author_name && <span>• {post.author_name}</span>}
      </div>
      {post.cover_url && <img src={post.cover_url} alt="" className="mt-6 rounded-xl w-full object-cover" />}
      <article className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: post.content_html || "" }} />
    </main>
  );
}
