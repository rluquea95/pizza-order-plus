import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';


export const AdminRoute = ({ children }) => {
  // Extrae el usuario y el estado de carga desde AuthContext 
  const { user, loading } = useAuth();

  // Mientras la app arranca y lee el localStorage, muestra el spinner de carga
  if (loading) {
    return <LoadingSpinner mensaje="Validando sesión..." />;
  }

  // Si no hay nadie logueado, lo redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado pero NO es ADMIN, lo redirige al inicio
  if (user.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Si es ADMIN, accede a la ruta indicada
  return children;
};