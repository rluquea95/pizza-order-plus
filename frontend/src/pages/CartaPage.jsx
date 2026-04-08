import { useState } from 'react';
import { BarraBusqueda } from '../components/BarraBusqueda';
import { Filtro } from '../components/Filtro';
import { BannerInformacion } from '../components/ui/BannerInformacion';
import { ProductCard } from '../components/ProductCard';
import { ProductConfigurator } from '../components/ProductConfigurator';
import { useCarta } from '../hooks/useCarta'; // Lógica de CartaPage

export const CartaPage = () => {
  // Desestructura todo lo que devuelve el hook (useCarta.js)
  const {
    activeTab,
    handleTabChange,
    selectedSize, setSelectedSize,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    cargando,
    error,
    pizzasOrdenadas,
    bebidasOrdenadas,
    ingredientes
  } = useCarta();

  // Almacena si el modal está abierto y lo inicia
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Función que controla el modal para configurar pizzas
  const handleOpenConfigurator = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  // Función que añade bebida
  const handleAñadirBebida = (producto, tamaño) => {
    const precio = producto[`precio_beb_${tamaño}`];
    console.log("Añadir bebida al carrito al instante:", {
      productoId: producto._id,
      nombre: producto.producto,
      tamaño: tamaño,
      cantidad: 1, // Por defecto añade 1 ud.
      precioTotal: precio
    });
  };

  return (
    <main className="w-full grow bg-bg-main py-8">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Barra de búsqueda que filtrará el resultado si coincide con el título o los ingredientes del producto */}
        <BarraBusqueda
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={activeTab === 'pizzas' ? "Buscar por nombre o ingredientes..." : "Buscar bebidas..."}
        />

        {/* BOTONES TAB PIZZAS/BEBIDAS */}
        <div className="flex justify-center mb-8 max-w-4xl mx-auto">
          <div className="w-full flex rounded-full bg-white shadow-sm overflow-hidden border border-gray-100">
            <button
              onClick={() => handleTabChange('pizzas')}
              className={`flex-1 py-3 text-lg font-bold transition-colors ${activeTab === 'pizzas' ? 'bg-primary text-white' : 'bg-transparent text-primary hover:bg-gray-50'
                }`}
            > PIZZAS </button>
            <button
              onClick={() => handleTabChange('bebidas')}
              className={`flex-1 py-3 text-lg font-bold transition-colors ${activeTab === 'bebidas' ? 'bg-primary text-white' : 'bg-transparent text-primary hover:bg-gray-50'
                }`}
            > BEBIDAS </button>
          </div>
        </div>

        {/* Filtro que devuelve la información filtrada/ordenada según la opción marcada */}
        <Filtro
          activeTab={activeTab}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Mensajes de carga/error de la Carta */}
        {cargando && <div className="text-center py-10 font-bold italic text-primary">Cargando la carta... 🍕</div>}
        {error && <div className="text-center text-red-500 py-10 font-bold">Error: {error}</div>}

        {/* PESTAÑA PIZZAS */}
        {!cargando && !error && activeTab === 'pizzas' && (
          <>
            {/* Banner descriptivo */}
            <BannerInformacion>
              El precio mostrado por defecto corresponde a las pizzas medianas. Pulsa en
              <strong> "Configurar Pizza" </strong> para elegir tu tamaño favorito y ver el precio final.
            </BannerInformacion>

            {/* Grid de pizzas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pizzasOrdenadas.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  activeTab="pizzas"
                  onOpenConfigurator={handleOpenConfigurator}
                />
              ))}
              {pizzasOrdenadas.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10 font-semibold text-lg">
                  No hemos encontrado pizzas que coincidan con esa búsqueda.
                </div>
              )}
            </div>
          </>
        )}

        {/* PESTAÑA BEBIDAS */}
        {!cargando && !error && activeTab === 'bebidas' && (
          <>
            {/* Grid de bebidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bebidasOrdenadas.map(item => (
                <ProductCard
                  key={item.idKey}
                  product={item.product}
                  activeTab="bebidas"
                  selectedSize={item.size}
                  onAñadirBebida={handleAñadirBebida}
                />
              ))}
              {bebidasOrdenadas.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10 font-semibold text-lg">
                  No hay bebidas que coincidan.
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* COMPONENTE DEL MODAL */}
      <ProductConfigurator
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        ingredientes={ingredientes}
      />
    </main>
  );
};