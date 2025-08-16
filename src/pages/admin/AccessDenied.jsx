import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
export default function AccessDenied() {
  const [info, setInfo] = useState(null);
  useEffect(() => { supabase.auth.getSession().then(({data}) => {
    const u = data.session?.user; setInfo(u ? { email: u.email, id: u.id } : null);
  }); }, []);
  return (
    <div style={{padding:24, maxWidth:540, margin:'4rem auto'}}>
      <h1>Access denied</h1>
      <p>You’re signed in, but not an admin yet.</p>
      {info && <p style={{color:'#666'}}>Signed in as <b>{info.email}</b></p>}
      <pre style={{whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:8}}>
{`update public.profiles set is_admin = true where email = '${info?.email ?? "user@example.com"}';`}
      </pre>
    </div>
  );
}
