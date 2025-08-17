import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function EditorLite({ value="", onChange }) {
  const ref = useRef(null);
  const [linkMode,setLinkMode]=useState(false);

  // keep caret in the editor
  useEffect(()=>{ ref.current?.focus(); },[]);

  const exec = (cmd, arg=null) => {
    document.execCommand(cmd,false,arg);
    ref.current?.focus();
    onChange?.(ref.current?.innerHTML || "");
  };
  const block = tag => { document.execCommand("formatBlock", false, tag); onInput(); };

  const onInput = () => onChange?.(ref.current?.innerHTML || "");
  const onPaste = () => setTimeout(onInput, 0);

  const upload = async (file) => {
    const path = `post-assets/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("press-assets").upload(path, file, { upsert:false });
    if (error) { alert(error.message); return; }
    const { data:pub } = supabase.storage.from("press-assets").getPublicUrl(path);
    const url = pub?.publicUrl; if (!url) return;
    if (file.type.startsWith("image/")) exec("insertImage", url);
    else exec("insertHTML", `<a href="${url}" target="_blank" rel="noreferrer">${file.name}</a>`);
  };

  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-zinc-50">
        <button className="px-2 py-1 border rounded" onClick={()=>exec("bold")}><b>B</b></button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec("italic")}><i>I</i></button>
        <button className="px-2 py-1 border rounded" onClick={()=>block("H1")}>H1</button>
        <button className="px-2 py-1 border rounded" onClick={()=>block("H2")}>H2</button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec("insertUnorderedList")}>• List</button>
        <button className="px-2 py-1 border rounded" onClick={()=>exec("insertOrderedList")}>1. List</button>
        {!linkMode && <button className="px-2 py-1 border rounded" onClick={()=>setLinkMode(true)}>Link</button>}
        {linkMode && (
          <span className="flex items-center gap-1">
            <input className="border rounded px-2 py-1 text-sm" placeholder="https://"
              onKeyDown={(e)=>{ if(e.key==="Enter"){ exec("createLink", e.currentTarget.value); setLinkMode(false);} }} />
            <button className="px-2 py-1 border rounded" onClick={()=>setLinkMode(false)}>Cancel</button>
          </span>
        )}
        <label className="ml-auto px-2 py-1 border rounded cursor-pointer">Upload
          <input type="file" className="hidden" onChange={e=>e.target.files?.[0] && upload(e.target.files[0])}/>
        </label>
      </div>

      <div
        ref={ref}
        className="min-h-[320px] p-4 prose max-w-none focus:outline-none"
        style={{direction:'ltr', unicodeBidi:'plaintext', whiteSpace:'pre-wrap'}}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{__html: value}}
        onInput={onInput}
        onBlur={onInput}
        onPaste={onPaste}
      />
    </div>
  );
}
