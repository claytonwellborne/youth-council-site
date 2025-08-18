import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// hard LTR helpers
const LRM = "\u200E"; // left-to-right mark

export default function EditorLite({ value = "", onChange, onUploadAsset }) {
  const ref = useRef(null);
  const [linkMode, setLinkMode] = useState(false);

  // sanitize any rogue RTL marks that may flip direction
  const clean = (html) =>
    (html || "")
      .replace(/\u200f|\u202b|\u202e/gi, "") // RLM/RLE/RLO
      .replace(/^\s*(<br\/?>)*/i, "");

  const emit = () => {
    const html = clean(ref.current?.innerHTML || "");
    onChange?.(html);
  };

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    emit();
  };

  const applyBlock = (tag) => {
    document.execCommand("formatBlock", false, tag);
    ref.current?.focus();
    emit();
  };

  const onPaste = () => setTimeout(emit, 0);

  // ensure first char includes an LRM so the paragraph stays LTR
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.innerHTML || el.innerHTML === "<br>") {
      el.innerHTML = LRM;
    } else if (!el.innerText.startsWith(LRM)) {
      el.innerHTML = LRM + clean(el.innerHTML);
    }
  }, []);

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `post-assets/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("press-assets").upload(path, file, { upsert: false });
    if (error) {
      alert(error.message);
      return;
    }
    const { data: pub } = supabase.storage.from("press-assets").getPublicUrl(path);
    const url = pub?.publicUrl;
    if (!url) return;

    onUploadAsset?.({ url, name: file.name, type: file.type });
    if (file.type.startsWith("image/")) exec("insertImage", url);
    else exec("insertHTML", `<a href="${url}" target="_blank" rel="noreferrer">${file.name}</a>`);
    e.target.value = "";
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-zinc-50">
        <button className="px-2 py-1 border rounded" onClick={() => exec("bold")}><b>B</b></button>
        <button className="px-2 py-1 border rounded" onClick={() => exec("italic")}><i>/</i></button>
        <button className="px-2 py-1 border rounded" onClick={() => applyBlock("H1")}>H1</button>
        <button className="px-2 py-1 border rounded" onClick={() => applyBlock("H2")}>H2</button>
        <button className="px-2 py-1 border rounded" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button className="px-2 py-1 border rounded" onClick={() => exec("insertOrderedList")}>1. List</button>
        {!linkMode && <button className="px-2 py-1 border rounded" onClick={() => setLinkMode(true)}>Link</button>}
        {linkMode && (
          <span className="flex items-center gap-1">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="https://"
              onKeyDown={(e) => {
                if (e.key === "Enter") { exec("createLink", e.currentTarget.value); setLinkMode(false); }
              }}
            />
            <button className="px-2 py-1 border rounded" onClick={() => setLinkMode(false)}>Cancel</button>
          </span>
        )}
        <label className="ml-auto px-2 py-1 border rounded cursor-pointer">
          Upload
          <input type="file" className="hidden" onChange={pickFile} />
        </label>
      </div>

      <div
        ref={ref}
        className="min-h-[320px] p-4 prose max-w-none focus:outline-none"
        // hard LTR — these three together prevent RTL flipping
        dir="ltr"
        style={{ direction: "ltr", unicodeBidi: "isolate", textAlign: "left", whiteSpace: "pre-wrap" }}
        contentEditable dir="ltr" style="direction:ltr;unicode-bidi:plaintext;text-align:left;white-space:pre-wrap"
        dangerouslySetInnerHTML={{ __html: value || LRM }}
        onInput={emit}
        onBlur={emit}
        onPaste={onPaste}
        onFocus={() => {
          const el = ref.current;
          if (el && !el.innerText.startsWith(LRM)) el.innerHTML = LRM + clean(el.innerHTML);
        }}
      />
    </div>
  );
}
