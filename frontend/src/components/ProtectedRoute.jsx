import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user?.token || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};
