import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function Press(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ (async ()=>{
    const { data } = await supabase.rpc('list_published_posts');
    setRows(data||[]);
  })(); },[]);
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Press</h1>
      <p className="text-gray-600 mb-6">Research, policy notes, and updates from Project 18.</p>
      <div className="space-y-4">
        {rows.map(p=>(
          <Link key={p.slug} to={`/press/${p.slug}`} className="block border rounded-xl p-4 bg-white hover:shadow-sm">
            <div className="text-xs text-gray-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ''} • {p.author_name || '—'}</div>
            <h2 className="text-xl font-semibold">{p.title}</h2>
            {p.excerpt && <p className="text-gray-700">{p.excerpt}</p>}
          </Link>
        ))}
        {!rows.length && <div className="text-gray-600">No posts yet.</div>}
      </div>
    </div>
  );
}
