import { supabase } from '../../lib/supabase';

export default function Login() {
  const signInWithEmail = async (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      emailRedirectTo: window.location.origin + '/#/admin'
    });
    if (error) alert(error.message); else alert('Magic link sent! Check your email.');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/#/admin' }
    });
    if (error) alert(error.message);
  };

  return (
    <div style={{ maxWidth: 380, margin: '6rem auto', padding: 24 }}>
      <h1>Admin Sign In</h1>
      <form onSubmit={signInWithEmail} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <input name="email" type="email" placeholder="you@weareproject18.com" required />
        <button type="submit">Send magic link</button>
      </form>
      <hr style={{ margin: '16px 0' }} />
      <button onClick={signInWithGoogle}>Continue with Google</button>
    </div>
  );
}
