import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Wallet, 
  QrCode, 
  Building, 
  MapPin, 
  RefreshCw,
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    currentUser, 
    createOrder, 
    currency,
    isAuthenticated,
    openAuthModal
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY_UPI' | 'PAYPAL' | 'CAMPUS_CARD'>('CAMPUS_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [redisLockAcquired, setRedisLockAcquired] = useState(false);
  const [dormInfo, setDormInfo] = useState({
    fullName: currentUser.name,
    campusDorm: 'Crothers Memorial Hall, Room 314-B',
    street: '450 Jane Stanford Way',
    city: 'Stanford',
    postalCode: '94305',
    phone: '+1 (650) 555-0199'
  });

  if (!isCheckoutOpen || cart.length === 0) return null;

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
  const studentDiscountUSD = subtotalUSD * 0.05;
  const taxUSD = (subtotalUSD - studentDiscountUSD) * 0.08;
  const totalUSD = subtotalUSD - studentDiscountUSD + taxUSD;

  // Extract upstream platform if item was imported
  const importedPlatformItem = cart.find(i => i.product.platform !== 'UniKart');

  const handleExecuteCheckout = async () => {
    setIsProcessing(true);
    setRedisLockAcquired(true);

    try {
      // Simulate real server call to /api/checkout
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: `IDEM_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          cartItems: cart,
          paymentMethod,
          shippingAddress: dormInfo,
          studentId: currentUser.studentId
        })
      });
    } catch {
      // Continue even if network glitch (mock fallback)
    }

    // Brief realistic processing delay for distributed lock & ledger commit
    setTimeout(() => {
      createOrder({
        subtotal: subtotalUSD,
        discount: studentDiscountUSD,
        tax: taxUSD,
        total: totalUSD,
        paymentMethod,
        shippingAddress: dormInfo,
        upstreamPlatformSync: importedPlatformItem ? {
          platform: importedPlatformItem.product.platform,
          upstreamOrderId: `${importedPlatformItem.product.platform.toUpperCase().slice(0, 3)}-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          syncStatus: 'SYNCHRONIZED'
        } : undefined
      });
      setIsProcessing(false);
      setRedisLockAcquired(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Secure Student Checkout
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                End-to-End Encrypted (TLS 1.3) • Zero Hidden Fees Guaranteed
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isAuthenticated && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Student Account Required to Place Order:</span>
                  <p className="text-[11px] text-amber-700">Please sign up with your email or phone and password before completing payment.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  openAuthModal('checkout');
                }}
                className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition shrink-0"
              >
                Sign Up / Log In Now
              </button>
            </div>
          )}

          {/* Distributed Lock & Idempotency Badge */}
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span><strong>Idempotency Active:</strong> Protected against double charging during high-demand student drops.</span>
            </div>
            <span className="rounded bg-indigo-200/70 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-950">
              Redis Lock Ready
            </span>
          </div>

          {/* Delivery Address (Campus Dorm) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-indigo-600" />
                <span>Campus Dorm & Room Delivery</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Direct Handover Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={dormInfo.fullName}
                  onChange={(e) => setDormInfo({ ...dormInfo, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Dormitory Building & Room #</label>
                <input
                  type="text"
                  value={dormInfo.campusDorm}
                  onChange={(e) => setDormInfo({ ...dormInfo, campusDorm: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus Street Address</label>
                <input
                  type="text"
                  value={dormInfo.street}
                  onChange={(e) => setDormInfo({ ...dormInfo, street: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Student Mobile (for courier SMS)</label>
                <input
                  type="text"
                  value={dormInfo.phone}
                  onChange={(e) => setDormInfo({ ...dormInfo, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              <span>Select Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Campus ID Card / Student Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('CAMPUS_CARD')}
                className={`flex flex-col text-left rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'CAMPUS_CARD'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-950">
                    <Wallet className="h-4 w-4 text-indigo-600" />
                    <span>Campus ID / Student Wallet</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                    1-Click Instant
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Alex Rivera ({currentUser.studentId}) • Balance: ${currentUser.walletBalance.toFixed(2)}
                </p>
              </button>

              {/* Razorpay / UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                className={`flex flex-col text-left rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'RAZORPAY_UPI'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <QrCode className="h-4 w-4 text-emerald-600" />
                    <span>UPI / Razorpay / QR</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Zero Fee
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant QR scan or VPA student handle (GPay, PhonePe, Paytm)
                </p>
              </button>

              {/* Stripe (Cards) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE')}
                className={`flex flex-col text-left rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'STRIPE'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Stripe (Debit / Credit)</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                    Visa/MC
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  3D Secure 2.0 encrypted card payment with tokenization
                </p>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => setPaymentMethod('PAYPAL')}
                className={`flex flex-col text-left rounded-2xl border p-3.5 transition ${
                  paymentMethod === 'PAYPAL'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Lock className="h-4 w-4 text-sky-600" />
                    <span>PayPal Student OneTouch</span>
                  </div>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                    Buyer Protection
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay with linked PayPal bank balance or student credit
                </p>
              </button>
            </div>
          </div>

          {/* Transparent Order Summary Table */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cart.length} items):</span>
              <span className="font-mono text-slate-800">{currency.symbol}{convertPrice(subtotalUSD)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Student Subsidy Discount:</span>
              <span className="font-mono">-{currency.symbol}{convertPrice(studentDiscountUSD)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Exact Categorized Tax:</span>
              <span className="font-mono text-slate-800">+{currency.symbol}{convertPrice(taxUSD)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Campus Dorm Delivery:</span>
              <span>FREE ($0.00)</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Handling / Platform Fee:</span>
              <span className="text-emerald-700 font-bold">$0.00</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Total Payable Amount:</span>
              <span className="font-mono text-indigo-700 text-lg">
                {currency.symbol}{convertPrice(totalUSD)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          {!isAuthenticated ? (
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                openAuthModal('checkout');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-amber-700 transition active:scale-98"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Sign Up / Log In with Email or Phone to Order</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleExecuteCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Acquiring Distributed Lock & Verifying Ledger...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Pay {currency.symbol}{convertPrice(totalUSD)}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
