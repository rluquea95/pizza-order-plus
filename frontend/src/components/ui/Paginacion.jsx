import { Button } from './Button';

export const Paginacion = ({ 
  paginaActual, 
  totalPaginas, 
  prevPagina, 
  nextPagina 
}) => {
  // Si solo hay 1 página (o ninguna), no pinta los controles
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="secondary"
        onClick={prevPagina}
        disabled={paginaActual === 1}
        className="px-4 py-2 text-sm uppercase tracking-widest" 
      >
        Anterior
      </Button>

      <span className="text-gray-500 font-medium px-4">
        Página <strong className="text-primary">{paginaActual}</strong> de {totalPaginas}
      </span>

      <Button
        variant="secondary"
        onClick={nextPagina}
        disabled={paginaActual === totalPaginas}
        className="px-4 py-2 text-sm uppercase tracking-widest"
      >
        Siguiente
      </Button>
    </div>
  );
};