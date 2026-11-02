import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';

export const DarkPatternShieldBanner: React.FC = () => {
  const { isDarkPatternShieldActive, setIsLinkExtractorOpen } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isDarkPatternShieldActive) return null;

  return (
    <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-indigo-50/60 px-4 py-3 transition">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Zero Dark Pattern Promise
                </span>
                <span className="rounded bg-emerald-200/60 px-1.5 py-0.2 text-[10px] font-bold text-emerald-900">
                  Guaranteed Clean UX
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Upfront guaranteed totals on every item. No fake urgency countdowns, zero hidden checkout handling fees, verified student hardware, and 1-click automated returns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-white transition"
            >
              <span>{isExpanded ? 'Hide Architecture Breakdown' : 'Compare vs Legacy Platforms'}</span>
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => setIsLinkExtractorOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
              <span>Import External URL</span>
            </button>
          </div>
        </div>

        {/* Expandable Comparison Matrix */}
        {isExpanded && (
          <div className="mt-3.5 rounded-xl border border-emerald-200/80 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legacy Platforms (Amazon / Flipkart flaws) */}
              <div className="rounded-lg bg-rose-50/50 p-3.5 border border-rose-100">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wide mb-2">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <span>Legacy Platforms (Amazon / Flipkart / etc.)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Hidden Checkout Surcharges:</strong> Shipping, convenience fees, and handling charges added at the final review step.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Manufactured Panic & Urgency:</strong> Synthetic timers ("Ends in 04:12!") and fake stock scarcity counters ("Only 1 left!").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Counterfeit Hardware Risk:</strong> Commingled inventory puts clones, fake clone microcontrollers, and pirated textbooks into circulation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Bureaucratic Returns:</strong> Lengthy customer support hold times, chat bot dead-ends, and disputed restocking deductions.</span>
                  </li>
                </ul>
              </div>

              {/* UniKart Student Architecture Solution */}
              <div className="rounded-lg bg-emerald-50/50 p-3.5 border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>UniKart Student Platform Guarantee</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Guaranteed Upfront Pricing:</strong> Base Price + Exact Tax + $0 Free Student Delivery + $0 Fee = Final Price on listing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Zero Deceptive Triggers:</strong> Transparent inventory metrics, clean design, zero auto-checked warranty subscriptions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Cryptographic Authenticity:</strong> Every Arduino, Raspberry Pi, textbook, or tool carries an immutable SHA-256 batch hash and lab audit.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Automated 1-Click Returns & Instant Refund:</strong> Zero bureaucratic loops; return bot approves immediately and credits your wallet/card.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
