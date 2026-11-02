import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  RotateCcw, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sparkles,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const OrderTrackingModal: React.FC = () => {
  const { 
    isOrderTrackingOpen, 
    closeOrderTracking, 
    orders, 
    selectedOrderId, 
    advanceOrderStatus, 
    cancelOrder, 
    requestReturn,
    currency 
  } = useStore();

  const [returnReason, setReturnReason] = useState('');
  const [showReturnPrompt, setShowReturnPrompt] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  if (!activeOrder) return null;

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

  const handleReturnSubmit = () => {
    requestReturn(activeOrder.id, returnReason || 'Course syllabus adjusted / duplicate item');
    setShowReturnPrompt(false);
  };

  const handleCancelSubmit = () => {
    cancelOrder(activeOrder.id, returnReason || 'Found required book in campus library');
    setShowCancelPrompt(false);
  };

  const isDelivered = activeOrder.status === 'DELIVERED';
  const isCancelled = activeOrder.status === 'CANCELLED';
  const isReturnApproved = activeOrder.status === 'RETURN_APPROVED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Order #{activeOrder.orderNumber}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isCancelled ? 'bg-rose-100 text-rose-800' :
                  isReturnApproved ? 'bg-amber-100 text-amber-800' :
                  isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} • Zero Hidden Fees
              </p>
            </div>
          </div>
          <button
            onClick={closeOrderTracking}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upstream Cross-Platform Synchronization Banner */}
          {activeOrder.upstreamPlatformSync && (
            <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <PlatformLogo platform={activeOrder.upstreamPlatformSync.platform} showText={true} />
                <span className="text-slate-700">
                  Fulfillment Synchronized with <strong>{activeOrder.upstreamPlatformSync.platform}</strong> ({activeOrder.upstreamPlatformSync.upstreamOrderId})
                </span>
              </div>
              <span className="flex items-center gap-1 font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full shadow-2xs text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Live Synced</span>
              </span>
            </div>
          )}

          {/* Order Lifecycle State Machine Visualizer */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Order Lifecycle State Machine
              </h3>
              {!isCancelled && !isDelivered && !isReturnApproved && (
                <button
                  onClick={() => advanceOrderStatus(activeOrder.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition"
                  title="Simulate advancing the order to the next step"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Simulate Next Step &gt;&gt;</span>
                </button>
              )}
            </div>

            <div className="relative border-l-2 border-indigo-200 pl-6 ml-2 space-y-6">
              {activeOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <div className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-bold ${
                    step.completed ? 'bg-emerald-600 ring-4 ring-emerald-100' :
                    step.current ? 'bg-indigo-600 ring-4 ring-indigo-100 animate-pulse' :
                    'bg-slate-300 ring-2 ring-white'
                  }`}>
                    {step.completed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary in this Order */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Ordered Student Items
            </h4>
            <div className="space-y-2">
              {activeOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-12 w-12 rounded-lg object-cover bg-slate-100 ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <PlatformLogo platform={item.product.platform} />
                        <span className="font-bold text-slate-900">{item.product.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Qty: {item.quantity} • Cryptographic Batch: {item.product.cryptoProvenance.batchHash.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-slate-900">
                    {currency.symbol}{convertPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dormitory Handover Address & Cryptographic Receipt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Campus Delivery Destination
              </span>
              <p className="font-semibold text-slate-900">{activeOrder.shippingAddress.fullName}</p>
              <p className="text-slate-600">{activeOrder.shippingAddress.campusDorm}</p>
              <p className="text-slate-500">{activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}</p>
              <p className="text-slate-500">Contact: {activeOrder.shippingAddress.phone}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Cryptographic Payment Proof
              </span>
              <p className="text-slate-600">Method: <strong>{activeOrder.paymentMethod.replace('_', ' ')}</strong></p>
              <p className="font-mono text-[11px] text-slate-500 truncate">Txn ID: {activeOrder.paymentTransactionId}</p>
              <p className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>HMAC-SHA256 Signature Verified</span>
              </p>
              <p className="text-indigo-700 font-extrabold text-sm pt-1">
                Total Paid: {currency.symbol}{convertPrice(activeOrder.total)} (Zero Hidden Surcharges)
              </p>
            </div>
          </div>

          {/* Return & Cancellation Action Bar */}
          {!isCancelled && (
            <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-emerald-600" />
                <span>UniKart Student Policy: <strong>Instant Automated Refunds</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Automated Return */}
                {isDelivered && !isReturnApproved && (
                  <button
                    onClick={() => setShowReturnPrompt(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
                    <span>1-Click Automated Return</span>
                  </button>
                )}

                {/* Instant Cancellation if not delivered */}
                {!isDelivered && (
                  <button
                    onClick={() => setShowCancelPrompt(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    <span>Cancel Order (100% Refund)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Automated Return Reason Prompt Modal */}
          {showReturnPrompt && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Automated 1-Click Return & Refund Request
              </h4>
              <p className="text-xs text-slate-600">
                No bureaucratic delays. Provide a brief reason and your return authorization (RMA) is generated instantly with dorm courier pickup.
              </p>
              <input
                type="text"
                placeholder="Reason (e.g. syllabus changed, duplicate purchase, changed mind)"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full rounded-xl border border-amber-300 bg-white p-2 text-xs focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReturnPrompt(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleReturnSubmit}
                  className="rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Confirm Automated Return
                </button>
              </div>
            </div>
          )}

          {/* Instant Cancel Reason Prompt Modal */}
          {showCancelPrompt && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/90 p-4 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Instant Order Cancellation
              </h4>
              <p className="text-xs text-slate-600">
                Cancel immediately prior to dorm handover. $0 fee deducted; full amount refunded to student wallet/card immediately.
              </p>
              <input
                type="text"
                placeholder="Cancellation reason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full rounded-xl border border-rose-300 bg-white p-2 text-xs focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelSubmit}
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Confirm Instant Cancellation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
