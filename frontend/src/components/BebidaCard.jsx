import { useState } from 'react';
import { Button } from './ui/Button';

export const BebidaCard = ({ product, selectedSize, onAñadirBebida }) => {
  const nombre = product.producto;
  // En caso de que no haya descripción en la BBDD
  const descripcionFinal = product.descripcion || "Bebida refrescante para acompañar tu pizza.";
  const precio = product[`precio_beb_${selectedSize}`] || 0;

  // Si la BBDD no tiene foto, usamos el placeholder
  const imgName = product[`imagen_beb_${selectedSize}`] || product.imagen_beb_330ml;
  const rutaImagen = imgName
    ? `/img/Bebidas/${imgName}`
    : '/img/Bebidas/bebida-not-found.jpg';

  // Almacena el estado de "Ver más" en la tarjeta
  const [mostrarMas, setMostrarMas] = useState(false);

  // Límite de caracteres para mostrar la opción "Ver más"
  const LIMITE_LETRAS = 40;

  const getTituloBebida = () => {
    // Lo convertimos a minúsculas para garantizar la búsqueda
    const nomLower = nombre.toLowerCase();

    // Evitamos duplicar "Lata" o "Botella" si el nombre original ya lo incluye
    const prefixLata = nomLower.includes('lata') ? '' : 'Lata ';
    const prefixBotella = nomLower.includes('botella') ? '' : 'Botella ';

    // 330ml
    if (selectedSize === '330ml') {
      return `${prefixLata}${nombre} 330ml`;
    }

    // 500ml 
    if (selectedSize === '500ml') {
      return `${prefixBotella}${nombre} 500ml`;
    }

    // 1L - 1.5L
    if (selectedSize === '1000ml') {
      const volumen = nomLower.includes('agua') ? '1.5L' : '1L';
      return `${prefixBotella}${nombre} ${volumen}`;
    }

    return nombre;
  };

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 flex flex-col h-full hover:shadow-md transition-shadow">

      {/* 1. IMAGEN */}
      <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden mb-4 bg-gray-200 relative flex items-center justify-center">
        <img
          src={rutaImagen}
          alt={`Imagen de ${nombre}`}
          className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/img/Bebidas/bebida-not-found.jpg';
          }}
        />
      </div>

      {/* 2. TÍTULO Y PRECIO */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-bold text-lg text-primary leading-tight">
          {getTituloBebida()}
        </h3>
        <span className="font-bold text-lg text-action whitespace-nowrap">
          {Number(precio).toFixed(2)}€
        </span>
      </div>

      {/* 3. DESCRIPCIÓN Y "VER MÁS" */}
      <div className="grow flex flex-col items-start mb-4">
        <p className={`text-sm text-primary/80 transition-all ${mostrarMas ? '' : 'line-clamp-1'}`}>
          {descripcionFinal}
        </p>

        {/* Aquí miramos la longitud de la descripción real o del texto por defecto */}
        {descripcionFinal.length > LIMITE_LETRAS && (
          <button
            onClick={() => setMostrarMas(!mostrarMas)}
            className="text-xs font-semibold text-primary mt-1 hover:text-action transition-colors focus:outline-none"
          >
            {mostrarMas ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* 4. BOTÓN */}
      <Button
        variant="secondary"
        className="w-full py-2.5 rounded-full"
        onClick={() => onAñadirBebida(product, selectedSize)}
      >
        Pedir
      </Button>

    </article>
  );
};