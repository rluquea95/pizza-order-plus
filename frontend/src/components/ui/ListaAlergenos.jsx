import { Link } from "react-router";

export const ListaAlergenos = ({ alergenos, className = "" }) => {

  // Si no hay alérgenos que mostrar, no pinta nada
  if (!alergenos || alergenos.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {alergenos.map((alergeno) => {
        // Construye el nombre y descripción del alérgeno
        const nombre = alergeno.alergeno?.toUpperCase() || 'ALÉRGENO';
        const descripcion = alergeno.descripcion ? `: ${alergeno.descripcion}` : '';
        const textoCompleto = `${nombre}${descripcion}`;

        return (
          <Link
            to="/alergenos"
            key={alergeno._id}
            title={textoCompleto}
            aria-label={`Alérgeno: ${textoCompleto}`}
            // Hace que el scroll se sitúe en el inicio de la página
            onClick={() => window.scrollTo(0, 0)} 
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden p-0.5 cursor-pointer hover:scale-110 hover:bg-action transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-action bg-white"
          >
            {alergeno.imagen ? (
              <img
                src={`/img/Alergenos/${alergeno.imagen}`}
                alt={`Icono de ${nombre}`}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.currentTarget.src = '/img/Alergenos/alergeno-not-found.jpg'; }}
              />
            ) : (
              <span className="text-sm">⚠️</span>
            )}
          </Link>
        );
      })}
    </div>
  );
};