export const PedidoColumn = ({ titulo, children, colorTexto, colorFondo, icono, cantidad }) => {
  return (
    <div className="flex flex-col bg-white backdrop-blur-md rounded-4xl p-6 md:p-8 shadow-sm border border-white min-h-125">
      
      {/* CABECERA DE LA COLUMNA*/}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icono}</span>
          <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${colorTexto}`}>{titulo}</h2>
        </div>

        {/* PILDORA QUE MUESTRA LA CANTIDAD DE PEDIDOS DE ESA COLUMNA */}
        <span className={`px-4 py-1 rounded-full text-sm font-black ${colorFondo} ${colorTexto}`}>
          {cantidad}
        </span>
      </div>

      {/* AREA DONDE APARECERAN LOS PEDIDOS */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col gap-6">
          
          {/* Recibe las tarjetas PedidoCard */}
          {children}

          {children.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12 opacity-40">
              <span className="text-4xl mb-2">💤</span>
              <p className="text-primary font-bold uppercase tracking-widest text-sm">Sin pedidos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};