import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const ROLES_STAFF = [
  "chief_of_staff",
  "vp_membership",
  "vp_finance",
  "vp_pr",
  "regional_coordinator",
  "creative_team",
];

const title = (s) => (s || "")
  .split("_")
  .map((x) => (x ? x[0].toUpperCase() + x.slice(1) : ""))
  .join(" ");

export default function Executive() {
  const { session, profile } = useAdmin();
  const uid = session?.user?.id;

  // lists + metrics
  const [pending, setPending] = useState([]);
  const [team, setTeam] = useState([]);
  const [metrics, setMetrics] = useState({
    apps7: 0,
    ambassadors: 0,
    posts: 0,
    supabase: "—",
  });

  // forms
  const [staffForm, setStaffForm] = useState({
    email: "",
    role: "chief_of_staff",
    is_admin: false,
  });
  const [ambForm, setAmbForm] = useState({ email: "", committee: "" });

  const canExec = useMemo(
    () =>
      ["executive_director", "chief_of_staff"].includes(
        (profile?.role || "").toLowerCase()
      ),
    [profile?.role]
  );

  // load data
  const load = async () => {
    const p = await supabase
      .from("staff_pending")
      .select("*")
      .order("created_at", { ascending: false });
    setPending(p.data || []);

    const t = await supabase.rpc("list_team_profiles");
    setTeam(t.data || []);

    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const apps = await supabase
      .from("applications")
      .select("id, created_at")
      .gte("created_at", weekAgo);
    const amb = await supabase.rpc("list_ambassador_profiles");
    const posts = await supabase
      .from("press_posts")
      .select("id")
      .eq("status", "published");

    setMetrics({
      apps7: (apps.data || []).length,
      ambassadors: (amb.data || []).length,
      posts: (posts.data || []).length,
      supabase: "OK",
    });
  };

  useEffect(() => {
    load();
  }, []);

  // actions
  const saveStaff = async (e) => {
    e.preventDefault();
    const row = {
      email: (staffForm.email || "").trim().toLowerCase(),
      role: staffForm.role,
      committee: null,
      is_admin: !!staffForm.is_admin,
    };
    await supabase.from("staff_pending").upsert(row);
    setStaffForm({ email: "", role: "chief_of_staff", is_admin: false });
    load();
  };

  const saveAmb = async (e) => {
    e.preventDefault();
    const row = {
      email: (ambForm.email || "").trim().toLowerCase(),
      role: "ambassador",
      committee: ambForm.committee || null,
      is_admin: false,
    };
    await supabase.from("staff_pending").upsert(row);
    setAmbForm({ email: "", committee: "" });
    load();
  };

  const removePending = async (email) => {
    await supabase.from("staff_pending").delete().eq("email", email);
    load();
  };

  const demote = async (email) => {
    await supabase
      .from("profiles")
      .update({ role: null, is_admin: false })
      .eq("email", email);
    load();
  };

  const sendMagicLink = async (email) => {
    // Sends them a sign-in link to finish account setup
    await supabase.auth.signInWithOtp({
      email,
    });
    alert("Magic sign-in link sent.");
  };

  const checkStatus = async () => {
    // Simple health: ping DB via a trivial select
    const r = await supabase.from("press_posts").select("id").limit(1);
    setMetrics((m) => ({ ...m, supabase: r.error ? "ERROR" : "OK" }));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <header>
        <h2 className="text-2xl font-bold mb-1">Executive Home</h2>
        <p className="text-gray-600">
          Welcome, {profile?.full_name || profile?.email}. Manage staff,
          ambassadors, and high-level settings.
        </p>
      </header>

      {/* Metrics */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Applications (7d)" value={metrics.apps7} />
        <MetricCard label="Ambassadors" value={metrics.ambassadors} />
        <MetricCard label="Published Posts" value={metrics.posts} />
        <MetricCard
          label="Supabase"
          value={
            <span className={metrics.supabase === "OK" ? "text-green-700" : "text-red-600"}>
              {metrics.supabase}
            </span>
          }
          action={<button onClick={checkStatus} className="text-sm underline">Check</button>}
        />
      </section>

      {/* Forms */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Staff role */}
        <div className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-3">Add / Update Staff Role</h3>
          <form onSubmit={saveStaff} className="space-y-3">
            <input
              required
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="person@org.com"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm((s) => ({ ...s, email: e.target.value }))
              }
            />
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={staffForm.role}
              onChange={(e) =>
                setStaffForm((s) => ({ ...s, role: e.target.value }))
              }
            >
              {ROLES_STAFF.map((r) => (
                <option key={r} value={r}>
                  {title(r)}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={staffForm.is_admin}
                onChange={(e) =>
                  setStaffForm((s) => ({ ...s, is_admin: e.target.checked }))
                }
              />
              <span className="text-sm">Admin privileges</span>
            </label>
            <div className="flex gap-3">
              <button className="btn btn-gradient">Save</button>
              <button
                type="button"
                className="border rounded-lg px-3 py-2"
                onClick={() => sendMagicLink(staffForm.email)}
                disabled={!staffForm.email}
                title="Send a sign-in (magic) link to this address"
              >
                Send magic link
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Tip: saving adds to <code>staff_pending</code>. When they sign in
            </p>
          </form>
        </div>

        {/* Ambassador */}
        <div className="border rounded-xl p-4 bg-white">
          <form onSubmit={saveAmb} className="space-y-3">
            <input
              required
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="student@email.com"
              value={ambForm.email}
              onChange={(e) =>
                setAmbForm((s) => ({ ...s, email: e.target.value }))
              }
            />
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Committee (optional)"
              value={ambForm.committee}
              onChange={(e) =>
                setAmbForm((s) => ({ ...s, committee: e.target.value }))
              }
            />
            <div className="flex gap-3">
              <button className="btn btn-gradient">Save</button>
              <button
                type="button"
                className="border rounded-lg px-3 py-2"
                onClick={() => sendMagicLink(ambForm.email)}
                disabled={!ambForm.email}
              >
                Send magic link
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Ambassadors will see only the sections they’re allowed to access.
            </p>
          </form>
        </div>
      </section>

      {/* Pending + Team */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 bg-white">
          <div className="space-y-2">
            {(pending || []).length ? (
              pending.map((p) => (
                <div
                  key={p.email}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{p.email}</div>
                    <div className="text-sm text-gray-600">
                      {title(p.role)}
                      {p.committee ? ` • ${p.committee}` : ""}
                      {p.is_admin ? " • Admin" : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendMagicLink(p.email)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      Send link
                    </button>
                    <button
                      onClick={() => removePending(p.email)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">None.</div>
            )}
          </div>
        </div>

        <div className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-3">Current Team</h3>
          <div className="space-y-2">
            {(team || []).length ? (
              team.map((t) => (
                <div
                  key={t.email}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{t.email}</div>
                    <div className="text-sm text-gray-600">
                      {title(t.role)}
                      {t.committee ? ` • ${t.committee}` : ""}
                      {t.is_admin ? " • Admin" : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => demote(t.email)}
                    className="text-sm border rounded px-2 py-1"
                    title="Remove role & admin from this user"
                  >
                    Demote
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No team members yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, action }) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
