import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('applications').select('status');
      if (error) return console.error(error);
      const totals = data.reduce((acc, r) => {
        const k = r.status ?? 'new'; acc[k] = (acc[k]||0)+1; return acc;
      }, {});
      setCounts(totals);
    })();
  }, []);
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/admin/login';
  };
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>Project 18 — Admin</h1>
        <button onClick={logout}>Sign out</button>
      </div>
      <nav style={{ margin:'12px 0' }}>
        <Link to="/admin/applications">Applications</Link>
      </nav>
      <section style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', marginTop:16 }}>
        {['new','reviewing','accepted','rejected'].map(k => (
          <div key={k} style={{ border:'1px solid #ddd', borderRadius:12, padding:16 }}>
            <div style={{ fontSize:12, color:'#666', textTransform:'uppercase' }}>{k}</div>
            <div style={{ fontSize:28, fontWeight:700 }}>{counts?.[k] ?? 0}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
