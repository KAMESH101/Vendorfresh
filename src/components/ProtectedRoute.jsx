import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoaded } = useAuth();

  // Real Clerk: wait until auth state is resolved
  if (!isLoaded) {
    return (
      <div className="protected-route-loading" aria-label="Checking authentication…">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
