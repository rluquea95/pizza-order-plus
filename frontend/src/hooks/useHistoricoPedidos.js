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

  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 15;

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

  // Si el usuario cambia los filtros, lo devuelve a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado, filtroEntrega, orden, searchTerm]);

  // Aplica Búsqueda, Filtros, Ordenación y Paginación
  const { pedidosPaginados, totalPaginas } = useMemo(() => {
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
        case 'NOMBRE_ASC': {  // Alfabéticamente
          const nombreA = `${a.usuario?.nombre} ${a.usuario?.apellidos}`.toLowerCase();
          const nombreB = `${b.usuario?.nombre} ${b.usuario?.apellidos}`.toLowerCase();
          return nombreA.localeCompare(nombreB);
        }
        default:
          return 0;
      }
    });

    // Divide los pedidos en bloques de 15
    const totalPaginasCalc = Math.ceil(resultado.length / elementosPorPagina);

    // Si la página actual se queda fuera de rango tras un borrado o filtrado, se ajusta al máximo posible
    const paginaAsegurada = Math.min(paginaActual, totalPaginasCalc > 0 ? totalPaginasCalc : 1);

    // Extrae solo los pedidos de la página correspondiente
    const indiceInicio = (paginaAsegurada - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const pedidosDeLaPagina = resultado.slice(indiceInicio, indiceFin);

    return {
      pedidosPaginados: pedidosDeLaPagina,
      totalPaginas: totalPaginasCalc
    };
  }, [pedidos, filtroEstado, filtroEntrega, searchTerm, orden, paginaActual]);

  // Funciones para navegar por las páginas
  const nextPagina = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const prevPagina = () => setPaginaActual(prev => Math.max(prev - 1, 1));

  return {
    pedidos: pedidosPaginados,
    totalPaginas,
    paginaActual,
    nextPagina,
    prevPagina,
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