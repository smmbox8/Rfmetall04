import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCallModal } from '../contexts/CallModalContext';
import { calculateDeliveryPrice } from '../data/priceData';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateCartItem, clearCart, getTotalPrice } = useCart();
  const { openModal } = useCallModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalWeight = items.reduce((sum, item) => sum + item.quantityTons, 0);
  const deliveryPrice = calculateDeliveryPrice(totalWeight);
  const totalWithDelivery = getTotalPrice() + deliveryPrice;

  const handleQuantityChange = (cartItemId: string, newQuantityTons: number) => {
    const cartItem = items.find(item => item.id === cartItemId);
    if (!cartItem) return;

    const newQuantityPieces = Math.round((newQuantityTons * 1000) / cartItem.item.weightPerPiece);
    const newQuantityMeters = newQuantityPieces * cartItem.item.lengthValue;
    const newTotalPrice = cartItem.pricePerTon * newQuantityTons;

    updateCartItem(cartItemId, newQuantityTons, newQuantityPieces, newQuantityMeters, newTotalPrice);
  };

  const handleOrderCart = () => {
    if (items.length === 0) return;

    const cartData = {
      items: items.map(item => ({
        name: item.item.name,
        size: item.item.size,
        quantity: item.quantityPieces,
        weight: item.quantityTons,
        price: item.totalPrice,
        branch: item.item.branch,
        gost: item.item.gost
      })),
      totalItems: items.length,
      totalWeight: totalWeight,
      totalPrice: totalWithDelivery,
      deliveryPrice: deliveryPrice
    };

    openModal('Заказать корзину товаров', { cartData });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCart className="h-6 sm:h-8 w-6 sm:w-8 mr-3" />
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Корзина</h2>
                <p className="text-blue-100 text-sm sm:text-base">
                  {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[calc(95vh-120px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Корзина пуста</h3>
                <p className="text-gray-500">Добавьте товары в корзину для оформления заказа</p>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4">
                  {items.map((cartItem) => (
                    <div key={cartItem.id} className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Product Info */}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">
                            {cartItem.item.name} {cartItem.item.size}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">ГОСТ:</span> {cartItem.item.gost}
                            </div>
                            <div>
                              <span className="font-medium">Филиал:</span> {cartItem.item.branch}
                            </div>
                            <div>
                              <span className="font-medium">Вес шт:</span> {cartItem.item.weightPerPiece.toFixed(2)} кг
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(cartItem.id, Math.max(0.1, cartItem.quantityTons - 0.1))}
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="text-center min-w-[80px]">
                              <div className="font-bold text-lg">{cartItem.quantityTons.toFixed(1)} т</div>
                              <div className="text-sm text-gray-600">{cartItem.quantityPieces} шт</div>
                            </div>
                            <button
                              onClick={() => handleQuantityChange(cartItem.id, cartItem.quantityTons + 0.1)}
                              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right min-w-[120px]">
                            <div className="font-bold text-lg text-blue-600">
                              {Math.round(cartItem.totalPrice).toLocaleString()} ₸
                            </div>
                            <div className="text-sm text-gray-600">
                              {Math.round(cartItem.pricePerTon).toLocaleString()} ₸/т
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(cartItem.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t bg-gray-50 p-4 sm:p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Товары:</span>
                    <span className="font-bold">{Math.round(getTotalPrice()).toLocaleString()} ₸</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Доставка ({totalWeight.toFixed(1)} т):</span>
                    <span className="font-bold">{Math.round(deliveryPrice).toLocaleString()} ₸</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-blue-600">
                    <span>Итого:</span>
                    <span>{Math.round(totalWithDelivery).toLocaleString()} ₸</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Очистить корзину
                  </button>
                  <button
                    onClick={handleOrderCart}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Оформить заказ
                  </button>
                </div>

                {/* Price Notice */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    ⚠️ <strong>Актуальность цен уточняйте у менеджера</strong>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;