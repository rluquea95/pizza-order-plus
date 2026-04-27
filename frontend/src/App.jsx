import { Route, Routes } from 'react-router';
import { useData } from './context/DataContext';
import { useCart } from './context/CartContext';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CartaPage } from './pages/CartaPage';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { IniciarPedidoPage } from './pages/IniciarPedidoPage';
import { PizzaConfigurator } from './components/PizzaConfigurator';
import { AdminRoute } from './components/routing/AdminRoute';
import { ClienteRoute } from './components/routing/ClienteRoute';
import { AdminPedidosPage } from './pages/AdminPedidosPage';
import { AlergenosPage } from './pages/AlergenosPage';
import { HistoricoPedidosPage } from './pages/HistoricoPedidosPage';
import { PedidosUsuarioPage } from './pages/PedidosUsuarioPage';


const App = () => {

  // Extrae el estado global del Modal de Configurar Pizzas desde el carrito
  const {
    isConfiguratorOpen,
    cerrarConfigurador,
    configProduct,
    pizzaEditando
  } = useCart();

  // Extrae los ingredientes desde DataContext
  const { ingredientes } = useData();

  return (
    <div className="min-h-screen flex flex-col">

      {/* Componente de navegación */}
      <Navbar />

      <Routes>

        {/* =========================================
            RUTAS PÚBLICAS
            ========================================= */}

        {/* Página de Inicio */}
        <Route path="/" element={<HomePage />} />

        {/* Página de Iniciar Pedido */}
        <Route path="/iniciar-pedido" element={<IniciarPedidoPage />} />

        {/* Página de Carta */}
        <Route path="/carta" element={<CartaPage />} />

        {/* Página de Alérgenos */}
        <Route path="/alergenos" element={<AlergenosPage />} />

        {/* Página de Registro */}
        <Route path="/registro" element={<RegisterPage />} />

        {/* Página de Login */}
        <Route path="/login" element={<LoginPage />} />


        {/* =========================================
            RUTAS DE CLIENTE
            ========================================= */}
        {/* Página de Checkout */}
        <Route
          path="/tramitar-pedido"
          element={
            <ClienteRoute>
              <CheckoutPage />
            </ClienteRoute>
          }
        />

        {/* Página de Pedidos del Usuario */}
        <Route
          path="/pedidos"
          element={
            <ClienteRoute>
              <PedidosUsuarioPage />
            </ClienteRoute>
          }
        />


        {/* =========================================
            RUTAS DE ADMINISTRADOR
            ========================================= */}
        {/* Página de Gestión de Pedidos */}
        <Route
          path="/admin/pedidos"
          element={
            <AdminRoute>
              <AdminPedidosPage />
            </AdminRoute>
          }
        />

        {/* Página de Historial de Pedidos Cerrados/Cancelados */}
        <Route
          path="/admin/historico"
          element={
            <AdminRoute>
              <HistoricoPedidosPage />
            </AdminRoute>
          }
        />

      </Routes>

      {/* Componente de pie de página */}
      <Footer />

      {/* Modal de Configurar Pizza Global */}
      <PizzaConfigurator
        isOpen={isConfiguratorOpen}
        onClose={cerrarConfigurador}
        product={configProduct}
        ingredientes={ingredientes}
        pizzaEditando={pizzaEditando}
      />
    </div>
  );
}

export default App;