import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { AlertMessage } from '../components/ui/AlertMessage';
import { FormInput } from '../components/ui/FormInput';
import { useLoginValidation } from '../hooks/useLoginValidation';
import { useAutoAlert } from '../hooks/useAutoAlert';

export const LoginPage = () => {
  // Permite redirigir a 'Inicio' directamente desde código
  const navigate = useNavigate();

  // Obtiene si el usuario viene de la página de Registro
  const location = useLocation();

  // Extrae la función 'login' del Contexto Global de Autenticación
  const { login } = useAuth();

  // Estado para controlar la visibilidad de la contraseña
  const [verPassword, setVerPassword] = useState(false);

  // Inicializa el validador del formulario con los campos vacíos
  const { formData, validateAll, getFieldProps, setCredencialesIncorrectas } = useLoginValidation({
    email: '',
    password: ''
  });

  // Gestión de errores y estados de carga
  const { aviso: globalError, mostrarAviso: setGlobalError, ocultarAviso } = useAutoAlert(5000);
  const [isLoading, setIsLoading] = useState(false);

  // Recupera el mensaje de éxito si viene desde el registro
  const mensajeExito = location.state?.mensaje;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    // Validación local antes de llamar a la API
    if (!validateAll()) {
      setGlobalError('Por favor, introduce un email y contraseña válidos.');
      return;
    }

    setIsLoading(true);

    // Intenta el login a través del contexto
    const resultado = await login(formData);

    if (resultado.success) {
      // Redirige a la página principal si inicia sesión
      navigate('/');
    } else {
      // Muestra el error devuelto por el servidor (ej: credenciales incorrectas)
      setGlobalError(resultado.mensaje);
      // Función que pondrá rojos los inputs
      setCredencialesIncorrectas();
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full grow flex items-center justify-center py-12 px-4 bg-transparent">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-12 border border-gray-100 my-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Iniciar Sesión</h1>
          <p className="text-gray-500 text-lg">¡Hola de nuevo! Entra para pedir tu pizza favorita.</p>
        </div>

        {/* Notificación de registro exitoso (si existe) */}
        {mensajeExito && !globalError && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center font-medium animate-pulse">
            {mensajeExito}
          </div>
        )}

        {/* Mensajes de error globales */}
        {globalError && <div className="mb-8"><AlertMessage message={globalError} /></div>}

        <form
          onSubmit={handleSubmit}
          onFocus={ocultarAviso}
          onChange={ocultarAviso}
          noValidate
          className="flex flex-col gap-6"
        >
          <FormInput
            label="Correo Electrónico"
            type="email"
            obligatorio={true}
            {...getFieldProps("email")}
            placeholder="tu@email.com"
          />

          <div className="flex flex-col gap-1">
            <FormInput
              label="Contraseña"
              type={verPassword ? 'text' : 'password'}
              obligatorio={true}
              {...getFieldProps("password")}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between mt-1">
              {/* 3. Checkbox para alternar la visibilidad */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="togglePass"
                  checked={verPassword}
                  onChange={() => setVerPassword(!verPassword)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
                <label 
                  htmlFor="togglePass" 
                  className="text-xs text-gray-500 cursor-pointer select-none hover:text-primary transition-colors"
                >
                  Mostrar contraseña
                </label>
              </div>

              <Link to="#" className="text-xs text-gray-400 hover:text-primary transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 mt-4 text-xl shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
            </Button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-base text-gray-600">
            ¿Aún no tienes cuenta? <br />
            <Link to="/registro" className="text-action font-bold hover:underline transition-all">
              Regístrate gratis aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};