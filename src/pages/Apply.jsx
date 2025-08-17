import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Apply() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e){
    e.preventDefault();
    setSending(true); setOk(false); setErr('');
    const fd = new FormData(e.currentTarget);
    const full_name = fd.get('full_name')?.trim();
    const email = fd.get('email')?.trim();
    const school = fd.get('school')?.trim();
    const chapter = fd.get('chapter')?.trim();
    const notes = fd.get('notes')?.trim();

    try {
      const { error } = await supabase
        .from('applications')
        .insert({ full_name, email, school, chapter, notes, status: 'reviewing' });
      if (error) throw error;
      setOk(true);
      e.currentTarget.reset();
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">Apply</h1>
      <p className="text-gray-600 mb-6">Join Project 18 as an ambassador.</p>

      {ok && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-800 p-3">Thanks! Your application was received.</div>}
      {err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-800 p-3">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <input name="full_name" required placeholder="Full name" className="w-full rounded-xl border px-4 py-3" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border px-4 py-3" />
        <input name="school" placeholder="School" className="w-full rounded-xl border px-4 py-3" />
        <select name="chapter" className="w-full rounded-xl border px-4 py-3">
          <option value="">Join a local chapter</option>
          <option>Austin</option>
          <option>Houston</option>
          <option>Dallas</option>
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
