import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const allowlist = (import.meta.env.VITE_ADMIN_ALLOWLIST || '')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      setSession(session);
      if (!session) { setIsAdmin(false); setLoading(false); return; }

      const email = (session.user.email || '').toLowerCase();

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      const dbAdmin = !!data?.is_admin;
      const fallbackAdmin = allowlist.includes(email);

      // If DB says admin OR allowlist says admin → let in
      setIsAdmin(dbAdmin || fallbackAdmin);

      if (error) {
        console.warn('profiles check error:', error?.message);
        console.warn('using allowlist fallback for', email, '=>', fallbackAdmin);
      }

      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => { sub.subscription.unsubscribe(); cancelled = true; };
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/admin/login?denied=1" replace />;

  return children;
}
