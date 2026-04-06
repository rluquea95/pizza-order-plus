import { BarraBusqueda } from '../components/BarraBusqueda';
import { Filtro } from '../components/Filtro';
import { ProductCard } from '../components/ProductCard';
import { useCarta } from '../hooks/useCarta'; // Lógica de CartaPage

export const CartaPage = () => {
	// Desestructura todo lo que devuelve el hook (userCarta.js)
	const {
		activeTab,
		handleTabChange,
		selectedSize, setSelectedSize,
		searchTerm, setSearchTerm,
		sortBy, setSortBy,
		cargando,
		error,
		productosOrdenados
	} = useCarta();

	// Las bebidas se almacenan en la BBDD de forma agrupada, por lo que para pintar bebidas de 
	// distintos tamaños hay que crear un array que almacene cada una de las posibles bebidas y se
	// renderice como una tarjeta independiente.
	const renderBebidas = () => {
		let bebidasARenderizar = [];

		productosOrdenados.forEach(prod => {
			if (selectedSize !== 'todos') {
				// Si hay un filtro activo, solo prepara la tarjeta de ese tamaño específico
				bebidasARenderizar.push({ product: prod, size: selectedSize, idKey: `${prod._id}-${selectedSize}` });
			} else {
				// Si el filtro es "todos", crea una tarjeta independiente por cada formato que tenga precio
				if (prod.precio_beb_330ml) bebidasARenderizar.push({ product: prod, size: '330ml', idKey: `${prod._id}-330` });
				if (prod.precio_beb_500ml) bebidasARenderizar.push({ product: prod, size: '500ml', idKey: `${prod._id}-500` });
				if (prod.precio_beb_1000ml) bebidasARenderizar.push({ product: prod, size: '1000ml', idKey: `${prod._id}-1000` });
			}
		});

		// Feedback visual en caso de que la búsqueda o el filtro no devuelvan resultados
		if (bebidasARenderizar.length === 0) {
			return <div className="col-span-full text-center text-gray-500 py-10 font-semibold text-lg">No hay bebidas que coincidan.</div>;
		}

		// Renderiza el grid inyectando el tamaño específico (size) a cada ProductCard
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{bebidasARenderizar.map(item => (
					<ProductCard key={item.idKey} product={item.product} activeTab="bebidas" selectedSize={item.size} />
				))}
			</div>
		);
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
						<div className="mb-8 text-center bg-[#FFFBF2] py-4 px-6 rounded-xl border border-action/20 max-w-3xl mx-auto shadow-sm">
							<p className="text-sm md:text-base text-primary/80 font-poppins">
								<span className="font-bold text-action mr-2">ℹ️ Información:</span>
								El precio mostrado por defecto corresponde a las pizzas medianas.
								Pulsa en <strong>"Configurar Pizza"</strong> para elegir tu tamaño favorito y ver el precio final.
							</p>
						</div>

						{/* Grid de productos */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{productosOrdenados.map((prod) => (
								<ProductCard key={prod._id} product={prod} activeTab="pizzas" selectedSize="todos" />
							))}
							{productosOrdenados.length === 0 && (
								<div className="col-span-full text-center text-gray-500 py-10 font-semibold text-lg">
									No hemos encontrado pizzas que coincidan con esa búsqueda.
								</div>
							)}
						</div>
					</>
				)}

				{/* PESTAÑA BEBIDAS */}
				{!cargando && !error && activeTab === 'bebidas' && renderBebidas()}

			</div>
		</main>
	);
};