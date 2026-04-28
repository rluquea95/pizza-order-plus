import { useState } from 'react';
import { useCarta } from '../hooks/useCarta';
import { BarraBusqueda } from '../components/BarraBusqueda';
import { ListaAlergenos } from '../components/ListaAlergenos';
import { CapsulaIngrediente } from '../components/CapsulaIngrediente';
import { DrinkIcon } from '../components/icons/DrinkIcon';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { RecogerLocalIcon } from '../components/icons/RecogerLocalIcon';

export const CartaPage = () => {
  // Desestructura todo lo que devuelve el hook (useCarta.js)
  const { pizzas, bebidas, searchTerm, setSearchTerm, cargando, error } = useCarta();

  // Estado local para controlar en qué pestaña está
  const [activeTab, setActiveTab] = useState('pizzas');

  // Cuando cambia de pestaña, limpia la barra de búsqueda
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  return (
    <main className="w-full grow bg-bg-main py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">

        {/* TÍTULO DE LA PÁGINA */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Nuestra Carta</h1>
          {/* TEXTO DINÁMICO SEGÚN LA PESTAÑA */}
          <p className="text-lg text-primary/70 max-w-2xl mx-auto transition-all duration-300">
            {activeTab === 'pizzas'
              ? "Descubre nuestra selección de pizzas artesanales. Ingredientes frescos, masa de fermentación lenta y mucho amor."
              : "Refresca tu paladar con nuestra variedad de bebidas frías. El acompañamiento perfecto para disfrutar de tu pizza."
            }
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="max-w-4xl mx-auto mb-8">
          <BarraBusqueda
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder={activeTab === 'pizzas' ? "Buscar por nombre o ingredientes (ej. Champiñones)..." : "Buscar bebidas..."}
          />
        </div>

        {/* BOTONES TAB PIZZAS/BEBIDAS */}
        <div className="flex justify-center mb-12 max-w-md mx-auto">
          <div className="w-full flex rounded-full bg-white shadow-sm overflow-hidden border border-gray-100">
            <button
              onClick={() => handleTabChange('pizzas')}
              className={`flex-1 py-3 text-lg font-bold transition-colors ${activeTab === 'pizzas' ? 'bg-primary text-white' : 'bg-transparent text-primary hover:bg-gray-50'
                }`}
            >
              PIZZAS
            </button>
            <button
              onClick={() => handleTabChange('bebidas')}
              className={`flex-1 py-3 text-lg font-bold transition-colors ${activeTab === 'bebidas' ? 'bg-primary text-white' : 'bg-transparent text-primary hover:bg-gray-50'
                }`}
            >
              BEBIDAS
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {cargando && <LoadingSpinner mensaje="Preparando la carta..." />}
        {error && (
          <EmptyState
            titulo="¡Ups! Algo ha salido mal"
            descripcion={error}
          />
        )}

        {/* =========================================
            PESTAÑA: PIZZAS (DISEÑO 1 COLUMNA)
            ========================================= */}
        {!cargando && !error && activeTab === 'pizzas' && (
          <div className="flex flex-col gap-10">
            {pizzas.map((pizza) => {
              // Obtenemos los alérgenos de useCarta
              const alergenosPizza = pizza.alergenosAcumulados || [];
              return (
                <article
                  key={pizza._id}
                  className="group bg-white rounded-4xl shadow-lg hover:shadow-xl transition-shadow duration-500 overflow-hidden border border-gray-100 flex flex-col md:flex-row"
                >
                  {/* Imagen con efecto de zoom */}
                  <div className="w-full md:w-2/5 h-72 md:h-auto min-h-75 overflow-hidden relative bg-gray-100">
                    <img
                      src={`/img/Pizzas/${pizza.imagen_pizza}`}
                      alt={pizza.producto}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                      onError={(e) => { e.currentTarget.src = '/img/Pizzas/pizza-not-found.jpg'; }}
                    />
                  </div>

                  {/* Información Detallada */}
                  <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
                      {pizza.producto}
                    </h2>
                    <p className="text-lg text-primary/80 mb-6 leading-relaxed">
                      {pizza.descripcion}
                    </p>

                    {/* Lista de Ingredientes Base */}
                    <div className="mt-auto pt-6 border-t border-gray-100"></div>
                    {pizza.ingredientes && pizza.ingredientes.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Ingredientes Base</h3>
                        <div className="flex flex-wrap gap-2">
                          {pizza.ingredientes.map(ing => (
                            <CapsulaIngrediente
                              key={ing._id}
                              nombre={ing.ingrediente}
                              variant="default"
                              interactivo={false} // indica que use <span>
                            />
                          ))}
                        </div>

                      </div>
                    )}

                    {/* Alérgenos */}
                    {alergenosPizza.length > 0 && (
                      <div className="mt-auto pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Alérgenos</h3>
                        <ListaAlergenos alergenos={alergenosPizza} />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {/* Mensaje si no hay resultados en la búsqueda de pizzas */}
            {pizzas.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  icono={<RecogerLocalIcon className="w-20 h-20" />}
                  titulo="No se encontraron pizzas"
                  descripcion={`No hemos encontrado pizzas que coincidan con "${searchTerm}".`}
                />
              </div>
            )}
          </div>
        )}

        {/* =========================================
            PESTAÑA: BEBIDAS (GRID MINIMALISTA)
            ========================================= */}
        {!cargando && !error && activeTab === 'bebidas' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {bebidas.map((bebida) => {
              const imgBebida = bebida.imagen_beb_330ml || bebida.imagen_beb_500ml || bebida.imagen_beb_1000ml;

              return (
                <div
                  key={bebida._id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all"
                >
                  <div className="w-24 h-24 mb-4 overflow-hidden relative">
                    <img
                      src={`/img/Bebidas/${imgBebida}`}
                      alt={bebida.producto}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary">{bebida.producto}</h3>
                </div>
              );
            })}

            {/* Mensaje si no hay resultados en la búsqueda de bebidas */}
            {bebidas.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  icono={<DrinkIcon className="w-20 h-20" />}
                  titulo="No se encontraron bebidas"
                  descripcion={`No hemos encontrado bebidas que coincidan con "${searchTerm}".`}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
};