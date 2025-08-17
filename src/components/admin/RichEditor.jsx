import { useEffect, useRef } from "react";

/**
 * Very small WYSIWYG based on contentEditable.
 * - Forces LTR / left align (fixes "typing backwards")
 * - Bold / Italic / H1 / H2 / H3 / Bullets / Link
 */
export default function RichEditor({ value = "", onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd, arg = null) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    // trigger change immediately
    onChange?.(ref.current?.innerHTML || "");
  };

  const onInput = (e) => onChange?.(e.currentTarget.innerHTML);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        <Btn onClick={() => exec("bold")}>B</Btn>
        <Btn onClick={() => exec("italic")}><i>I</i></Btn>
        <Btn onClick={() => exec("formatBlock", "H1")}>H1</Btn>
        <Btn onClick={() => exec("formatBlock", "H2")}>H2</Btn>
        <Btn onClick={() => exec("formatBlock", "H3")}>H3</Btn>
        <Btn onClick={() => exec("insertUnorderedList")}>• List</Btn>
        <Btn onClick={() => {
          const url = prompt("Link URL");
          if (url) exec("createLink", url);
        }}>Link</Btn>
        <Btn onClick={() => exec("removeFormat")}>Clear</Btn>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        dir="ltr"
        style={{ textAlign: "left" }}
        className="prose prose-sm max-w-none border rounded-lg p-3 min-h-[140px] focus:outline-none"
      />
    </div>
  );
}

function Btn({ children, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="px-2 py-1 border rounded-md bg-white hover:bg-zinc-50">
      {children}
    </button>
  );
}
