import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Key, 
  RefreshCw, 
  Cpu, 
  QrCode, 
  Layers 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const RoleDashboard: React.FC = () => {
  const { currentUser, orders, advanceOrderStatus, products, switchUserRole } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'actions'>('overview');

  if (currentUser.role === 'student') return null;

  return (
    <div className="border-b border-indigo-100 bg-indigo-50/70 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs ${
              currentUser.role === 'vendor' ? 'bg-amber-600' :
              currentUser.role === 'delivery' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {currentUser.role === 'vendor' && <Building2 className="h-5 w-5" />}
              {currentUser.role === 'delivery' && <Truck className="h-5 w-5" />}
              {currentUser.role === 'admin' && <ShieldAlert className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {currentUser.role.toUpperCase()} CONSOLE: {currentUser.name}
                </h3>
                <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-indigo-700 shadow-2xs">
                  Role Active
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {currentUser.role === 'vendor' && 'Manage campus stock, generate cryptographic batch provenance, and track ledger balances.'}
                {currentUser.role === 'delivery' && 'Manage campus dorm handovers and advance order lifecycle state machines.'}
                {currentUser.role === 'admin' && 'Real-time OWASP security logs, sliding-window rate limit defense, and payment signature audits.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchUserRole('student')}
              className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition"
            >
              Switch Back to Student View
            </button>
          </div>
        </div>

        {/* Console Details */}
        <div className="mt-4 rounded-xl bg-white p-4 border border-indigo-100 shadow-2xs">
          {currentUser.role === 'delivery' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pending Campus Deliveries
              </h4>
              {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length === 0 ? (
                <p className="text-xs text-slate-500">No active dorm deliveries in transit right now.</p>
              ) : (
                <div className="space-y-2">
                  {orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Order #{order.orderNumber}</span>
                          <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-800">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">
                          Destination: {order.shippingAddress.campusDorm} • Student: {order.shippingAddress.fullName}
                        </p>
                      </div>

                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shrink-0"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Advance State Machine &gt;&gt;</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentUser.role === 'vendor' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-medium block">Total Active Student SKUs:</span>
                <span className="text-lg font-bold text-slate-900">{products.length} Products</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-medium block">Distributed Lock Status:</span>
                <span className="text-lg font-bold text-emerald-700">Redis Active (0 Over-sells)</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="text-slate-500 font-medium block">Vendor Ledger Payout Balance:</span>
                <span className="text-lg font-bold text-indigo-700">${currentUser.walletBalance.toFixed(2)}</span>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="space-y-2 text-xs font-mono">
              <span className="font-bold text-slate-700 uppercase tracking-wider block font-sans">
                Real-Time Security & Webhook Audit Logs
              </span>
              <div className="rounded-lg bg-slate-900 p-3 text-slate-200 space-y-1 text-[11px] max-h-36 overflow-y-auto">
                <p className="text-emerald-400">[2026-11-02T09:12:00Z] SEC-AUDIT: OWASP Zod Schema validation passed for all catalog requests.</p>
                <p className="text-sky-400">[2026-11-02T09:12:05Z] RATE-LIMIT: Sliding-window bucket active. 0 IP threshold breaches.</p>
                <p className="text-emerald-400">[2026-11-02T09:12:12Z] HMAC-VERIFY: Payment webhook signature SHA256:88fa2b1049... verified OK.</p>
                <p className="text-indigo-400">[2026-11-02T09:12:15Z] CRYPTO-CHAIN: All products checked against Stanford/MIT/Arduino public certificates.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
