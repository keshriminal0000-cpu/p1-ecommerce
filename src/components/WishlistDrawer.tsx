import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Bell 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const WishlistDrawer: React.FC = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    products, 
    toggleWishlist, 
    clearWishlist, 
    addToCart, 
    setIsCartOpen,
    currency,
    openProductDetail,
    hasPriceAlert,
    openPriceAlertModal 
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  const formatPrice = (usd: number) => {
    const converted = usd * currency.rateAgainstUSD;
    if (currency.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(converted);
    }
    return converted.toFixed(2);
  };

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    toggleWishlist(product.id);
  };

  const handleAddAllToCart = () => {
    savedProducts.forEach(p => addToCart(p));
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart className="h-4 w-4 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Student Wishlist</h2>
              <span className="text-xs text-slate-500 font-medium">
                {savedProducts.length} saved {savedProducts.length === 1 ? 'item' : 'items'} for later
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
                <Heart className="h-8 w-8 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your Student Wishlist is Empty</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Click the heart button on any textbook, Arduino kit, or laptop to save it for your next semester order!
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                Browse Student Catalog
              </button>
            </div>
          ) : (
            <>
              {savedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition group hover:border-slate-300"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      openProductDetail(product);
                    }}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover bg-white ring-1 ring-slate-200 cursor-pointer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <PlatformLogo platform={product.platform} showText={true} />
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <h4 
                        onClick={() => {
                          setIsWishlistOpen(false);
                          openProductDetail(product);
                        }}
                        className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 cursor-pointer"
                      >
                        {product.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-extrabold text-indigo-700">
                          {currency.symbol}{formatPrice(product.price)}
                        </span>
                        {product.studentDiscountPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {product.studentDiscountPercent}% off
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      {/* Price Alert button on Wishlist item */}
                      <button
                        onClick={() => openPriceAlertModal(product)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                          hasPriceAlert(product.id)
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                        title="Set or manage price alert for this wishlist item"
                      >
                        <Bell className={`h-3 w-3 ${hasPriceAlert(product.id) ? 'fill-amber-600' : ''}`} />
                        <span>{hasPriceAlert(product.id) ? 'Alert Active' : 'Set Alert'}</span>
                      </button>

                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearWishlist}
                  className="text-xs font-medium text-slate-400 hover:text-rose-600 transition"
                >
                  Clear Wishlist
                </button>
                <button
                  onClick={handleAddAllToCart}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  <span>Add All to Cart</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-6">
            <button
              onClick={handleAddAllToCart}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-98"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add All Saved Items to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
