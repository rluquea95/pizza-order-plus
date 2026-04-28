import { useData } from '../context/DataContext';
import { BannerInformacion } from '../components/ui/BannerInformacion';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';

export const AlergenosPage = () => {
  // Extrae alérgenos, cargando y error de useData
  const { alergenos, cargando, error: errorApi } = useData();

  // Define un error manual por si la colección viene vacía
  // Evalua si hay un error de la API o si simplemente la colección vino vacía
  const error = errorApi || (!cargando && (!alergenos || alergenos.length === 0) ? "No se ha encontrado la información detallada de los alérgenos." : null);

  return (
    <main className="w-full grow bg-bg-main py-12 pt-28">
      <div className="container mx-auto px-4 md:px-8 max-w-8xl">

        {/* TÍTULO DE LA PÁGINA */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            Alérgenos
          </h1>
          <p className="text-lg text-primary/70 max-w-2xl mx-auto">
            El Real Decreto 126/2015 establece como obligatoria “la información sobre todo ingrediente que cause alergias o intolerancias y se utilice en la fabricación o la elaboración de un alimento”.
          </p>
        </div>

        {/* Mensajes de estado */}
        {cargando && <LoadingSpinner mensaje="Cargando alérgenos..." />}

        {error && (
          <EmptyState
            titulo="¡Ups! Algo ha salido mal"
            descripcion={error}
          />
        )}

        {/* =========================================
            GRID DE ALÉRGENOS (2 COLUMNAS)
            ========================================= */}
        {!cargando && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {alergenos.map((alergeno) => (
              <article
                key={alergeno._id}
                className="bg-white rounded-4xl shadow-lg overflow-hidden border border-gray-100 flex flex-col sm:flex-row"
              >
                {/* Contenedor del Icono */}
                <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-white flex items-center justify-center p-8 relative overflow-hidden shrink-0">
                  <img
                    src={`/img/Alergenos/${alergeno.imagen}`}
                    alt={alergeno.alergeno}
                    className="w-full h-full max-h-32 object-contain relative z-10"
                    onError={(e) => { e.currentTarget.src = '/img/Alergenos/alergeno-not-found.jpg'; }}
                  />
                </div>

                {/* Información Detallada */}
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 first-letter:uppercase">
                    {alergeno.alergeno}
                  </h2>

                  {/* Separador */}
                  <div className="h-1 w-10 bg-action mb-4 rounded-full"></div>

                  <p className="text-base text-primary/70 leading-relaxed font-medium">
                    {alergeno.descripcion}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* NOTA AL PIE USANDO BANNERINFORMACION */}
        {!cargando && !error && (
          <div className="mt-16">
            <BannerInformacion>
              <strong>Aviso Importante:</strong> Para cualquier duda adicional sobre intolerancias severas o contaminación cruzada, por favor
              <strong> contáctenos antes de realizar su pedido </strong>. Su salud es nuestra prioridad.
            </BannerInformacion>
          </div>
        )}

      </div>
    </main>
  );
};