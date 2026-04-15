import { useState } from 'react';

export const useFormValidation = (initialState) => {
  // Almacena el formulario
  const [formData, setFormData] = useState(initialState);
  // Almacena los errores
  const [errors, setErrors] = useState({});


  // FUNCIONES DE VALIDACIÓN DE LOS INPUTS OBLIGATORIOS

  const esSoloTexto = (texto) => {
    // Acepta letras mayúsculas, minúsculas, vocales con tilde, la ñ y espacios.
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    return regex.test(texto);
  };

  const esDniValido = (dni) => {
    // Comprueba formato básico (8 números y 1 letra) 
    const regex = /^\d{8}[a-zA-Z]$/;
    if (!regex.test(dni)) return false;

    const numero = dni.substring(0, 8);
    const letraUsuario = dni.charAt(8).toUpperCase();
    const letrasValidas = "TRWAGMYFPDXBNJZSQVHLCKE";

    // Calcula el resto de dividir el número entre 23 y busca la letra 
    const resto = parseInt(numero, 10) % 23;
    const letraCorrecta = letrasValidas.charAt(resto);

    return letraUsuario === letraCorrecta;
  };

  const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const esPasswordValido = (password) => {
    // Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const esFechaValida = (fechaNacimiento) => {
    if (!fechaNacimiento) return false;
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    // Ajuste si el mes actual es menor al de nacimiento o si es el mismo mes pero el día no ha llegado 
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;

    return edad >= 18 && edad <= 120;
  };

  const esTelefonoValido = (telefono) => {
    // Comprueba que empiece por 6, 7, 8 o 9, y 8 dígitos más.
    const regex = /^[6789]\d{8}$/;
    return regex.test(telefono);
  };

  const esCodigoPostalValido = (codigo_postal) => {
    // Comprueba que tenga 5 dígitos.
    const regex = /^[0-9]{5}$/;
    return regex.test(codigo_postal);
  };

  // Asigna las funciones validadoras al input correspondiente
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'nombre':
      case 'apellidos':
      case 'ciudad':
        if (value.length > 0 && !esSoloTexto(value)) errorMsg = 'Solo puede contener letras y espacios.';
        break;
      case 'dni':
        if (value.length > 0 && !esDniValido(value)) errorMsg = 'El formato o la letra del DNI no son válidos.';
        break;
      case 'email':
        if (value.length > 0 && !esEmailValido(value)) errorMsg = 'Introduce un correo electrónico válido.';
        break;
      case 'password':
        if (value.length > 0 && !esPasswordValido(value)) errorMsg = 'Mín. 8 caracteres que incluya 1 mayúscula, 1 minúscula, 1 número y 1 especial.';
        break;
      case 'fecha_nacimiento':
        if (value.length > 0 && !esFechaValida(value)) errorMsg = 'Debes tener entre 18 y 120 años para registrarte.';
        break;
      case 'telefono':
        if (value.length > 0 && !esTelefonoValido(value)) errorMsg = 'El teléfono debe tener exactamente 9 dígitos.';
        break;
      case 'codigo_postal':
        if (value.length > 0 && !esCodigoPostalValido(value))  errorMsg = 'El código postal debe tener 5 números.';
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // Se ejecuta mientras el usuario escribe en cualquier input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Evalua las validaciones en cada momento para dar feedback al usuario
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError
    }));
  };

  // Se ejecuta cuando el usuario pulsa en 'Crear cuenta'
  // Revisa todos los campos de golpe para asegurarse de que no falte nada antes de ir al Backend.
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const camposObligatorios = ['nombre', 'apellidos', 'dni', 'fecha_nacimiento', 'telefono', 'email', 'password'];

      // Comprueba que los campos obligatorios no se hayan dejado en blanco
      if (camposObligatorios.includes(key) && !formData[key]) {
        newErrors[key] = 'Este campo es obligatorio.';
        isValid = false;

      // Si están rellenos, se comprueba que cumplan con el formato establecido
      } else {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    // Pinta de rojo todos los campos que hayan fallado de golpe
    setErrors(newErrors);

    // Devuelve true si todo está perfecto, o false si la revisión ha fallado
    return isValid;
  };

  // Evalúa el formato que debe tener el input 
  const isFieldValid = (name) => {
    // Revisa que sea un string antes de hacer .trim()
    const valor = formData[name] || '';
    const hasValue = valor.trim().length > 0;

    // Si está vacío o tiene un error rojo visible, no se pone verde
    if (!hasValue || errors[name]) return false;

    // Comprueba todos los campos pasandole las funciones validadoras
    return validateField(name, valor) === '';
  };

  // Inyecta todas las propiedades en el input
  const getFieldProps = (name) => {
    return {
      name: name,
      value: formData[name],
      onChange: handleChange,
      error: errors[name],
      isValid: isFieldValid(name)
    };
  };

  // Exporta los datos necesarios para RegisterPage
  return {
    formData,
    errors,
    handleChange,
    validateAll,
    getFieldProps
  };
};