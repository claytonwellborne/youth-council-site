import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const fmt = (d) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
const badgeClass = (c) => {
  const m=(c||"").toLowerCase();
  if (m.includes("award")) return "bg-amber-100 text-amber-800";
  if (m.includes("update")) return "bg-blue-100 text-blue-800";
  if (m.includes("policy")) return "bg-purple-100 text-purple-800";
  if (m.includes("press"))  return "bg-pink-100 text-pink-800";
  return "bg-zinc-100 text-zinc-800";
};

export default function Press(){
  const [posts,setPosts]=useState(null);

  useEffect(()=>{ (async()=>{
    const { data, error } = await supabase
      .from("press_posts")
      .select("id,slug,title,subtitle,summary,category,published_at,cover_url,author_name,is_published")
      .eq("is_published", true)
      .order("published_at",{ascending:false})
      .limit(50);
    if (!error) setPosts(data||[]);
  })(); },[]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/60 to-white" />
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-gradient-to-tr from-brandRed to-brandBlue text-white grid place-items-center shadow-lg">
            <span className="text-2xl">📰</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Press <span className="text-brandBlue">&amp; Media Center</span>
          </h1>
          <p className="mt-3 text-zinc-700 max-w-2xl mx-auto">
            News, updates, and media resources about Project 18’s work and impact.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Latest Press Releases</h2>

          {!posts && (
            <div className="grid gap-4">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-4 w-28 bg-zinc-200 rounded mb-2" />
                  <div className="h-6 w-2/3 bg-zinc-200 rounded mb-2" />
                  <div className="h-4 w-full bg-zinc-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {posts && posts.length===0 && <div className="text-zinc-600">No press releases yet.</div>}

          {posts && posts.length>0 && (
            <div className="grid gap-4">
              {posts.map((p)=>(
                <article key={p.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4">
                  {p.cover_url && (
                    <Link to={`/press/${p.slug}`} className="shrink-0">
                      <img src={p.cover_url} alt="" className="w-full md:w-56 h-36 object-cover rounded-lg" loading="lazy" />
                    </Link>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-1">
                      {p.category && <span className={`px-2 py-0.5 rounded-full ${badgeClass(p.category)}`}>{p.category}</span>}
                      <span className="text-zinc-500">{fmt(p.published_at)}</span>
                      {p.author_name && <span className="text-zinc-400">•</span>}
                      {p.author_name && <span className="text-zinc-600">{p.author_name}</span>}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold">
                      <Link to={`/press/${p.slug}`} className="hover:text-brandBlue">{p.title}</Link>
                    </h3>
                    {p.subtitle && <p className="text-zinc-600">{p.subtitle}</p>}
                    {!p.subtitle && p.summary && <p className="text-zinc-600">{p.summary}</p>}
                  </div>
                  <div className="md:ml-4">
                    <Link to={`/press/${p.slug}`} className="btn btn-gradient">Read more</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
