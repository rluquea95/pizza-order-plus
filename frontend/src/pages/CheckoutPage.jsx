import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCheckout } from '../hooks/useCheckout';
import { FormInput } from '../components/ui/FormInput';
import { Button } from '../components/ui/Button';
import { RecogerLocalIcon } from '../components/icons/RecogerLocalIcon';
import { EnvioDomIcon } from '../components/icons/EnvioDomIcon';
import { AlertMessage } from '../components/ui/AlertMessage';
import { BannerInformacion } from '../components/ui/BannerInformacion';
import { AddressForm } from '../components/AddressForm';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CartItem } from '../components/CartItem';

export const CheckoutPage = () => {

  // Permite redirigir a 'Login' o 'Carta' directamente desde código
  const navigate = useNavigate();

  // Extrae el contexto del Carrito
  const {
    carrito,
    vaciarCarrito,
    precioTotal,
    actualizarCantidad,
    editarPizzaDelCarrito,
    eliminarDelCarrito,
    pedidoEnEdicion
  } = useCart();

  // Obtiene el usuario y la función que comprueba el login
  const { user, loading: authLoading } = useAuth();

  // Almacena las propiedades del Hook useCheckout
  const {
    metodoEntrega, setMetodoEntrega,
    getFieldProps,
    gastosEnvio,
    loading: checkoutLoading,
    errorGlobal,
    enviarPedido,
    isCerrado,
    pedidoRealizado,
    pedidoCancelado,
    tiempoVisual,
    handleVaciarCarrito
  } = useCheckout(user, carrito, precioTotal, vaciarCarrito, navigate, pedidoEnEdicion);

  // Controla el Scroll hacia el mensaje de aviso
  const errorRef = useRef(null);

  // Evalúa si el restaurante está cerrado 
  const estadoCierre = isCerrado();

  // Comprueba los efectos para redigirir al usuario a un sitio u otro
  useEffect(() => {

    // Si está cargando, acaba de hacer un pedido o acaba de cancelar un pedido, cancela el efecto.
    if (authLoading || pedidoRealizado || pedidoCancelado) return;

    // SOLO redirige a la carta si el carrito está vacío y no se está editando un pedido
    else if (carrito.length === 0 && !pedidoEnEdicion) {
      navigate('/carta');
    }
  }, [authLoading, carrito.length, navigate, pedidoRealizado, pedidoEnEdicion]);

  // Efecto para hacer scroll automático hacia el error
  useEffect(() => {
    if (errorGlobal && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errorGlobal]);

  // Mensaje de carga 
  if (authLoading) {
    return <LoadingSpinner mensaje="Cargando pedido..." />;
  }

  // Si el carrito está vacío y no se está editando, no renderiza la vista (evita pantallazos antes de redirigir)
  if (carrito.length === 0 && !pedidoEnEdicion) return null;

  return (
    <main className="container mx-auto p-4 pt-28 pb-12 max-w-7xl min-h-screen">

      {/* ENCABEZADO */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
          {pedidoEnEdicion ? 'Modifica tu Pedido' : 'Finaliza tu Pedido'}
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Revisa tu compra y selecciona el método de entrega para disfrutar de tu pedido.
        </p>

        {/* Muestra el mensaje del estado del negocio */}
        {estadoCierre.cerrado && (
          <BannerInformacion>
            <strong>{estadoCierre.msg}</strong> Puedes finalizar tu compra ahora.
          </BannerInformacion>
        )}
      </div>

      {/* Zona de AlertMessage con la referencia para el Scroll */}
      <div ref={errorRef} className="w-full max-w-3xl mx-auto">
        <AlertMessage message={errorGlobal} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">

        {/* COLUMNA IZQUIERDA: ENVÍO Y DATOS */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              1. ¿Cómo quieres tu pedido?
            </h2>
            <div className="h-px bg-gray-100 w-full mb-8"></div>

            {/* BOTONES DE SELECCIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setMetodoEntrega('LOCAL')}
                className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 focus:outline-none ${metodoEntrega === 'LOCAL'
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-transparent border-gray-200 text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50/50'
                  }`}
              >
                <RecogerLocalIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                  Recogida Local
                </span>
              </button>

              <button
                onClick={() => setMetodoEntrega('DOMICILIO')}
                className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 focus:outline-none ${metodoEntrega === 'DOMICILIO'
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-transparent border-gray-200 text-gray-400 hover:text-primary hover:border-primary hover:bg-gray-50/50'
                  }`}
              >
                <EnvioDomIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                  Envío a Domicilio
                </span>
              </button>
            </div>

            {/* BLOQUE DE DIRECCIÓN */}
            {metodoEntrega === 'DOMICILIO' && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  1.1. Dirección de entrega
                </h2>

                {/* FORMULARIO DE DIRECCIÓN */}
                <AddressForm
                  getFieldProps={getFieldProps}
                  bloquearUbicacion={true}
                />

              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE PRODUCTOS */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-28 flex flex-col">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">
              2. Resumen de tu pedido
            </h2>

            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 space-y-4 custom-scrollbar bg-gray-50/30 p-2 rounded-lg">
              {carrito.map((item) => (
                <CartItem
                  key={item.idLinea}
                  item={item}
                  onEliminar={eliminarDelCarrito}
                  onEditar={editarPizzaDelCarrito}
                  onActualizarCantidad={actualizarCantidad}
                />
              ))}
            </div>

            {/* PIE DE PAGO CON DESGLOSE */}
            <div className="border-t border-gray-200 pt-6 mt-6">

              {/* Desglose de Precios */}
              <div className="flex flex-col gap-2 mb-4 px-2">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>{precioTotal.toFixed(2)}€</span>
                </div>

                {metodoEntrega === 'DOMICILIO' && (
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Gastos de envío</span>
                    <span>{gastosEnvio.toFixed(2)}€</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6 px-2 border-t border-gray-100 pt-4">
                <span className="text-xl font-bold text-gray-800 uppercase tracking-widest">Total a pagar</span>
                <span className="text-4xl font-extrabold text-primary">{(precioTotal + gastosEnvio).toFixed(2)}€</span>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="primary" className="w-full py-4 text-xl font-black tracking-widest rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" onClick={enviarPedido} disabled={checkoutLoading}>
                  {checkoutLoading
                    ? 'PROCESANDO...'
                    : (pedidoEnEdicion ?
                      <>
                        GUARDAR CAMBIOS <span className="text-sm px-2 py-0.5  animate-pulse">({tiempoVisual})</span>
                      </>
                      : 'CONFIRMAR Y PAGAR')
                  }
                </Button>
                <button onClick={handleVaciarCarrito} className="w-full py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">
                  Vaciar Carrito
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
};