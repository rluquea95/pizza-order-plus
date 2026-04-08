import { useState, useEffect, useRef } from 'react';

export const usePizzaConfigurator = (isOpen, product, ingredientes) => {
  // Inicia el tamaño de la pizza, cantidad, ingredientes base quitados, ingredientes 
  // extras añadidos, mensaje de aviso de advertencias
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState('mediana');
  const [cantidad, setCantidad] = useState(1);
  const [ingredientesQuitados, setIngredientesQuitados] = useState([]);
  const [ingredientesExtra, setIngredientesExtra] = useState([]);
  const [avisoMaxExtras, setAvisoMaxExtras] = useState(null);

  // Referencia para guardar el ID del temporizador actual
  const timerRef = useRef(null);

  // Función auxiliar para mostrar avisos sin que se solapen los tiempos
  const mostrarAviso = (mensaje, seccion) => {
    setAvisoMaxExtras({ mensaje, seccion });

    // Si ya había una cuenta atrás funcionando, la cancela
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Inicia una nueva cuenta atrás
    timerRef.current = setTimeout(() => {
      setAvisoMaxExtras(null);
    }, 3500);
  };

  // Efectos al abrir y cerrar el modal
  useEffect(() => {
    if (isOpen && product) {
      // Bloquea el scroll del fondo de la pantalla
      document.body.style.overflow = 'hidden';

      // Resetea las variables para evitar valores de la configuración anterior
      setCantidad(1);
      setIngredientesQuitados([]);
      setIngredientesExtra([]);
      setAvisoMaxExtras(null);

      // De forma predeterminada la pizza que se muestra es mediana, pero en caso de que
      // no haya, se muestra otra
      if (product.disp_piz_med) setTamañoSeleccionado('mediana');
      else if (product.disp_piz_peq) setTamañoSeleccionado('pequeña');
      else if (product.disp_piz_fam) setTamañoSeleccionado('familiar');

    } else {
      // Si el modal se cierra, devuelve el scroll a la página
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, product]);

  // Si no hay producto, devolvemos valores por defecto vacíos para evitar errores
  if (!product) return { isLoading: true };

  // --- VARIABLES BÁSICAS DEL PRODUCTO ---
  const nombre = product.producto;
  const descripcion = product.descripcion;
  const rutaImagen = product.imagen_pizza
    ? `/img/Pizzas/${product.imagen_pizza}`
    : '/img/Pizzas/pizza-not-found.jpg';

  // Crea un array con los tamaños que estén marcados como disponibles en la BBDD
  const tamañosDisponibles = [];
  if (product.disp_piz_peq) tamañosDisponibles.push({ id: 'pequeña', label: 'Pequeña', precio: product.precio_pizza_peq });
  if (product.disp_piz_med) tamañosDisponibles.push({ id: 'mediana', label: 'Mediana', precio: product.precio_pizza_med });
  if (product.disp_piz_fam) tamañosDisponibles.push({ id: 'familiar', label: 'Familiar', precio: product.precio_pizza_fam });

  // Busca el precio correspondiente al tamaño que el usuario selecciona
  const precioBase = tamañosDisponibles.find(t => t.id === tamañoSeleccionado)?.precio || 0;

  // Asegura que los ingredientes base sean un array para evitar fallos al convertilos a String
  const ingredientesBase = Array.isArray(product.ingredientes) ? product.ingredientes : [];

  // --- LÓGICA DE ALÉRGENOS DINÁMICOS ---
  const calcularAlergenos = () => {
    const base = product.alergenos || [];

    // Obtiene los ingredientes originales ignorando los que el usuario quita
    const baseActivos = ingredientesBase.filter((ing) => !ingredientesQuitados.some((q) => q._id === ing._id));

    // Extrae los alérgenos de los ingredientes que quedan y de los extras añadidos
    const alergenosBaseActivos = baseActivos.flatMap(ing => ing.alergenos || []);
    const alergenosExtra = ingredientesExtra.flatMap(ing => ing.alergenos || []);

    // Junta todos los alérgenos en un solo array
    const todos = [...base, ...alergenosBaseActivos, ...alergenosExtra];

    // Elimina los alérgenos duplicados para que solo se muestre una vez
    return Array.from(
      new Map(
        todos.filter(al => al && typeof al === 'object' && al._id).map(al => [al._id, al])
      ).values()
    );
  };

  const alergenosActuales = calcularAlergenos();

  // --- Listado de Ingredientes extras ---
  // Filtra la lista total de ingredientes de la BBDD para mostrar solo los elegibles
  const extrasParaDropdown = (ingredientes || []).filter(
    ing => {
      // Normalizamos el nombre para evitar problemas con mayúsculas/tildes
      const nombreIngrediente = ing.ingrediente.toLowerCase();

      return (
        nombreIngrediente !== 'orégano' &&
        nombreIngrediente !== 'oregano' &&
        // No mostrar ingredientes que ya se han añadido como extra
        !ingredientesExtra.some(ingExtra => ingExtra._id === ing._id) &&
        // No mostrar ingredientes que formaban parte de la base y se han quitado
        !ingredientesQuitados.some(ingQuitado => ingQuitado._id === ing._id)
      );
    }
  );

  // --- HANDLERS ---
  // Alterna el estado de un ingrediente que viene por defecto en la pizza
  const handleToggleBaseIngrediente = (ing) => {
    const yaQuitado = ingredientesQuitados.some(item => item._id === ing._id);

    if (yaQuitado) {
      // Si el usuario intenta recuperar un ingrediente base que había quitado,
      // calcula cuál será su nuevo límite de ingredientes extras
      const nuevoLimiteExtras = 3 + (ingredientesQuitados.length - 1);

      // Si tiene más ing extras añadidos que el nuevo límite, bloquea la acción
      if (ingredientesExtra.length > nuevoLimiteExtras) {
        mostrarAviso(
          `Debes quitar al menos 1 ingrediente extra para recuperar este ingrediente base.`,
          'ing-base'
        );
        return;
      }

      // Si pasa la validación, quita el ingrediente de la lista de "quitados"
      setIngredientesQuitados(prev => prev.filter(item => item._id !== ing._id));
      // Limpia el mensaje si hay éxito
      setAvisoMaxExtras(null);

    } else {
      // Cuando el usuario intenta quitar un ingrediente base
      // Se verifica que sólo pueda quitar hasta 3
      if (ingredientesQuitados.length < 3) {
        setIngredientesQuitados(prev => [...prev, ing]);
        setAvisoMaxExtras(null);

      } else {
        mostrarAviso(
          `Solo puedes quitar un máximo de 3 ingredientes base.`,
          'ing-base'
        );
      }
    }
  };

  // Añade un ingrediente extra desde el menú desplegable
  const handleAddExtraFromDropdown = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    // Busca el objeto completo del ingrediente basándose en su ID
    const extraObject = extrasParaDropdown.find(ing => ing._id === selectedId);
    if (!extraObject) return;

    // Calcula los ingredientes extras que puede añadir,
    // 3 extras por defecto + 1 extra adicional por cada ing base quitado
    const maxExtrasPermitidos = 3 + ingredientesQuitados.length;

    // Solo actualiza si realmente está por debajo del límite
    if (ingredientesExtra.length < maxExtrasPermitidos) {
      setIngredientesExtra(prev => [...prev, extraObject]);
      setAvisoMaxExtras(null);

    } 
    // Resetea visualmente el select a la opción por defecto
    e.target.value = "";
  };

  // Borra un ingrediente extra que se había añadido previamente
  const handleRemoveExtraAdded = (id) => {
    setIngredientesExtra(prev => prev.filter(item => item._id !== id));
    setAvisoMaxExtras(null);
  };

  // --- CÁLCULO DE PRECIO TOTAL ---
  const numExtras = ingredientesExtra.length;
  const numQuitados = ingredientesQuitados.length;
  const maxExtrasUI = 3 + numQuitados;

  // Sumamos el precio de todos los extras añadidos
  // Reduce el array de extras a un solo número sumando sus precios (por defecto 1.5€)
  const costeTotalExtras = ingredientesExtra.reduce((total, ing) => total + (ing.precio || 1.5), 0);

  // Precio de 1 pizza = precio de su tamaño + coste de sus extras
  const precioUnitario = precioBase + costeTotalExtras;

  // Precio final = Precio unitario * número de pizzas seleccionadas (evitando precios negativos)
  const precioTotalLinea = Math.max(0, precioUnitario) * cantidad;

  // Empaqueta toda la configuración actual en un objeto listo para ser enviado al carrito
  const generarPedidoFinal = () => ({
    productoId: product._id,
    nombre: product.producto,
    tamaño: tamañoSeleccionado,
    cantidad: cantidad,
    ingredientesQuitados,
    ingredientesExtra,
    costeExtras: costeTotalExtras, // Guardamos los gastos extra para el ticket
    precioTotalLinea,
    alergenos: alergenosActuales
  });

  return {
    isLoading: false,
    nombre, descripcion, rutaImagen,
    tamañosDisponibles, tamañoSeleccionado, setTamañoSeleccionado,
    ingredientesBase, ingredientesQuitados, handleToggleBaseIngrediente,
    extrasParaDropdown, ingredientesExtra, handleAddExtraFromDropdown, handleRemoveExtraAdded,
    numQuitados, numExtras, maxExtrasUI,
    cantidad, setCantidad,
    precioTotalLinea,
    generarPedidoFinal,
    alergenosActuales,
    avisoMaxExtras
  };
};