import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  ShoppingCart, 
  Heart, 
  Bell, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Check, 
  TrendingUp,
  Tag,
  GraduationCap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product, ProductCategory } from '../types';
import { PlatformLogo } from './PlatformLogo';

interface SearchBarWithRelatedProps {
  onOpenMultiPlatformSearch?: () => void;
  className?: string;
  placeholder?: string;
  isMobileModal?: boolean;
}

export const SearchBarWithRelated: React.FC<SearchBarWithRelatedProps> = ({
  onOpenMultiPlatformSearch,
  className = '',
  placeholder = 'Search Amazon, Flipkart, BestBuy (e.g. ESP32, Casio, CLRS)...',
  isMobileModal = false
}) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    currency,
    addToCart,
    openProductDetail,
    toggleWishlist,
    isInWishlist,
    openPriceAlertModal,
    hasPriceAlert,
    setCategory
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format currency
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

  // Student trending keyword suggestions
  const popularKeywords = [
    { label: 'Arduino Uno R4', category: 'project-electronics' as ProductCategory },
    { label: 'ESP32 WiFi+BLE', category: 'project-electronics' as ProductCategory },
    { label: 'CLRS Algorithms', category: 'books' as ProductCategory },
    { label: 'Casio FX-991CW', category: 'gadgets-calculators' as ProductCategory },
    { label: 'Rotring 600 Pen', category: 'stationery' as ProductCategory },
    { label: 'Raspberry Pi 5', category: 'project-electronics' as ProductCategory },
    { label: 'Campus Laptop Bag', category: 'backpacks-bags' as ProductCategory },
  ];

  // Calculate direct matching and related products
  const { directMatches, relatedProducts, matchedCategories } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      // If no query, show top featured / student essential recommendations
      return {
        directMatches: products.slice(0, 4),
        relatedProducts: products.slice(4, 8),
        matchedCategories: []
      };
    }

    // Direct text matches
    const direct: Product[] = [];
    const directIds = new Set<string>();
    const foundCategories = new Set<ProductCategory>();

    products.forEach((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSub = p.subtitle.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchPlatform = p.platform.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      const matchDesc = p.description.toLowerCase().includes(q);

      if (matchTitle || matchSub || matchCat || matchPlatform || matchTags || matchDesc) {
        direct.push(p);
        directIds.add(p.id);
        foundCategories.add(p.category);
      }
    });

    // Related products: Products in the same category or sharing tags with direct matches
    const related: Product[] = [];
    products.forEach((p) => {
      if (directIds.has(p.id)) return;

      const sameCategory = foundCategories.has(p.category);
      const hasSharedTag = direct.some(d => d.tags.some(t => p.tags.includes(t)));

      if (sameCategory || hasSharedTag) {
        related.push(p);
      }
    });

    // If still no related items, fallback to top student picks
    if (related.length === 0 && direct.length === 0) {
      const genericSuggestions = products.slice(0, 5);
      return {
        directMatches: [],
        relatedProducts: genericSuggestions,
        matchedCategories: Array.from(foundCategories)
      };
    }

    return {
      directMatches: direct.slice(0, 5),
      relatedProducts: related.slice(0, 5),
      matchedCategories: Array.from(foundCategories)
    };
  }, [products, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    setIsOpen(false);
    openProductDetail(product);
  };

  const handleSearchChipClick = (keyword: string, category?: ProductCategory) => {
    setSearchQuery(keyword);
    if (category) {
      setCategory(category);
    }
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (onOpenMultiPlatformSearch && searchQuery.trim()) {
        setIsOpen(false);
        onOpenMultiPlatformSearch();
      }
    }
  };

  const totalResultsCount = directMatches.length + relatedProducts.length;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-28 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition shadow-2xs"
        />

        {/* Right Action Icons in Input */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchQuery && (
            <button 
              type="button"
              onClick={handleClear}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {onOpenMultiPlatformSearch && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenMultiPlatformSearch();
              }}
              className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition ring-1 ring-indigo-200 shrink-0"
              title="Check where this item is available across Amazon, Flipkart, Best Buy"
            >
              Where Available?
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete & Related Products Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-slate-900/10 animate-in fade-in zoom-in-95 max-h-[80vh] overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                {searchQuery.trim() ? (
                  <>
                    Related Student Products for <span className="text-indigo-600 font-extrabold">"{searchQuery}"</span>
                  </>
                ) : (
                  'Recommended Student Essentials'
                )}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {totalResultsCount} items
            </span>
          </div>

          {/* Quick Search Chips */}
          <div className="py-2.5 px-1 border-b border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1.5">
              <TrendingUp className="h-3 w-3 text-indigo-500" />
              <span>Popular Student Searches:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularKeywords.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSearchChipClick(item.label, item.category)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    searchQuery.toLowerCase() === item.label.toLowerCase()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Matching Products Section */}
          {directMatches.length > 0 && (
            <div className="py-2 space-y-1">
              <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  In Stock & Verified
                </span>
              </div>

              <div className="space-y-1">
                {directMatches.map((product) => {
                  const inWish = isInWishlist(product.id);
                  const inAlert = hasPriceAlert(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-indigo-50/60 cursor-pointer"
                      onClick={() => handleSelectProduct(product)}
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover bg-white ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <PlatformLogo platform={product.platform} showText={false} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                              {product.category.replace('-', ' ')}
                            </span>
                            {product.studentDiscountPercent > 0 && (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800 shrink-0">
                                -{product.studentDiscountPercent}%
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition truncate">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono font-extrabold text-indigo-700">
                              {currency.symbol}{formatPrice(product.price)}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through font-mono">
                              {currency.symbol}{formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              • Zero hidden fees
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className={`rounded-lg p-1.5 transition ${
                            inWish 
                              ? 'bg-rose-50 text-rose-600' 
                              : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'
                          }`}
                          title={inWish ? 'Saved in Wishlist' : 'Save to Student Wishlist'}
                        >
                          <Heart className={`h-3.5 w-3.5 ${inWish ? 'fill-rose-500' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openPriceAlertModal(product)}
                          className={`rounded-lg p-1.5 transition ${
                            inAlert
                              ? 'bg-amber-50 text-amber-600'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500'
                          }`}
                          title="Set Price Drop Alert"
                        >
                          <Bell className={`h-3.5 w-3.5 ${inAlert ? 'fill-amber-500' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-indigo-700 transition active:scale-95"
                          title="Add to Student Cart"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related / Complementary Products Section */}
          {relatedProducts.length > 0 && (
            <div className="py-2 border-t border-slate-100 space-y-1">
              <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Frequently Bought Together / Related Essentials</span>
                <span className="text-[10px] text-indigo-600 font-medium">
                  Student Recommended
                </span>
              </div>

              <div className="space-y-1">
                {relatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-10 w-10 rounded-lg object-cover bg-white ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                            {product.platform}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {product.subtitle}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition truncate">
                          {product.title}
                        </h5>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {currency.symbol}{formatPrice(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                        title="Add related item to cart"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Navigation within Dropdown */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all {totalResultsCount} results in main catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {onOpenMultiPlatformSearch && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenMultiPlatformSearch();
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>Check live availability on Amazon/Flipkart</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
