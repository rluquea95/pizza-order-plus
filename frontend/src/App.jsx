import { Route, Routes } from 'react-router';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CartaPage } from './pages/CartaPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Componente de navegación */}
      <Navbar />

      <Routes>
        {/* Página de Inicio */}
        <Route path="/" element={<HomePage />} />

        {/* Página de Carta */}
        <Route path="/carta" element={<CartaPage />} />
      </Routes>

      {/* Componente de pie de página */}
      <Footer />
    </div>
  )
}

export default App;