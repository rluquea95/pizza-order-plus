import { FormInput } from "./ui/FormInput";

export const AddressForm = ({ getFieldProps, bloquearUbicacion = false }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* FILA 1: Tipo de Vía y Nombre de la calle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        <div className="col-span-1 flex flex-col">
          <label className="block text-sm font-semibold text-primary/90 mb-2">Vía</label>
          <select
            name={getFieldProps("tipo_via").name}
            value={getFieldProps("tipo_via").value}
            onChange={getFieldProps("tipo_via").onChange}
            className="w-full px-4 py-3 bg-bg-light rounded-md focus:outline-none focus:ring-2 transition-all shadow-sm border-2 border-gray-300 focus:ring-gray-300 focus:border-gray-400"
          >
            <option value="Calle">Calle</option>
            <option value="Avenida">Avenida</option>
            <option value="Travesía">Travesía</option>
            <option value="Camino">Camino</option>
            <option value="Carretera">Carretera</option>
            <option value="Barriada">Barriada</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <FormInput
            label="Nombre de la vía"
            obligatorio={true}
            {...getFieldProps("calle")}
            placeholder="Ej: de Andalucía"
          />
        </div>
      </div>

      {/* FILA 2: Número y Piso / Puerta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormInput
          label="Número"
          obligatorio={true}
          {...getFieldProps("numero")}
          placeholder="Ej: 14, S/N"
        />
        <FormInput
          label="Piso / Puerta"
          {...getFieldProps("piso")}
          placeholder="Ej: 2ºB (Opcional)"
        />
      </div>

      {/* FILA 3: Código Postal y Ciudad (SE BLOQUEAN SI bloquearUbicacion ES TRUE) */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 transition-opacity duration-300 ${bloquearUbicacion ? 'opacity-60 pointer-events-none' : ''
          }`}
      >
        <FormInput
          label="Código Postal"
          obligatorio={!bloquearUbicacion}
          readOnly={bloquearUbicacion}
          {...getFieldProps("codigo_postal")}
          placeholder="Ej: 41580"
        />
        <FormInput
          label="Ciudad"
          obligatorio={!bloquearUbicacion}
          readOnly={bloquearUbicacion}
          {...getFieldProps("ciudad")}
          placeholder="Ej: Casariche"
        />
      </div>
    </div>
  );
};