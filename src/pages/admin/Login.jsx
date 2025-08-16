import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const REDIRECT = 'https://weareproject18.com/#/admin';

async function getIsAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { session: null, isAdmin: false };
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle();
  return { session, isAdmin: !!data?.is_admin };
}

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      const { session, isAdmin } = await getIsAdmin();
      if (session && isAdmin) window.location.replace(REDIRECT);
      // if signed in but not admin: stay here; guard will show /admin/access-denied if they try /admin
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email');
    const password = fd.get('password');

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.replace(REDIRECT);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Account created. Ask an admin to give you access.');
      }
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  const box = { maxWidth: 420, margin: '6rem auto', padding: 24, border: '1px solid #eee', borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,.06)', background:'#fff' };

  return (
    <div style={box}>
      <h1 style={{margin:0}}>Project 18 Admin</h1>
      <p style={{marginTop:6, color:'#666'}}>Sign in to continue</p>

      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <button onClick={()=>setMode('signin')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signin'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Sign in</button>
        <button onClick={()=>setMode('signup')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signup'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Create account</button>
      </div>

      {err && <div style={{color:'#b00020', margin:'8px 0'}}>{err}</div>}

      <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
        <input name="email" type="email" placeholder="email" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <input name="password" type="password" placeholder="password" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <button type="submit" style={{padding:10, borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff'}}>
          {mode==='signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p style={{fontSize:12, color:'#888', marginTop:12}}>After login, admins go straight to the dashboard.</p>
    </div>
  );
}
