import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';
import { CerrarIcon } from './icons/CerrarIcon';
import { EliminarIcon } from './icons/EliminarIcon';
import { EditarIcon } from './icons/EditarIcon';
import { QuantitySelector } from './ui/QuantitySelector';

export const CartSidebar = ({ isOpen, onClose, onEditPizza }) => {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, precioTotal } = useCart();

  // EFECTO PARA BLOQUEAR EL SCROLL DE LA PÁGINA DE FONDO
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Congela el scroll
    } else {
      document.body.style.overflow = 'unset'; // Lo restaura
    }

    // Limpieza por si el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* OVERLAY OSCURO (difumina el fondo de la página para centrar el foco en el resumen del pedido) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onClose}
      />

      {/* BARRA LATERAL (Drawer) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-125 bg-bg-main shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* CABECERA */}
        <div className="relative flex items-center justify-center p-6 border-b border-gray-200 bg-white min-h-20">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Tu Pedido</h2>
          <button
            onClick={onClose}
            className="absolute right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-action"
            aria-label="Cerrar carrito"
          >
            <CerrarIcon className="w-6 h-6" />
          </button>
        </div>

        {/* CUERPO: LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {carrito.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <Button variant="secondary" className="px-6 py-2" onClick={onClose}>Ver la Carta</Button>
            </div>
          ) : (
            carrito.map((item) => (
              <div
                key={item.idLinea}
                className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 group transition-all hover:shadow-md"
              >

                {/* ACCIONES DE ELIMINAR O EDITAR PRODUCTO */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => eliminarDelCarrito(item.idLinea)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                    aria-label="Eliminar producto"
                    title="Eliminar del pedido"
                  >
                    <EliminarIcon className="w-5 h-5" />
                  </button>

                  {item.categoria === 'PIZZA' && (
                    <button
                      onClick={() => onEditPizza(item)}
                      className="p-1.5 text-gray-400 hover:text-action hover:bg-orange-50 rounded-full transition-colors flex items-center justify-center"
                      aria-label="Modificar Pizza"
                      title="Modificar Pizza"
                    >
                      <EditarIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* IMAGEN DEL PRODUCTO */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 p-1">
                  <img
                    // obtenemos el nombre la imagen y la concatenamos con la ruta correspondiente
                    src={item.imagen
                      ? `/img/${item.categoria === 'PIZZA' ? 'Pizzas' : 'Bebidas'}/${item.imagen}`
                      : `/img/${item.categoria === 'PIZZA' ? 'Pizzas/pizza-not-found.jpg' : 'Bebidas/bebida-not-found.jpg'}`}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                    // Imagen por defecto dinámica en caso de error
                    onError={(e) => {
                      e.currentTarget.src = item.categoria === 'PIZZA'
                        ? '/img/Pizzas/pizza-not-found.jpg'
                        : '/img/Bebidas/bebida-not-found.jpg';
                    }}
                  />
                </div>

                {/* INFORMACIÓN DEL PRODUCTO */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-bold text-primary text-base sm:text-lg truncate">
                    <span className="capitalize">{item.categoria.toLowerCase()}</span> {item.nombre}
                  </h3>
                  <span className="font-bold text-action">
                    {item.precioTotalLinea.toFixed(2)}€
                  </span>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">Tamaño: {item.tamaño}</p>

                  {item.categoria === 'PIZZA' && item.ingredientesExtra && item.ingredientesExtra.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                      + {item.ingredientesExtra.map(i => i.nombre).join(', ')}
                    </p>
                  )}
                </div>

                {/* CONTROLES DE CANTIDAD */}
                <QuantitySelector
                  cantidad={item.cantidad}
                  setCantidad={(nuevaCantidad) => actualizarCantidad(item.idLinea, nuevaCantidad)}
                  variant="carrito"
                />

              </div>
            ))
          )}
        </div>

        {/* PIE: TOTAL Y BOTONES */}
        {carrito.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-medium text-gray-500">Total a pagar:</span>
              <span className="text-3xl font-extrabold text-primary">{precioTotal.toFixed(2)}€</span>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full py-4 text-lg" to="/tramitar-pedido">
                TRAMITAR PEDIDO
              </Button>
              <button
                onClick={vaciarCarrito}
                className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};