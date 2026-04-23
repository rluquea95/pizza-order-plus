import { useState } from 'react';
import { RecogerLocalIcon } from '../icons/RecogerLocalIcon';
import { EnvioDomIcon } from '../icons/EnvioDomIcon';
import { AtrasIcon } from '../icons/AtrasIcon';
import { CerrarIcon } from '../icons/CerrarIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationIcon } from '../icons/LocationIcon';

export const PedidoCard = ({ pedido, accionPrincipal, accionRetroceder, onCancelar }) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const isDom = pedido.metodoEntrega === 'DOMICILIO';

  const renderDireccion = (dir) => {
    if (!dir) return 'Sin dirección';
    return `${dir.calle}, ${dir.numero}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-md">

      {/* CABECERA: Naranja para Domicilio, Azul para Local */}
      <div className={`p-4 sm:p-5 flex items-center justify-between border-b border-gray-200 ${isDom ? 'bg-orange-50' : 'bg-blue-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-white shadow-sm border border-white rounded-xl flex items-center justify-center ${isDom ? 'text-orange-500' : 'text-blue-600'}`}>
            {isDom ? <EnvioDomIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <RecogerLocalIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          <div className="flex flex-col">
            <h3 className={`font-black text-sm sm:text-base leading-tight uppercase ${isDom ? 'text-orange-800' : 'text-blue-800'}`}>
              {isDom ? 'A Domicilio' : 'En Local'}
            </h3>
            {/* ID DEL PEDIDO ACORTADO */}
            <span className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Ref: #{pedido._id.slice(-6)}
            </span>
          </div>
        </div>

        {/* HORA DEL PEDIDO */}
        <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-sm sm:text-base font-black text-gray-700">
            {new Date(pedido.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* CUERPO DEL PEDIDO */}
      <div className="p-5 flex flex-col flex-1 bg-white">

        {/* INFO DEL CLIENTE */}
        <div className="flex justify-between items-center mb-5">
          <div className="min-w-0 pr-2 flex flex-col gap-1">
            <p className="text-xl sm:text-xl font-black text-[#1a3a5a] uppercase wrap-break-word leading-none">
              {pedido.usuario?.nombre} {pedido.usuario?.apellidos}
            </p>
            {/* TELÉFONO */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <PhoneIcon className="h-4 w-4 shrink-0 text-gray-400" />
              <p className="wrap-break-word">{pedido.usuario?.telefono}</p>
            </div>

            {/* DIRECCIÓN */}
            {isDom && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium mt-1">
                <LocationIcon className="h-4 w-4 shrink-0 text-gray-400" />
                <p className="wrap-break-word">{renderDireccion(pedido.direccionEntrega)}</p>
              </div>
            )}
          </div>
          <div className="bg-orange-50 font-black text-action  px-3 py-1.5 rounded-xl text-lg sm:text-xl shrink-0 border border-orange-100">
            {pedido.precioTotal.toFixed(2)}€
          </div>
        </div>

        {/* BOTÓN DESPLEGAR COMANDA */}
        <button
          onClick={() => setMostrarDetalle(!mostrarDetalle)}
          className="w-full py-3.5 mb-2 bg-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-[#1a3a5a] transition-colors flex justify-between px-5 items-center shadow-sm"
        >
          {/* TEXTO CONDICIONAL: OCULTAR O VER */}
          <span>{mostrarDetalle ? 'Ocultar Comanda' : `Ver Comanda`}</span>
          <span>{mostrarDetalle ? '▲' : '▼'}</span>
        </button>

        {/* LISTADO DE PRODUCTOS */}
        {mostrarDetalle && (
          <div className="space-y-4 mb-2 animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
            {pedido.productos.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 sm:gap-5 pb-4 border-b border-gray-100 last:border-0 last:pb-0">

                {/* CANTIDAD DE PRODUCTO */}
                <div className="flex flex-col shrink-0">
                  <span className="w-10 h-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center font-black text-base border border-gray-200">
                    {item.cantidad}x
                  </span>
                </div>

                {/* IMAGEN DEL PRODUCTO */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 p-1">
                  <img
                    src={`/img/${item.categoria === 'PIZZA' ? 'Pizzas' : 'Bebidas'}/${item.imagen || (item.categoria === 'PIZZA' ? 'pizza-not-found.jpg' : 'bebida-not-found.jpg')}`}
                    className="w-full h-full object-cover rounded-md"
                    alt={item.nombre}
                    onError={(e) => { e.currentTarget.src = item.categoria === 'PIZZA' ? '/img/Pizzas/pizza-not-found.jpg' : '/img/Bebidas/bebida-not-found.jpg'; }}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {/* NOMBRE DEL PRODUCTO */}
                  <h3 className="font-black text-[#1a3a5a] text-base sm:text-lg leading-tight uppercase wrap-break-word">
                    {item.nombre}
                  </h3>
                  {/* TAMAÑO DEL PRODUCTO */}
                  <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">
                    TAMAÑO: {item.tamaño || 'ESTÁNDAR'}
                  </p>

                  {/* INGREDIENTES */}
                  {item.categoria === 'PIZZA' && ((item.ingredientesExtra && item.ingredientesExtra.length > 0) || (item.ingredientesQuitados && item.ingredientesQuitados.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.ingredientesExtra?.map((ex, i) => (
                        <span
                          key={`ex-${i}`}
                          className="inline-flex items-center justify-center rounded px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap bg-green-50 text-green-700 border border-green-100"
                        >
                          + {typeof ex === 'object' ? ex.ingrediente : ex}
                        </span>
                      ))}
                      {item.ingredientesQuitados?.map((qu, i) => (
                        <span
                          key={`qu-${i}`}
                          className="inline-flex items-center justify-center rounded px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap bg-red-50 text-red-600 border border-red-100 line-through opacity-90"
                        >
                          - {typeof qu === 'object' ? qu.ingrediente : qu}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3 w-full shrink-0">

        {/* RETROCEDER EL ESTADO DEL PEDIDO */}
        {accionRetroceder && (
          <button
            onClick={accionRetroceder}
            title="Retroceder estado"
            className="w-14 h-14 flex items-center justify-center text-gray-500 bg-white hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 rounded-xl transition-all border border-gray-200 shrink-0 shadow-sm"
          >
            <AtrasIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* CANCELAR EL PEDIDO */}
        {onCancelar && (
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas CANCELAR este pedido? Esta acción no se puede deshacer.')) {
                onCancelar();
              }
            }}
            title="Cancelar Pedido"
            className="w-14 h-14 flex items-center justify-center text-gray-500 bg-white hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all border border-gray-200 shrink-0 shadow-sm"
          >
            <CerrarIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* AVANZAR EL PEDIDO */}
        <div className="flex-1 min-w-0">
          {accionPrincipal}
        </div>
      </div>

    </div>
  );
};