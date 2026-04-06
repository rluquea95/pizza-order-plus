export const Filtro = ({ 
  activeTab, 
  selectedSize, 
  setSelectedSize, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div className="flex justify-center items-center mb-10 gap-6 flex-wrap">
      
      {/* Selector de Tamaño en Bebidas */}
      {activeTab === 'bebidas' && (
        <div className="flex items-center gap-3">
          <label htmlFor="tamaño" className="text-gray-500 text-sm font-semibold font-poppins">
            Categoría:
          </label>
          <select 
            id="tamaño" 
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="py-2 px-4 rounded-md border border-gray-200 bg-white text-primary focus:outline-none focus:border-action cursor-pointer font-medium font-poppins min-w-37.5 shadow-sm"
          >
            <option value="todos">Todos los tamaños</option>
            <option value="330ml">Latas (330ml)</option>
            <option value="500ml">Botellas (500ml)</option>
            <option value="1000ml">Botellas (1L - 1.5L)</option>
          </select>
        </div>
      )}

      {/* Separador visual (solo visible en pantallas medianas o si hay dos selectores) */}
      {activeTab === 'bebidas' && (
        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
      )}

      {/* Selector de Ordenación para Pizzas y Bebidas*/}
      <div className="flex items-center gap-3">
        <label htmlFor="ordenar" className="text-gray-500 text-sm font-semibold font-poppins">
          Ordenar por:
        </label>
        <select 
          id="ordenar" 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="py-2 px-4 rounded-md border border-gray-200 bg-white text-primary focus:outline-none focus:border-action cursor-pointer font-medium font-poppins min-w-45 shadow-sm"
        >
          <option value="nombre">Nombre (A-Z)</option>
          <option value="precio-asc">Precio (Menor a Mayor)</option>
          <option value="precio-desc">Precio (Mayor a Menor)</option>
        </select>
      </div>
      
    </div>
  );
};