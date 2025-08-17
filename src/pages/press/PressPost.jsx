import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function PressPost(){
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  useEffect(()=>{ (async ()=>{
    const { data } = await supabase.rpc('get_post_by_slug', { slug_in: slug });
    setPost((data||[])[0]);
  })(); },[slug]);
  if(!post) return <div className="p-8">Loading…</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-xs text-gray-500">
        {post.published_at ? new Date(post.published_at).toLocaleString() : ''} • {post.author_name || '—'}
      </div>
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      {post.cover_url && <img src={post.cover_url} alt="" className="rounded-xl mb-4"/>}
      {/* content is HTML from the editor */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
