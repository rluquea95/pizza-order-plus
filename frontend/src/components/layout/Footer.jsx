
import { Link } from 'react-router';
import logoClaro from '../../assets/logo_pizza_order.webp';
import { ListaAlergenos } from '../ListaAlergenos';
import { useData } from '../../context/DataContext';

export const Footer = () => {
  // Extrae 'alergenos' y 'cargando' de DataContext
  const { alergenos, cargando } = useData();

  return (
    <footer className="w-full flex flex-col">
      {/* =========================================
          BARRA SUPERIOR (Precios de envío y aviso)
          ========================================= */}
      <div className="bg-white text-action py-4 px-4 text-center shadow-sm">
        <p className="font-poppins font-bold text-lg md:text-xl tracking-wide max-w-4xl mx-auto leading-relaxed">
          Servicio a domicilio 1,00€ <span className="hidden md:inline mx-2 text-primary/30">|</span><br className="md:hidden" />
          Fuera del casco urbano 2,00€ <span className="hidden md:inline mx-2 text-primary/30">|</span><br className="md:hidden" />
          Cerrado lunes por descanso
        </p>
      </div>

      {/* =========================================
          CONTENIDO PRINCIPAL DEL FOOTER
          ========================================= */}
      <div className="bg-primary text-white pt-12 pb-8 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">

          {/* Divide el footer en 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* COLUMNA 1: Estamos Aquí */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-xl mb-6 tracking-widest text-center">ESTAMOS AQUÍ</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                <img
                  src={logoClaro}
                  alt="Logo PizzaOrder+"
                  className="w-20 h-20 object-contain shrink-0"
                />
                <div className="text-lg leading-relaxed text-gray-200">
                  <p>C\ Calle, 12</p>
                  <p className="font-bold text-white">POBLACIÓN</p>
                  <p>(PROVINCIA)</p>
                  <p className="text-action font-bold mt-2 text-xl">999 999 999</p>
                </div>
              </div>
            </div>

            {/* COLUMNA 2: Alérgenos */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-xl mb-6 tracking-widest text-center">INFORMACIÓN SOBRE ALÉRGENOS</h3>

              {cargando ? (
                <span className="text-gray-400 text-sm animate-pulse">Cargando alérgenos...</span>
              ) : (
                <ListaAlergenos
                  alergenos={alergenos}
                  className="justify-center max-w-70"
                />
              )}
            </div>

            {/* COLUMNA 3: Horarios */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-xl mb-6 tracking-widest text-center">ABIERTOS</h3>
              <div className="text-lg leading-relaxed text-gray-200 text-center">
                <p>De Martes a Domingo</p>
                <p className="font-bold text-white mt-1">20:00 – 24:00 Horas</p>
              </div>
            </div>

          </div>

          {/* =========================================
              LÍNEA SEPARADORA
              ========================================= */}
          <hr className="border-white/10 my-10" />

          {/* =========================================
              ENLACES LEGALES Y COPYRIGHT
              ========================================= */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm md:text-base text-gray-300">
              <Link to="/aviso-legal" className="hover:text-action transition-colors">Aviso Legal</Link>
              <Link to="/privacidad" className="hover:text-action transition-colors">Política de Privacidad</Link>
              <Link to="/cookies" className="hover:text-action transition-colors">Política de Cookies</Link>
              <Link to="/accesibilidad" className="hover:text-action transition-colors">Declaración de Accesibilidad</Link>
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">
              Copyright © {new Date().getFullYear()} PizzaOrder+ | Diseñado por Rosa María Luque Aguilar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};