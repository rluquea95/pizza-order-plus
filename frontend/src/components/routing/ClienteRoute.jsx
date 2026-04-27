import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export const ClienteRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Spinner de carga mientras se comprueba localStorage 
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf1] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-bold tracking-widest uppercase text-sm">Validando sesión...</p>
      </div>
    );
  }

  // Si no hay usuario logueado, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, permite el acceso a la ruta
  return children;
};