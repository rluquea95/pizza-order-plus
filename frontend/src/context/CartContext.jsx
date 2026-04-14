import { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto
const CartContext = createContext();

// Crea el Provider (repartirá los datos por toda la web)
export const CartProvider = ({ children }) => {

  // Inicializa el carrito, verificando si ya había items añadidos almacenados localmente
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('pizza-order-cart');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Inicializa los estados del Modal de configurar pizzas
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [configProduct, setConfigProduct] = useState(null);
  const [pizzaEditando, setPizzaEditando] = useState(null);

  // Cada vez que el carrito se modifique, lo guarda en 'pizza-order-cart' 
  useEffect(() => {
    localStorage.setItem('pizza-order-cart', JSON.stringify(carrito));
  }, [carrito]);

  // AÑADE PRODUCTOS AL CARRITO
  const agregarAlCarrito = (productoAñadido) => {
    setCarrito((prevCarrito) => {
      // Busca si ya existe una línea con el mismo ID (misma pizza editada o misma bebida/tamaño)
      const indexExistente = prevCarrito.findIndex(item => item.idLinea === productoAñadido.idLinea);

      if (indexExistente >= 0) {
        // Si existe, clona el carrito para no mutar el estado original
        const nuevoCarrito = [...prevCarrito];
        const itemExistente = nuevoCarrito[indexExistente];

        if (productoAñadido.categoria === 'PIZZA') {
          // En el caso de ser pizza, la reemplaza por la nueva pizza con los cambios realizados
          nuevoCarrito[indexExistente] = productoAñadido;

        } else {
          // Si es bebida, suma la cantidad y el precio
          nuevoCarrito[indexExistente] = {
            ...itemExistente,
            cantidad: itemExistente.cantidad + productoAñadido.cantidad,
            precioTotalLinea: itemExistente.precioTotalLinea + productoAñadido.precioTotalLinea
          };
        }
        return nuevoCarrito;
      } else {
        // Si el producto no estaba en el carrito, se añade como una nueva línea
        return [...prevCarrito, productoAñadido];
      }
    });
  };

  // ELIMINAR UN PRODUCTO
  const eliminarDelCarrito = (idLinea) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.idLinea !== idLinea));
  };

  // ACTUALIZA CANTIDAD DE UN PRODUCTO
  const actualizarCantidad = (idLinea, nuevaCantidad) => {
    // No permite bajar de 1, para quitar el producto se usaría el botón eliminar
    if (nuevaCantidad < 1) return;

    setCarrito((prevCarrito) => prevCarrito.map(item => {
      if (item.idLinea === idLinea) {
        // Calcula cuánto vale 1 unidad para poder multiplicar por la nueva cantidad
        const precioUnitario = item.precioTotalLinea / item.cantidad;
        return {
          ...item,
          cantidad: nuevaCantidad,
          precioTotalLinea: precioUnitario * nuevaCantidad
        };
      }
      return item;
    }));
  };

  // VACIAR CARRITO (Se usará para el botón "Vaciar todo" y tras realizar el pedido) 
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Cálculos globales
  const cantidadTotal = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
  const precioTotal = carrito.reduce((total, item) => total + item.precioTotalLinea, 0);

  // FUNCIONES PARA EL MODAL DE CONFIGURACIÓN DE PIZZAS
  // Al abrir el Modal carga con el producto base y en caso de que tenga edición
  // carga con las modificaciones que hizo el usuario
  const abrirConfigurador = (productoBase, edicion = null) => {
    setConfigProduct(productoBase);
    setPizzaEditando(edicion);
    setIsConfiguratorOpen(true);
  };

  // Cierra el modal de personalización de pizzas y resetea la memoria.
  const cerrarConfigurador = () => {
    setIsConfiguratorOpen(false);
    setTimeout(() => {
      setConfigProduct(null);
      setPizzaEditando(null);
    }, 300); // Pequeño delay para que la animación de cierre termine bien
  };

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      cantidadTotal,
      precioTotal,
      isConfiguratorOpen,
      configProduct,
      pizzaEditando,
      abrirConfigurador,
      cerrarConfigurador
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook global para usar el carrito
export const useCart = () => {
  return useContext(CartContext);
};