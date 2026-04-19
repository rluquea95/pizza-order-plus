import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crea una instancia de axios para no repetir la URL base siempre
const api = axios.create({
  baseURL: API_URL
});

// Inyección del Token de seguridad antes de que cualquier petición salga hacia el backend
api.interceptors.request.use((config) => {
  // Busca el token en el almacenamiento local del navegador
  const token = localStorage.getItem('pizza-order-token');
  
  if (token) {
    // Si hay token, lo añade a la cabecera de Autorización
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Objeto de servicio que agrupa todas las llamadas a la base de datos 
// de Producto, Ingrediente y Alergeno
export const pizzaApi = {

  // Obtiene la colección Productos
  getProductos: () => api.get('/productos'),

  // Obtiene la colección Ingredientes
  getIngredientes: () => api.get('/ingredientes'),

  // Obtiene la colección Alérgenos
  getAlergenos: () => api.get('/alergenos'),

  /**
   * Carga masiva de datos iniciales.
   * Se usa en el CartContext para alimentar la App al arrancar.
   */
  getInitialData: () => {
    return Promise.all([
      pizzaApi.getIngredientes(),
      pizzaApi.getProductos(),
      pizzaApi.getAlergenos()
    ]);
  }
};

// Objeto de servicio que agrupa las llamadas relacionadas con la autenticación
// de usuarios (registro y login)
export const authApi = {
  // Envía los datos del formulario para registrar un nuevo usuario
  registro: (userData) => api.post('/auth/registro', userData),
  
  // Autentica a un usuario mediante sus credenciales y recibe el Token JWT
  login: (credentials) => api.post('/auth/login', credentials)
};

// Objeto de servicio que agrupa las llamadas relacionadas con los pedidos
export const pedidosApi = {
  // Crea un nuevo pedido
  crearPedido: (datosPedido) => api.post('/pedidos', datosPedido),

  // Obtiene TODOS los pedidos de la pizzería (Solo ADMIN)
  obtenerTodosLosPedidos: () => api.get('/pedidos'),

  // Obtiene el historial de pedidos de un usuario
  obtenerPedidosUsuario: (userId) => api.get(`/pedidos/usuario/${userId}`),

  // Cancela un pedido (Borrado lógico)
  cancelarPedido: (pedidoId) => api.patch(`/pedidos/${pedidoId}/cancelar`),

  // Modifica un pedido
  modificarPedido: (pedidoId, datosPedido) => api.put(`/pedidos/${pedidoId}`, datosPedido),

  // Cambia el estado del pedido (Solo ADMIN)
  actualizarEstadoPedido: (pedidoId, nuevoEstado) => api.patch(`/pedidos/${pedidoId}/estado`, { nuevoEstado })
};