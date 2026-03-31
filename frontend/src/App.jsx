import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Creamos la "memoria" para guardar nuestros productos. 
  // Empieza como un array vacío [] porque al cargar la página aún no tenemos nada.
  const [productos, setProductos] = useState([]);

  // 2. Usamos useEffect para ir a buscar los datos nada más arrancar la app
  useEffect(() => {
    // Hacemos la petición a nuestra API (tu backend)
    fetch('http://localhost:5000/api/productos')
      .then((respuesta) => respuesta.json()) // Convertimos la respuesta a JSON
      .then((datos) => {
        console.log("¡Datos recibidos del backend!", datos);
        setProductos(datos); // Guardamos los datos en nuestra "memoria" (useState)
      })
      .catch((error) => console.error("Error al traer los productos:", error));
  }, []); // Los corchetes vacíos [] significan: "Haz esto SOLO UNA VEZ al cargar la página"

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🍕 Nuestra Carta</h1>
      
      {/* 3. Recorremos la memoria y pintamos cada producto en la pantalla */}
      <ul>
        {productos.map((producto) => (
          <li key={producto._id} style={{ marginBottom: '10px' }}>
            <strong>{producto.producto}</strong> - {producto.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
