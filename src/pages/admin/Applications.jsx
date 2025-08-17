import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAdmin } from "../../components/admin/AdminContext";

const prettyDate = (d) => d ? new Date(d).toLocaleString() : "";

function StatusBadge({ s }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[s]||"bg-zinc-100 text-zinc-800"}`}>{s||"pending"}</span>;
}

export default function Applications(){
  const { session } = useAdmin();
  const uid = session?.user?.id;

  const [rows,setRows] = useState(null);
  const [tab,setTab] = useState("pending"); // pending | approved | rejected | all
  const [q,setQ] = useState("");

  const load = async ()=>{
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id, created_at, status, review_notes, reviewed_at, reviewed_by,
        full_name, first_name, last_name, email, school, city, state, committee, why, experience,
        reviewer:reviewed_by (full_name, email)
      `)
      .order("created_at", { ascending:false });
    if (!error) setRows(data||[]);
  };

  useEffect(()=>{ load() },[]);

  const filtered = useMemo(()=>{
    let x = rows || [];
    if (tab !== "all") x = x.filter(r => (r.status||"pending") === tab);
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      x = x.filter(r =>
        (r.full_name||"").toLowerCase().includes(k) ||
        (r.first_name||"").toLowerCase().includes(k) ||
        (r.last_name||"").toLowerCase().includes(k) ||
        (r.email||"").toLowerCase().includes(k)
      );
    }
    return x;
  }, [rows, tab, q]);

  const decide = async (row, nextStatus) => {
    const placeholder = nextStatus === "approved" ? "Notes to applicant / internal (optional)" : "Reason for rejection (optional)";
    const notes = window.prompt(placeholder, row.review_notes || "") || null;

    const { error } = await supabase
      .from("applications")
      .update({
        status: nextStatus,
        review_notes: notes,
        reviewed_by: uid,      // trigger will also stamp if null
        reviewed_at: new Date().toISOString()
      })
      .eq("id", row.id);

    if (error) { alert(error.message); return; }
    load();
  };

  const reopen = async (row) => {
    const notes = window.prompt("Optional notes when reopening", row.review_notes || "") || null;
    const { error } = await supabase
      .from("applications")
      .update({
        status: "pending",
        review_notes: notes,
        reviewed_by: uid,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", row.id);
    if (error) { alert(error.message); return; }
    load();
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this application?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", row.id);
    if (error) { alert(error.message); return; }
    load();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Ambassador Applications</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search name or email…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <div className="inline-flex rounded-lg border overflow-hidden">
            {["pending","approved","rejected","all"].map(t=>(
              <button key={t}
                onClick={()=>setTab(t)}
                className={`px-3 py-2 text-sm ${tab===t ? "bg-gradient-to-r from-brandRed to-brandBlue text-white" : "bg-white"}`}>
                {t[0].toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* list */}
      <div className="space-y-4">
        {!rows && <div className="card p-6 animate-pulse h-24" />}
        {rows && filtered.length===0 && <div className="text-zinc-600">No applications.</div>}
        {rows && filtered.map((r)=>(
          <article key={r.id} className="card p-4">
            <div className="flex flex-col md:flex-row md:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{r.full_name || [r.first_name,r.last_name].filter(Boolean).join(" ") || "—"}</h3>
                  <StatusBadge s={r.status||"pending"} />
                </div>
                <div className="text-sm text-zinc-600 flex flex-wrap gap-3 mt-1">
                  {r.email && <span>{r.email}</span>}
                  {r.school && <span>• {r.school}</span>}
                  {(r.city||r.state) && <span>• {(r.city||"")}{r.city&&r.state?", ":""}{r.state||""}</span>}
                  {r.committee && <span>• Committee: {r.committee}</span>}
                </div>

                {/* preview content */}
                {r.why && (
                  <p className="mt-2 text-zinc-800">
                    {r.why.length > 240 ? r.why.slice(0,240) + "…" : r.why}
                  </p>
                )}

                {/* review meta */}
                <div className="mt-2 text-xs text-zinc-600">
                  {r.reviewed_at && (
                    <span>
                      Last action {prettyDate(r.reviewed_at)}
                      {r.reviewer?.full_name || r.reviewer?.email ? ` • by ${r.reviewer?.full_name || r.reviewer?.email}` : ""}
                      {r.review_notes ? ` • notes: "${r.review_notes}"` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* actions */}
              <div className="flex md:flex-col gap-2 md:ml-4">
                {(r.status||"pending") === "pending" && (
                  <>
                    <button onClick={()=>decide(r,"approved")} className="btn btn-gradient px-3 py-2 rounded-lg">Approve</button>
                    <button onClick={()=>decide(r,"rejected")} className="px-3 py-2 rounded-lg border">Reject</button>
                  </>
                )}
                {(r.status||"pending") !== "pending" && (
                  <button onClick={()=>reopen(r)} className="px-3 py-2 rounded-lg border">Reopen</button>
                )}
                <button onClick={()=>remove(r)} className="px-3 py-2 rounded-lg border text-red-600">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
