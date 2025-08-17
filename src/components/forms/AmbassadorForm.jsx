import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AmbassadorForm({ id="apply-form" }) {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setSending(true); setOk(false); setErr('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: fd.get('full_name')?.toString().trim(),
      email:     fd.get('email')?.toString().trim(),
      school:    fd.get('school')?.toString().trim(),
      chapter:   fd.get('chapter')?.toString().trim(),
      notes:     fd.get('notes')?.toString().trim(),
      source:    'weareproject18.com'
    };

    try {
      // 1) your existing endpoint (if configured)
      const url = import.meta.env.VITE_FORM_ENDPOINT;
      if (url) {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, notify: import.meta.env.VITE_NOTIFY_EMAIL || '' })
        });
        if (!res.ok) throw new Error(`Form endpoint error: ${res.status}`);
      }

      // 2) backup: also insert into Supabase, status=reviewing
      try {
        await supabase.from('applications').insert({ ...payload, status: 'reviewing' });
      } catch (_) { /* ignore if table missing / RLS */ }

      setOk(true);
      e.currentTarget.reset();
      // smooth-scroll back to top of form on success
      setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}), 50);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally { setSending(false); }
  }

  return (
    <div id={id} className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Apply</h2>
      <p className="text-gray-600 mb-6">Join Project 18 as an Ambassador.</p>

      {ok && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-800 p-3">Thanks! Your application was received.</div>}
      {err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-800 p-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input name="full_name" required placeholder="Full name" className="w-full rounded-xl border px-4 py-3" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border px-4 py-3" />
        <input name="school" placeholder="School" className="w-full rounded-xl border px-4 py-3" />
        <select name="chapter" className="w-full rounded-xl border px-4 py-3">
          <option value="">Join a local chapter</option>
          <option>Austin</option><option>Houston</option><option>Dallas</option>
          <option>Other / Start a chapter</option>
        </select>
        <textarea name="notes" placeholder="Why do you want to join?" className="w-full rounded-xl border px-4 py-3 h-32" />
        <button disabled={sending} className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 disabled:opacity-60">
          {sending ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
