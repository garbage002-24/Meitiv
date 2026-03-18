import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Menu, 
  X, 
  ShoppingCart, 
  Info,
  ChevronDown,
  Star,
  CalendarDays,
  Quote,
  Eye,
  Plus
} from 'lucide-react';
import { products, Category, Hashgacha, Product } from './data/products';
import ShoppingList, { CartItem } from './components/ShoppingList';
import QuickView from './components/QuickView';
import HolidayCalendar from './components/HolidayCalendar';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog'>('home');
  const [isPassoverMode, setIsPassoverMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedHashgacha, setSelectedHashgacha] = useState<Hashgacha | 'All'>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New Features State
  const [shoppingList, setShoppingList] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isHolidayCalendarOpen, setIsHolidayCalendarOpen] = useState(false);
  const [savings, setSavings] = useState(0);

  const categories: (Category | 'All')[] = ['All', 'Meat & Poultry', 'Dairy', 'Pantry', 'Bakery', 'Frozen', 'Produce', 'Beverages & Drinks'];
  const hashgachas: (Hashgacha | 'All')[] = ['All', 'Vaad Hakashrus KY', 'Volova', 'Hisachdus (CRC)', 'Weissmandel', 'Badatz', 'Nirbater'];

  // Dynamic Hours
  const getTodayHours = () => {
    const day = new Date().getDay();
    if (day >= 0 && day <= 3) return "Open today until 12:00 AM";
    if (day === 4) return "Open today until 1:00 AM";
    if (day === 5) return "Open today until 2 hrs before sundown";
    if (day === 6) return "Closed today for Shabbat";
    return "";
  };

  // Savings Counter Animation
  useEffect(() => {
    const target = 2543000;
    const duration = 2000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setSavings(target);
        clearInterval(timer);
      } else {
        setSavings(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesHashgacha = selectedHashgacha === 'All' || p.hashgacha === selectedHashgacha;
      const matchesPassover = !isPassoverMode || p.kosherForPassover;
      
      return matchesSearch && matchesCategory && matchesHashgacha && matchesPassover;
    });
  }, [searchQuery, selectedCategory, selectedHashgacha, isPassoverMode]);

  const featuredProducts = products.filter(p => p.featured && (!isPassoverMode || p.kosherForPassover));

  // Shopping List Functions
  const addToCart = (product: Product) => {
    setShoppingList(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setShoppingList(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setShoppingList(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartItemCount = shoppingList.reduce((sum, item) => sum + item.quantity, 0);

  const renderProductCard = (product: Product) => (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      key={product.id}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setQuickViewProduct(product)}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <Eye size={18} /> Quick View
          </div>
        </div>
        {product.featured && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-md">
            HOT DEAL
          </div>
        )}
        {product.kosherForPassover && (
          <div className="absolute top-4 right-4 bg-amber-500 text-amber-950 px-3 py-1 rounded-full font-bold text-xs shadow-md">
            KFP
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-slate-900 leading-tight">{product.name}</h3>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200 whitespace-nowrap ml-2">
            {product.hashgacha}
          </span>
        </div>
        <p className="text-slate-500 text-sm mb-4 flex-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto space-y-4">
          <div className="flex justify-between items-end border-t border-slate-100 pt-4">
            <div>
              <div className="text-sm text-slate-500">Regular Price</div>
              <div className="font-bold text-lg text-slate-900">${product.price.toFixed(2)}<span className="text-sm text-slate-500 font-normal">/{product.unit}</span></div>
            </div>
            {product.bulkDeal && (
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600 uppercase">Bulk Deal</div>
                <div className="text-sm font-medium text-slate-700">{product.bulkDeal.split(':')[0]}</div>
              </div>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 hover:border-blue-600"
          >
            <Plus size={18} /> Add to List
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={14} /> 123 Kosher Way, Monroe NY</span>
            <span className="flex items-center gap-1"><Phone size={14} /> (718) 555-0198</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-blue-800 px-2 py-1 rounded text-xs uppercase tracking-wide">Wholesale Only</span>
            <span className="text-blue-200">{getTodayHours()}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                MW
              </div>
              <span className="text-2xl font-bold tracking-tight text-blue-900">Meitiv Wholesale</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setCurrentView('home')} className={`font-medium transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Home</button>
              <button onClick={() => setCurrentView('catalog')} className={`font-medium transition-colors ${currentView === 'catalog' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Full Catalog</button>
              <a href="#hours" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Hours & Locations</a>
              
              {/* Passover Toggle */}
              <button 
                onClick={() => setIsPassoverMode(!isPassoverMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  isPassoverMode 
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-inner' 
                    : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isPassoverMode ? 'bg-amber-500' : 'bg-slate-400'}`} />
                Pesach Mode
              </button>

              {/* Shopping List Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-600"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                className="p-2 text-slate-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t overflow-hidden bg-white"
            >
              <div className="p-4 flex flex-col gap-4">
                <button onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} className="font-medium text-slate-600 text-left">Home</button>
                <button onClick={() => { setCurrentView('catalog'); setIsMobileMenuOpen(false); }} className="font-medium text-slate-600 text-left">Full Catalog</button>
                <a href="#hours" onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-slate-600">Hours & Locations</a>
                <button 
                  onClick={() => setIsPassoverMode(!isPassoverMode)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium justify-center transition-all ${
                    isPassoverMode 
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' 
                      : 'bg-slate-100 text-slate-500 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${isPassoverMode ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  Pesach Mode {isPassoverMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Passover Banner */}
      <AnimatePresence>
        {isPassoverMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-amber-950 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center gap-3 font-bold text-lg text-center">
              <Star className="fill-amber-950 shrink-0" size={20} />
              Pesach Mode Active: Showing only Kosher for Passover items.
              <Star className="fill-amber-950 shrink-0" size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="relative bg-blue-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
                alt="Supermarket Aisles" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-transparent" />
            
            <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <span className="inline-block py-1 px-3 rounded-full bg-blue-800 text-blue-200 font-semibold text-sm mb-6 border border-blue-700">
                  Upstate's Largest Kosher Wholesaler
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                  Bulk Savings.<br/>
                  <span className="text-blue-400">Zero Compromise.</span>
                </h1>
                <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-xl">
                  Your local destination for wholesale kosher groceries, premium grocery items, and bulk pantry staples. Open to the public.
                </p>
                
                {/* Savings Counter */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-10 max-w-md">
                  <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Total Savings for Local Families</div>
                  <div className="text-4xl font-black text-white flex items-center gap-1">
                    $<span>{savings.toLocaleString()}</span>+
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setCurrentView('catalog')} className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                    Browse Full Catalog
                  </button>
                  <a href="#hours" className="bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors border border-blue-600">
                    View Store Hours
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Featured Specials */}
          <section id="specials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Weekly Pallet Deals</h2>
                  <p className="text-slate-500 text-lg">In-store only. Valid through Friday.</p>
                </div>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="hidden md:block text-blue-600 font-bold hover:underline"
                >
                  View All Products &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.slice(0, 3).map(renderProductCard)}
              </div>
              
              <div className="mt-12 text-center md:hidden">
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="bg-blue-50 text-blue-600 font-bold px-8 py-4 rounded-xl w-full"
                >
                  View All Products
                </button>
              </div>
            </div>
          </section>

          {/* Info / Features Section */}
          <section className="py-20 bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-20">
                <div>
                  <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-300">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No Membership Required</h3>
                  <p className="text-blue-200">Shop wholesale prices without the annual fees. Open to the public and commercial buyers alike.</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-300">
                    <Star size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Strict Hashgacha</h3>
                  <p className="text-blue-200">We carry products from the most trusted kosher certification agencies worldwide.</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-300">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Pallet & Case Deals</h3>
                  <p className="text-blue-200">Perfect for large families, simchas, caterers, and local institutions.</p>
                </div>
              </div>

              {/* Testimonials */}
              <div className="border-t border-blue-800 pt-20">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: "Sarah M.", text: "Meitiv Wholesale has completely changed how I shop for Yom Tov. The pallet deals are incredible!", location: "Monroe, NY" },
                    { name: "Chaim B.", text: "The selection of strictly kosher products is unmatched. I don't have to go anywhere else.", location: "Spring Valley, NY" },
                    { name: "Rivka L.", text: "Clean, organized, and the prices are unbeatable. Highly recommend to any large family.", location: "Brooklyn, NY" },
                  ].map((testimonial, i) => (
                    <div key={i} className="bg-blue-800/50 p-8 rounded-3xl border border-blue-700/50 relative">
                      <Quote className="absolute top-6 right-6 text-blue-600/50" size={48} />
                      <p className="text-blue-100 text-lg mb-6 relative z-10 leading-relaxed">"{testimonial.text}"</p>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-blue-300 text-sm">{testimonial.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Dedicated Catalog View */
        <section className="py-12 bg-slate-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Full Product Catalog</h2>
                <p className="text-slate-600">Browse our extensive selection and build your shopping list.</p>
              </div>
              <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                Showing {filteredProducts.length} products
              </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-8 sticky top-24 z-30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                  <div className="relative min-w-[160px]">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>

                  <div className="relative min-w-[160px]">
                    <select 
                      value={selectedHashgacha}
                      onChange={(e) => setSelectedHashgacha(e.target.value as any)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer"
                    >
                      {hashgachas.map(h => <option key={h} value={h}>{h === 'All' ? 'All Certifications' : h}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(renderProductCard)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <Info className="mx-auto text-slate-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedHashgacha('All');
                    setIsPassoverMode(false);
                  }}
                  className="mt-6 text-blue-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hours & Locations */}
      <section id="hours" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Visit Our Warehouse</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-slate-900">Store Hours</h3>
                      <button 
                        onClick={() => setIsHolidayCalendarOpen(true)}
                        className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors"
                      >
                        <CalendarDays size={16} /> Holiday Calendar
                      </button>
                    </div>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span>Sunday - Wednesday</span>
                        <span className="font-medium text-slate-900">10:00 AM - 12:00 AM</span>
                      </li>
                      <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span>Thursday</span>
                        <span className="font-medium text-slate-900">10:00 AM - 1:00 AM</span>
                      </li>
                      <li className="flex justify-between border-b border-slate-200 pb-2">
                        <span>Friday</span>
                        <span className="font-medium text-slate-900">9:00 AM - 2 hrs before sundown</span>
                      </li>
                      <li className="flex justify-between pt-1">
                        <span>Saturday (Shabbat)</span>
                        <span className="font-bold text-blue-600">CLOSED</span>
                      </li>
                    </ul>
                    <p className="text-sm text-amber-600 mt-3 font-medium bg-amber-50 p-3 rounded-lg border border-amber-100">
                      * Holiday hours may vary. We close early on Erev Yom Tov.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">Location #1</h3>
                      <p className="text-slate-600 mb-2">1017 NY-17M<br/>Monroe, NY 10950</p>
                      <a href="#" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                        Get Directions
                      </a>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">Location #2</h3>
                      <p className="text-slate-600 mb-2">3 Satmar Dr.<br/>Monroe, NY 10950</p>
                      <a href="#" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                        Get Directions
                      </a>
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-slate-200 min-h-[400px] relative">
              {/* Placeholder for Map */}
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" 
                alt="Map Location"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <MapPin size={24} />
                </div>
                <div className="font-bold text-slate-900">Meitiv Wholesale</div>
                <div className="text-sm text-slate-500">Monroe, NY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-sm">
              MW
            </div>
            <span className="text-xl font-bold text-white">Meitiv Wholesale</span>
          </div>
          <div className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Meitiv Wholesale. All rights reserved.
            <br/>
            Prices subject to change. Not responsible for typographical errors.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Wholesale Application</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Modals & Sidebars */}
      <ShoppingList 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={shoppingList}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
      
      <QuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        onAddToList={addToCart}
      />

      <HolidayCalendar 
        isOpen={isHolidayCalendarOpen}
        onClose={() => setIsHolidayCalendarOpen(false)}
      />
    </div>
  );
}

