import { createContext, useState, useContext, useEffect } from 'react';
import { pizzaApi } from '../services/api';

// Crea el contexto
const DataContext = createContext();

// Crea el Provider (repartirá los datos por toda la web)
export const DataProvider = ({ children }) => {

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
        setCargando(false);
      }
    };
    cargarInventario();
  }, []);

  return (
    <DataContext.Provider value={{ productos, ingredientes, alergenos, cargando }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);