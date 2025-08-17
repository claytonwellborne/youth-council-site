import { Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

export default function RoleGuard({ allow = [], committee = null, children }) {
  const { profile, loading } = useAdmin();
  if (loading) return null;

  const role = (profile?.role || 'ambassador').toLowerCase();
  const userCommittee = (profile?.committee || '').toLowerCase();

  const okRole = allow.includes(role) || (profile?.is_admin ?? false);
  const okCommittee = committee ? (userCommittee === committee) : true;

  return okRole && okCommittee ? children : <Navigate to="/admin" replace />;
}
