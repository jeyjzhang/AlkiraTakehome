import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function PublicRoute() {
  const { status } = useAuth();
  return status === 'authenticated' ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
