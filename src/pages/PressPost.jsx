import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PressPost(){
  const { slug } = useParams();
  const [post,setPost]=useState(null);
  const [author,setAuthor]=useState('Project 18');

  useEffect(()=>{
    (async ()=>{
      const { data, error } = await supabase.from('press_posts').select('*').eq('slug', slug).maybeSingle();
      if (error) { alert(error.message); return; }
      setPost(data);
      if (data?.published_by){
        const { data: p } = await supabase.from('profiles').select('full_name').eq('id', data.published_by).maybeSingle();
        setAuthor(p?.full_name || 'Project 18');
      }
    })();
  },[slug]);

  if (!post) return <main className="pt-24 mx-auto max-w-3xl px-4">Loading…</main>;
  const dateStr = post.display_date
    ? new Date(post.display_date).toLocaleDateString()
    : (post.published_at ? new Date(post.published_at).toLocaleDateString() : '');

  return (
    <main className="pt-24 pb-16">
      <article className="mx-auto max-w-3xl px-4">
        <Link to="/admin/press" className="text-sm text-zinc-600 hover:text-zinc-900">← Back to Press</Link>
        <div className="flex items-center gap-3 text-sm text-zinc-600 mt-4">
          {post.primary_tag && (
            <span className="px-3 py-1 rounded-full text-sm text-zinc-900"
                  style={{backgroundColor: post.primary_tag_color || '#e6ecff'}}>{post.primary_tag}</span>
          )}
          <span>{dateStr}</span>
          <span>• {author}</span>
        </div>
        <h1 className="text-4xl font-extrabold mt-2">{post.title}</h1>
        {post.subtitle && <p className="text-lg text-zinc-700 mt-2">{post.subtitle}</p>}
        {post.cover_url && <img src={post.cover_url} alt="" className="w-full h-64 object-cover rounded-xl mt-6" />}
        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{__html: post.content_html || ''}} />
      </article>
    </main>
  );
}
