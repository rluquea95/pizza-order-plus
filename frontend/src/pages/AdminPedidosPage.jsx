import { useAdminPedidos } from '../hooks/useAdminPedidos';
import { PedidoColumn } from '../components/admin/PedidoColumn';
import { PedidoCard } from '../components/admin/PedidoCard';
import { PedidoIcon } from '../components/icons/PedidoIcon';
import { KitchenIcon } from '../components/icons/KitchenIcon';
import { RecogerLocalIcon } from '../components/icons/RecogerLocalIcon';
import { EnvioDomIcon } from '../components/icons/EnvioDomIcon';
import { SiguienteIcon } from '../components/icons/SiguienteIcon';
import { Button } from '../components/ui/Button';

export const AdminPedidosPage = () => {
  const {
    pedidos,
    loading,
    cargarPedidos,
    cambiarEstado,
    retrocederEstado,
    esProcesable
  } = useAdminPedidos();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold tracking-widest uppercase text-sm">Sincronizando cocina...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main pt-28 pb-12 px-4 md:px-6 font-poppins">

      {/* CABECERA */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
          Gestión de Pedidos
        </h1>
        <p className="text-lg text-primary/70 max-w-2xl mx-auto mb-8">
          Flujo de trabajo en tiempo real. Los pedidos entrantes se sincronizan automáticamente cada 30 segundos para mantener la operativa de cocina al día.
        </p>

        {/* BOTÓN DE ACTUALIZAR LAS COLUMNAS DE LOS PEDIDOS */}
        <Button
          variant="primary"
          onClick={cargarPedidos}
          className="mx-auto px-8 py-3.5 rounded-full text-sm"
        >
          <span className="text-sm md:text-lg">ACTUALIZAR TABLERO</span> 
        </Button>
      </div>

      {/* TABLERO KANBAN: 4 COLUMNAS (Para resoluciones grandes) */}
      <div className="max-w-450 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">

        {/* =========================================================
            COLUMNA 1: PEDIDOS ENTRANTES (EN_CURSO)
            ========================================================= */}
        <PedidoColumn
          titulo="Entrantes"
          colorTexto="text-blue-700"
          colorFondo="bg-blue-50"
          icono={<PedidoIcon className="w-8 h-8 text-blue-600" />}
          cantidad={pedidos.filter(p => p.estado === 'EN_CURSO').length}
        >
          {pedidos.filter(p => p.estado === 'EN_CURSO').map(pedido => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              onCancelar={() => cambiarEstado(pedido._id, 'CANCELADO')}
              accionPrincipal={
                esProcesable(pedido.createdAt) ? (
                  <button onClick={() => cambiarEstado(pedido._id, 'EN_PREPARACION')} className="flex items-center justify-center w-full h-14 bg-[#1D4ED8] text-white rounded-xl font-bold text-sm uppercase shadow-sm hover:bg-blue-800 transition-all">
                    ACEPTAR Y COCINAR
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-full h-14 bg-blue-50 border border-blue-100 rounded-xl animate-pulse">
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Esperando (5 min)...</span>
                  </div>
                )
              }
            />
          ))}
        </PedidoColumn>

        {/* =========================================================
            COLUMNA 2: EN PREPARACIÓN (EN_PREPARACION)
            ========================================================= */}
        <PedidoColumn
          titulo="En Cocina"
          colorTexto="text-action"
          colorFondo="bg-orange-50"
          icono={<KitchenIcon className="w-8 h-8 text-action" />}
          cantidad={pedidos.filter(p => p.estado === 'EN_PREPARACION').length}
        >
          {pedidos.filter(p => p.estado === 'EN_PREPARACION').map(pedido => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              accionRetroceder={() => retrocederEstado(pedido)}
              onCancelar={() => cambiarEstado(pedido._id, 'CANCELADO')}
              accionPrincipal={
                <button onClick={() => cambiarEstado(pedido._id, 'LISTO')} className="flex items-center justify-center w-full h-14 bg-orange-500 text-white rounded-xl font-bold text-sm uppercase shadow-sm hover:bg-orange-600 transition-all">
                  MARCAR COMO PREPARADO
                </button>
              }
            />
          ))}
        </PedidoColumn>

        {/* =========================================================
            COLUMNA 3: LISTOS (LISTO)
            LOCAL -> Pasa a CERRADO. DOMICILIO -> Pasa a ENVIADO
            ========================================================= */}
        <PedidoColumn
          titulo="Listos"
          colorTexto="text-green-700"
          colorFondo="bg-green-50"
          icono={<RecogerLocalIcon className="w-8 h-8 text-green-600" />}
          cantidad={pedidos.filter(p => p.estado === 'LISTO').length}
        >
          {pedidos.filter(p => p.estado === 'LISTO').map(pedido => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              accionRetroceder={() => retrocederEstado(pedido)}
              onCancelar={() => cambiarEstado(pedido._id, 'CANCELADO')}
              accionPrincipal={
                pedido.metodoEntrega === 'DOMICILIO' ? (
                  <button onClick={() => cambiarEstado(pedido._id, 'ENVIADO')} className="flex items-center justify-center w-full h-14 bg-purple-600 text-white rounded-xl font-bold text-sm uppercase shadow-sm hover:bg-purple-700 transition-all">
                    MARCAR COMO EN REPARTO
                  </button>
                ) : (
                  <button onClick={() => cambiarEstado(pedido._id, 'CERRADO')} className="flex items-center justify-center w-full h-14 bg-green-600 text-white rounded-xl font-bold text-sm uppercase shadow-sm hover:bg-green-700 transition-all">
                    MARCAR COMO CERRADO
                  </button>
                )
              }
            />
          ))}
        </PedidoColumn>

        {/* =========================================================
            COLUMNA 4: EN REPARTO
            SOLO PARA PEDIDOS A DOMICILIO. Pasa a CERRADO
            ========================================================= */}
        <PedidoColumn
          titulo="En Reparto"
          colorTexto="text-purple-700"
          colorFondo="bg-purple-50"
          icono={<EnvioDomIcon className="w-8 h-8 text-purple-600" />}
          cantidad={pedidos.filter(p => p.estado === 'ENVIADO').length}
        >
          {pedidos.filter(p => p.estado === 'ENVIADO').map(pedido => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              accionRetroceder={() => retrocederEstado(pedido)}
              onCancelar={() => cambiarEstado(pedido._id, 'CANCELADO')}
              accionPrincipal={
                <button onClick={() => cambiarEstado(pedido._id, 'CERRADO')} className="flex items-center justify-center w-full h-14 bg-green-600 text-white rounded-xl font-bold text-sm uppercase shadow-sm hover:bg-green-700 transition-all">
                  MARCAR COMO CERRADO
                </button>
              }
            />
          ))}
        </PedidoColumn>

      </div>
    </div>
  );
};