export const QuantitySelector = ({ cantidad, setCantidad, min = 1 }) => {
  // Función que decrementa la cantidad
  const handleDecrement = () => {
    setCantidad(Math.max(min, cantidad - 1));
  };

  // Función que aumenta la cantidad
  const handleIncrement = () => {
    setCantidad(cantidad + 1);
  };

  return (
    <div className="flex items-center gap-4">
      {/* BOTÓN DECREMENTAR (-) */}
      <button
        onClick={handleDecrement}
        aria-label="Disminuir cantidad"
        className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-action hover:text-action 
                  transition-colors text-3xl font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-action/50 focus:border-action/50 active:scale-95 pb-1.5"
      >
        -
      </button>

      {/* CANTIDAD */}
      <span className="w-6 text-center font-bold text-primary text-2xl select-none">
        {cantidad}
      </span>

      {/* BOTÓN INCREMENTAR (+) */}
      <button
        onClick={handleIncrement}
        aria-label="Aumentar cantidad"
        className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-action hover:text-action 
                  transition-colors text-3xl font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-action/50 focus:border-action/50 active:scale-95 pb-1.5"
      >
        +
      </button>
    </div>
  );
};