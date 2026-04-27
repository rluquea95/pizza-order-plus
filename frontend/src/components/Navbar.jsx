import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useCart } from '../context/CartContext';
import logoClaro from '../assets/logo_pizza_order_claro.png';
import { CarritoIcon } from './icons/CarritoIcon';
import { LoginIcon } from './icons/LoginIcon';
import { MenuIcon } from './icons/MenuIcon';
import { CerrarIcon } from './icons/CerrarIcon';
import { CartSidebar } from './CartSidebar';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {

  // Estado para el menú hamburguesa: 'false' (cerrado) y 'true' (abierto) 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado que controla si la preview del carrito está abierto o no
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Extrae el total del Carrito
  const { cantidadTotal } = useCart();

  // Estado que controla el usuario y la función de cierre de sesión
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="bg-primary text-white h-20 shadow-md relative z-30">
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
              {isMenuOpen ? <CerrarIcon className="w-10 h-10" /> : <MenuIcon className="w-10 h-10" />}
            </button>

            {/* Logo */}
            <Link to="/" aria-label="Ir a la página de inicio" className="hover:scale-105 transition-transform shrink-0">
              <img src={logoClaro} alt="Logo PizzaOrder+" className="h-18 w-auto lg:block" />
            </Link>

            {/* Enlaces de Navegación ESCRITORIO */}
            <div className="hidden lg:flex items-center gap-6 font-poppins font-bold tracking-widest text-lg mt-1">
              {/* Carta */}
              <NavLink
                to="/carta"
                className={({ isActive }) =>
                  isActive
                    ? "text-action border-b-2 border-action pb-1"
                    : "hover:text-action transition-colors pb-1 text-white"
                }
              >
                CARTA
              </NavLink>
            </div>
          </div>

          {/* Agrupa el resto de botones de la barra de navegación*/}
          <div className="flex items-center gap-2 md:gap-4 text-lg font-bold tracking-wide">

            {/* Botón Iniciar Pedido*/}
            <Link
              to="/iniciar-pedido"
              className="bg-action text-primary px-3 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-focus hover:text-primary transition-all 
                      shadow-md flex items-center justify-center hover:scale-105 active:scale-95 active:shadow-sm"
            >
              <span className="text-sm md:text-lg">INICIAR PEDIDO</span>
            </Link>

            {/* LÓGICA DE USUARIO (DESKTOP) */}
            {user ? (
              <div className="relative group hidden md:block">

                {/* Botón de Usuario */}
                <button className="flex items-center gap-2 text-white hover:text-action transition-colors px-2 h-20">
                  <LoginIcon className="w-8 h-8" />
                  <span className="hidden xl:inline tracking-widest uppercase">
                    {user.rol === 'ADMIN' ? '¡HOLA, ADMIN!' : `¡HOLA, ${user.nombre}!`}
                  </span>
                </button>

                {/* Menú Desplegable al Hover */}
                <div className="absolute right-0 top-full w-64 bg-primary text-white rounded-b-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border-t-2 border-action">

                  {/* Enlace de cliente común a TODOS los usuarios logueados */}
                  <Link
                    to="/pedidos"
                    className="block px-4 py-3 hover:text-action transition-colors text-lg tracking-widest font-bold"
                  >
                    MIS PEDIDOS
                  </Link>

                  {/* Si es ADMIN muestra Panel de Cocina y el Historico de Pedidos*/}
                  {user.rol === 'ADMIN' && (
                    <>
                      <Link
                        to="/admin/pedidos"
                        className="block px-4 py-3 hover:text-action transition-colors text-lg tracking-widest font-bold border-t border-white/10"
                      >
                        PANEL DE COCINA
                      </Link>
                      <Link
                        to="/admin/historico"
                        className="block px-4 py-3 hover:text-action transition-colors text-lg tracking-widest font-bold border-t border-white/10"
                      >
                        HISTORIAL DE PEDIDOS
                      </Link>
                    </>
                  )}

                  <hr className="my-2 border-gray-100" />

                  {/* Contenedor para darle margen al botón de cerrar sesión */}
                  <div className="px-3 pb-2 pt-1">
                    <Button
                      onClick={logout}
                      animated={false}
                      variant="primary"
                      className="w-full py-2.5 rounded-full text-base tracking-widest gap-2"
                    >
                      <CerrarIcon className="w-5 h-5" /> CERRAR SESIÓN
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 text-white hover:text-action transition-colors px-2"
              >
                <LoginIcon className="w-8 h-8" />
                <span className="hidden xl:inline tracking-widest">INICIAR SESIÓN</span>
              </Link>
            )}

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
          <div className="lg:hidden absolute top-20 left-0 w-full bg-primary border-t border-white/10 shadow-xl flex flex-col p-4 gap-4 font-poppins font-bold tracking-widest text-base animate-fade-in">
            {/* Carta */}
            <NavLink
              to="/carta"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "text-action" : "text-white hover:text-action"}
            >
              CARTA
            </NavLink>

            <hr className="border-white/10 my-2" />

            {/* LÓGICA DE USUARIO (MÓVIL) */}
            {user ? (
              <>
                {/* Enlace común para todos */}
                <Link
                  to="/pedidos"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-action "
                >
                  MIS PEDIDOS
                </Link>

                {/* Enlaces exclusivos de Admin en móvil */}
                {user.rol === 'ADMIN' && (
                  <>
                    <hr className="border-white/10 my-1" />

                    <Link
                      to="/admin/pedidos"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-action"
                    >
                      PANEL DE COCINA
                    </Link>

                    <hr className="border-white/10 my-1" />

                    <Link
                      to="/admin/historico"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-action"
                    >
                      HISTORIAL DE PEDIDOS
                    </Link>
                  </>
                )}
                <Button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  variant="primary"
                  animated={false}
                  className="w-full py-3 mt-2 rounded-full text-base gap-2"
                >
                  <CerrarIcon className="w-6 h-6" /> CERRAR SESIÓN
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-white hover:text-action transition-colors w-full text-left"
              >
                <LoginIcon className="w-7 h-7" /> INICIAR SESIÓN
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Resumen del Carrito */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};