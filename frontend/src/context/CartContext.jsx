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

    // Cada vez que el carrito se modifique, lo guarda en 'pizza-order-cart' que es el correspondiente
    // al carrito
    useEffect(() => {
      localStorage.setItem('pizza-order-cart', JSON.stringify(carrito));
    }, [carrito]);

    // AÑADE PRODUCTOS AL CARRITO
    const agregarAlCarrito = (productoAñadido) => {
      setCarrito((prevCarrito) => {
        // Busca si ya existe exactamente el mismo producto en el carrito
        const indexExistente = prevCarrito.findIndex(item => item.idLinea === productoAñadido.idLinea);

        if (indexExistente >= 0) {
          // Si existe, clona el carrito para no mutar el estado original
          const nuevoCarrito = [...prevCarrito];
          const itemExistente = nuevoCarrito[indexExistente];

          // Actualiza la cantidad y el precio total de esa línea
          nuevoCarrito[indexExistente] = {
            ...itemExistente,
            cantidad: itemExistente.cantidad + productoAñadido.cantidad,
            precioTotalLinea: itemExistente.precioTotalLinea + productoAñadido.precioTotalLinea
          };
          return nuevoCarrito;
        } else {
          // Si no existe, lo añade como una línea nueva
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

    // ACTUALIZAR PIZZA MODIFICADA (Reemplaza una pizza añadida al carrito por su versión editada)
    const modificarPizza = (idLineaAntigua, pizzaModificada) => {
      setCarrito((prevCarrito) => prevCarrito.map(item =>
        item.idLinea === idLineaAntigua ? pizzaModificada : item
      ));
    };

    // VACIAR CARRITO (Se usará para el botón "Vaciar todo" y tras realizar el pedido) 
    const vaciarCarrito = () => {
      setCarrito([]);
    };

    // Cálculos globales
    const cantidadTotal = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
    const precioTotal = carrito.reduce((total, item) => total + item.precioTotalLinea, 0);

    return (
      <CartContext.Provider value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        modificarPizza,
        vaciarCarrito,
        cantidadTotal,
        precioTotal
      }}>
        {children}
      </CartContext.Provider>
    );
  };
  
// Hook global para usar el carrito en cualquier componente.
// Se define en la raíz del archivo para garantizar un único contexto compartido.
export const useCart = () => {
  return useContext(CartContext);
};