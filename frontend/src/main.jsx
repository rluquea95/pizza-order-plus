import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { CartProvider } from './context/CartContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envuelve toda la app con AuthProvider para la sesión del usuario */}
    <AuthProvider>
    {/* Envuelve la aplicación con DataProvider para que tenga el contexto de la BBDD */}
    <DataProvider>
    {/* Envuelve la aplicación con CartProvider para que tenga el contexto del carrito */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
    </DataProvider>
    </AuthProvider>
  </StrictMode>,
)