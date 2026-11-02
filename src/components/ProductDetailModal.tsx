import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  ShoppingCart, 
  ArrowRight, 
  Check, 
  Truck, 
  RotateCcw, 
  ExternalLink,
  Cpu,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    isProductDetailOpen, 
    closeProductDetail, 
    addToCart, 
    setIsCartOpen,
    currency,
    openAuthenticityModal 
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isProductDetailOpen || !selectedProduct) return null;

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

  const handleBuyNow = () => {
    addToCart(selectedProduct);
    closeProductDetail();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Sticky Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 backdrop-blur-xs hover:bg-slate-100 hover:text-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
              <img
                src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow-xs backdrop-blur-xs">
                <PlatformLogo platform={selectedProduct.platform} showText={true} />
              </div>
            </div>

            {selectedProduct.images.length > 1 && (
              <div className="flex gap-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                      activeImageIdx === idx ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Cryptographic Proof Trigger */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    Cryptographic Provenance Verified
                  </span>
                </div>
                <button
                  onClick={() => openAuthenticityModal(selectedProduct)}
                  className="text-xs font-semibold text-indigo-700 underline hover:text-indigo-800"
                >
                  Inspect SHA-256 Hash
                </button>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                Batch Hash: {selectedProduct.cryptoProvenance.batchHash.slice(0, 32)}...
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Verified against Campus Lab registry: {selectedProduct.cryptoProvenance.campusVerificationId}
              </p>
            </div>
          </div>

          {/* Right Column: Specs, Transparent Price & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {selectedProduct.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{selectedProduct.rating}</span>
                  <span className="text-slate-400">({selectedProduct.reviewCount} student reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedProduct.title}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
                  {selectedProduct.subtitle}
                </p>
              </div>

              {/* Verified Vendor Tag */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Vendor:</span>
                <span className="font-bold text-slate-900">{selectedProduct.vendorName}</span>
                {selectedProduct.vendorVerified && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                    <Check className="h-3 w-3" />
                    Verified Campus Partner
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Key Specifications Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProduct.specs).map(([specKey, specVal]) => (
                    <div key={specKey} className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/70">
                      <span className="text-[11px] font-medium text-slate-400 block">{specKey}</span>
                      <span className="font-bold text-slate-800">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transparent Cost Formula Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                  <span>Transparent Price Breakdown:</span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Zero Dark Patterns Enforced
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Item Base Subtotal:</span>
                  <span className="font-mono">{currency.symbol}{convertPrice(selectedProduct.transparentPricing.basePrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Exact Categorized Tax:</span>
                  <span className="font-mono">+{currency.symbol}{convertPrice(selectedProduct.transparentPricing.estimatedTax)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Campus Dorm Courier:</span>
                  <span>FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Hidden Checkout Surcharge:</span>
                  <span className="font-mono text-emerald-600">$0.00</span>
                </div>
                <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Guaranteed Total:</span>
                  <span className="font-mono text-indigo-700 text-lg">
                    {currency.symbol}{convertPrice(selectedProduct.transparentPricing.guaranteedTotal)}
                  </span>
                </div>
              </div>

              {/* Student Return Policy Guarantee */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{selectedProduct.returnPolicyDays}-Day 1-Click Automated Returns:</strong> Zero questions asked; instant refund credited to wallet upon scan.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  closeProductDetail();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                <ShoppingCart className="h-4 w-4 text-slate-500" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                <span>Direct Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
