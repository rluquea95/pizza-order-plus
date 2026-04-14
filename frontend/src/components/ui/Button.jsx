import { Link } from 'react-router'; 

export const Button = ({ 
  children, 
  to, 
  variant = 'primary', 
  className = '', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  // Estilos base (Estructura, sombras, animaciones y comportamientos compartidos)
  // focus-visible el anillo sobre el botón solo sale cuando se tabula con el teclado
  // focus-visible:ring-primary para que el halo del tabulador sea azul.
  const baseStyles = "font-semibold flex justify-center items-center text-center rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-md hover:scale-105 active:scale-95 active:shadow-sm";
  
  // Diccionario de variantes de botones
  const variants = {
    // Botón naranja
    primary: "bg-action text-primary border-2 border-transparent hover:bg-focus hover:text-primary hover:border-primary",
    // Botón azul
    secondary: "bg-primary text-white border-2 border-primary rounded-md hover:bg-transparent hover:text-primary",
  };

  // Une las clases: Base + Variante + Clases extra específicas (padding, width...)
  const finalClasses = `${baseStyles} ${variants[variant]} ${className}`;

  // Si le pasamos una ruta (to), devuelve un Link
  if (to) {
    return (
      <Link to={to} className={finalClasses} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  // Si no hay ruta, devuelve un botón normal (ideal para formularios o clics simples)
  return (
    <button type={type} onClick={onClick} className={finalClasses} {...props}>
      {children}
    </button>
  );
};