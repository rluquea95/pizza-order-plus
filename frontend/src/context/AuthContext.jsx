import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api';

// Crea el contexto
const AuthContext = createContext();

// Crea el Provider (proveera el usuario logueado)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar la aplicación, comprueba si hay un token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('pizza-order-token');
    const storedUser = localStorage.getItem('pizza-order-user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); 
  }, []);

  // Función para Iniciar Sesión
  const login = async (credenciales) => {
    try {
      // Llama al backend
      const response = await authApi.login(credenciales);
      const { token: nuevoToken, usuario } = response.data;

      // Guarda el usuario y el token en memoria de ejecución (React)
      setToken(nuevoToken);
      setUser(usuario);

      // Guarda en localStorage para persistencia en caso de cierre de navegador o recarga de página
      localStorage.setItem('pizza-order-token', nuevoToken);
      localStorage.setItem('pizza-order-user', JSON.stringify(usuario));

      return { success: true };
    } catch (error) {
      // Si el backend devuelve un error (ej. credenciales inválidas), lo captura
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || 'Error al iniciar sesión'
      };
    }
  };

  // Función para Registrarse
  const register = async (datosUsuario) => {
    try {
      await authApi.registro(datosUsuario);
      // en el backend el registro no devuelve token, 
      // así que devuelve success y el frontend redirigirá al Login.
      return { success: true };
    } catch (error) {
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || 'Error al registrarse'
      };
    }
  };

  // Función para Cerrar Sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pizza-order-token');
    localStorage.removeItem('pizza-order-user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crea un Hook para usarlo en cualquier componente
export const useAuth = () => {
  return useContext(AuthContext);
};