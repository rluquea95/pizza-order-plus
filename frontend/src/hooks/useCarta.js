import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCarta = () => {
  // Inicializa los productos, si está cargando, si hay error y si hay búsqueda
  const [pizzasBase, setPizzas] = useState([]);
  const [bebidasBase, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calcula todos los alérgenos de la pizza
  const procesarAlergenos = (pizza) => {
    const alergenosBase = pizza.alergenos || [];
    const ingredientes = pizza.ingredientes || [];
    // Extrae los alérgenos de cada ingrediente y los agrupa en un único array
    const alergenosIngredientes = ingredientes.flatMap(ing => ing.alergenos || []);
    const todos = [...alergenosBase, ...alergenosIngredientes];

    return Array.from(
      new Map(todos.filter(al => al && al._id).map(al => [al._id, al])).values()
    );
  };

  // Extrae los productos desde el backend
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Se extrae la colección Productos que es la necesaria para la Carta
        const respuesta = await axios.get('http://localhost:5000/api/productos');
        const todosLosProductos = respuesta.data;

        // Filtra, ordena y procesa los alérgenos
        const pizzasProcesadas = todosLosProductos
          .filter(prod => prod.categoria?.toUpperCase() === 'PIZZA')
          .sort((a, b) => a.producto.localeCompare(b.producto))
          .map(pizza => ({
            ...pizza,
            alergenosAcumulados: procesarAlergenos(pizza)
          }));

        // Filtra y ordena las bebidas por orden alfabético
        const bebidasOrdenadas = todosLosProductos
          .filter(prod => prod.categoria?.toUpperCase() === 'BEBIDA')
          .sort((a, b) => a.producto.localeCompare(b.producto));

        setPizzas(pizzasProcesadas);
        setBebidas(bebidasOrdenadas);
        setCargando(false);
      } catch (err) {
        console.error("Error cargando la carta visual:", err);
        setError(err.response?.data?.mensaje || err.message);
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  // Filtra dinámicamente según lo que el usuario escriba
  const term = searchTerm.toLowerCase();

  const pizzasFiltradas = pizzasBase.filter(prod => {
    if (!term) return true;

    const nombre = (prod.producto || '').toLowerCase();
    const descripcion = (prod.descripcion || '').toLowerCase();

    // Convertimos los ingredientes a texto para poder buscar en ellos
    let ingredientesTxt = '';
    if (Array.isArray(prod.ingredientes)) {
      ingredientesTxt = prod.ingredientes.map(ing =>
        typeof ing === 'object' && ing !== null ? ing.ingrediente : ing
      ).join(' ').toLowerCase();
    }

    return nombre.includes(term) || descripcion.includes(term) || ingredientesTxt.includes(term);
  });

  const bebidasFiltradas = bebidasBase.filter(prod => {
    if (!term) return true;
    const nombre = (prod.producto || '').toLowerCase();
    return nombre.includes(term);
  });

  // Retorna la información para que la vista solo se encargue de pintar
  return {
    pizzas: pizzasFiltradas,
    bebidas: bebidasFiltradas,
    searchTerm,
    setSearchTerm,
    cargando,
    error
  };
};