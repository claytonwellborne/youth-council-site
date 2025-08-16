import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); setIsAdmin(false); return; }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) console.error(error);
      setIsAdmin(!!data?.is_admin);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
