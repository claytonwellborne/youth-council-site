import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/admin/login?signout=1';
  };
  return (
    <div style={{padding:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Project 18 — Admin Dashboard</h1>
        <button onClick={logout} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #ddd',background:'#fff'}}>Sign out</button>
      </div>
      <nav style={{margin:'12px 0'}}><Link to="/admin/applications">Applications</Link></nav>
      <p>Welcome!</p>
    </div>
  );
}
