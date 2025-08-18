import React from "react";
import { Link } from "react-router-dom";

export default function PressEditor() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <Link to="/admin/press" className="text-sm text-zinc-600 hover:underline">← Back to Hub</Link>
      </div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Press Post</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded-lg">Save Draft</button>
          <button className="btn btn-gradient rounded-lg">Publish Now</button>
        </div>
      </header>

      {/* Keep the body minimal for now; you can wire your editor here */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input className="border rounded-lg px-3 py-2 w-full" placeholder="Title" />
          <input className="border rounded-lg px-3 py-2 w-full" placeholder="Subtitle (optional)" />
          <textarea className="border rounded-lg px-3 py-2 w-full" rows={4} placeholder="Summary (optional)"></textarea>
        </div>
        <div className="space-y-2">
          <div className="border rounded-xl p-4 min-h-[280px]">
            <div className="text-sm text-zinc-600 mb-2">Content</div>
            <div
              contentEditable
              className="min-h-[220px] outline-none"
              style={{ direction: "ltr", unicodeBidi: "plaintext", textAlign: "left", whiteSpace: "pre-wrap" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
