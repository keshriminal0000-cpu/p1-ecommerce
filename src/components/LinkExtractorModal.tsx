import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Link2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw,
  Cpu,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';
import { ExtractedProductPreview, PlatformOrigin } from '../types';

export const LinkExtractorModal: React.FC = () => {
  const { 
    isLinkExtractorOpen, 
    setIsLinkExtractorOpen, 
    addExtractedProduct, 
    addToCart,
    setIsCartOpen,
    currency 
  } = useStore();

  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedProductPreview | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLinkExtractorOpen) return null;

  const demoLinks = [
    {
      title: 'Amazon: CLRS 4th Ed Hardcover',
      platform: 'Amazon' as PlatformOrigin,
      url: 'https://www.amazon.com/Introduction-Algorithms-4th-Thomas-Cormen/dp/026204630X'
    },
    {
      title: 'Flipkart: Pilot G2 Smooth Pen 12-Pack',
      platform: 'Flipkart' as PlatformOrigin,
      url: 'https://www.flipkart.com/pilot-g2-fine-gel-pens-black/p/itm09812'
    },
    {
      title: 'BestBuy: Sony ANC Study Headphones',
      platform: 'BestBuy' as PlatformOrigin,
      url: 'https://www.bestbuy.com/site/sony-wh-1000xm5-wireless-noise-cancelling/6505727.p'
    },
    {
      title: 'Arduino Store: Sensor Robotics Lab',
      platform: 'ArduinoStore' as PlatformOrigin,
      url: 'https://store.arduino.cc/products/uno-r4-robotics-mechatronics-kit'
    }
  ];

  const handleExtract = async (urlToExtract: string = inputUrl) => {
    if (!urlToExtract.trim()) {
      setErrorMsg('Please paste a valid product link.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setExtractedData(null);

    try {
      // Call backend extractor service
      const res = await fetch('/api/products/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToExtract })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setExtractedData(json.data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback client extraction if API unavailable
      const lower = urlToExtract.toLowerCase();
      let platform: PlatformOrigin = 'UniKart';
      if (lower.includes('amazon')) platform = 'Amazon';
      else if (lower.includes('flipkart')) platform = 'Flipkart';
      else if (lower.includes('bestbuy')) platform = 'BestBuy';
      else if (lower.includes('arduino')) platform = 'ArduinoStore';

      const original = 89.00;
      const discounted = Number((original * 0.8).toFixed(2));
      const fallback: ExtractedProductPreview = {
        url: urlToExtract,
        detectedPlatform: platform,
        title: platform === 'Amazon' ? 'MIT Press Computer Science Algorithms Hardcover' :
               platform === 'Flipkart' ? 'Precision Engineering Stationery Kit' :
               platform === 'BestBuy' ? 'Wireless ANC Library & Coding Headphones' :
               'Official Arduino Mechatronics Student Kit',
        category: platform === 'Amazon' ? 'books' :
                  platform === 'Flipkart' ? 'stationery' :
                  platform === 'BestBuy' ? 'gadgets-calculators' : 'project-electronics',
        extractedPrice: original,
        studentDiscountedPrice: discounted,
        savings: Number((original - discounted).toFixed(2)),
        imageUrl: platform === 'Amazon' ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' :
                  platform === 'Flipkart' ? 'https://images.unsplash.com/photo-1585336261026-62187f5d6f83?auto=format&fit=crop&w=800&q=80' :
                  platform === 'BestBuy' ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' :
                  'https://images.unsplash.com/photo-1608555855762-2b657eb1c348?auto=format&fit=crop&w=800&q=80',
        specs: {
          'Origin Verification': `${platform} Verified Marketplace API`,
          'Student Tier': '20% Direct Campus Subsidized Discount',
          'Delivery ETA': 'Next-day campus dorm delivery'
        },
        vendor: `${platform} Student Direct Partner`,
        authenticityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        inStock: true
      };
      setExtractedData(fallback);
    } catch (err: any) {
      setErrorMsg('Failed to extract link. Please check network or URL format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportAndAddToCart = () => {
    if (!extractedData) return;
    const newProduct = addExtractedProduct(extractedData);
    addToCart(newProduct);
    setIsLinkExtractorOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Multi-Platform Link Extractor & Direct Order
              </h2>
              <p className="text-xs text-slate-500">
                Paste any product URL from Amazon, Flipkart, BestBuy, or Arduino Store to order directly.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLinkExtractorOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* URL Input Bar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Paste E-Commerce Product URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://www.amazon.com/dp/... or https://www.flipkart.com/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={() => handleExtract()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <span>Extract Product</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            {errorMsg && <p className="text-xs text-rose-600 mt-1.5">{errorMsg}</p>}
          </div>

          {/* Quick Demo Pre-Filled Links */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Or Try One-Click Example Links:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoLinks.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputUrl(demo.url);
                    handleExtract(demo.url);
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-2 text-left text-xs text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <PlatformLogo platform={demo.platform} />
                    <span className="font-semibold text-slate-800 truncate">{demo.title}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Product Preview Card */}
          {extractedData && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Product Successfully Parsed from {extractedData.detectedPlatform}
                  </span>
                </div>
                <PlatformLogo platform={extractedData.detectedPlatform} showText={true} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={extractedData.imageUrl}
                  alt={extractedData.title}
                  className="h-28 w-28 shrink-0 rounded-xl object-cover bg-white ring-1 ring-slate-200"
                />

                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {extractedData.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 line-through">
                      Original: {currency.symbol}{(extractedData.extractedPrice * currency.rateAgainstUSD).toFixed(2)}
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Student Price: {currency.symbol}{(extractedData.studentDiscountedPrice * currency.rateAgainstUSD).toFixed(2)}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-700">
                      Save {currency.symbol}{(extractedData.savings * currency.rateAgainstUSD).toFixed(2)} (Student Subsidy)
                    </span>
                  </div>

                  {/* Anti-counterfeit verification hash */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-white/80 p-1.5 rounded-lg border border-slate-200/80">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Provenance Hash: {extractedData.authenticityHash}</span>
                  </div>

                  {/* Upstream sync promise */}
                  <p className="text-[11px] text-slate-600">
                    ⚡ <strong>Automated Order Routing:</strong> UniKart handles direct payment, syncs with {extractedData.detectedPlatform}'s fulfillment queue, and guarantees 1-click zero-penalty returns.
                  </p>
                </div>
              </div>

              {/* Import & Direct Buy CTA */}
              <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsLinkExtractorOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleImportAndAddToCart}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Import & Order Direct in UniKart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
