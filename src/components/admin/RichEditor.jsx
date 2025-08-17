import { useEffect, useRef } from "react";

export default function RichEditor({ value = "", onChange }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && value != null && value !== "") ref.current.innerHTML = value; }, [value]);

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    onChange?.(ref.current?.innerHTML || "");
  };
  const onInput = () => onChange?.(ref.current?.innerHTML || "");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 border rounded-lg p-2 bg-zinc-50">
        <Btn onClick={()=>exec("formatBlock","H2")}>H2</Btn>
        <Btn onClick={()=>exec("formatBlock","H3")}>H3</Btn>
        <Btn onClick={()=>exec("bold")}><b>B</b></Btn>
        <Btn onClick={()=>exec("italic")}><em>I</em></Btn>
        <Btn onClick={()=>exec("underline")}><u>U</u></Btn>
        <Btn onClick={()=>exec("insertUnorderedList")}>• List</Btn>
        <Btn onClick={()=>exec("insertOrderedList")}>1. List</Btn>
        <input type="color" onChange={(e)=>exec("foreColor", e.target.value)} title="Text color"/>
        <Btn onClick={()=>{
          const url = prompt("Link URL");
          if (!url) return;
          exec("createLink", url);
        }}>Link</Btn>
        <Btn onClick={()=>exec("removeFormat")}>Clear</Btn>
      </div>
      <div
        ref={ref}
        className="min-h-[200px] border rounded-lg p-3 bg-white"
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
      />
    </div>
  );
}
function Btn({children, onClick}) {
  return <button type="button" onClick={onClick} className="border rounded px-2 py-1">{children}</button>;
}
