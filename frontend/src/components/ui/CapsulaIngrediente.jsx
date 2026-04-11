export const CapsulaIngrediente = ({ 
  nombre, 
  variant = 'default', 
  interactivo = false,
  isToggled = false,
  size = 'sm',
  onClick
}) => {
  
  // Tamaños dinámicos
  const sizeStyles = size === 'md' 
    ? "px-5 py-2.5 text-base"  // Tamaño original del Modal
    : "px-4 py-1.5 text-sm";   // Tamaño más compacto para la Carta

  // Estilos base
  const baseStyles = `inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 shadow-sm ${sizeStyles}`;
  
  // Estilos de interacción
  const interactiveStyles = interactivo 
    ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-action/50 focus:border-action/50" 
    : "cursor-default";

  // Colores 
  const variants = {
    default: `bg-[#FFECC8] text-[#8C5E03] border border-transparent ${interactivo ? 'hover:bg-[#FCD38B]' : ''}`,
    disabled: "bg-white/60 text-gray-400 line-through border border-gray-200",
  };

  const currentStyle = variants[variant] || variants.default;
  const combinedClasses = `${baseStyles} ${interactiveStyles} ${currentStyle}`;

  // Si es interactivo se renderiza un botón
  if (interactivo) {
    return (
      <button 
        type="button"
        onClick={onClick}
        aria-pressed={isToggled}
        className={combinedClasses}
      >
        {nombre}
      </button>
    );
  }

  // Si no, se renderiza un <span>
  return (
    <span className={combinedClasses}>
      {nombre}
    </span>
  );
};