import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function MfaRoute() {
  const { status } = useAuth();

  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  if (status !== 'mfa-required') return <Navigate to="/login" replace />;

  return <Outlet />;
}
