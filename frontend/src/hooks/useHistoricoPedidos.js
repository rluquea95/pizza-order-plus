import { useState, useEffect, useCallback, useMemo } from 'react';
import { pedidosApi } from '../services/api';

export const useHistoricoPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS'); 
  const [filtroEntrega, setFiltroEntrega] = useState('TODOS'); 
  const [orden, setOrden] = useState('FECHA_DESC');

  // Carga inicial de datos
  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pedidosApi.obtenerTodosLosPedidos();
      if (response.data.success) {
        // Se filtra por pedidos CERRADOS y CANCELADOS
        const historicos = response.data.pedidos.filter(
          p => p.estado === 'CERRADO' || p.estado === 'CANCELADO'
        );
        setPedidos(historicos);
      }
    } catch (err) {
      console.error('Error al cargar el historial de pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  // Aplica Búsqueda, Filtros y Ordenación
  const pedidosProcesados = useMemo(() => {
    let resultado = [...pedidos];

    // Filtro por Estado 
    if (filtroEstado !== 'TODOS') {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    // Filtro por Método de Entrega
    if (filtroEntrega !== 'TODOS') {
      resultado = resultado.filter(p => p.metodoEntrega === filtroEntrega);
    }

    // Búsqueda por Referencia o Nombre
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      resultado = resultado.filter(p => 
        p._id.slice(-6).toLowerCase().includes(query) || 
        `${p.usuario?.nombre} ${p.usuario?.apellidos}`.toLowerCase().includes(query)
      );
    }

    // Ordenación
    resultado.sort((a, b) => {
      switch (orden) {
        case 'FECHA_DESC': // Más recientes primero
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'FECHA_ASC':  // Más antiguos primero
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'PRECIO_DESC': // Mayor precio
          return b.precioTotal - a.precioTotal;
        case 'PRECIO_ASC':  // Menor precio
          return a.precioTotal - b.precioTotal;
        case 'NOMBRE_ASC':  // Alfabético A-Z
          const nombreA = `${a.usuario?.nombre} ${a.usuario?.apellidos}`.toLowerCase();
          const nombreB = `${b.usuario?.nombre} ${b.usuario?.apellidos}`.toLowerCase();
          return nombreA.localeCompare(nombreB);
        default:
          return 0;
      }
    });

    return resultado;
  }, [pedidos, filtroEstado, filtroEntrega, searchTerm, orden]);

  return {
    pedidos: pedidosProcesados,
    loading,
    searchTerm,
    setSearchTerm,
    filtroEstado,
    setFiltroEstado,
    filtroEntrega, 
    setFiltroEntrega, 
    orden,
    setOrden,
    cargarPedidos
  };
};