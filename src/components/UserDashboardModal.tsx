import React from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  GraduationCap, 
  Wallet, 
  Package, 
  Trash2, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingCart, 
  Sparkles,
  ShieldCheck,
  Building,
  TrendingDown
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const UserDashboardModal: React.FC = () => {
  const { 
    currentUser, 
    isUserDashboardOpen, 
    setIsUserDashboardOpen, 
    activeDashboardTab, 
    setActiveDashboardTab, 
    priceAlerts, 
    products, 
    removePriceAlert, 
    simulatePriceDrop, 
    openPriceAlertModal, 
    addToCart, 
    setIsCartOpen,
    orders,
    openOrderTracking,
    currency 
  } = useStore();

  if (!isUserDashboardOpen) return null;

  const formatPrice = (usd: number) => {
    const val = usd * currency.rateAgainstUSD;
    if (currency.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(val);
    }
    return val.toFixed(2);
  };

  const activeAlertsWithProducts = priceAlerts.map(alert => {
    const product = products.find(p => p.id === alert.productId);
    return { alert, product };
  }).filter(item => item.product !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  {currentUser.name}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {currentUser.verifiedStudent ? 'Verified Student (.edu)' : 'Student'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser.universityName || 'Stanford University'} • ID: {currentUser.studentId || 'STU-2026-8894'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUserDashboardOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveDashboardTab('alerts')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeDashboardTab === 'alerts'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Manage Price Alerts</span>
            {priceAlerts.length > 0 && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-extrabold">
                {priceAlerts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveDashboardTab('profile')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeDashboardTab === 'profile'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Profile</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('orders')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeDashboardTab === 'orders'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>My Orders ({orders.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {/* TAB 1: MANAGE PRICE ALERTS */}
          {activeDashboardTab === 'alerts' && (
            <div className="space-y-5">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <BellRing className="h-4 w-4 text-amber-600" />
                    <span>Active Alerts</span>
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">
                    {priceAlerts.length} Products
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Monitored for campus drops</p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                    <span>Triggered Drops</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {priceAlerts.filter(a => a.notified).length} Triggered
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Price target reached</p>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-3.5">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>Anti-Spam Guarantee</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Zero Synthetic Deals
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Strict target enforcement</p>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Active Student Price Monitors
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Auto-saved to your student account
                  </span>
                </div>

                {activeAlertsWithProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Bell className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No active price drop alerts</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Click the bell icon on any textbook, Arduino kit, or laptop in your catalog or wishlist to get notified when the price drops!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAlertsWithProducts.map(({ alert, product }) => {
                      if (!product) return null;
                      const isPriceMet = product.price <= alert.targetPriceUSD || alert.notified;

                      return (
                        <div 
                          key={alert.id}
                          className={`rounded-2xl border p-4 transition ${
                            isPriceMet
                              ? 'border-emerald-200 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                              : 'border-slate-200/80 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Product Info */}
                            <div className="flex items-center gap-3.5">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="h-16 w-16 rounded-xl object-cover bg-white ring-1 ring-slate-200 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <PlatformLogo platform={product.platform} showText={true} />
                                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                    isPriceMet ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {isPriceMet ? '🎉 Price Drop Triggered!' : `Alert at -${alert.discountTriggerPercent}%`}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</h4>

                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                                  <span className="text-slate-500">
                                    Current: <strong className="text-slate-900 font-mono">{currency.symbol}{formatPrice(product.price)}</strong>
                                  </span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-amber-700 font-semibold">
                                    Target: <strong className="font-mono">{currency.symbol}{formatPrice(alert.targetPriceUSD)}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {/* Simulate Price Drop Button for immediate user test */}
                              <button
                                onClick={() => simulatePriceDrop(product.id, alert.discountTriggerPercent || 15)}
                                className="inline-flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-2xs"
                                title="Simulate dropping this item price below your target"
                              >
                                <Zap className="h-3.5 w-3.5 text-amber-600" />
                                <span>Simulate Drop</span>
                              </button>

                              <button
                                onClick={() => openPriceAlertModal(product)}
                                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                              >
                                Edit Target
                              </button>

                              <button
                                onClick={() => {
                                  addToCart(product);
                                  setIsUserDashboardOpen(false);
                                  setIsCartOpen(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 transition"
                              >
                                <ShoppingCart className="h-3 w-3" />
                                <span>Buy Now</span>
                              </button>

                              <button
                                onClick={() => removePriceAlert(product.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                                title="Remove price alert"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT PROFILE */}
          {activeDashboardTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    Academic Verification Status
                  </span>
                  <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified Stanford .edu</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Student ID Number</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{currentUser.studentId}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Campus Wallet Balance</span>
                    <span className="font-bold text-indigo-700 font-mono text-sm">
                      {currency.symbol}{formatPrice(currentUser.walletBalance)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-indigo-600" />
                  <span>Dormitory Delivery Address</span>
                </span>
                <p className="font-semibold text-slate-900">Crothers Memorial Hall, Room 314-B</p>
                <p className="text-slate-600">450 Jane Stanford Way, Stanford, CA 94305</p>
                <p className="text-slate-500">Contact phone: +1 (650) 555-0199</p>
              </div>
            </div>
          )}

          {/* TAB 3: MY ORDERS */}
          {activeDashboardTab === 'orders' && (
            <div className="space-y-3 text-xs">
              {orders.length === 0 ? (
                <p className="text-slate-500 py-6 text-center">No previous orders placed yet.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Order #{order.orderNumber}</span>
                        <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 uppercase">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        Total: <strong className="text-slate-900 font-mono">{currency.symbol}{formatPrice(order.total)}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserDashboardOpen(false);
                        openOrderTracking(order.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                    >
                      <span>Track Order Lifecycle</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
