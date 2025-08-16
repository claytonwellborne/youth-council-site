import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (!cancelled) { setSession(null); setIsAdmin(false); setLoading(false); } return; }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!cancelled) {
        setSession(session);
        setIsAdmin(!!data?.is_admin && !error);
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null);
      // do not redirect here; let render handle it
    });
    return () => { sub.subscription.unsubscribe(); cancelled = true; };
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/admin/access-denied" replace />;
  return children;
}
