import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PressPost(){
  const { slug } = useParams();
  const [post,setPost]=useState(null);
  const [author,setAuthor]=useState('Project 18');

  useEffect(()=>{
    const load = async ()=>{
      const { data, error } = await supabase.from('press_posts').select('*').eq('slug', slug).maybeSingle();
      if (error) { alert(error.message); return; }
      setPost(data);
      if (data?.published_by){
        const { data: p } = await supabase.from('profiles').select('full_name').eq('id', data.published_by).maybeSingle();
        setAuthor(p?.full_name || 'Project 18');
      }
    };
    load();
  },[slug]);

  if (!post) return <main className="pt-24 mx-auto max-w-3xl px-4">Loading…</main>;

  return (
    <main className="pt-24 pb-16">
      <article className="mx-auto max-w-3xl px-4">
        {post.cover_url && <img src={post.cover_url} alt="" className="w-full h-64 object-cover rounded-xl" />}
        <h1 className="text-4xl font-extrabold mt-6">{post.title}</h1>
        {post.subtitle && <p className="text-lg text-zinc-700 mt-2">{post.subtitle}</p>}
        <p className="text-sm text-zinc-600 mt-2">
          {author} • {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}
        </p>
        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{__html: post.content_html || ''}} />
      </article>
    </main>
  );
}
