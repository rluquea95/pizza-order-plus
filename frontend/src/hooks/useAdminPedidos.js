import { useEffect, useState, useCallback, useMemo } from 'react';
import { pedidosApi } from '../services/api';

export const useAdminPedidos = () => {
  // Estado que almacena todos los pedidos de la BBDD
  const [pedidos, setPedidos] = useState([]);
  // Estado para mostrar la pantalla de carga inicial
  const [loading, setLoading] = useState(true);

  /**
   * Obtiene todos los pedidos desde la API.
   * Se envuelve en useCallback para memorizar la función y evitar renders innecesarios
   * cuando se usa como dependencia en el useEffect del polling.
   */
  const cargarPedidos = useCallback(async () => {
    try {
      const response = await pedidosApi.obtenerTodosLosPedidos();
      if (response.data.success) {
        setPedidos(response.data.pedidos);
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);

    } finally {
      // Oculta el spinner de carga inicial una vez traídos los datos
      setLoading(false);
    }
  }, []);

  /**
   * EFECTO DE POLLING (Sincronización en tiempo real)
   * Se ejecuta una vez al montar el componente y luego establece un intervalo
   * que pide datos nuevos al servidor cada 30 segundos.
   */
  useEffect(() => {
    cargarPedidos();
    const intervalo = setInterval(cargarPedidos, 30000);
    return () => clearInterval(intervalo);
  }, [cargarPedidos]);

  // Filtra para obtener los pedidos pendientes de gestionar, es decir no están CERRADOS o CANCELADOS
  const pedidosActivos = useMemo(() => {
    return pedidos.filter(p => p.estado !== 'CERRADO' && p.estado !== 'CANCELADO');
  }, [pedidos]);

  
  // Cambia el estado de un pedido (ej. de EN_CURSO a EN_PREPARACION)
  // fuerza una recarga inmediata del tablero para reflejar el cambio.
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosApi.actualizarEstadoPedido(id, nuevoEstado);
      await cargarPedidos();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al actualizar');
    }
  };


  // Retrocede el pedido al estado  anterior en caso de error.
  // Usa un diccionario (mapa) para saber a qué estado debe volver.
  const retrocederEstado = async (pedido) => {
    const mapa = {
      'EN_PREPARACION': 'EN_CURSO',
      'LISTO': 'EN_PREPARACION',
      'ENVIADO': 'LISTO',
      'CERRADO': pedido.metodoEntrega === 'DOMICILIO' ? 'ENVIADO' : 'LISTO'
    };

    // Si existe un estado anterior válido en el mapa, ejecuta el cambio
    if (mapa[pedido.estado]) await cambiarEstado(pedido._id, mapa[pedido.estado]);
  };

  /**
   * PERIODO DE EDICIÓN (5 Minutos)
   * Compara la fecha de creación del pedido con la hora actual.
   * 300.000 ms = 5 minutos. Si han pasado más de 5 minutos, devuelve 'true' (es procesable).
   * Evita que la cocina comience con un pedido que el cliente aún tiene derecho a cancelar/modificar.
   */
  const esProcesable = (createdAt) => (Date.now() - new Date(createdAt).getTime()) > 300000;

  return {
    pedidos: pedidosActivos, // Solo mandamos a la interfaz los que están pendientes
    loading,
    cargarPedidos,
    cambiarEstado,
    retrocederEstado,
    esProcesable
  };
};