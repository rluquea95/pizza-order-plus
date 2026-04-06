import { useState } from 'react';
import { Button } from './ui/Button';

export const BebidaCard = ({ product, selectedSize }) => {
  const nombre = product.producto;
  const descripcion = product.descripcion;
  const precio = product[`precio_beb_${selectedSize}`] || 0;

  // Si la BD no tiene foto, usamos tu imagen por defecto
  const imgName = product[`imagen_beb_${selectedSize}`] || product.imagen_beb_330ml;
  const rutaImagen = imgName
    ? `/img/Bebidas/${imgName}`
    : '/img/Bebidas/bebida-not-found.jpg';

  // Almacena el estado de "Ver más" en la tarjeta
  const [mostrarMas, setMostrarMas] = useState(false);

  // Límite de caracteres para mostrar la opción "Ver más"
  const LIMITE_LETRAS = 40;

  const getTituloBebida = () => {
    const nombreLower = nombre.toLowerCase();

    // 330ml
    if (selectedSize === '330ml') {
      if (nombreLower.includes('lata')) return `${nombre} 330ml`;
      return `Lata ${nombre} 330ml`;
    }

    // 500ml (Añadimos la protección de la palabra "botella")
    if (selectedSize === '500ml') {
      if (nombreLower.includes('botella')) return `${nombre} 500ml`;
      return `Botella ${nombre} 500ml`;
    }

    // 1000ml (Añadimos la protección de la palabra "botella")
    if (selectedSize === '1000ml') {
      let tituloBase = nombreLower.includes('botella') ? nombre : `Botella ${nombre}`;
      if (nombreLower.includes('agua')) return `${tituloBase} 1.5L`;
      return `${tituloBase} 1L`;
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
            // Si la imagen de la BD falla al cargar, usamos tu nueva imagen local
            e.currentTarget.src = '/img/Bebidas/bebida-not-found.jpg';
          }}
        />
      </div>

      {/* 2. TÍTULO Y PRECIO */}
      <div className="flex justify-between items-start mb-2 gap-2 font-poppins">
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
          {descripcion || "Bebida refrescante para acompañar tu pizza."}
        </p>

        {/* Aquí miramos la longitud de la descripción real o del texto por defecto */}
        {descripcion && descripcion.length > LIMITE_LETRAS && (
          <button
            onClick={() => setMostrarMas(!mostrarMas)}
            className="text-xs font-semibold text-primary mt-1 hover:text-action transition-colors focus:outline-none"
          >
            {mostrarMas ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* 4. BOTÓN */}
      <Button variant="secondary" className="w-full py-2.5 rounded-full">
        Pedir
      </Button>

    </article>
  );
};