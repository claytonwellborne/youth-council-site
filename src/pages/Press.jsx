import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Press(){
  const [rows,setRows]=useState(null);
  const [filter,setFilter]=useState('All');

  useEffect(()=>{
    const load = async ()=>{
      const { data, error } = await supabase
        .from('press_posts')
        .select('id, slug, title, subtitle, summary, cover_url, tags, published_at, published_by')
        .eq('status','published')
        .order('published_at',{ascending:false});
      if (error) { console.error(error); return; }

      const ids = Array.from(new Set((data||[]).map(r=>r.published_by).filter(Boolean)));
      let names = {};
      if (ids.length){
        const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', ids);
        (profs||[]).forEach(p=>{ names[p.id]=p.full_name || 'Project 18'; });
      }
      setRows((data||[]).map(r=>({ ...r, author_name: names[r.published_by] || 'Project 18' })));
    };
    load();
  },[]);

  const tags = useMemo(()=>{
    const set = new Set();
    (rows||[]).forEach(r=>(r.tags||[]).forEach(t=>set.add(t)));
    return ['All', ...Array.from(set)];
  },[rows]);

  const list = useMemo(()=>{
    if (!rows) return null;
    if (filter==='All') return rows;
    return rows.filter(r=>(r.tags||[]).includes(filter));
  },[rows,filter]);

  return (
    <main className="pt-24 pb-16">
      {/* crisp (not foggy) hero */}
      <section className="mx-auto max-w-6xl px-4 text-center mb-10">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-brandRed/30 to-brandBlue/30 grid place-items-center">
          <span className="text-3xl">📰</span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">Our Press</h1>
        <p className="mt-3 text-zinc-700">News, updates, and media resources about Project 18’s work and impact.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(t=>(
            <button key={t}
              onClick={()=>setFilter(t)}
              className={`px-3 py-1 rounded-full border ${filter===t ? 'bg-gradient-to-r from-brandRed to-brandBlue text-white border-transparent' : 'bg-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {!rows && <div className="card p-6">Loading…</div>}
        {rows && list?.length===0 && <div className="card p-6">No releases yet.</div>}

        <div className="grid md:grid-cols-2 gap-5">
          {list?.map(r=>(
            <Link key={r.id} to={`/press/${r.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow">
              {r.cover_url && <img src={r.cover_url} alt="" className="w-full h-48 object-cover" />}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-2">
                  {(r.tags||[]).map(t=> <span key={t} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">{t}</span>)}
                </div>
                <h3 className="text-lg font-bold">{r.title}</h3>
                {r.subtitle && <p className="text-zinc-700 mt-1">{r.subtitle}</p>}
                <p className="text-sm text-zinc-600 mt-2">
                  {r.author_name} • {r.published_at ? new Date(r.published_at).toLocaleDateString() : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
