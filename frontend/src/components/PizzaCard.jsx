import { useState } from 'react';
import { Button } from './ui/Button';

export const PizzaCard = ({ product, onOpenConfigurator }) => {
  const nombre = product.producto;
  // En caso de que no haya descripción en la BBDD
  const descripcionFinal = product.descripcion || "Nuestra deliciosa pizza artesanal recién horneada.";
  const imagen = product.imagen_pizza;

  // Almacena el precio de las pizzas medianas. Si por fallo de BBDD no existe, almacena 0.
  const precio = product.precio_pizza_med || 0;

  // En caso de que no se encuentre la imagen, se asigna un placeholder
  const rutaImagen = imagen ? `/img/Pizzas/${imagen}` : '/img/Pizzas/pizza-not-found.jpg';

  // Almacena el estado de "Ver más" en la tarjeta
  const [mostrarMas, setMostrarMas] = useState(false);

  // Límite de caracteres para mostrar la opción "Ver más"
  const LIMITE_LETRAS = 60;

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 flex flex-col h-full hover:shadow-md transition-shadow">

      {/* 1. IMAGEN */}
      <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden mb-4 bg-gray-200 relative flex items-center justify-center">
        <img
          src={rutaImagen}
          alt={`Imagen de ${nombre}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/img/Pizzas/pizza-not-found.jpg';
          }}
        />
      </div>

      {/* 2. TÍTULO Y PRECIO */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-bold text-lg text-primary leading-tight">
          {nombre}
        </h3>
        <span className="font-bold text-lg text-action whitespace-nowrap">
          {Number(precio).toFixed(2)}€
        </span>
      </div>

      {/* 3. DESCRIPCIÓN Y "VER MÁS" */}
      <div className="grow flex flex-col items-start mb-4">
        {/* Si supera los 60 caracteres, se corta la descripción */}
        <p className={`text-sm text-primary/80 transition-all ${mostrarMas ? '' : 'line-clamp-1'}`}>
          {descripcionFinal}
        </p>

        {/* Muestra el botón si la descripción supera los 60 caracteres */}
        {descripcionFinal.length > LIMITE_LETRAS && (
          <button
            onClick={() => setMostrarMas(!mostrarMas)}
            className="text-xs font-semibold text-primary mt-1 hover:text-action transition-colors focus:outline-none"
          >
            {mostrarMas ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* 4. BOTÓN "CONFIGURAR PIZZA" */}
      <Button
        variant="secondary"
        className="w-full py-2.5 rounded-full"
        onClick={() => onOpenConfigurator(product)}
      >
        Configurar Pizza
      </Button>

    </article>
  );
};