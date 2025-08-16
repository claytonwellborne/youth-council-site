import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AccessDenied() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setInfo(session?.user ? { id: session.user.id, email: session.user.email } : null);
    })();
  }, []);

  return (
    <div style={{padding:24, maxWidth:540, margin:'4rem auto'}}>
      <h1>Access denied</h1>
      <p>You’re signed in, but you’re not an admin yet.</p>
      <ol>
        <li>Ask an existing admin to promote you in Supabase:</li>
      </ol>
      <pre style={{whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:8}}>
{`update public.profiles set is_admin = true where email = '${info?.email ?? "user@example.com"}';`}
      </pre>
      {info && <p style={{color:'#666'}}>Signed in as <b>{info.email}</b> (id: <code>{info.id}</code>)</p>}
    </div>
  );
}
