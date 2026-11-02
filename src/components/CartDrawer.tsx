import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    setIsCheckoutOpen,
    setIsLinkExtractorOpen,
    currency 
  } = useStore();

  if (!isCartOpen) return null;

  const convertPrice = (usd: number) => {
    const val = usd * currency.rateAgainstUSD;
    if (currency.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(val);
    }
    return val.toFixed(2);
  };

  const subtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const studentDiscountUSD = subtotalUSD * 0.05; // 5% extra cart-wide student discount
  const taxUSD = (subtotalUSD - studentDiscountUSD) * 0.08;
  const shippingUSD = 0; // Guaranteed Free
  const totalUSD = subtotalUSD - studentDiscountUSD + taxUSD;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Student Shopping Cart</h2>
              <span className="text-xs text-slate-500 font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} • Zero Hidden Fees
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <ShoppingCart className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your Student Cart is Empty</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Explore student electronics, STEM books, stationery, or paste any external link from Amazon or Flipkart!
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsLinkExtractorOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Paste External Product Link</span>
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Continue Browsing Catalog
                </button>
              </div>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover bg-white ring-1 ring-slate-200"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <PlatformLogo platform={item.product.platform} showText={true} />
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] font-mono text-indigo-700 font-extrabold mt-0.5">
                        {currency.symbol}{convertPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-900">
                        {currency.symbol}{convertPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs font-medium text-slate-400 hover:text-rose-600 transition"
                >
                  Clear all items
                </button>
                <button
                  onClick={() => setIsLinkExtractorOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>+ Add another platform URL</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer: Transparent Pricing & Checkout Trigger */}
        {cart.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span className="font-mono text-slate-800">{currency.symbol}{convertPrice(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Student Cart Subsidy (-5%):</span>
                <span className="font-mono">-{currency.symbol}{convertPrice(studentDiscountUSD)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Category Sales Tax:</span>
                <span className="font-mono text-slate-800">+{currency.symbol}{convertPrice(taxUSD)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Dorm Delivery:</span>
                <span>FREE ($0.00)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Platform Convenience Surcharge:</span>
                <span className="text-emerald-700 font-bold">$0.00 (Guaranteed Zero)</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Guaranteed Final Total:</span>
                <span className="font-mono text-indigo-700 text-lg">
                  {currency.symbol}{convertPrice(totalUSD)}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-98"
            >
              <span>Proceed to Multi-Gateway Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
