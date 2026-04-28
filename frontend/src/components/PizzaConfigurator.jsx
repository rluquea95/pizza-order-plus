import { useCart } from '../context/CartContext';
import { usePizzaConfigurator } from '../hooks/usePizzaConfigurator';
import { Button } from './ui/Button';
import { AlertMessage } from './ui/AlertMessage';
import { BannerInformacion } from './ui/BannerInformacion';
import { CerrarIcon } from './icons/CerrarIcon';
import { QuantitySelector } from './ui/QuantitySelector';
import { ListaAlergenos } from './ListaAlergenos';
import { CapsulaIngrediente } from './CapsulaIngrediente';

export const PizzaConfigurator = ({ isOpen, onClose, product, ingredientes, pizzaEditando }) => {

  // Desestructura todo lo que devuelve el hook (usePizzaConfigurator.js)
  const {
    isLoading,
    nombre, descripcion, rutaImagen,
    tamañosDisponibles, tamañoSeleccionado, setTamañoSeleccionado,
    ingredientesBase, ingredientesQuitados, handleToggleBaseIngrediente,
    extrasParaDropdown, ingredientesExtra, handleAddExtraFromDropdown, handleRemoveExtraAdded,
    numQuitados, numExtras, maxExtrasUI,
    cantidad, setCantidad,
    precioTotalLinea,
    generarPizzaFinal,
    alergenosActuales,
    avisoMaxExtras
  } = usePizzaConfigurator(isOpen, product, ingredientes, pizzaEditando);

  // Almacena el carrito (estado global)
  const { agregarAlCarrito } = useCart();

  if (!isOpen || isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[95vh] animate-fade-in">

        {/* CABECERA FIJA BLANCA */}
        <div className="shrink-0 pt-8 pb-4 px-6 md:px-12 relative z-10 bg-white">
          <button
            onClick={onClose}
            aria-label="Cerrar configurador"
            className="absolute top-6 right-6 md:top-8 md:right-8 z-20 text-gray-400 hover:text-primary transition-colors text-3xl md:text-4xl font-light focus:outline-none leading-none"
          >
            <CerrarIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center">
            Configura la pizza seleccionada
          </h2>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="grow overflow-hidden flex flex-col px-4 sm:px-8 md:px-12 pb-6 md:pb-10 bg-white">
          {/* 
            CONTENEDOR DE LA INFORMACIÓN DEL PRODUCTO
            Redondeado a la izquierda (rounded-l-3xl) y esquinas rectas/suaves a la derecha (rounded-r-md),
            así la barra de scroll nativa se integra mejor visualmente.
          */}
          <div className="bg-[#FFF8ED] rounded-l-3xl rounded-r-md border border-[#FBEAD2] shadow-inner flex-1 overflow-y-auto p-6 sm:p-8 md:p-10">

            {/* 1. SECCIÓN: IMAGEN Y TÍTULO */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10 pb-10 border-b border-[#FBEAD2] group overflow-hidden">
              <div className="w-full sm:w-87.5 h-64 sm:h-auto min-h-62.5 rounded-xl overflow-hidden shrink-0 shadow-md relative">
                <img
                  src={rutaImagen} alt={nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/img/Pizzas/pizza-not-found.jpg'; }}
                />
              </div>
              <div className="flex flex-col justify-center w-full">
                <h3 className="text-3xl font-bold text-primary mb-3">{nombre}</h3>
                <p className="text-primary/80 text-base leading-relaxed">{descripcion}</p>

                {/* --- RENDERIZADO DINÁMICO DE ALÉRGENOS --- */}
                {alergenosActuales.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-primary/10">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Contiene los siguientes alérgenos:</p>
                    <ListaAlergenos alergenos={alergenosActuales} />
                  </div>
                )}
              </div>
            </div>

            {/* OPCIONES */}
            <div className="flex flex-col gap-10">

              {/* SECCIÓN A: INGREDIENTES BASE */}
              <div className="pb-10 border-b border-[#FBEAD2]">
                <h4 className="font-bold text-xl text-primary mb-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  1. Ingredientes por defecto <span className="text-sm font-medium text-gray-500">(Ingredientes quitados: {numQuitados}/3)</span>
                </h4>

                {/* Banner descriptivo */}
                <BannerInformacion>
                  <strong>Puedes eliminar hasta 3 ingredientes base </strong> (el precio de la pizza no varía).
                  Por cada ingrediente base eliminado, podrás añadir un ingrediente extra adicional al límite establecido.
                </BannerInformacion>

                {/* AVISO SOLO SI ES DE LA SECCIÓN BASE */}
                {avisoMaxExtras?.seccion === 'ing-base' && (
                  <AlertMessage message={avisoMaxExtras.mensaje} />
                )}

                <div className="flex flex-wrap gap-3">
                  {ingredientesBase.map((ing) => {
                    // Calcula si el algún ingrediente base ha sido quitado
                    const estaQuitado = ingredientesQuitados.some(item => item._id === ing._id);
                    return (
                      <CapsulaIngrediente
                        key={`base-${ing._id}`}
                        nombre={ing.ingrediente}
                        variant={estaQuitado ? 'disabled' : 'default'}
                        interactivo={true}
                        isToggled={!estaQuitado}
                        size="md"
                        onClick={() => handleToggleBaseIngrediente(ing)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* SECCIÓN B: TAMAÑO */}
              <div className="pb-10 border-b border-[#FBEAD2]">
                <h4 className="font-bold text-xl text-primary mb-4">2. Elige el tamaño de la pizza</h4>
                <div className="relative w-full">
                  <select
                    value={tamañoSeleccionado} onChange={(e) => setTamañoSeleccionado(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#FBEAD2] text-primary py-4 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-action/50 focus:border-action/50 cursor-pointer text-base shadow-sm"
                  >
                    {tamañosDisponibles.map(tam => (
                      <option key={tam.id} value={tam.id}>{tam.label} — {Number(tam.precio).toFixed(2)}€</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* SECCIÓN C: EXTRAS */}
              <div>
                <h4 className="font-bold text-xl text-primary mb-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  3. Ingredientes extras
                  <span className="text-action font-extrabold">(+1.50€/ud)</span>
                  <span className="text-sm font-medium text-gray-500">(Añadidos: {numExtras}/{maxExtrasUI})</span>
                </h4>

                {/* Banner descriptivo */}
                <BannerInformacion>
                  Puedes añadir hasta <strong>3 ingredientes extras</strong>. Si has eliminado ingredientes base, este límite aumentará automáticamente en <strong>{maxExtrasUI}</strong>.
                </BannerInformacion>

                {/* AVISO SOLO SI ES DE LA SECCIÓN EXTRAS */}
                {avisoMaxExtras?.seccion === 'ing-extras' && (
                  <AlertMessage message={avisoMaxExtras.mensaje} />
                )}

                <div className="relative mb-6 w-full">
                  <select
                    onChange={handleAddExtraFromDropdown}
                    defaultValue=""
                    // Bloquea el selector si se llega al límite de ingr extras añadidos
                    disabled={numExtras >= maxExtrasUI}
                    className={`w-full appearance-none border border-[#FBEAD2] py-4 px-5 rounded-xl text-base shadow-sm transition-colors
                      ${numExtras >= maxExtrasUI
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-80' // Estilos cuando está bloqueado
                        : 'bg-white text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-action/50 focus:border-action/50' // Estilos normales
                      }`}
                  >
                    <option value="" disabled>
                      {numExtras >= maxExtrasUI
                        ? '-- Límite de extras alcanzado --'
                        : '-- Selecciona un ingrediente --'}
                    </option>
                    {extrasParaDropdown.map(extra => (
                      <option key={extra._id} value={extra._id}>{extra.ingrediente}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-primary/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {numExtras > 0 && (
                  <div className="bg-white border border-[#FBEAD2] p-5 rounded-xl w-full shadow-sm">
                    <p className="text-sm text-primary mb-4 font-semibold">Añadidos:</p>
                    <div className="flex flex-wrap gap-3">
                      {ingredientesExtra.map((ing) => (
                        <div
                          key={`extra-added-${ing._id}`}
                          tabIndex="0"
                          className="bg-[#FFECC8] text-[#8C5E03] px-5 py-2.5 rounded-full text-base font-medium flex items-center gap-3 shadow-sm animate-fade-in transition-all duration-300
                                    hover:bg-[#FCD38B] focus:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:border-action/50"
                        >
                          <span>{ing.ingrediente}</span>
                          <button
                            onClick={() => handleRemoveExtraAdded(ing._id)}
                            className="text-[#8C5E03]/60 hover:text-[#8C5E03] font-bold leading-none text-2xl 
                                      focus:outline-none focus-visible:text-[#8C5E03]"
                          >
                            <CerrarIcon className="w-5 h-5 stroke-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PIE DEL MODAL (CANTIDAD, BOTÓN PEDIR)*/}
        <div className="shrink-0 p-6 sm:p-8 md:px-12 md:py-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-6 items-center justify-between z-10">
          <div className="flex items-center gap-5">
            <span className="text-xl font-bold text-primary tracking-widest">CANTIDAD</span>

            {/* Botones selectores de cantidad */}
            <QuantitySelector
              cantidad={cantidad}
              setCantidad={setCantidad}
              variant="modal"
            />
          </div>
          <Button
            variant="primary"
            className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 text-lg sm:text-xl uppercase"
            onClick={() => {
              // Genera el objeto con toda la info de la pizza configurada
              const pizzaAñadida = generarPizzaFinal();
              // Lo agrega al carrito (estado global)
              agregarAlCarrito(pizzaAñadida);
              // Cierra el modal
              onClose();
            }}
          >
            PEDIR POR {precioTotalLinea.toFixed(2)}€
          </Button>
        </div>

      </div>
    </div>
  );
};