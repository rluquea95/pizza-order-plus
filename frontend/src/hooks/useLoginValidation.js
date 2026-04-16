import { useState } from 'react';

export const useLoginValidation = (initialState) => {
  // Almacena el formulario
  const [formData, setFormData] = useState(initialState);
  // Almacena los errores
  const [errors, setErrors] = useState({});

  // Función de validación de email
  const esEmailValido = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Comprueba que el usuario introduzca un email con formato correcto
  const validateField = (name, value) => {
    let errorMsg = '';
    const val = value ? value.toString().trim() : '';

    if (name === 'email') {
      if (val.length > 0 && !esEmailValido(value)) {
        errorMsg = 'Introduce un correo electrónico válido.';
      }
    }
    return errorMsg;
  };

  // Se ejecuta mientras el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Evalúa las validaciones en cada momento para dar feedback al usuario
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError
    }));
  };

  // Limpia el formato de error de un campo cuando el usuario hace clic en él
  const handleFocus = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '' // Se vacía para que el borde vuelva a ser gris
      }));
    }
  };

  // Función para forzar los bordes rojos si el backend rechaza el login
  const setCredencialesIncorrectas = () => {
    setErrors({
      // Usamos un espacio en blanco (' '). 
      // Al no estar vacío, FormInput lo detecta como error y se pone rojo, 
      // pero al ser solo un espacio, no muestra texto duplicado debajo del input.
      email: ' ',    
      password: ' '
    });
  };

  // Revisa todos los campos de golpe antes de enviar al Backend
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const camposObligatorios = ['email', 'password'];

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

    setErrors(newErrors);
    return isValid;
  };

  // Inyecta todas las propiedades en el input
  const getFieldProps = (name) => {
    return {
      name: name,
      value: formData[name],
      onChange: handleChange,
      onFocus: handleFocus,
      error: errors[name]
    };
  };

  // Exporta los datos necesarios para LoginPage
  return {
    formData,
    errors,
    handleChange,
    validateAll,
    getFieldProps,
    setCredencialesIncorrectas
  };
};