import { createContext, useState, useContext, useEffect } from 'react';
import { pizzaApi } from '../services/api';

// Crea el contexto
const DataContext = createContext();

// Crea el Provider (repartirá los datos por toda la web)
export const DataProvider = ({ children }) => {

  // Almacena los productos, ingredientes, alergenos y si están cargando
  const [productos, setProductos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [alergenos, setAlergenos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const [resIng, resProd, resAle] = await pizzaApi.getInitialData();

        setIngredientes(resIng.data.filter(i => i.disponible));
        setProductos(resProd.data);
        setAlergenos(resAle.data);
        setCargando(false);

      } catch (err) {
        console.error("Error cargando inventario:", err);
        // Mensaje que recibe el usuario
        setError("No hemos podido cargar la carta. Por favor, revisa tu conexión o inténtalo de nuevo más tarde.");
        setCargando(false);
      }
    };
    cargarInventario();
  }, []);

  // Devuelve el Provider con las colecciones de la BBDD
  return (
    <DataContext.Provider value={{ productos, ingredientes, alergenos, cargando }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);