import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { CartProvider } from './context/CartContext.jsx';
import './index.css'
import App from './App.jsx'
import { DataProvider } from './context/DataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envuelve la aplicación con DataProvider para que tenga el contexto de la BBDD */}
    <DataProvider>
    {/* Envuelve la aplicación con CartProvider para que tenga el contexto del carrito */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
    </DataProvider>
  </StrictMode>,
)
