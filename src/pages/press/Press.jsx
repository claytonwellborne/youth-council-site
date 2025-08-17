import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function Press(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=>{
    const { data } = await supabase.from('press_posts')
      .select('id,slug,title,excerpt,cover_url,published_at')
      .eq('status','published')
      .order('published_at',{ascending:false}).limit(50);
    setRows(data||[]);
  })(); },[]);
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Press</h1>
      <div className="space-y-4">
        {rows.map(p=>(
          <Link key={p.id} to={`/press/${p.slug}`} className="block border rounded-xl p-4 bg-white hover:shadow-sm">
            <div className="text-xs text-gray-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ''}</div>
            <h2 className="text-xl font-semibold">{p.title}</h2>
            {p.excerpt && <p className="text-gray-700">{p.excerpt}</p>}
          </Link>
        ))}
        {!rows.length && <div className="text-gray-600">No posts yet.</div>}
      </div>
    </div>
  );
}
