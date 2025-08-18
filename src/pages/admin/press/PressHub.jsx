import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

export default function PressHub() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase
        .from("press_posts")
        .select("id,title,status,slug,published_at,updated_at")
        .order("updated_at", { ascending: false });
      if (!ignore) setRows(error ? [] : (data || []));
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Press Hub</h1>
        <Link to="/admin/press/create" className="btn btn-gradient rounded-lg">New press post</Link>
      </header>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {!rows && <tr><td className="p-3" colSpan={3}>Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td className="p-3" colSpan={3}>No posts yet.</td></tr>}
            {rows && rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-zinc-600">{r.slug}</div>
                </td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-zinc-600">
                  {r.published_at ? new Date(r.published_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
