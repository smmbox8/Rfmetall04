import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';

const CartButton: React.FC = () => {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-40"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {totalItems}
          </div>
        )}
      </button>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;