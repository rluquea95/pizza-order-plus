import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { AlertMessage } from '../components/ui/AlertMessage';
import { FormInput } from '../components/ui/FormInput';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAutoAlert } from '../hooks/useAutoAlert';
import { AddressForm } from '../components/ui/AddressForm';

export const RegisterPage = () => {
  // Permite redirigir a 'Login' directamente desde código
  const navigate = useNavigate();

  // Extrae la función 'register' del Contexto Global de Autenticación
  const { register } = useAuth();

  // Controla el estado del check de ver contraseña
  const [verPassword, setVerPassword] = useState(false);

  // Inicializa el validador del formulario con los campos vacíos
  const { formData, validateAll, getFieldProps } = useFormValidation({
    nombre: '', apellidos: '', dni: '', fecha_nacimiento: '', telefono: '',
    email: '', password: '', confirm_password: '', tipo_via: 'Calle', calle: '',
    numero: '', piso: '', codigo_postal: '', ciudad: ''
  });

  // Hook para manejar el cartel de error superior. Se auto-ocultará a los 5 segundos.
  const { aviso: globalError, mostrarAviso: setGlobalError, ocultarAviso } = useAutoAlert(5000);

  // Estado para bloquear el botón mientras esperamos la respuesta del backend
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {

    // Evita que el navegador recargue la página
    e.preventDefault();
    setGlobalError('');

    // Función que realiza la revisión final del formulario. Si hay algún error, bloquea el envío y sube arriba.
    if (!validateAll()) {
      setGlobalError('Por favor, corrige los errores marcados en rojo antes de continuar.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    // Comprueba si el usuario ha escrito algo en la zona de dirección (que es opcional)
    const tieneDireccion = formData.calle || formData.numero || formData.codigo_postal;

    // Formatea los datos exactamente como los espera el modelo Mongoose en el Backend.
    const datosParaBackend = {
      nombre: formData.nombre, apellidos: formData.apellidos, dni: formData.dni,
      fecha_nacimiento: formData.fecha_nacimiento, telefono: formData.telefono,
      email: formData.email, password: formData.password,
      direccion: tieneDireccion ? [{
        tipo_via: formData.tipo_via, calle: formData.calle, numero: formData.numero,
        piso: formData.piso, codigo_postal: formData.codigo_postal, ciudad: formData.ciudad
      }] : []
    };

    // Envía los datos al backend
    const resultado = await register(datosParaBackend);

    if (resultado.success) {
      navigate('/login', { state: { mensaje: '¡Registro exitoso! Por favor, inicia sesión.' } });
    } else {
      setGlobalError(resultado.mensaje);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full grow flex items-center justify-center py-12 px-4 bg-transparent">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 md:p-12 border border-gray-100 my-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Crear Cuenta</h1>
          <p className="text-gray-500 text-lg">Completa tus datos para agilizar tus futuros pedidos</p>
        </div>

        {globalError && <div className="mb-8"><AlertMessage message={globalError} /></div>}

        {/* Con onChange y onFocus en el <form>, cualquier interacción algún input disparará 'ocultarAviso',
            limpiando el error global en cuanto el usuario intenta corregir algo.*/}
        <form
          onSubmit={handleSubmit}
          onFocus={ocultarAviso}
          onChange={ocultarAviso}
          noValidate
          className="flex flex-col gap-12"
        >

          <section>
            <h2 className="text-xl font-bold text-primary border-b-2 border-gray-100 pb-3 mb-6">1. Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <FormInput label="Nombre" obligatorio={true} {...getFieldProps("nombre")} />
              <FormInput label="Apellidos" obligatorio={true} {...getFieldProps("apellidos")} />
              <FormInput label="DNI / NIE" obligatorio={true} {...getFieldProps("dni")} placeholder="12345678A" maxLength="9" uppercase={true} />
              <FormInput type="date" label="Fecha de Nacimiento" obligatorio={true} {...getFieldProps("fecha_nacimiento")} />
              <div className="md:col-span-2">
                <FormInput type="tel" label="Teléfono" obligatorio={true} {...getFieldProps("telefono")} placeholder="Ej: 600123456" maxLength="9" />
              </div>
            </div>
          </section>

          {/* SECCIÓN DE DIRECCIÓN */}
          <section>
            <div className="border-b-2 border-gray-100 pb-3 mb-6 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <h2 className="text-xl font-bold text-primary">2. Dirección de Envío</h2>
              <span className="text-sm text-gray-500 mt-1 sm:mt-0">(Sólo es necesario en caso de envío a domicilio)</span>
            </div>

            {/* FORMULARIO DE DIRECCIÓN */}
            <AddressForm getFieldProps={getFieldProps} />

          </section>

          <section>
            <h2 className="text-xl font-bold text-primary border-b-2 border-gray-100 pb-3 mb-6">3. Datos de Acceso</h2>
            <div className="flex flex-col gap-2">
              <FormInput type="email" label="Email" obligatorio={true} {...getFieldProps("email")} placeholder="usuario@email.com" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <FormInput
                  type={verPassword ? 'text' : 'password'}
                  label="Contraseña"
                  obligatorio={true}
                  {...getFieldProps("password")}
                  placeholder="Mín. 8 caracteres..."
                />
                <FormInput
                  type={verPassword ? 'text' : 'password'}
                  label="Repetir Contraseña"
                  obligatorio={true}
                  {...getFieldProps("confirm_password")}
                  placeholder="Repite la contraseña"
                />
              </div>

              {/* Checkbox para alternar la visibilidad de ambas contraseñas */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="toggleRegPass"
                  checked={verPassword}
                  onChange={() => setVerPassword(!verPassword)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
                <label
                  htmlFor="toggleRegPass"
                  className="text-sm text-gray-600 cursor-pointer select-none hover:text-primary transition-colors"
                >
                  Mostrar contraseñas
                </label>
              </div>
            </div>
          </section>

          <Button type="submit" variant="primary" className="w-full py-4 mt-2 text-xl shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
            {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </Button>

        </form>

        <p className="mt-10 text-center text-base text-gray-600">
          ¿Ya tienes cuenta? <Link to="/login" className="text-action font-bold hover:underline transition-all">Inicia sesión aquí</Link>
        </p>
      </div>
    </main>
  );
};