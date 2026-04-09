import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { BarraBusqueda } from '../components/BarraBusqueda';
import { Filtro } from '../components/Filtro';
import { BannerInformacion } from '../components/ui/BannerInformacion';
import { ProductCard } from '../components/ProductCard';
import { PizzaConfigurator } from '../components/PizzaConfigurator';
import { useIniciarPedido } from '../hooks/useIniciarPedido'; // Lógica de IniciarPedidoPage

export const IniciarPedidoPage = () => {
  // Desestructura todo lo que devuelve el hook (useIniciarPedido.js)
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
  } = useIniciarPedido();

  // Almacena si el modal está abierto y lo inicia
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Almacena el carrito (estado global)
  const { agregarAlCarrito } = useCart();

  // Función que controla el modal para configurar pizzas
  const handleOpenConfigurator = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  // Función que añade bebida
  const handleAñadirBebida = (producto, tamaño) => {

    // Calcula el precio según el tamaño
    const precio = producto[`precio_beb_${tamaño}`];

    // Crea el objeto del pedido de la bebida
    const bebidaPedido = {
      // Genera un ID único por si el usuario añade la misma bebida varias veces
      idLinea: `bebida-${producto._id}-${tamaño}`, 
      productoId: producto._id,
      tipo: 'bebida',
      nombre: producto.producto,
      tamaño: tamaño,
      cantidad: 1, // Por defecto añade 1 ud.
      precioTotalLinea: precio
    };

    // Lo metemos al estado global del carrito
    agregarAlCarrito(bebidaPedido);
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
      <PizzaConfigurator
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        ingredientes={ingredientes}
      />
    </main>
  );
};