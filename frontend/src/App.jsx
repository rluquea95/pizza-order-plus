import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Componente de navegación */}
      <Navbar />

      {/* Landing Page*/}
      <HomePage />

      {/* Componente de pie de página */}
      <Footer/>
    </div>
  )
}

export default App;