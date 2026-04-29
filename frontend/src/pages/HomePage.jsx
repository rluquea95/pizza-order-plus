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
    }, 7000);

    // Limpia el timer al desmontar el componente
    return () => clearInterval(timer);
  }, []);

  // Función auxiliar para renderizar los botones según el tipo definido en los datos
  const renderButtons = (type) => {
    if (type === 'principal') {
      return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 w-full mt-6 md:mt-10">
          <Button
            to="/carta"
            variant="secondary"
            className="w-full sm:w-auto text-lg py-3 md:py-4 px-8 md:px-10"
          >
            VER CARTA
          </Button>

          <Button
            to="/iniciar-pedido"
            variant="primary"
            className="w-full sm:w-auto text-base md:text-lg py-3 md:py-4 px-8 md:px-10"
          >
            INICIAR PEDIDO
          </Button>
        </div>
      );
    }

    if (type === 'registro') {
      return (
        <div className="flex justify-center items-center w-full mt-6 md:mt-10">
          <Button
            to="/registro"
            variant="primary"
            className="w-full sm:w-auto text-base md:text-lg py-3 md:py-4 px-8 md:px-10"
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
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}

        {/* =========================================
            CONTENIDO (TEXTOS Y BOTONES EN TARJETA)
            ========================================= */}
        <div className="relative z-20 w-[90%] max-w-4xl mx-auto bg-bg-main/85 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden grid items-center">
          {landingSlides.map((slide, index) => (
            <div
              key={`content-${slide.id}`}
              // El translate-y crea el efecto de que el texto flota desde abajo.
              // pointer-events-none evita que el usuario pueda hacer clic en botones que están ocultos.
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center w-full px-6 py-10 md:px-12 md:py-16 transition-all duration-700 ease-in-out ${index === currentSlide
                  ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                  : 'opacity-0 translate-y-8 pointer-events-none z-0'
                }`}
            >
              <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl text-primary mb-4 md:mb-6 tracking-tight drop-shadow-sm leading-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl text-primary/90 leading-relaxed max-w-2xl font-medium">
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
              className={`h-3 rounded-full transition-all duration-300 shadow-sm border border-black/10 ${index === currentSlide ? 'bg-action w-8' : 'bg-white/60 w-3 hover:bg-white hover:scale-125'
                }`}
            />
          ))}
        </div>

      </section>
    </main>
  );
};