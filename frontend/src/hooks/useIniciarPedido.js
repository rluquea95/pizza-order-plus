import { useState } from 'react';
import { useData } from '../context/DataContext';

export const useIniciarPedido = () => {
  // Inician la pestaña activa, el filtrado y la barra de búsqueda
  const [activeTab, setActiveTab] = useState('pizzas');
  const [selectedSize, setSelectedSize] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  
  // Extrae 'productos','cargando' y 'error' de la memoria global
  const { productos, cargando, error } = useData();

  // Cuando se cambia de pestaña, resetea la búsqueda y el filtro
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedSize('todos');
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
    if (esPizza && !prod.disp_piz_med) return false;

    if (esBebida) {
      // Comprueba la disponibilidad según el tamaño seleccionado
      if (selectedSize === '330ml' && !prod.disp_beb_330ml) return false;
      if (selectedSize === '500ml' && !prod.disp_beb_500ml) return false;
      if (selectedSize === '1000ml' && !prod.disp_beb_1000ml) return false;
      
      // Si está filtrado por "todos" los tamaños, se asegura de que al menos 
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

  // --- Ordenas las pizzas ---
  const pizzasFiltradas = productosFiltrados.filter(p => p.categoria?.toUpperCase() === 'PIZZA');
  const pizzasOrdenadas = [...pizzasFiltradas].sort((a, b) => {
    if (sortBy === 'nombre') return a.producto.localeCompare(b.producto);
    const precioA = Number(a.precio_pizza_med) || 0;
    const precioB = Number(b.precio_pizza_med) || 0;
    return sortBy === 'precio-asc' ? precioA - precioB : precioB - precioA;
  });

  // --- Ordena las bebidas ---
  const bebidasFiltradas = productosFiltrados.filter(p => p.categoria?.toUpperCase() === 'BEBIDA');
  let bebidasDesglosadas = [];
  
  bebidasFiltradas.forEach(prod => {
    if (selectedSize !== 'todos') {
      bebidasDesglosadas.push({ product: prod, size: selectedSize, idKey: `${prod._id}-${selectedSize}` });
    } else {
      if (prod.precio_beb_330ml) bebidasDesglosadas.push({ product: prod, size: '330ml', idKey: `${prod._id}-330` });
      if (prod.precio_beb_500ml) bebidasDesglosadas.push({ product: prod, size: '500ml', idKey: `${prod._id}-500` });
      if (prod.precio_beb_1000ml) bebidasDesglosadas.push({ product: prod, size: '1000ml', idKey: `${prod._id}-1000` });
    }
  });

  const bebidasOrdenadas = bebidasDesglosadas.sort((a, b) => {
    const precioA = Number(a.product[`precio_beb_${a.size}`]) || 0;
    const precioB = Number(b.product[`precio_beb_${b.size}`]) || 0;

    if (sortBy === 'precio-asc') return precioA - precioB;
    if (sortBy === 'precio-desc') return precioB - precioA;
    
    if (sortBy === 'nombre') {
      const comparacionNombre = a.product.producto.localeCompare(b.product.producto);
      if (comparacionNombre === 0) return precioA - precioB; // Misma bebida, ordena por tamaño
      return comparacionNombre;
    }
    return 0;
  });

  // Retorna solo lo que la vista (IniciarPedidoPage) necesita saber o modificar
  return {
    activeTab,
    handleTabChange,
    selectedSize, setSelectedSize,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    cargando,
    error,
    pizzasOrdenadas, 
    bebidasOrdenadas
  };
};