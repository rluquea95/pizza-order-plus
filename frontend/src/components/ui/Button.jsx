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
  // Estilos base
  // focus-visible el anillo sobr el botón solo sale cuando se tabula con el teclado
  // focus-visible:ring-primary para que el halo del tabulador sea azul.
  const baseStyles = "font-semibold flex justify-center items-center text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-md";
  
  // Diccionario de variantes de botones
  const variants = {
    // Botón naranja
    primary: "bg-action text-white border-2 border-transparent rounded-md hover:bg-focus hover:text-primary hover:border-primary hover:scale-105",
    // Botón azul
    secondary: "bg-primary text-white border-2 border-primary rounded-md hover:bg-transparent hover:text-primary",
  };

  // Une las clases: Base + Variante + Clases extra específicas (padding, width...)
  const finalClasses = `${baseStyles} ${variants[variant]} ${className}`;

  // Si le pasamos una ruta (to), devuelve un Link
  if (to) {
    return (
      <Link to={to} className={finalClasses} {...props}>
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