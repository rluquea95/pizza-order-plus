import { PizzaCard } from './PizzaCard';
import { BebidaCard } from './BebidaCard';

export const ProductCard = ({ activeTab, product, selectedSize }) => {

  // Si estamos en la pestaña de pizzas, manda los datos a PizzaCard.
  // Si no, se mandan a BebidaCard.
  return activeTab === 'pizzas' 
    ? <PizzaCard product={product} /> 
    : <BebidaCard product={product} selectedSize={selectedSize} />;
};