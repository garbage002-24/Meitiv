import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Info } from 'lucide-react';
import { Product } from '../data/products';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToList: (product: Product) => void;
}

export default function QuickView({ product, onClose, onAddToList }: QuickViewProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X size={24} className="text-slate-700" />
          </button>

          <div className="md:w-1/2 h-64 md:h-auto bg-slate-100 relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.kosherForPassover && (
              <div className="absolute top-4 left-4 bg-amber-500 text-amber-950 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                Kosher for Passover
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">{product.category}</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-bold border border-slate-200">
                {product.hashgacha}
              </span>
            </div>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Regular Price</div>
                  <div className="font-black text-3xl text-slate-900">
                    ${product.price.toFixed(2)}
                    <span className="text-base text-slate-500 font-medium ml-1">/ {product.unit}</span>
                  </div>
                </div>
                {product.bulkDeal && (
                  <div className="text-right bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="text-xs font-bold text-blue-800 uppercase mb-1">Wholesale Deal</div>
                    <div className="text-lg font-bold text-blue-900">{product.bulkDeal}</div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  onAddToList(product);
                  onClose();
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Plus size={24} /> Add to Shopping List
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
