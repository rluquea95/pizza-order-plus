export const PedidoItem = ({ item, isCompact = false }) => {

  // Calcula el precio x la cantidad de un producto
  let precioAMostrar = null;

  if (item.precioTotalLinea) {
    precioAMostrar = item.precioTotalLinea;
  } else if (item.precioUnitario) {
    precioAMostrar = item.precioUnitario * item.cantidad;
  }

  return (
    <div className={`flex items-center ${isCompact ? 'gap-3 pb-3' : 'gap-4 sm:gap-5 pb-4'} border-b border-gray-100 last:border-0 last:pb-0`}>

      {/* CANTIDAD DE PRODUCTO */}
      <div className="flex flex-col shrink-0">
        <span className={`${isCompact ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'} rounded-full bg-white text-gray-800 flex items-center justify-center font-black border border-gray-200 shadow-sm`}>
          {item.cantidad}x
        </span>
      </div>

      {/* IMAGEN DEL PRODUCTO */}
      <div className={`${isCompact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 p-1`}>
        <img
          src={`/img/${item.categoria === 'PIZZA' ? 'Pizzas' : 'Bebidas'}/${item.imagen || (item.categoria === 'PIZZA' ? 'pizza-not-found.jpg' : 'bebida-not-found.jpg')}`}
          className="w-full h-full object-cover rounded-md"
          alt={item.nombre}
          onError={(e) => { e.currentTarget.src = item.categoria === 'PIZZA' ? '/img/Pizzas/pizza-not-found.jpg' : '/img/Bebidas/bebida-not-found.jpg'; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* NOMBRE DEL PRODUCTO */}
        <h3 className={`font-black text-[#1a3a5a] ${isCompact ? 'text-sm' : 'text-base sm:text-lg'} leading-tight uppercase wrap-break-word`}>
          {item.nombre}
        </h3>
        {/* TAMAÑO DEL PRODUCTO */}
        <p className={`text-gray-500 font-bold uppercase tracking-wide ${isCompact ? 'text-[10px] mt-0' : 'text-xs sm:text-sm mt-1'}`}>
          TAMAÑO: {item.tamaño || 'ESTÁNDAR'}
        </p>

        {/* INGREDIENTES (Solo si es Pizza) */}
        {item.categoria === 'PIZZA' && ((item.ingredientesExtra && item.ingredientesExtra.length > 0) || (item.ingredientesQuitados && item.ingredientesQuitados.length > 0)) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.ingredientesExtra?.map((ex, i) => (
              <span
                key={`ex-${i}`}
                className="inline-flex items-center justify-center rounded-xl px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap bg-green-50 text-green-700 border border-green-100"
              >
                + {typeof ex === 'object' ? ex.ingrediente : ex}
              </span>
            ))}
            {item.ingredientesQuitados?.map((qu, i) => (
              <span
                key={`qu-${i}`}
                className="inline-flex items-center justify-center rounded-xl px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap bg-red-50 text-red-600 border border-red-100 line-through opacity-90"
              >
                - {typeof qu === 'object' ? qu.ingrediente : qu}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PRECIO DEL PRODUCTO */}
      <div className="bg-orange-50 font-black text-action  px-3 py-1.5 rounded-xl text-lg sm:text-xl shrink-0 border border-orange-100">
        {precioAMostrar !== null ? `${precioAMostrar.toFixed(2)}€` : '--'}
      </div>
    </div>
  );
};