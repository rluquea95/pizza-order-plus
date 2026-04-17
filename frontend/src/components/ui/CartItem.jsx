import { EliminarIcon } from '../icons/EliminarIcon';
import { EditarIcon } from '../icons/EditarIcon';
import { QuantitySelector } from './QuantitySelector';

export const CartItem = ({ item, onEliminar, onEditar, onActualizarCantidad }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 group transition-all hover:shadow-md">
      
      {/* BLOQUE SUPERIOR (Móvil) / IZQUIERDO (PC) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        
        {/* Botones de acción */}
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={() => onEliminar(item.idLinea)} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
            title="Eliminar del pedido"
          >
            <EliminarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {item.categoria === 'PIZZA' && (
            <button 
              onClick={() => onEditar(item)} 
              className="p-2 text-gray-400 hover:text-action hover:bg-orange-50 rounded-full transition-colors flex items-center justify-center"
              title="Modificar Pizza"
            >
              <EditarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Imagen */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 p-1">
          <img
            src={item.imagen ? `/img/${item.categoria === 'PIZZA' ? 'Pizzas' : 'Bebidas'}/${item.imagen}` : `/img/${item.categoria === 'PIZZA' ? 'Pizzas/pizza-not-found.jpg' : 'Bebidas/bebida-not-found.jpg'}`}
            alt={item.nombre}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = item.categoria === 'PIZZA' ? '/img/Pizzas/pizza-not-found.jpg' : '/img/Bebidas/bebida-not-found.jpg'; }}
          />
        </div>

        {/* Textos */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-[#1a3a5a] text-sm sm:text-base leading-tight">
            <span className="capitalize text-gray-500 text-xs sm:text-sm font-semibold">{item.categoria.toLowerCase()}</span><br/>
            <span className="truncate block">{item.nombre}</span>
          </h3>
          <span className="font-black text-action mt-1 text-sm sm:text-base">
            {item.precioTotalLinea.toFixed(2)}€
          </span>
          <p className="text-[10px] sm:text-xs text-gray-500 capitalize mt-0.5">Tamaño: {item.tamaño}</p>

          {item.categoria === 'PIZZA' && ((item.ingredientesExtra && item.ingredientesExtra.length > 0) || (item.ingredientesQuitados && item.ingredientesQuitados.length > 0)) && (
            <span className="inline-flex items-center w-fit mt-1.5 px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-medium rounded border border-gray-200 shadow-sm whitespace-nowrap">
              ✨ Personalizada
            </span>
          )}
        </div>
      </div>

      {/* BLOQUE INFERIOR (Móvil) / DERECHO (PC): Selector de cantidad */}
      <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
        <QuantitySelector
          cantidad={item.cantidad} 
          setCantidad={(nuevaCantidad) => onActualizarCantidad(item.idLinea, nuevaCantidad)} 
          variant="carrito" 
        />
      </div>

    </div>
  );
};