import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EditorLite({ value="", onChange }) {
  const ref = useRef(null);
  const [linkMode,setLinkMode]=useState(false);

  const exec = (cmd, arg=null) => { document.execCommand(cmd,false,arg);
    ref.current?.focus(); onChange?.(ref.current?.innerHTML || ""); };
  const block = (tag) => { document.execCommand('formatBlock', false, tag);
    ref.current?.focus(); onChange?.(ref.current?.innerHTML || ""); };
  const onInput = () => onChange?.(ref.current?.innerHTML || "");

  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const setLTR = (node) => {
      if (node.nodeType===1) {
        node.setAttribute('dir','ltr');
        node.style.direction='ltr';
        node.style.unicodeBidi='plaintext';
        node.style.textAlign='left';
      }
    };
    setLTR(el);
    el.querySelectorAll('*').forEach(setLTR);
    const mo = new MutationObserver(m=>m.forEach(mu=>mu.addedNodes.forEach(setLTR)));
    mo.observe(el,{childList:true, subtree:true});
    return ()=> mo.disconnect();
  },[]);

  const onPaste = () => setTimeout(onInput, 0);

  const upload = async (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const path = `post-assets/${crypto.randomUUID()}-${f.name}`;
    const { error } = await supabase.storage.from('press-assets').upload(path, f, { upsert:false });
    if (error) { alert(error.message); e.target.value=""; return; }
    const { data:pub } = supabase.storage.from('press-assets').getPublicUrl(path);
    const url = pub?.publicUrl; if (!url) { e.target.value=""; return; }
    if (f.type.startsWith('image/')) exec('insertImage', url);
    else exec('insertHTML', `<a href="${url}" target="_blank" rel="noreferrer">${f.name}</a>`);
    e.target.value="";
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-zinc-50">
        <button className="px-2 py-1 border rounded" onClick={()=>exec('bold')}><b>B</b></button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec('italic')}><i>I</i></button>
        <button className="px-2 py-1 border rounded" onClick={()=>block('H1')}>H1</button>
        <button className="px-2 py-1 border rounded" onClick={()=>block('H2')}>H2</button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec('insertUnorderedList')}>• List</button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec('insertOrderedList')}>1. List</button>
        {!linkMode && <button className="px-2 py-1 border rounded" onClick={()=>setLinkMode(true)}>Link</button>}
        {linkMode && (
          <span className="flex items-center gap-1">
            <input className="border rounded px-2 py-1 text-sm" placeholder="https://"
                   onKeyDown={(e)=>{ if(e.key==='Enter'){ exec('createLink', e.currentTarget.value); setLinkMode(false);} }} />
            <button className="px-2 py-1 border rounded" onClick={()=>setLinkMode(false)}>Cancel</button>
          </span>
        )}
        <label className="ml-auto px-2 py-1 border rounded cursor-pointer">
          Upload
          <input type="file" className="hidden" onChange={upload}/>
        </label>
      </div>
      <div
        ref={ref}
        dir="ltr"
        className="min-h-[320px] p-4 prose max-w-none focus:outline-none"
        style={{direction:'ltr', unicodeBidi:'plaintext', textAlign:'left'}}
        contentEditable
        dangerouslySetInnerHTML={{__html: value}}
        onInput={onInput}
        onPaste={onPaste}
        onBlur={onInput}
      />
    </div>
  );
}
