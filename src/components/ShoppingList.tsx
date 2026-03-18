import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Printer, Download } from 'lucide-react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
}

export default function ShoppingList({ isOpen, onClose, items, updateQuantity, removeItem }: ShoppingListProps) {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">My Shopping List</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">
                  <p>Your shopping list is empty.</p>
                  <button onClick={onClose} className="mt-4 text-blue-600 font-medium hover:underline">
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-4 border border-slate-200 p-3 rounded-xl">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.product.name}</h3>
                          <div className="text-slate-500 text-xs mt-1">${item.product.price.toFixed(2)} / {item.product.unit}</div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-slate-600 hover:text-blue-600 font-bold">-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-slate-600 hover:text-blue-600 font-bold">+</button>
                          </div>
                          <button onClick={() => removeItem(item.product.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 font-medium">Estimated Total</span>
                  <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrint} className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <Printer size={18} /> Print
                  </button>
                  <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                    <Download size={18} /> Save PDF
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center mt-3">
                  * Prices are estimates and may vary in-store.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
