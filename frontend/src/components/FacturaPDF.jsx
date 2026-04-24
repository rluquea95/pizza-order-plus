import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DownloadIcon } from './icons/DownloadIcon';
import { PedidoItem } from './admin/PedidoItem';

export const FacturaPDF = ({ pedido }) => {
  const isDom = pedido.metodoEntrega === 'DOMICILIO';

  // Cream una referencia al div que se quiere imprimir
  const componenteRef = useRef(null);

  // Configuramos la librería añadiendo onBeforeGetContent para asegurar la carga de las imágenes
  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Factura_${pedido.usuario?.nombre || 'Cliente'}_${pedido._id.slice(-6)}`
  });

  // Función para manejar el clic y evitar que la fila se despliegue
  const descargarFactura = (e) => {
    e.stopPropagation();
    handlePrint();
  };

  return (
    <>
      {/* BOTÓN VISIBLE */}
      <button
        onClick={descargarFactura}
        className="text-gray-400 hover:text-action transition-colors bg-white border border-gray-200 hover:border-red-200 p-2 rounded-lg shadow-sm active:scale-95"
        title="Descargar Factura en PDF"
      >
        <DownloadIcon className="w-6 h-6" />
      </button>

      {/* PLANTILLA OCULTA DEL TICKET (AHORA EN EL VIEWPORT PERO INVISIBLE) */}
      <div className="absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-50 overflow-hidden h-0">
        {/* Le pasamos la referencia "componenteRef" a este contenedor */}
        <div ref={componenteRef} className="w-full p-8 bg-white text-left font-sans text-gray-800">

          {/* CABECERA FACTURA */}
          <div className="border-b-4 border-[#1a3a5a] pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-[#1a3a5a] tracking-tighter">PIZZA ORDER PLUS</h1>
              <p className="text-gray-500 font-medium mt-1">Factura de Pedido</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Referencia</p>
              <p className="text-2xl font-black text-[#1a3a5a] mb-1">#{pedido._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-gray-500 font-medium">
                {new Date(pedido.createdAt).toLocaleDateString('es-ES')} - {new Date(pedido.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* DATOS CLIENTE Y PEDIDO */}
          <div className="grid grid-cols-2 gap-8 mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200">

            {/* Columna Izquierda: Cliente */}
            <div>
              <h3 className="text-base font-black text-primary uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Datos del Cliente</h3>
              <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                <span className="font-bold text-gray-500">Nombre:</span>
                <span className="font-medium text-gray-800">{pedido.usuario?.nombre} {pedido.usuario?.apellidos}</span>

                <span className="font-bold text-gray-500">Teléfono:</span>
                <span className="font-medium text-gray-800">{pedido.usuario?.telefono || 'No especificado'}</span>

                <span className="font-bold text-gray-500">Correo:</span>
                <span className="font-medium text-gray-800">{pedido.usuario?.email || 'No especificado'}</span>
              </div>
            </div>

            {/* Columna Derecha: Entrega */}
            <div>
              <h3 className="text-base font-black text-primary uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Detalles de Entrega</h3>
              <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                <span className="font-bold text-gray-500">Método:</span>
                <span className="font-medium text-gray-800">{isDom ? 'Envío a Domicilio' : 'Recogida en Local'}</span>

                {isDom && (
                  <>
                    <span className="font-bold text-gray-500">Dirección:</span>
                    <span className="font-medium text-gray-800">{pedido.direccionEntrega?.calle}, {pedido.direccionEntrega?.numero}</span>
                  </>
                )}

                <span className="font-bold text-gray-500 mt-2">Cierre:</span>
                <span className="font-medium text-gray-800 mt-2">
                  {pedido.estado === 'CERRADO' || pedido.estado === 'CANCELADO'
                    ? new Date(pedido.updatedAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'En proceso'}
                </span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* PRODUCTOS DESGLOSADOS (¡USANDO TU COMPONENTE PedidoItem!) */}
          {/* ======================================================== */}
          <div className="mb-10">
            <h3 className="text-base font-black text-primary uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
              Productos
            </h3>
            <div className="space-y-2">
              {pedido.productos.map((itemDelBucle, idx) => (
                <PedidoItem key={idx} item={itemDelBucle} />
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* LÍNEA SEPARADORA Y TOTAL (ANCHO COMPLETO)                  */}
          {/* ======================================================== */}
          <hr className="my-8 border-t-2 border-gray-100" />

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex justify-between items-center">
            <span className="text-base font-black text-primary uppercase tracking-widest">Total del Pedido</span>
            <span className="text-4xl font-black text-[#1a3a5a]">
              {pedido.precioTotal.toFixed(2)}€
            </span>
          </div>

        </div>
      </div>
    </>
  );
}