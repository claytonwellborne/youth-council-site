import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const Ctx = createContext({ session:null, profile:null, loading:true });

const allowlist = (import.meta.env.VITE_ADMIN_ALLOWLIST || '')
  .split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);

export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let cancelled = false;

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(session);

      let prof = null;
      const email = (session?.user?.email || '').toLowerCase();

      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id,email,role,committee,is_admin')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!error && data) prof = data;
      }

      // Fallback: if DB read fails, honor allowlist as executive director
      if (!prof && session && allowlist.includes(email)) {
        prof = { id: session.user.id, email, role: 'executive_director', committee: null, is_admin: true };
      }

      if (!cancelled) { setProfile(prof); setLoading(false); }
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s ?? null); });
    return () => { sub.subscription.unsubscribe(); cancelled = true; };
  }, []);

  return <Ctx.Provider value={{ session, profile, loading }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
