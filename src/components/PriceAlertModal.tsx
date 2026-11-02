import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const PriceAlertModal: React.FC = () => {
  const { 
    isPriceAlertModalOpen, 
    closePriceAlertModal, 
    selectedProductForAlert, 
    priceAlerts, 
    setPriceAlert, 
    removePriceAlert, 
    simulatePriceDrop,
    currency 
  } = useStore();

  const product = selectedProductForAlert;
  const existingAlert = product ? priceAlerts.find(a => a.productId === product.id) : undefined;

  const currentPriceINR = product ? Number((product.price * 85.5).toFixed(2)) : 0;
  const [targetINR, setTargetINR] = useState<number>(0);
  const [selectedPercentage, setSelectedPercentage] = useState<number>(10);

  useEffect(() => {
    if (product) {
      if (existingAlert) {
        setTargetINR(existingAlert.targetPriceINR);
        setSelectedPercentage(existingAlert.discountTriggerPercent || 10);
      } else {
        const defaultTarget = Number((currentPriceINR * 0.90).toFixed(2));
        setTargetINR(defaultTarget);
        setSelectedPercentage(10);
      }
    }
  }, [product, existingAlert]);

  if (!isPriceAlertModalOpen || !product) return null;

  const handlePercentageClick = (pct: number) => {
    setSelectedPercentage(pct);
    const newTarget = Number((currentPriceINR * ((100 - pct) / 100)).toFixed(2));
    setTargetINR(newTarget);
  };

  const handleSaveAlert = () => {
    // Convert target INR back to USD for internal storage
    const targetUSD = Number((targetINR / 85.5).toFixed(2));
    setPriceAlert(product.id, targetUSD);
  };

  const handleSimulateDrop = () => {
    // Drop by selected percentage to trigger the alert immediately
    simulatePriceDrop(product.id, selectedPercentage || 15);
    closePriceAlertModal();
  };

  const formattedCurrent = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(currentPriceINR);
  const formattedTarget = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(targetINR);
  const savingsINR = Math.max(0, currentPriceINR - targetINR);
  const formattedSavings = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(savingsINR);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Set Student Price Drop Alert
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Get notified the instant the price drops below your target
              </p>
            </div>
          </div>
          <button
            onClick={closePriceAlertModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Snapshot */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-16 w-16 rounded-xl object-cover bg-white ring-1 ring-slate-200 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PlatformLogo platform={product.platform} showText={true} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded">
                  {product.category.replace('-', ' ')}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">Current Price:</span>
                <span className="text-sm font-mono font-extrabold text-slate-900">
                  {currency.symbol}{formattedCurrent}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Target Percentage Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Drop Alert Threshold
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageClick(pct)}
                  className={`rounded-xl py-2 px-2 text-xs font-bold transition flex flex-col items-center justify-center ${
                    selectedPercentage === pct
                      ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/30'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>-{pct}% Drop</span>
                  <span className={`text-[10px] font-normal ${selectedPercentage === pct ? 'text-amber-100' : 'text-slate-400'}`}>
                    ₹{((currentPriceINR * (100 - pct)) / 100).toFixed(0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Target Price Input (in ₹) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Custom Alert Price Target ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                {currency.symbol}
              </span>
              <input
                type="number"
                step="10"
                min="1"
                max={currentPriceINR}
                value={targetINR}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setTargetINR(val);
                  if (currentPriceINR > 0) {
                    const diff = Math.max(0, currentPriceINR - val);
                    setSelectedPercentage(Math.round((diff / currentPriceINR) * 100));
                  }
                }}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-4 text-sm font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Notify me when price drops below target.</span>
              <span className="font-semibold text-emerald-700">
                You save: {currency.symbol}{formattedSavings}
              </span>
            </p>
          </div>

          {/* Zero Spam Guarantee */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Zero Spam Policy:</strong> UniKart only alerts you when genuine price drops occur. No artificial marketing countdowns or misleading flash deals.
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              {existingAlert && (
                <button
                  type="button"
                  onClick={() => {
                    removePriceAlert(product.id);
                    closePriceAlertModal();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  title="Delete price alert"
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                  <span className="hidden sm:inline">Delete Alert</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveAlert}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition active:scale-98"
              >
                <Bell className="h-4 w-4" />
                <span>{existingAlert ? 'Update Price Alert' : `Set Alert for ${currency.symbol}${formattedTarget}`}</span>
              </button>
            </div>

            {/* Quick Simulation Button for user testing */}
            <button
              type="button"
              onClick={handleSimulateDrop}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/60 py-2 text-[11px] font-bold text-amber-900 hover:bg-amber-100 transition"
              title="Test the real-time notification engine"
            >
              <Zap className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
              <span>⚡ Test Feature: Simulate Price Drop Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
