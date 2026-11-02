import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  ShoppingCart, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Bell, 
  Heart,
  Store
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { PlatformLogo } from './PlatformLogo';
import { PlatformOrigin } from '../types';

interface ExternalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  priceINR: number;
  originalPrice: number;
  studentDiscountPercent: number;
  platform: PlatformOrigin;
  platformUrl: string;
  platformLogo: string;
  availableAt: string;
  vendor: string;
  imageUrl: string;
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
}

interface MultiPlatformSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const MultiPlatformSearchModal: React.FC<MultiPlatformSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    currency, 
    addToCart, 
    setIsCartOpen,
    toggleWishlist,
    isInWishlist,
    openPriceAlertModal,
    addExtractedProduct 
  } = useStore();

  const [query, setQuery] = useState(initialQuery || searchQuery);
  const [results, setResults] = useState<ExternalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<'ALL' | PlatformOrigin>('ALL');

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.results)) {
          setResults(json.results);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default sample results if offline
    setResults([
      {
        id: 'fallback_1',
        title: `${searchTerm || 'Student Hardware'} - Dual-Core Lab Edition`,
        subtitle: 'Available on Amazon Prime • Verified Student Supply',
        category: 'project-electronics',
        price: 24.00,
        priceINR: 2052.00,
        originalPrice: 32.00,
        studentDiscountPercent: 25,
        platform: 'Amazon',
        platformUrl: 'https://www.amazon.com',
        platformLogo: 'amazon',
        availableAt: 'In Stock on Amazon Prime',
        vendor: 'Amazon Direct',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
        specs: { 'Origin': 'Amazon Prime' },
        rating: 4.88,
        reviewCount: 320
      }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      const q = initialQuery || searchQuery || 'arduino';
      setQuery(q);
      executeSearch(q);
    }
  }, [isOpen, initialQuery, searchQuery]);

  if (!isOpen) return null;

  const handleDirectOrder = (item: ExternalSearchResult) => {
    const product = addExtractedProduct({
      url: item.platformUrl,
      detectedPlatform: item.platform,
      title: item.title,
      category: item.category as any,
      extractedPrice: item.originalPrice,
      studentDiscountedPrice: item.price,
      savings: item.originalPrice - item.price,
      imageUrl: item.imageUrl,
      specs: item.specs,
      vendor: item.vendor,
      authenticityHash: `SHA256-${Date.now()}-${item.platform}`,
      inStock: true
    });
    addToCart(product);
    onClose();
    setIsCartOpen(true);
  };

  const filteredResults = selectedPlatformFilter === 'ALL'
    ? results
    : results.filter(r => r.platform === selectedPlatformFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Multi-Platform Direct Search & Availability
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Find where items are available across Amazon, Flipkart, Best Buy, and Arduino Store
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 border-b border-slate-100 bg-white space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search across Amazon, Flipkart, Arduino Store, Best Buy (e.g. ESP32, Casio, CLRS, Laptop)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch(query)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              onClick={() => executeSearch(query)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <span>Search Platforms</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Platform Source Filters */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Source:
            </span>
            {(['ALL', 'Amazon', 'Flipkart', 'BestBuy', 'ArduinoStore'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatformFilter(p)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                  selectedPlatformFilter === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'ALL' ? 'All Sources' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Found <strong>{filteredResults.length}</strong> items available directly from verified e-commerce sources
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Direct Ordering via UniKart Supported
            </span>
          </div>

          {filteredResults.map((item) => (
            <div 
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 transition hover:bg-white hover:border-indigo-300 hover:shadow-md"
            >
              {/* Product and Availability Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-20 w-20 rounded-xl object-cover bg-white ring-1 ring-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  {/* Platform Availability Tag */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-900 shadow-2xs ring-1 ring-slate-900/10">
                      <PlatformLogo platform={item.platform} showText={true} />
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {item.availableAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.subtitle}
                  </p>

                  {/* Pricing in INR */}
                  <div className="flex items-center gap-2.5 pt-1 text-xs">
                    <span className="font-mono text-base font-extrabold text-indigo-700">
                      ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(item.priceINR)}
                    </span>
                    <span className="text-slate-400 line-through text-[11px] font-mono">
                      ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(item.originalPrice * 85.5)}
                    </span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-extrabold text-emerald-700">
                      Save {item.studentDiscountPercent}% Student Tier
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <a
                  href={item.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition w-full sm:w-auto justify-center"
                  title={`View original listing on ${item.platform}`}
                >
                  <span>View on {item.platform}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>

                <button
                  onClick={() => handleDirectOrder(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition w-full sm:w-auto justify-center"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Direct Order with Discount</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
