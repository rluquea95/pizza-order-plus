import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';


export const AdminRoute = ({ children }) => {
  // Extrae el usuario y el estado de carga desde AuthContext 
  const { user, loading } = useAuth();

  // Mientras la app arranca y lee el localStorage, muestra el spinner de carga
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf1] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-bold tracking-widest uppercase text-sm">Cargando usuario...</p>
      </div>
    );
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