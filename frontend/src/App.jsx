import { Navbar } from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Componente de navegación */}
      <Navbar />

      {/* Un texto temporal para saber que estamos probando */}
      <div className="p-8 text-center">
        <h1 className="text-3xl font-poppins text-primary font-bold">
          Contenido de la página...
        </h1>
      </div>

    </div>
  )
}

export default App;