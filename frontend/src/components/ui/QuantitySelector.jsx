export const QuantitySelector = ({
  cantidad,
  setCantidad,
  min = 1,
  variant = 'modal', // Se le pasa modal por defecto 
}) => {

  // Función que reduce la cantidad
  const handleDecrement = () => {
    setCantidad(Math.max(min, cantidad - 1));
  };

  // Función que aumenta la cantidad
  const handleIncrement = () => {
    setCantidad(cantidad + 1);
  };

  // CLASES COMPARTIDAS 
  const baseBtnClasses = "flex items-center justify-center leading-none rounded-full border border-gray-200 bg-white text-gray-600 hover:border-action hover:text-action transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-action/50 active:scale-95";
  const baseNumClasses = "text-center font-bold text-primary select-none";

  // CLASES DINÁMICAS (Lo que cambia según en qué componente se inserten los botones)
  const isModal = variant === 'modal';

  const containerSize = isModal ? "gap-4" : "gap-1";
  const btnSize = isModal
    ? "w-12 h-12 text-3xl focus:border-action/50"
    : "w-8 h-8 text-xl sm:w-10 sm:h-10 sm:text-2xl";
  const numSize = isModal
    ? "w-6 text-2xl"
    : "w-6 sm:w-8 text-base sm:text-lg";

  // Ajustes de padding para cada símbolo y que se alineen igual
  const minusAdjust = isModal ? "pb-1.5" : "pb-1";
  const plusAdjust = isModal ? "pb-0.5" : "";

  return (
    <div className={`flex items-center ${containerSize}`}>
      {/* BOTÓN DECREMENTAR (-) */}
      <button
        onClick={handleDecrement}
        aria-label="Disminuir cantidad"
        className={`${baseBtnClasses} ${btnSize} ${minusAdjust}`}
      >
        -
      </button>

      {/* CANTIDAD */}
      <span className={`${baseNumClasses} ${numSize}`}>
        {cantidad}
      </span>

      {/* BOTÓN INCREMENTAR (+) */}
      <button
        onClick={handleIncrement}
        aria-label="Aumentar cantidad"
        className={`${baseBtnClasses} ${btnSize} ${plusAdjust}`}
      >
        +
      </button>
    </div>
  );
};