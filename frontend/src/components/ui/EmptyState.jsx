import { CerrarIcon } from '../icons/CerrarIcon';

export const EmptyState = ({
  icono = <CerrarIcon className="w-20 h-20" />,
  titulo = 'No hay resultados',
  descripcion = 'No se encontró la información solicitada.'
}) => {
  return (
    <div className="text-center py-24 bg-white rounded-4xl border border-gray-200 shadow-sm mt-8 flex flex-col items-center">
      {/* El div contenedor del icono maneja la opacidad y el centrado */}
      <div className="opacity-40 mb-6 flex justify-center text-gray-400" aria-hidden="true">
        {icono}
      </div>
      <h3 className="text-2xl font-bold text-primary mb-2">{titulo}</h3>
      <p className="text-gray-500 font-medium">{descripcion}</p>
    </div>
  );
};