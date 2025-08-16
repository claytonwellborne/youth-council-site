import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const REDIRECT = 'https://weareproject18.com/#/admin';

export default function Login() {
  const [mode, setMode] = useState('signin'); // signin | signup | reset
  const [error, setError] = useState('');

  useEffect(() => {
    // if already logged in, go to admin
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.hash = '#/admin';
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email');
    const password = fd.get('password');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: REDIRECT } });
        if (error) throw error;
        alert('Check your email to confirm your account.');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = REDIRECT;
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: REDIRECT });
        if (error) throw error;
        alert('Password reset email sent.');
      }
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: REDIRECT }
    });
    if (error) setError(error.message);
  };

  const linkGoogle = async () => {
    // must already be signed in with email/password
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError('Sign in first to link Google.'); return; }
    const { error } = await supabase.auth.linkIdentity({ provider: 'google' });
    if (error) setError(error.message);
    else alert('Google linked to your account.');
  };

  const box = { maxWidth: 420, margin: '6rem auto', padding: 24, border: '1px solid #eee', borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,.06)', background: '#fff' };

  return (
    <div style={box}>
      <h1 style={{margin:0}}>Project 18 Admin</h1>
      <p style={{marginTop:6, color:'#666'}}>Sign in to continue</p>

      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <button onClick={()=>setMode('signin')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signin'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Sign in</button>
        <button onClick={()=>setMode('signup')}  style={{padding:'6px 10px', borderRadius:8, border: mode==='signup'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Create account</button>
        <button onClick={()=>setMode('reset')}   style={{padding:'6px 10px', borderRadius:8, border: mode==='reset'?'2px solid #000':'1px solid #ccc', background:'#fff'}}>Reset password</button>
      </div>

      {error && <div style={{color:'#b00020', margin:'8px 0'}}>{error}</div>}

      <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
        <input name="email" type="email" placeholder="email" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        {mode !== 'reset' && (
          <input name="password" type="password" placeholder="password" required style={{padding:10, borderRadius:8, border:'1px solid #ddd'}} />
        )}
        <button type="submit" style={{padding:10, borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff'}}>
          {mode==='signin' ? 'Sign in' : mode==='signup' ? 'Create account' : 'Send reset link'}
        </button>
      </form>

      <div style={{display:'grid', gap:8, marginTop:16}}>
        <button onClick={signInWithGoogle} style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#fff'}}>Continue with Google</button>
        <button onClick={linkGoogle} style={{padding:10, borderRadius:8, border:'1px solid #ddd', background:'#fff'}}>Link Google to current account</button>
      </div>

      <p style={{fontSize:12, color:'#888', marginTop:12}}>After login you’ll be redirected to the admin dashboard.</p>
    </div>
  );
}
