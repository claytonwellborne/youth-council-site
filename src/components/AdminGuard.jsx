import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navigate } from 'react-router-dom';

const allowlist = (import.meta.env.VITE_ADMIN_ALLOWLIST || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export default function AdminGuard({ children }) {
  const [state, setState] = useState({ loading: true, session: null });

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setState({ loading: false, session: data.session });
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({ loading: false, session });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state.loading) return null;

  const email = state.session?.user?.email?.toLowerCase();
  const isAllowed = email && allowlist.includes(email);
  if (!isAllowed) return <Navigate to="/admin/login" replace />;

  return children;
}
