import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext'
import logoClaro from '../assets/logo_pizza_order_claro.jpg';
import iconoClaro from '../assets/icono_pizza_order_claro.jpg';
import { CarritoIcon } from './icons/CarritoIcon';
import { LoginIcon } from './icons/LoginIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CerrarIcon } from './icons/CerrarIcon';
import { CartSidebar } from './CartSideBar';
import { Button } from './ui/Button';

export const Navbar = () => {

  // Estado para el menú hamburguesa: 'false' (cerrado) y 'true' (abierto) 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado que controla si la preview del carrito está abierto o no
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Extrae la variable, función y colección de la memoria global
  const { cantidadTotal, abrirConfigurador } = useCart();
  const { productos } = useData();

  // Función para editar una pizza del carrito
  const handleEditPizza = (pizzaDelCarrito) => {
 
    // Buscamos la pizza original en la memoria global y así obtener
    // los ingredientes que tiene por defecto
    const productoBase = productos.find(p => p._id === pizzaDelCarrito.productoId);
    
    // Si el producto existe, se le pasa al modal la pizza base y las modificaciones
    // del usuario 
    if (productoBase) {
      abrirConfigurador(productoBase, pizzaDelCarrito);

    } else {
      console.error("No se ha encontrado el producto base para editar.");
    }
  };

  return (
    <>
      <nav className="bg-primary text-white h-20 shadow-md relative z-50">
        <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">

          {/* Agrupa Menú Hamburguesa, Logo y Enlaces */}
          <div className="flex items-center gap-4 lg:gap-8">

            {/* Botón Menú Hamburguesa (Solo móvil) */}
            <button
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú principal"}
              className="lg:hidden p-1 hover:text-action transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {/* Alterna entre el icono Menú y Cerrar */}
              {isMenuOpen ? (
                <CerrarIcon className="w-12 h-12" />
              ) : (
                <MenuIcon className="w-12 h-12" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" aria-label="Ir a la página de inicio" className="hover:scale-105 transition-transform shrink-0">
              <img
                src={iconoClaro}
                alt="Icono PizzaOrder+"
                className="h-18 w-auto lg:hidden"
              />
              <img
                src={logoClaro}
                alt="Logo PizzaOrder+"
                className="h-18 w-auto hidden lg:block"
              />
            </Link>

            {/* Enlaces de Navegación ESCRITORIO */}
            <div className="hidden lg:flex items-center gap-6 font-poppins font-bold tracking-widest text-lg mt-1">
              {/* Carta */}
              <NavLink
                to="/carta"
                aria-label="Ir a la página de carta"
                className={({ isActive }) =>
                  isActive
                    ? "text-action border-b-2 border-action pb-1"
                    : "hover:text-action transition-colors pb-1 text-white"
                }
              >
                CARTA
              </NavLink>

              {/* Ofertas */}
              <NavLink
                to="/ofertas"
                aria-label="Ir a la página de ofertas"
                className={({ isActive }) =>
                  isActive
                    ? "text-action border-b-2 border-action pb-1"
                    : "hover:text-action transition-colors pb-1 text-white"
                }
              >
                OFERTAS
              </NavLink>
            </div>
          </div>

          {/* Agrupa el resto de botones de la barra de navegación*/}
          <div className="flex items-center gap-2 md:gap-4 text-lg font-bold tracking-wide">

            {/* Botón Iniciar Pedido*/}
            <Link
              to="/iniciar-pedido"
              aria-label="Ir a la página de iniciar pedido"
              className="bg-action text-primary px-3 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-focus hover:text-primary transition-all 
                      shadow-md flex items-center justify-center hover:scale-105 active:scale-95 active:shadow-sm"
            >
              <span className="text-sm md:text-lg">INICIAR PEDIDO</span>
            </Link>

            {/* Botón Iniciar Sesión*/}
            <button
              aria-label="Iniciar Sesión"
              className="hidden md:flex items-center gap-2 text-white hover:text-action transition-colors px-2"
            >
              <LoginIcon className="w-8 h-8" />
              <span className="hidden xl:inline tracking-widest">INICIAR SESIÓN</span>
            </button>

            {/* Botón Carrito*/}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito de compras"
              className="flex items-center gap-2 text-white hover:text-action px-2 transition-colors"
            >
              <div className="relative">
                <CarritoIcon className="w-7 h-7 md:w-8 md:h-8" />
                {/* Solo se muestra la burbuja si hay productos en el carrito */}
                {cantidadTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-action text-white rounded-full text-[9px] md:text-[10px] font-bold 
                                  shadow-sm flex items-center justify-center w-4 h-4 md:w-5 md:h-5 ">
                    {cantidadTotal}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline tracking-widest">
                CARRITO
              </span>
            </button>
          </div>
        </div>

        {/* Menú desplegable para resoluciones pequeñas */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-primary border-t border-white/10 shadow-xl flex flex-col p-4 gap-4 font-poppins font-bold tracking-widest text-lg animate-fade-in">
            {/* Carta */}
            <NavLink
              to="/carta"
              aria-label="Ir a la página de carta"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "text-action" : "text-white hover:text-action"}
            >
              CARTA
            </NavLink>

            {/* Ofertas */}
            <NavLink
              to="/ofertas"
              aria-label="Ir a la página de ofertas"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "text-action" : "text-white hover:text-action"}
            >
              OFERTAS
            </NavLink>

            <hr className="border-white/10 my-2" />

            {/* Iniciar Sesión */}
            <button
              aria-label="Iniciar sesión"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-white hover:text-action transition-colors w-full text-left"
            >
              <LoginIcon className="w-8 h-8" />
              INICIAR SESIÓN
            </button>
          </div>
        )}
      </nav>

      {/* Resumen del Carrito */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onEditPizza={handleEditPizza}
      />
    </>
  );
}