import { createContext, useState, useContext, useEffect } from 'react';
import { useData } from './DataContext';

// Crea el contexto
const CartContext = createContext();

// Crea el Provider (repartirá los datos por toda la web)
export const CartProvider = ({ children }) => {

  // Extrae los productos globales
  const { productos } = useData();

  // Inicializa el carrito, verificando si ya había items añadidos almacenados localmente
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('pizza-order-cart');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Guarda el ID del pedido que se está editando
  // Se almacena en LocalStorage para que no se pierda si se recarga la página.
  const [pedidoEnEdicion, setPedidoEnEdicion] = useState(() => {
    return localStorage.getItem('pizza-order-edicion') || null;
  });

  // Inicializa los estados del Modal de configurar pizzas
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [configProduct, setConfigProduct] = useState(null);
  const [pizzaEditando, setPizzaEditando] = useState(null);

  // Cada vez que el carrito se modifique, lo guarda en 'pizza-order-cart' 
  useEffect(() => {
    localStorage.setItem('pizza-order-cart', JSON.stringify(carrito));
  }, [carrito]);

  // Almacena el pedido que se va a editar en LocalStorage
  useEffect(() => {
    if (pedidoEnEdicion) {
      localStorage.setItem('pizza-order-edicion', pedidoEnEdicion);
    } else {
      // Cuando no hay pedido en edición, limpia la memoria por completo
      localStorage.removeItem('pizza-order-edicion');
      localStorage.removeItem('pizza-order-fecha');
    }
  }, [pedidoEnEdicion]);

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
    // Al vaciar el carrito, sale del modo edición
    setPedidoEnEdicion(null); 
  };

  // FUNCION QUE CONTROLA LA EDICION DEL PEDIDO
  const iniciarEdicionPedido = (pedidoAntiguo) => {

    // Formatea los productos del pedido para que encajen en la estructura del carrito
    const productosAdaptados = pedidoAntiguo.productos.map(p => ({
      ...p,
      // Genera un idLinea temporal 
      idLinea: p.productoId + '-' + Date.now() + Math.random(),

      // Recrea el precioTotalLinea ya que en la BBDD se almacena el precio unitario
      precioTotalLinea: p.precioUnitario * p.cantidad
    }));

    // Añade los productos al carrito
    setCarrito(productosAdaptados);

    // Guarda el ID del pedido para que Checkout sepa que es una actualización
    setPedidoEnEdicion(pedidoAntiguo._id);

    // Se almacena en LocalStorage para no perder los datos cuando se recarga o redirecciona
    localStorage.setItem('pizza-order-cart', JSON.stringify(productosAdaptados));
    localStorage.setItem('pizza-order-edicion', pedidoAntiguo._id);
    localStorage.setItem('pizza-order-fecha', pedidoAntiguo.createdAt);
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

  // Carga el Modal de Configurar Pizza con todas las características de la pizza añadida al carrito
  const editarPizzaDelCarrito = (itemEnCarrito) => {
    if (!productos || productos.length === 0) return;
    const productoBase = productos.find(p => p._id === itemEnCarrito.productoId || p.nombre === itemEnCarrito.nombre);
    if (productoBase) {
      abrirConfigurador(productoBase, itemEnCarrito);
    }
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
      editarPizzaDelCarrito,
      cerrarConfigurador,
      pedidoEnEdicion,       
      iniciarEdicionPedido
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook global para usar el carrito
export const useCart = () => {
  return useContext(CartContext);
};