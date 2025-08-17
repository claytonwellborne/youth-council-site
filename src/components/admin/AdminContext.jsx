import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const Ctx = createContext({ session:null, profile:null, loading:true });
export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(session);
      if (session){
        const { data } = await supabase.from('profiles').select('id,email,role,committee,is_admin').eq('id', session.user.id).maybeSingle();
        setProfile(data || null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=> setSession(s ?? null));
    return ()=> sub.subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={{ session, profile, loading }}>{children}</Ctx.Provider>;
}
export const useAdmin = () => useContext(Ctx);
