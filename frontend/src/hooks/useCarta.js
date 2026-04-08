import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCarta = () => {
  // Inician la pestana activa, el filtrado y la barra de búsqueda
  const [activeTab, setActiveTab] = useState('pizzas');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  
  // Inician los productos, la carga de productos y si hay algún error
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para guardar todos los ingredientes de la BBDD
  const [ingredientes, setIngredientes] = useState([]);

  // Extrae los productos desde el backend 
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Pide productos e ingredientes al mismo tiempo
        const [resProductos, resIngredientes] = await Promise.all([
          axios.get('http://localhost:5000/api/productos'),
          axios.get('http://localhost:5000/api/ingredientes')
        ]);
        
        setProductos(resProductos.data);
        // Guarda los ingredientes que estén "disponibles: true"
        setIngredientes(resIngredientes.data.filter(ing => ing.disponible));
        setCargando(false);
      } catch (err) {
        console.error("Error cargando carta:", err);
        setError(err.response?.data?.mensaje || err.message);
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  // Cuando se cambia de pestaña, resetea la búsqueda y el filtro
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedSize('todos');
  };

  // Obtiene el precio de las pizzas y bebidas
  const getPrecioReferencia = (prod) => {
    const esPizza = prod.categoria?.toUpperCase() === 'PIZZA';
    if (esPizza) {
      return prod.precio_pizza_med || 0;
    } else {
      if (selectedSize === '330ml') return prod.precio_beb_330ml;
      if (selectedSize === '500ml') return prod.precio_beb_500ml;
      if (selectedSize === '1000ml') return prod.precio_beb_1000ml;
      return Math.min(
        prod.precio_beb_330ml || Infinity,
        prod.precio_beb_500ml || Infinity,
        prod.precio_beb_1000ml || Infinity
      );
    }
  };

  // Convertimos el texto de la búsqueda a minúsculas para garantizar coincidencias
  const term = searchTerm.toLowerCase();

  // Filtra la lista principal de productos basándose en la pestaña activa, 
  // el tamaño seleccionado (para bebidas) y el texto del buscador.
  const productosFiltrados = productos.filter((prod) => {
    const categoria = prod.categoria?.toUpperCase();
    const esPizza = categoria === 'PIZZA';
    const esBebida = categoria === 'BEBIDA';
    
    // Bloques de seguridad que garantizan que el filtrado de pizzas se haga en 
    // la pestaña pizzas y viceversa
    if (activeTab === 'pizzas' && !esPizza) return false;
    if (activeTab === 'bebidas' && !esBebida) return false;

    // Filtro de disponibilidad
    if (esPizza) {
      // Comprueba disponibilidad de pizza mediana
      if (!prod.disp_piz_med) return false;
    }

    if (esBebida) {
      // Comprobamos la disponibilidad según el tamaño seleccionado
      if (selectedSize === '330ml' && !prod.disp_beb_330ml) return false;
      if (selectedSize === '500ml' && !prod.disp_beb_500ml) return false;
      if (selectedSize === '1000ml' && !prod.disp_beb_1000ml) return false;
      
      // Si está filtrado por "todos" los tamaños, nos aseguramos de que al menos 
      // uno de los tres tamaños exista y esté disponible
      if (selectedSize === 'todos') {
        const algunTamañoDisponible = prod.disp_beb_330ml || prod.disp_beb_500ml || prod.disp_beb_1000ml;
        if (!algunTamañoDisponible) return false;
      }
    }

    // Si la barra está vacía, no hace falta buscar nada, el producto es válido
    if (!term) return true;

    // Como medida de seguridad en caso de que no exista el producto buscado,
    // se asigna un texto vacío
    const nombreProducto = (prod.producto || '').toLowerCase();
    
    if (esPizza) {
      const coincideNombre = nombreProducto.includes(term);
      const descripcionTxt = (prod.descripcion || '').toLowerCase();
      const coincideDescripcion = descripcionTxt.includes(term);
      let coincideIngredientes = false;
      
      // Se convierte el array de Ingredientes a una cadena de Strings para que JavaScript
      // pueda compararlo con la búsqueda introducida 
      if (Array.isArray(prod.ingredientes)) {
        const textoIngredientes = prod.ingredientes.map(ing => {
          if (typeof ing === 'object' && ing !== null) {
            return ing.ingrediente || '';
          }
          return ing;
        }).join(' ').toLowerCase();
        coincideIngredientes = textoIngredientes.includes(term);
      }
      return coincideNombre || coincideDescripcion || coincideIngredientes;
    } 
    
    if (esBebida) {
      return nombreProducto.includes(term);
    }
    // Por seguridad, en caso de que no sea pizza ni bebida
    return false; 
  });

  // Toma los productos ya filtrados y los ordena alfabéticamente 
  // o por precio (ascendente/descendente) usando la función de referencia.
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (sortBy === 'nombre') return a.producto.localeCompare(b.producto);
    const precioA = getPrecioReferencia(a);
    const precioB = getPrecioReferencia(b);
    return sortBy === 'precio-asc' ? precioA - precioB : precioB - precioA;
  });

  // Retorna solo lo que la vista (CartaPage) necesita saber o modificar
  return {
    activeTab,
    handleTabChange,
    selectedSize, setSelectedSize,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    cargando,
    error,
    productosOrdenados,
    ingredientes
  };
};