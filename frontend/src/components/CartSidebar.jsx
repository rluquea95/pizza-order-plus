import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';
import { CerrarIcon } from './icons/CerrarIcon';
import { CartItem } from './ui/CartItem';

export const CartSidebar = ({ isOpen, onClose }) => {
  // Constante desestructurada que recibe el carrito global
  const { 
    carrito, 
    actualizarCantidad, 
    eliminarDelCarrito, 
    editarPizzaDelCarrito, 
    vaciarCarrito, 
    precioTotal 
  } = useCart();

  // Constante que lee la ruta de la URL actual
  const location = useLocation();

  // Efecto que se encarga de cerrar la ventana del carrito si cambia la URL
  useEffect(() => {
    // Si el carrito está abierto y detecta que la ruta ha cambiado, lo cierra
    if (isOpen) {
      onClose();
    }
    // Se ejecuta cada vez que 'location.pathname' (la URL) cambia
  }, [location.pathname]);

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
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 md:w-125 bg-bg-main shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
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
              <Button variant="primary" className="px-6 py-2" to="/iniciar-pedido" onClick={onClose}>
                Iniciar Pedido
              </Button>
            </div>
          ) : (
            // Componente que lista las columnas de productos
            carrito.map((item) => (
              <CartItem
                key={item.idLinea}
                item={item}
                onEliminar={eliminarDelCarrito}
                onEditar={editarPizzaDelCarrito}
                onActualizarCantidad={actualizarCantidad}
              />
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