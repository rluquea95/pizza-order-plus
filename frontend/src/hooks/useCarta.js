import { useState } from 'react';
import { useData } from '../context/DataContext';

export const useCarta = () => {

  // Extrae los 'produtos','cargando' y 'error' de DataContext
  const { productos, cargando, error } = useData();

  // Almacena la búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Calcula todos los alérgenos de la pizza
  const procesarAlergenos = (pizza) => {
    const alergenosBase = pizza.alergenos || [];
    const ingredientes = pizza.ingredientes || [];
    // Extrae los alérgenos de cada ingrediente y los agrupa en un único array
    const alergenosIngredientes = ingredientes.flatMap(ing => ing.alergenos || []);
    const todos = [...alergenosBase, ...alergenosIngredientes];

    return Array.from(
      new Map(todos.filter(al => al && al._id).map(al => [al._id, al])).values()
    );
  };

  // Filtra, ordena y procesa los alérgenos leyendo la variable global
  const pizzasBase = productos
    .filter(prod => prod.categoria?.toUpperCase() === 'PIZZA')
    .sort((a, b) => a.producto.localeCompare(b.producto))
    .map(pizza => ({
      ...pizza,
      alergenosAcumulados: procesarAlergenos(pizza)
    }));

  // Filtra y ordena las bebidas leyendo la variable global
  const bebidasBase = productos
    .filter(prod => prod.categoria?.toUpperCase() === 'BEBIDA')
    .sort((a, b) => a.producto.localeCompare(b.producto));

  // Filtra dinámicamente según lo que el usuario escriba en la barra de búsqueda
  const term = searchTerm.toLowerCase();

  const pizzasFiltradas = pizzasBase.filter(prod => {
    if (!term) return true;

    const nombre = (prod.producto || '').toLowerCase();
    const descripcion = (prod.descripcion || '').toLowerCase();

    // Convierte los ingredientes a texto para poder buscar en ellos
    let ingredientesTxt = '';
    if (Array.isArray(prod.ingredientes)) {
      ingredientesTxt = prod.ingredientes.map(ing =>
        typeof ing === 'object' && ing !== null ? ing.ingrediente : ing
      ).join(' ').toLowerCase();
    }

    return nombre.includes(term) || descripcion.includes(term) || ingredientesTxt.includes(term);
  });

  const bebidasFiltradas = bebidasBase.filter(prod => {
    if (!term) return true;
    const nombre = (prod.producto || '').toLowerCase();
    return nombre.includes(term);
  });

  // Retorna la información para que la vista solo se encargue de pintar
  return {
    pizzas: pizzasFiltradas,
    bebidas: bebidasFiltradas,
    searchTerm,
    setSearchTerm,
    cargando,
    error
  };
};