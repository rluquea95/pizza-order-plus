// Componente interno y auxiliar para renderizar la etiqueta del input.
// Muestra automáticamente un asterisco rojo si es obligatorio,
// o el texto "(Opcional)" si no lo es.
const Label = ({ texto, obligatorio }) => (
  <label className="block text-sm font-semibold text-primary/90 mb-2">
    {texto}
    {obligatorio ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-400 font-normal text-xs ml-1">(Opcional)</span>}
  </label>
);

// Este es el componente que se importará y creará el label e input personalizado
export const FormInput = ({
  label,
  obligatorio = false,
  type = "text",
  name,
  placeholder,
  maxLength,
  uppercase,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  isValid
}) => {

  // Estado Base: Borde gris neutro
  let borderStyle = "border-2 border-gray-300 focus:ring-gray-300 focus:border-gray-400";

  // Color rojo para indicar que el campo no cumple con los requisitos mínimos
  if (error) {
    borderStyle = "border-2 border-red-500 focus:ring-red-200 focus:border-red-600";

  // Color verde para indicar que el campo cumple los requisitos 
  } else if (isValid) {
    borderStyle = "border-2 border-green-500 focus:ring-green-200 focus:border-green-600";
  }

  return (
    <div className="flex flex-col">
      {/* Si recibe un label, lo pinta. Si no, solo pinta el input */}
      {label && <Label texto={label} obligatorio={obligatorio} />}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 bg-bg-light rounded-md focus:outline-none focus:ring-2 transition-all shadow-sm ${uppercase ? 'uppercase' : ''} ${borderStyle}`}
      />

      {/* Espacio reservado para el error para evitar saltos en la pantalla */}
      <div className="min-h-5 mt-1">
        {error && <span className="text-red-500 text-xs font-medium">{error}</span>}
      </div>
    </div>
  );
};