import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const ClienteRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Spinner de carga mientras se comprueba localStorage 
  if (loading) {
    return <LoadingSpinner mensaje="Validando sesión..." />;
  }

  // Si no hay usuario logueado, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, permite el acceso a la ruta
  return children;
};