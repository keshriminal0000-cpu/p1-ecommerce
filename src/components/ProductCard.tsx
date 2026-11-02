import React from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';
import { 
  ShieldCheck, 
  Star, 
  ShoppingCart, 
  ExternalLink, 
  Heart,
  Bell,
  ArrowRight
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    currency, 
    addToCart, 
    openAuthenticityModal, 
    openProductDetail,
    setIsCartOpen,
    toggleWishlist,
    isInWishlist,
    hasPriceAlert,
    openPriceAlertModal,
    isAuthenticated,
    openAuthModal
  } = useStore();

  const isSaved = isInWishlist(product.id);
  const hasAlert = hasPriceAlert(product.id);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    if (!isAuthenticated) {
      openAuthModal('checkout');
    } else {
      setIsCartOpen(true);
    }
  };

  const handleOpenAuth = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAuthenticityModal(product);
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => openProductDetail(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Top Media & Platform Header */}
      <div>
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Platform Origin Badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-xs ring-1 ring-slate-900/5">
            <PlatformLogo platform={product.platform} showText={true} />
            {product.platformUrl && (
              <ExternalLink className="h-2.5 w-2.5 text-slate-400 ml-0.5" />
            )}
          </div>

          {/* Student Discount Pill */}
          {product.studentDiscountPercent > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-xs">
              Save {product.studentDiscountPercent}% Student
            </div>
          )}

          {/* Cryptographic Authenticity Badge */}
          <button
            onClick={handleOpenAuth}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-2 py-1 text-[10px] font-mono font-medium text-emerald-400 backdrop-blur-xs hover:bg-slate-950 transition"
            title="Inspect SHA-256 cryptographic provenance & campus lab verification"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>SHA-256 Verified</span>
          </button>

          {/* Quick Action Overlay: Bell Price Alert & Heart Wishlist */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {/* Set Price Alert Bell Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPriceAlertModal(product);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all duration-200 active:scale-90 ${
                hasAlert
                  ? 'bg-amber-500 text-white shadow-amber-500/40 ring-2 ring-white animate-pulse'
                  : 'bg-white/90 text-slate-600 hover:text-amber-600 hover:bg-white hover:scale-105'
              }`}
              title={hasAlert ? 'Price drop alert active (Click to manage)' : 'Set Price Alert for this product'}
              aria-label="Set Price Alert"
            >
              <Bell className={`h-4 w-4 transition-transform ${hasAlert ? 'fill-white scale-110' : ''}`} />
            </button>

            {/* Student Wishlist Heart Toggle Button */}
            <button
              onClick={handleToggleHeart}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all duration-200 active:scale-90 ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-rose-500/40 ring-2 ring-white'
                  : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white hover:scale-105'
              }`}
              title={isSaved ? 'Remove from Student Wishlist' : 'Save to Student Wishlist'}
              aria-label="Save to Student Wishlist"
            >
              <Heart className={`h-4 w-4 transition-transform ${isSaved ? 'fill-white scale-110' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-indigo-600 uppercase tracking-wider text-[10px]">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Key Specs tags */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <span 
                key={key} 
                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
              >
                {key}: {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Transparent Fee Breakdown */}
      <div className="border-t border-slate-100 bg-slate-50/60 p-4">
        {/* Transparent Cost Formula */}
        <div className="mb-2.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-200/80 text-[11px]">
          <div className="flex items-center justify-between text-slate-500">
            <span>Base Price:</span>
            <span className="font-medium text-slate-700">
              {currency.symbol}{formatPrice(product.transparentPricing.basePrice)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Est. Category Tax:</span>
            <span className="font-medium text-slate-700">
              +{currency.symbol}{formatPrice(product.transparentPricing.estimatedTax)}
            </span>
          </div>
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span>Student Dorm Shipping:</span>
            <span className="font-bold">FREE ({currency.symbol}0.00)</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Platform / Convenience Fee:</span>
            <span className="text-emerald-700 font-semibold">{currency.symbol}0.00 (Zero Hidden)</span>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-dashed border-slate-200 flex items-center justify-between font-bold text-slate-900">
            <span className="text-xs">Guaranteed Total:</span>
            <span className="text-sm text-indigo-700 font-extrabold font-mono">
              {currency.symbol}{formatPrice(product.transparentPricing.guaranteedTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5 text-slate-500" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleDirectBuy}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition active:scale-95"
          >
            <span>Direct Buy</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
