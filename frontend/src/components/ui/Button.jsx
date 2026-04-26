import { Link } from 'react-router';

export const Button = ({
  children,
  to,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  animated = true,
  disabled = false,
  ...props
}) => {
  // Estilos base (Estructura, sombras y comportamientos compartidos)
  // focus-visible el anillo sobre el botón solo sale cuando se tabula con el teclado
  // focus-visible:ring-primary para que el halo del tabulador sea azul.
  const baseStyles = "font-semibold flex justify-center items-center text-center rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-md";

  // La animación se aplica SOLO si está animado Y NO está deshabilitado
  const animacionStyles = (animated && !disabled)
    ? "hover:scale-105 active:scale-95 active:shadow-sm"
    : "";

  // Clases para el estado deshabilitado
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  // Diccionario de variantes de botones
  const variants = {
    primary: `bg-action text-primary border-2 border-transparent ${!disabled ? 'hover:bg-focus hover:text-primary hover:border-primary' : ''
      }`,
    secondary: `bg-primary text-white border-2 border-primary rounded-md ${!disabled ? 'hover:bg-white hover:text-primary' : ''
      }`,
  };

  // Une las clases: Base + Animación + Variante + Clases extra específicas (padding, width...)
  const finalClasses = `${baseStyles} ${animacionStyles} ${disabledStyles} ${variants[variant]} ${className}`;

  // Si le pasamos una ruta (to), devuelve un Link
  if (to) {
    return (
      <Link
        // Previene la navegación si está disabled
        to={disabled ? '#' : to}
        className={finalClasses}
        onClick={(e) => {
          // Elimina el evento que se desencadenaría
          if (disabled) e.preventDefault(); 
          else if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </Link>
    );
  }
  // Si no hay ruta, devuelve un botón normal (ideal para formularios o clics simples)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClasses}
      {...props}>

      {children}
    </button>
  );
};