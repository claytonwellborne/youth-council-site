import React, { useEffect, useRef } from "react";

const LRM = "\u200E"; // left-to-right mark to keep caret sane when empty

export default function EditorLite({ value = "", onChange }) {
  const ref = useRef(null);

  const emit = (e) => {
    onChange?.(e.currentTarget.innerHTML);
  };

  // keep DOM in sync when parent value changes
  useEffect(() => {
    if (ref.current && typeof value === "string" && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || LRM;
    }
  }, [value]);

  return (
    <div className="min-h-[320px] p-4 prose max-w-none border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
      <div
        ref={ref}
        className="focus:outline-none"
        dir="ltr"
        style={{ direction: "ltr", unicodeBidi: "plaintext", textAlign: "left", whiteSpace: "pre-wrap" }}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        dangerouslySetInnerHTML={{ __html: value || LRM }}
      />
    </div>
  );
}
