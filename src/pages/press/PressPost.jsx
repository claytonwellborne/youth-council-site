import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function PressPost(){
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  useEffect(()=>{ (async ()=>{
    const { data } = await supabase.from('press_posts').select('*').eq('slug', slug).maybeSingle();
    setPost(data);
  })(); },[slug]);
  if(!post) return <div className="p-8">Loading…</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-xs text-gray-500">{post.published_at ? new Date(post.published_at).toLocaleString() : ''}</div>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      {post.cover_url && <img src={post.cover_url} alt="" className="rounded-xl mb-4"/>}
      <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
    </article>
  );
}
