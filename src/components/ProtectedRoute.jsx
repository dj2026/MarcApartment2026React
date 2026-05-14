import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ adminOnly = false, isAdmin: isAdminProp }) {
  const { isAuthenticated, isAdmin: isAdminContext, isLoading } = useAuth();

  const effectiveIsAdmin = isAdminProp !== undefined ? isAdminProp : isAdminContext;

  if (isLoading) {
    return (
      <div className="fullscreen-loading">
        <div className="text-gradient1">VERIFICANT CREDENCIALS...</div>
      </div>
    );
  }

  if (adminOnly && !effectiveIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return (isAuthenticated || effectiveIsAdmin) ? <Outlet /> : <Navigate to="/" replace />;
}