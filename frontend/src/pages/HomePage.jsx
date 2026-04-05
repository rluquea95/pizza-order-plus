import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { landingSlides } from '../data/landingSlides'; // Importa el array con los datos del carrusel

export const HomePage = () => {

  // Estado que almacena la diapositiva que se está mostrando
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Comprueba si se encuentra en la última diapositiva y si es así, vuelve a la primera
      setCurrentSlide((prev) => (prev === landingSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    // Limpia el timer al desmontar el componente
    return () => clearInterval(timer);
  }, []);

  // Función auxiliar para renderizar los botones según el tipo definido en los datos
  const renderButtons = (type) => {
    if (type === 'principal') {
      return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 w-full mt-10">
          <Button 
            to="/carta" 
            variant="secondary" 
            className="w-full sm:w-auto text-lg py-4 px-10"
          >
            VER CARTA
          </Button>
          
          <Button 
            to="/iniciar-pedido" 
            variant="primary" 
            className="w-full sm:w-auto text-lg py-4 px-10"
          >
            INICIAR PEDIDO
          </Button>
        </div>
      );
    }
    
    if (type === 'registro') {
      return (
        <div className="flex justify-center items-center w-full mt-10">
          <Button 
            to="/registro" 
            variant="primary" 
            className="w-full sm:w-auto text-lg py-4 px-10"
          >
            CREAR CUENTA
          </Button>
        </div>
      );
    }

    // Cuando llega a la diapositiva que no tiene botones, sale de la función
    return null; 
  };

  return (
    <main className="w-full grow flex flex-col">
      <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden">
        
        {/* =========================================
            IMÁGENES DE FONDO 
            ========================================= */}
        {landingSlides.map((slide, index) => (
          <div
            key={`bg-${slide.id}`}
            // Cuando se cambia a la siguiente diapositiva, la iamgen de fondo se oculta, 
            // creando una transición suave
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}

        {/* =========================================
            CONTENIDO (TEXTOS Y BOTONES EN TARJETA)
            ========================================= */}
        <div className="relative z-20 px-6 py-10 md:py-16 text-center flex flex-col items-center w-[90%] max-w-4xl mx-auto min-h-87.5 justify-center bg-bg-main/85 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {landingSlides.map((slide, index) => (
            <div 
              key={`content-${slide.id}`}
              // El translate-y crea el efecto de que el texto flota desde abajo.
              // pointer-events-none evita que el usuario pueda hacer clic en botones que están ocultos.
              className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center justify-center w-full px-6 md:px-12 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-primary mb-6 tracking-tight drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-primary/90 leading-relaxed max-w-2xl font-medium">
                {slide.text}
              </p>
              
              {renderButtons(slide.buttonType)}
            </div>
          ))}
        </div>

        {/* =========================================
            CONTROLES DEL CARRUSEL 
            ========================================= */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
          {/* Usamos '_' como primer parámetro porque no necesitamos los datos de la diapositiva, 
              solo nos interesa su posición (index) */}
          {landingSlides.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
              // Al estar activo, el botón se ensancha (w-8) y cambia a color naranja
              className={`h-3 rounded-full transition-all duration-300 shadow-sm border border-black/10 ${
                index === currentSlide ? 'bg-action w-8' : 'bg-white/60 w-3 hover:bg-white hover:scale-125'
              }`}
            />
          ))}
        </div>

      </section>
    </main>
  );
};