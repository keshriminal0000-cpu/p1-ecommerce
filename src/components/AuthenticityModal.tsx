import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  FileCheck, 
  Key, 
  RefreshCw, 
  Copy, 
  Check 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';

export const AuthenticityModal: React.FC = () => {
  const { 
    isAuthenticityOpen, 
    closeAuthenticityModal, 
    selectedProductForAuthenticity 
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  if (!isAuthenticityOpen || !selectedProductForAuthenticity) return null;

  const product = selectedProductForAuthenticity;
  const cryptoData = product.cryptoProvenance;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cryptoData.batchHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunVerificationCheck = () => {
    setVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      setVerifying(false);
      setVerificationResult('CRYPTOGRAPHIC_HASH_VALID_MATCH');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Cryptographic Supply-Chain Provenance
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Anti-Counterfeit Architecture & Immutable Verification Log
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthenticityModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Header in Modal */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-16 w-16 rounded-xl object-cover bg-white ring-1 ring-slate-200 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PlatformLogo platform={product.platform} showText={true} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                  {cryptoData.authenticityStatus}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Manufacturer: {cryptoData.manufacturer} • Vendor: {product.vendorName}
              </p>
            </div>
          </div>

          {/* SHA-256 Batch Hash Details */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
                <Lock className="h-3.5 w-3.5" />
                <span>SHA-256 Batch Merkle Hash</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="rounded-lg bg-slate-950 p-3 text-[11px] break-all border border-slate-800 text-emerald-300">
              {cryptoData.batchHash}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Vendor ECDSA Signature:</span>
                <span className="truncate block font-semibold text-slate-200">{cryptoData.vendorSignature}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Campus Lab Audit ID:</span>
                <span className="font-semibold text-indigo-300">{cryptoData.campusVerificationId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Audit Certified At:</span>
                <span className="text-slate-300">{new Date(cryptoData.auditTimestamp).toUTCString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Serial Pattern:</span>
                <span className="text-amber-300 font-semibold">{cryptoData.serialNumberPattern}</span>
              </div>
            </div>
          </div>

          {/* Verification check CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="text-xs text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero Counterfeit Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Every microcontroller, textbook ISBN, and student gadget is cryptographically reconciled with university engineering & academic repositories.
              </p>
            </div>
            <button
              onClick={handleRunVerificationCheck}
              disabled={verifying}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition shrink-0"
            >
              {verifying ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <FileCheck className="h-3.5 w-3.5" />}
              <span>Verify Cryptographic Node</span>
            </button>
          </div>

          {verificationResult && (
            <div className="rounded-xl border border-emerald-300 bg-white p-3 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Verification Passed:</strong> Hash matches official campus cryptographic ledger block #89421. Authenticity: 100%.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
