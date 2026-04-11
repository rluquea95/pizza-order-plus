import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crea una instancia de axios para no repetir la URL base siempre
const api = axios.create({
  baseURL: API_URL
});

// Objeto de servicio que agrupa todas las llamadas a la base de datos.
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