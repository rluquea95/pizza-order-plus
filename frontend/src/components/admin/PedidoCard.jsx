import { useState } from 'react';
import { RecogerLocalIcon } from '../icons/RecogerLocalIcon';
import { EnvioDomIcon } from '../icons/EnvioDomIcon';
import { AtrasIcon } from '../icons/AtrasIcon';
import { CerrarIcon } from '../icons/CerrarIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationIcon } from '../icons/LocationIcon';
import { PedidoItem } from '../PedidoItem';

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
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-4 space-y-4 mb-2">
            {/* SE ENVÍA CADA PRODUCTO */}
            {pedido.productos.map((itemDelBucle, index) => (
              <PedidoItem
                key={index}
                item={itemDelBucle}
                isCompact={true}
              />
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