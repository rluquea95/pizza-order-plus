import { useEffect, useState } from 'react';
import { pedidosApi } from '../services/api';
import { useAutoAlert } from './useAutoAlert';

export const useCheckout = (user, carrito, precioTotal, clearCart, navigate, pedidoEnEdicion) => {

  // Almacena el método de entrega del pedido
  const [metodoEntrega, setMetodoEntrega] = useState('LOCAL');

  // Estado centralizado del formulario 
  const [direccion, setDireccion] = useState({
    tipo_via: user?.direccion?.[0]?.tipo_via || 'Calle',
    calle: user?.direccion?.[0]?.calle || '',
    numero: user?.direccion?.[0]?.numero || '',
    piso: user?.direccion?.[0]?.piso || '',
    codigo_postal: '41580',
    ciudad: 'Casariche'
  });

  // Cuando el user termina de cargar desde el AuthContext, actualiza el formulario.
  useEffect(() => {
    if (user?.direccion && user.direccion.length > 0) {
      const dirPrincipal = user.direccion[0];
      setDireccion(prev => ({
        ...prev,
        tipo_via: dirPrincipal.tipo_via || 'Calle',
        calle: dirPrincipal.calle || '',
        numero: dirPrincipal.numero || '',
        piso: dirPrincipal.piso || ''
      }));
    }
  }, [user]);

  // Almacena los errores y si está cargando
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  // Controla que el aviso global desaparezca en 5 seg
  const { aviso: errorGlobal, mostrarAviso: setErrorGlobal, ocultarAviso } = useAutoAlert(5000);

  // Calcula los gastos de envío que debe aplicar (1€ casco urbano, 2€ afueras)
  const gastosEnvio = metodoEntrega === 'DOMICILIO'
    ? (direccion.tipo_via === 'Camino' || direccion.tipo_via === 'Carretera' ? 2 : 1)
    : 0;

  // Bandera para saber si el carrito se ha vaciado al realizar una compra
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  // Bandera para saber si acabamos de cancelar un pedido
  const [pedidoCancelado, setPedidoCancelado] = useState(false);

  // Validaciones básicas de longitud para la calle y número
  const esCalleValida = (calle) => {
    return calle.trim().length >= 3;
  };

  const esNumeroValido = (numero) => {
    const numLimpio = numero.trim();
    return numLimpio.length > 0 && numLimpio.length <= 5;
  };

  // Asigna las funciones validadoras al input correspondiente
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'calle':
        if (value.length > 0 && !esCalleValida(value)) errorMsg = 'Mínimo 3 caracteres.';
        break;
      case 'numero':
        if (value.length > 0 && !esNumeroValido(value)) errorMsg = 'Máximo 5 caracteres.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // Se ejecuta mientras el usuario escribe en cualquier input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualiza los datos
    setDireccion(prev => ({ ...prev, [name]: value }));
    ocultarAviso(); // Si había error global, lo quita porque el usuario está corrigiendo

    // Valida en tiempo real y actualiza el estado de errores
    if (name !== 'tipo_via') {
      const fieldError = validateField(name, value);
      setErrores(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  // Comprueba si el campo es válido para aplicarle el formato adecuado
  const isFieldValid = (name) => {
    // El select siempre es válido
    if (name === 'tipo_via') return true;
    const valor = direccion[name] || '';
    const hasValue = valor.trim().length > 0;

    // El CP y Ciudad siempre son válidos ya que están inyectados en el código
    if (name === 'codigo_postal' || name === 'ciudad') return true;

    // Si está vacío o tiene un error, no es válido
    if (!hasValue || errores[name]) return false;

    return validateField(name, valor) === '';
  };

  // Inyecta todas las propiedades en el input
  const getFieldProps = (name) => {
    return {
      name: name,
      value: direccion[name],
      onChange: handleInputChange,
      error: errores[name],
      isValid: isFieldValid(name)
    };
  };

  // Revisa todos los campos de golpe para asegurarse de que no falte nada antes de ir al Backend.
  const validarFormularioFinal = () => {
    const nuevosErrores = {};
    let isValid = true;

    if (!direccion.calle.trim()) {
      nuevosErrores.calle = 'El nombre de la dirección es obligatoria.';
      isValid = false;
    } else {
      const errorCalle = validateField('calle', direccion.calle);
      if (errorCalle) { nuevosErrores.calle = errorCalle; isValid = false; }
    }

    if (!direccion.numero.trim()) {
      nuevosErrores.numero = 'El número es obligatorio.';
      isValid = false;
    } else {
      const errorNum = validateField('numero', direccion.numero);
      if (errorNum) { nuevosErrores.numero = errorNum; isValid = false; }
    }

    setErrores(nuevosErrores);
    return isValid;
  };

  // Función que vigila el horario del negocio para mostrar un mensaje de aviso cuando 
  // el negocio se encuentra cerrado
  const isCerrado = () => {
    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours();

    if (dia === 1) return { cerrado: true, msg: "Los lunes estamos cerrados por descanso." };
    if (hora < 20) return { cerrado: true, msg: "Procesaremos tu pedido automáticamente a partir de las 20:00h." };
    return { cerrado: false };
  };

  // LÓGICA DE TEMPORIZADOR DE EDICIÓN
  const [now, setNow] = useState(Date.now());
  const fechaPedidoStr = localStorage.getItem('pizza-order-fecha');
  const tiempoTranscurrido = fechaPedidoStr ? now - new Date(fechaPedidoStr).getTime() : 0;
  const tiempoRestante = (5 * 60 * 1000) - tiempoTranscurrido;

  const minutos = Math.floor(tiempoRestante / 60000);
  const segundos = Math.floor((tiempoRestante % 60000) / 1000);
  const tiempoVisual = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

  // Mostrará al usuario el tiempo restante de edición de pedido
  useEffect(() => {
    let intervalo;
    if (pedidoEnEdicion && fechaPedidoStr) {
      intervalo = setInterval(() => setNow(Date.now()), 1000);
    }
    return () => clearInterval(intervalo);
  }, [pedidoEnEdicion, fechaPedidoStr]);

  // Redirige a los pedidos del usuario cuando se acaba el tiempo de edición
  useEffect(() => {
    // Si quedan 0 segundos o menos, limpiamos y redirigimos
    if (pedidoEnEdicion && fechaPedidoStr && tiempoRestante <= 0) {
      alert("El tiempo de modificación (5 minutos) ha expirado.");
      clearCart();
      navigate('/pedidos');
    }
  }, [tiempoRestante, pedidoEnEdicion, fechaPedidoStr, clearCart, navigate]);


  // --- ENVÍO A BACKEND ---
  const enviarPedido = async () => {
    ocultarAviso();
    setErrores({});

    // PEDIDO MÍNIMO DE 10€ A DOMICILIO
    // Comprueba el precioTotal (subtotal de productos) antes de sumar gastos de envío
    if (metodoEntrega === 'DOMICILIO' && precioTotal < 10) {
      setErrorGlobal("El pedido mínimo para envío a domicilio es de 10€ (sin incluir gastos de envío).");
      return;
    }

    // Verifica que los campos obligatorios del Domicilio estén cumplimentados
    if (metodoEntrega === 'DOMICILIO') {
      if (!validarFormularioFinal()) {
        setErrorGlobal("Por favor, revisa los campos en rojo de la dirección.");
        return;
      }
    }

    setLoading(true);
    try {
      // Formatea los productos para insertarlos en el objeto datosPedido
      const productosFormateados = carrito.map(item => ({
        productoId: item.productoId || item._id,
        nombre: item.nombre,
        categoria: item.categoria, // 'PIZZA' o 'BEBIDA'
        tamaño: item.tamaño || '',
        cantidad: item.cantidad,
        precioUnitario: Number((item.precioTotalLinea / item.cantidad).toFixed(2)),
        ingredientesExtra: item.ingredientesExtra || [],
        ingredientesQuitados: item.ingredientesQuitados || [],
        imagen: item.imagen
      }));

      // Suma los gastos de envío al total
      const totalConEnvio = precioTotal + gastosEnvio;

      // Genera el pedido
      const datosPedido = {
        usuario: user._id || user.id,
        productos: productosFormateados,
        metodoEntrega: metodoEntrega,
        precioTotal: Number(totalConEnvio.toFixed(2))
      };

      // Añade la dirección SOLO si es a domicilio
      if (metodoEntrega === 'DOMICILIO') {
        datosPedido.direccionEntrega = {
          tipo_via: direccion.tipo_via,
          calle: direccion.calle,
          numero: direccion.numero,
          piso: direccion.piso || '',
          codigo_postal: direccion.codigo_postal,
          ciudad: direccion.ciudad
        };
      }
      
      // Llamada a la API
      // Depende de si es edición o una compra se crea/modifica el pedido
      if (pedidoEnEdicion) {
        await pedidosApi.modificarPedido(pedidoEnEdicion, datosPedido);
      } else {
        await pedidosApi.crearPedido(datosPedido);
      }

      // Indica que el carrito se vacía por una compra
      setPedidoRealizado(true);

      // Vacía el carrito
      clearCart();

      // Redirige a los pedidos del usuario
      // Añade replace:true para que no pueda volver atrás con el navegador
      navigate('/pedidos', { replace: true });

    } catch (err) {

      console.error("Error devuelto por el backend:", err.response?.data);

      // Extrae el mensaje de error de Mongoose si existe, sino da uno genérico
      const mensajeError = err.response?.data?.mensaje
        || err.response?.data?.error
        || "Error de validación al tramitar el pedido.";
      setErrorGlobal(mensajeError);

    } finally {
      setLoading(false);
    }
  };

  // Función que Cancela el pedido editado en caso de que el usuario vacíe el carrito
  const handleVaciarCarrito = async () => {
    if (!pedidoEnEdicion) {
      clearCart();
      return;
    }

    const confirmar = window.confirm(
      "Al vaciar el carrito durante una edición, este pedido se CANCELARÁ definitivamente. ¿Estás seguro de que deseas cancelar el pedido?"
    );

    if (confirmar) {
      try {
        await pedidosApi.cancelarPedido(pedidoEnEdicion);
        setPedidoCancelado(true);
        clearCart();
        navigate('/pedidos', { replace: true });
      } catch (err) {
        alert(err.response?.data?.mensaje || "Hubo un error al cancelar el pedido.");
      }
    }
  };

  // Exporta los datos necesarios para CheckoutPage
  return {
    metodoEntrega,
    setMetodoEntrega,
    gastosEnvio,
    getFieldProps,
    loading,
    errorGlobal,
    enviarPedido,
    isCerrado,
    pedidoRealizado,
    pedidoCancelado,
    tiempoVisual,
    handleVaciarCarrito
  };
};