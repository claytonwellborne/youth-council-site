import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export default function Applications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) alert(error.message); else setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) alert(error.message); else load();
  };

  const addRow = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: fd.get('full_name'),
      email: fd.get('email'),
      chapter: fd.get('chapter'),
      notes: fd.get('notes')
    };
    const { error } = await supabase.from('applications').insert(payload);
    if (error) alert(error.message); else { e.currentTarget.reset(); load(); }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Applications</h2>
      <form onSubmit={addRow} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:8, margin:'12px 0 24px' }}>
        <input name="full_name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="chapter" placeholder="Chapter (optional)" />
        <input name="notes" placeholder="Notes (optional)" />
        <button type="submit">Add</button>
      </form>
      {loading ? <div>Loading…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>
              {['Created','Name','Email','Chapter','Status','Notes',''].map(h => (
                <th key={h} style={{ textAlign:'left', padding:8, borderBottom:'1px solid #eee' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ padding:8 }}>{new Date(r.created_at).toLocaleString()}</td>
                  <td style={{ padding:8 }}>{r.full_name}</td>
                  <td style={{ padding:8 }}>{r.email}</td>
                  <td style={{ padding:8 }}>{r.chapter || '—'}</td>
                  <td style={{ padding:8 }}>
                    <select value={r.status || 'new'} onChange={(e)=>updateStatus(r.id, e.target.value)}>
                      <option value="new">new</option>
                      <option value="reviewing">reviewing</option>
                      <option value="accepted">accepted</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                  <td style={{ padding:8, maxWidth:280, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.notes || '—'}</td>
                  <td style={{ padding:8 }}>
                    <button onClick={()=>navigator.clipboard.writeText(r.email)}>Copy email</button>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7} style={{ padding:12, color:'#666' }}>No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
