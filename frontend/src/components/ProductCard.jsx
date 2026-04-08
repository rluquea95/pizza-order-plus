import { PizzaCard } from './PizzaCard';
import { BebidaCard } from './BebidaCard';

export const ProductCard = ({ activeTab, product, selectedSize, onOpenConfigurator, onAñadirBebida }) => {

  // Si estamos en la pestaña de pizzas, manda los datos a PizzaCard.
  // Si no, se mandan a BebidaCard.
  if (activeTab === 'pizzas') {
    return <PizzaCard product={product} onOpenConfigurator={onOpenConfigurator} />;
  }
  return (
    <BebidaCard 
      product={product} 
      selectedSize={selectedSize} 
      onAñadirBebida={onAñadirBebida} 
    />
  );
};