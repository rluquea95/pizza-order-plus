import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { pedidosApi } from '../services/api';
import { useCart } from '../context/CartContext';

export const usePedidosUsuario = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reloj interno para el contador de 5 minutos
  const [now, setNow] = useState(Date.now());

  // Estados para los filtros 
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroEntrega, setFiltroEntrega] = useState('TODOS');
  const [orden, setOrden] = useState('FECHA_DESC');

  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10; 

  const { iniciarEdicionPedido } = useCart();
  const navigate = useNavigate();

  // Obtiene los pedidos de la BBDD
  const cargarPedidos = useCallback(async () => {
    try {
      const response = await pedidosApi.obtenerMisPedidos();
      if (response.data.success) {
        setPedidos(response.data.pedidos);
      }
    } catch (err) {
      console.error('Error al cargar mis pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Consulta los pedidos cada 30 segundos
  useEffect(() => {
    cargarPedidos();
    const intervaloDatos = setInterval(cargarPedidos, 30000);
    return () => clearInterval(intervaloDatos);
  }, [cargarPedidos]);

  // Reloj para el temporizador visual
  useEffect(() => {
    const intervaloReloj = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervaloReloj);
  }, []);

  // Función para Editar
  const editarPedido = (pedido) => {
    iniciarEdicionPedido(pedido);
    navigate('/tramitar-pedido');
  };

  // Función para Cancelar
  const cancelarPedido = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      try {
        await pedidosApi.cancelarPedido(id);
        await cargarPedidos();
      } catch (err) {
        alert(err.response?.data?.mensaje || 'El tiempo para cancelar ha expirado.');
        cargarPedidos();
      }
    }
  };

  // Si el usuario cambia los filtros, lo devuelve a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado, filtroEntrega, orden]);

  // Aplica Filtros y Ordenación
  const { pedidosPaginados, totalPaginas } = useMemo(() => {
    let resultado = [...pedidos];

    // Almacena los pedidos pendientes
    if (filtroEstado === 'ACTIVOS') {
      resultado = resultado.filter(p => p.estado !== 'CERRADO' && p.estado !== 'CANCELADO');

      // Almacena los pedidos Cerrados o Cancelados
    } else if (filtroEstado !== 'TODOS') {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    // Almacena todos los pedidos
    if (filtroEntrega !== 'TODOS') resultado = resultado.filter(p => p.metodoEntrega === filtroEntrega);

    resultado.sort((a, b) => {
      if (orden === 'FECHA_DESC') return new Date(b.createdAt) - new Date(a.createdAt);
      if (orden === 'FECHA_ASC') return new Date(a.createdAt) - new Date(b.createdAt);
      if (orden === 'PRECIO_DESC') return b.precioTotal - a.precioTotal;
      if (orden === 'PRECIO_ASC') return a.precioTotal - b.precioTotal;
      return 0;
    });

    // Inyecta el cálculo del tiempo de edición del pedido 
    const resultadosEnriquecidos = resultado.map(pedido => {
      const tiempoTranscurrido = now - new Date(pedido.createdAt).getTime();
      const cincoMinutos = 5 * 60 * 1000;
      const tiempoRestante = cincoMinutos - tiempoTranscurrido;
      const esEditable = pedido.estado === 'EN_CURSO' && tiempoRestante > 0;

      let tiempoVisual = "0:00";
      if (esEditable) {
        const minutos = Math.floor(tiempoRestante / 60000);
        const segundos = Math.floor((tiempoRestante % 60000) / 1000);
        tiempoVisual = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
      }

      return {
        ...pedido,
        esEditable,
        tiempoVisual
      };
    });

    // Divide los pedidos en bloques de 10
    const totalPaginasCalc = Math.ceil(resultadosEnriquecidos.length / elementosPorPagina);
    
    // Si la página actual se queda fuera de rango tras un borrado o filtrado, se ajusta al máximo posible
    const paginaAsegurada = Math.min(paginaActual, totalPaginasCalc > 0 ? totalPaginasCalc : 1);
    
    // Extrae solo los pedidos de la página correspondiente
    const indiceInicio = (paginaAsegurada - 1) * elementosPorPagina;
    const indiceFin = indiceInicio + elementosPorPagina;
    const pedidosDeLaPagina = resultadosEnriquecidos.slice(indiceInicio, indiceFin);

    return {
      pedidosPaginados: pedidosDeLaPagina,
      totalPaginas: totalPaginasCalc
    };

    // Con 'now' se consigue que useMemo se dispare cada segundo
  }, [pedidos, filtroEstado, filtroEntrega, orden, now, paginaActual]);

  // Funciones para navegar por las páginas
  const nextPagina = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const prevPagina = () => setPaginaActual(prev => Math.max(prev - 1, 1));

  return {
    pedidos: pedidosPaginados,
    totalPaginas,
    paginaActual,
    nextPagina,
    prevPagina,
    loading, now,
    filtroEstado, setFiltroEstado,
    filtroEntrega, setFiltroEntrega,
    orden, setOrden,
    cargarPedidos,
    editarPedido,
    cancelarPedido
  };
};