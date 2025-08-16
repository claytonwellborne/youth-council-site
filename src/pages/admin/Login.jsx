import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

const REDIRECT = 'https://weareproject18.com/#/admin';

function useHashParams() {
  return useMemo(() => new URLSearchParams((window.location.hash.split('?')[1] || '')), []);
}

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [err, setErr] = useState('');
  const params = useHashParams();
  const denied = params.get('denied');
  const signout = params.get('signout');

  useEffect(() => {
    (async () => {
      if (signout) { await supabase.auth.signOut(); history.replaceState(null, '', '#/admin/login'); }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle();
      if (data?.is_admin) window.location.replace(REDIRECT);
    })();
  }, [signout]);

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
        alert('Account created. Ask an admin to grant access.');
      }
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  const box = { maxWidth: 440, margin: '6rem auto', padding: 24, border: '1px solid #eee', borderRadius: 16, boxShadow: '0 8px 28px rgba(0,0,0,.06)', background:'#fff', fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' };

  return (
    <div style={box}>
      <h1 style={{margin:0}}>Project 18 Admin</h1>
      <p style={{marginTop:6, color:'#666'}}>Sign in to continue</p>

      {denied && (
        <div style={{background:'#fff4e5', border:'1px solid #ffd8a8', color:'#8a5b00', padding:10, borderRadius:10, margin:'10px 0'}}>
          You’re signed in but not an admin yet. Ask an admin to grant access.
        </div>
      )}
      {signout && (
        <div style={{background:'#e7f5ff', border:'1px solid #a5d8ff', color:'#0b7285', padding:10, borderRadius:10, margin:'10px 0'}}>
          Signed out.
        </div>
      )}
      {err && <div style={{color:'#b00020', margin:'8px 0'}}>{err}</div>}

      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <button onClick={()=>setMode('signin')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signin'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Sign in</button>
        <button onClick={()=>setMode('signup')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signup'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Create account</button>
      </div>

      <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
        <input name="email" type="email" placeholder="email" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <input name="password" type="password" placeholder="password" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        <button type="submit" style={{padding:10, borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff'}}>
          {mode==='signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div style={{fontSize:12, color:'#888', marginTop:12}}>
        Admins are granted in Supabase; once approved you’ll go straight to the dashboard.
      </div>
    </div>
  );
}
