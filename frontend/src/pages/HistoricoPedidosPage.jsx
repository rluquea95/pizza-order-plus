import React, { useState } from 'react';
import { useHistoricoPedidos } from '../hooks/useHistoricoPedidos';
import { Button } from '../components/ui/Button';
import { BarraBusqueda } from '../components/BarraBusqueda';
import { PedidoItem } from '../components/PedidoItem';
import { FacturaPDF } from '../components/FacturaPDF';
import { Paginacion } from '../components/ui/Paginacion';

export const HistoricoPedidosPage = () => {
  const {
    pedidos, loading,
    searchTerm, setSearchTerm,
    filtroEstado, setFiltroEstado,
    filtroEntrega, setFiltroEntrega,
    orden, setOrden,
    cargarPedidos,
    totalPaginas, paginaActual, nextPagina, prevPagina
  } = useHistoricoPedidos();

  // Control para mostrar detalles del pedido
  const [expandedRows, setExpandedRows] = useState({});

  // Controla qué filas de la tabla están desplegadas (para ver los productos).
  // Recibe el ID del pedido que el usuario ha clicado.
  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      // Copia el estado del resto de filas (para conservar las filas abiertas/cerradas)
      ...prev,
      // Cambia el estado de plegado a desplegado y viceversa
      [id]: !prev[id]
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold tracking-widest uppercase text-sm">Cargando pedidos...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-main pt-28 pb-12 px-4 md:px-8">

      {/* CABECERA */}
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
          Histórico de Pedidos
        </h1>
        <p className="text-lg text-primary/70 mb-8">
          Consulta y filtra los pedidos ya entregados o cancelados.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* BARRA DE BÚSQUEDA */}
        <BarraBusqueda
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por referencia o nombre del cliente..."
        />

        {/* FILTROS */}
        <div className="flex justify-center items-center mb-10 gap-6 flex-wrap">

          <div className="flex items-center gap-3">
            <label htmlFor="filtroEstado" className="text-gray-500 text-sm font-semibold font-poppins">
              Estado:
            </label>
            <select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-200 bg-white text-primary focus:outline-none focus:border-action cursor-pointer font-medium font-poppins min-w-45 shadow-sm"
            >
              <option value="TODOS">Todos</option>
              <option value="CERRADO">Cerrados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <label htmlFor="filtroEntrega" className="text-gray-500 text-sm font-semibold font-poppins">
              Entrega:
            </label>
            <select
              id="filtroEntrega"
              value={filtroEntrega}
              onChange={(e) => setFiltroEntrega(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-200 bg-white text-primary focus:outline-none focus:border-action cursor-pointer font-medium font-poppins min-w-45 shadow-sm"
            >
              <option value="TODOS">Todas las entregas</option>
              <option value="LOCAL">Recogida en Local</option>
              <option value="DOMICILIO">A Domicilio</option>
            </select>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <label htmlFor="orden" className="text-gray-500 text-sm font-semibold font-poppins">
              Ordenar por:
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-200 bg-white text-primary focus:outline-none focus:border-action cursor-pointer font-medium font-poppins min-w-45 shadow-sm"
            >
              <option value="FECHA_DESC">Más recientes</option>
              <option value="FECHA_ASC">Más antiguos</option>
              <option value="PRECIO_DESC">Precio (Mayor a Menor)</option>
              <option value="PRECIO_ASC">Precio (Menor a Mayor)</option>
              <option value="NOMBRE_ASC">Cliente (A-Z)</option>
            </select>
          </div>

          <Button
            variant="primary"
            onClick={cargarPedidos}
            className="px-4 py-2"
            title="Refrescar datos"
          >
            <span className="text-sm md:text-lg">ACTUALIZAR PEDIDOS</span>
          </Button>
        </div>

        {/* TABLA */}
        {pedidos.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-4xl shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse whitespace-nowrap">

                  {/* CABECERA */}
                  <thead>
                    <tr className="bg-primary text-white text-base uppercase tracking-widest">
                      <th className="p-5 font-bold rounded-tl-4xl text-center">Referencia</th>
                      <th className="p-5 font-bold text-center">Fecha / Hora</th>
                      <th className="p-5 font-bold text-center">Cliente</th>
                      <th className="p-5 font-bold text-center">Entrega</th>
                      <th className="p-5 font-bold text-center">Estado</th>
                      <th className="p-5 font-bold text-center ">Total (€)</th>
                      <th className="p-5 font-bold text-center rounded-tr-4xl">DESCARGAR PEDIDO</th>
                    </tr>
                  </thead>

                  {/* CUERPO DE LA TABLA */}
                  <tbody className="divide-y divide-gray-100">
                    {pedidos.map((pedido, index) => {
                      const isDom = pedido.metodoEntrega === 'DOMICILIO';
                      const isCancelado = pedido.estado === 'CANCELADO';
                      const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30';
                      const isExpanded = expandedRows[pedido._id];

                      return (
                        // Usa Fragment para poder devolver 2 filas (la principal y la oculta) por cada pedido
                        <React.Fragment key={pedido._id}>

                          {/* FILA PRINCIPAL */}
                          <tr
                            onClick={() => toggleRow(pedido._id)}
                            onKeyDown={(e) => handleKeyDown(e, pedido._id)}
                            tabIndex="0"
                            aria-expanded={isExpanded}
                            className={`${rowBg} hover:bg-orange-50/40 transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-inset`}
                          >

                            {/* REFERENCIA DEL PEDIDO */}
                            <td className="p-5 font-black text-gray-400 group-hover:text-action transition-colors text-center select-none">
                              <span className="inline-block w-4 mr-1 text-action">
                                {isExpanded ? '▼' : '▶'}
                              </span>
                              #{pedido._id.slice(-6).toUpperCase()}
                            </td>

                            {/* FECHA Y HORA */}
                            <td className="p-5 text-center select-none">
                              <div className="text-[#1a3a5a] font-bold">
                                {new Date(pedido.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </div>
                              <div className="text-gray-500 font-semibold text-xs mt-0.5">
                                {new Date(pedido.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            {/* CLIENTE */}
                            <td className="p-5 font-bold text-[#1a3a5a] text-center select-none">
                              {pedido.usuario?.nombre} {pedido.usuario?.apellidos}
                            </td>

                            {/* TIPO DE ENTREGA */}
                            <td className="p-5 text-center select-none">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide border ${isDom ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                {isDom ? 'Domicilio' : 'Local'}
                              </span>
                            </td>

                            {/* ESTADO */}
                            <td className="p-5 text-center select-none">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide border ${isCancelado ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {isCancelado ? 'Cancelado' : 'Entregado'}
                              </span>
                            </td>

                            {/* TOTAL */}
                            <td className="p-5 font-black text-action text-xl text-center select-none">
                              {pedido.precioTotal.toFixed(2)}
                            </td>

                            {/* BOTÓN DESCARGAR PDF */}
                            <td className="p-5 text-center">
                              <FacturaPDF pedido={pedido} />
                            </td>
                          </tr>

                          {/* FILA SECUNDARIA: DESGLOSE DE PRODUCTOS */}
                          {isExpanded && (
                            <tr className="bg-gray-50/80 border-b-2 border-gray-200">
                              <td colSpan="7" className="p-0">
                                <div className="p-8 px-12 animate-in slide-in-from-top-2 duration-300">
                                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                                    Desglose de la Comanda
                                  </h4>

                                  {/* Se listan los productos usando PedidoItem */}
                                  <div className="space-y-4">
                                    {pedido.productos.map((itemDelBucle, idx) => (
                                      <PedidoItem key={idx} item={itemDelBucle} />
                                    ))}
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}

                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* CONTROLES DE PAGINACIÓN */}
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              prevPagina={prevPagina}
              nextPagina={nextPagina}
            />
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-4xl border border-gray-200 shadow-sm mt-8">
            <span className="text-6xl opacity-40 block mb-6" aria-hidden="true">🗄️</span>
            <h3 className="text-2xl font-bold text-primary mb-2">No hay resultados</h3>
            <p className="text-gray-500 font-medium">No se encontraron pedidos que coincidan con estos filtros.</p>
          </div>
        )}
      </div>

    </main>
  );
};