import React, { useMemo } from 'react';
import { useStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { DarkPatternShieldBanner } from './components/DarkPatternShieldBanner';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LinkExtractorModal } from './components/LinkExtractorModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthenticityModal } from './components/AuthenticityModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { TestingSuiteModal } from './components/TestingSuiteModal';
import { DockerDeploymentModal } from './components/DockerDeploymentModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { RoleDashboard } from './components/RoleDashboard';
import { PlatformLogo } from './components/PlatformLogo';
import { ProductCategory, PlatformOrigin } from './types';
import { 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  Check, 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Cpu, 
  Calculator, 
  Laptop, 
  Smartphone, 
  Backpack, 
  Home, 
  CheckCircle2, 
  RotateCcw,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const {
    products,
    selectedCategory,
    setCategory,
    selectedPlatform,
    setSelectedPlatform,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    verifiedOnly,
    setVerifiedOnly,
    setIsLinkExtractorOpen,
    notification,
    setIsArchitectureOpen,
    setIsTestingSuiteOpen,
    setIsDockerOpen
  } = useStore();

  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Student Essentials', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: 'project-electronics', label: 'Project Electronics & Robotics', icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: 'books', label: 'Textbooks & Engineering Study', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { id: 'stationery', label: 'Precision Pens & Drafting', icon: <PenTool className="h-3.5 w-3.5" /> },
    { id: 'gadgets-calculators', label: 'Calculators & STEM Gadgets', icon: <Calculator className="h-3.5 w-3.5" /> },
    { id: 'laptops-tablets', label: 'Laptops & Tablets', icon: <Laptop className="h-3.5 w-3.5" /> },
    { id: 'mobiles-wearables', label: 'Mobiles & Smartwatches', icon: <Smartphone className="h-3.5 w-3.5" /> },
    { id: 'backpacks-bags', label: 'Campus Laptop Backpacks', icon: <Backpack className="h-3.5 w-3.5" /> },
    { id: 'dorm-essentials', label: 'Dorm & Desk Lighting', icon: <Home className="h-3.5 w-3.5" /> },
  ];

  const platforms: { id: PlatformOrigin | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Platforms' },
    { id: 'UniKart', label: 'UniKart Direct' },
    { id: 'Amazon', label: 'Amazon' },
    { id: 'Flipkart', label: 'Flipkart' },
    { id: 'BestBuy', label: 'Best Buy' },
    { id: 'ArduinoStore', label: 'Arduino Store' },
    { id: 'CampusStore', label: 'Campus Store' },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Platform filter
      if (selectedPlatform !== 'ALL' && p.platform !== selectedPlatform) {
        return false;
      }
      // Verified only filter
      if (verifiedOnly && !p.vendorVerified) {
        return false;
      }
      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSub = p.subtitle.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesPlatform = p.platform.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSub && !matchesCategory && !matchesPlatform && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.studentDiscountPercent - a.studentDiscountPercent;
      return 0; // featured default
    });
  }, [products, selectedCategory, selectedPlatform, verifiedOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl ring-1 ${
            notification.type === 'success' ? 'bg-slate-900 text-white ring-emerald-500/30' :
            notification.type === 'warning' ? 'bg-amber-900 text-amber-50 ring-amber-500/30' :
            'bg-slate-900 text-white ring-indigo-500/30'
          }`}>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Zero Dark Pattern Shield Banner */}
      <DarkPatternShieldBanner />

      {/* Role Console (Vendor, Delivery, Admin) */}
      <RoleDashboard />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200/60 mb-4">
              <GraduationCap className="h-4 w-4" />
              <span>Dedicated Exclusively to Students & University Labs</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Student Commerce with <span className="text-indigo-600">Zero Dark Patterns</span> & Multi-Platform Direct Ordering.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Order engineering textbooks, project robotics kits (Arduino, Raspberry Pi), calculators, and stationery. Paste any product link from <strong>Amazon, Flipkart, BestBuy, or Arduino Store</strong> to unlock direct ordering with campus discounts, $0 hidden delivery fees, and automated 1-click returns.
            </p>

            {/* Quick Action Pill Row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsLinkExtractorOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Extract Link From Amazon / Flipkart</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsArchitectureOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>View System Architecture & ER</span>
              </button>
            </div>

            {/* Micro Feature Bullets */}
            <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Zero Hidden Fees Guaranteed</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Cryptographic SHA-256 Provenance</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>1-Click Automated Return Pipeline</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Free Student Dorm Delivery</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Explorer Section */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex-1 w-full space-y-6">
        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          {/* Platform Selector Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
              Platform:
            </span>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                  selectedPlatform === p.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sorter & Verified Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Verified Campus Partner Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Cryptographically Verified Only</span>
                <span className="sm:hidden">Verified Only</span>
              </span>
            </label>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="featured">Featured Student Picks</option>
              <option value="discount">Highest Student Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated by Students</option>
            </select>
          </div>
        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredProducts.length}</strong> student-certified items
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {selectedPlatform !== 'ALL' && ` from ${selectedPlatform}`}
          </span>

          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Guaranteed $0 Hidden Checkout Fees
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No matching student products found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Couldn't find what you need? Paste any product URL from Amazon, Flipkart, or BestBuy to import and order it directly!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsLinkExtractorOpen(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
              >
                Extract From External Link
              </button>
              <button
                onClick={() => {
                  setCategory('all');
                  setSelectedPlatform('ALL');
                  setSearchQuery('');
                  setVerifiedOnly(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Production-Grade Student Commerce Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Uni<span className="text-indigo-600">Kart</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The student-first e-commerce engine engineered to dismantle predatory dark patterns, fake urgency countdowns, hidden delivery fees, and counterfeit hardware risks.
              </p>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Strategic Guarantees</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Guaranteed Upfront Pricing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>0 Fake Countdown Timers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>SHA-256 Batch Merkle Logs</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>1-Click Automated Return Engine</span>
                </li>
              </ul>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Direct Order Supported</h4>
              <div className="flex flex-col gap-1.5 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <PlatformLogo platform="Amazon" />
                  <span>Amazon Student Books & Tech</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PlatformLogo platform="Flipkart" />
                  <span>Flipkart Engineering Supplies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PlatformLogo platform="ArduinoStore" />
                  <span>Arduino Official STEM Lab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PlatformLogo platform="BestBuy" />
                  <span>BestBuy Student Tech</span>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Engineering Specs & QA</h4>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setIsArchitectureOpen(true)}
                  className="text-left font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  PostgreSQL 16 Schema & ER Diagram →
                </button>
                <button
                  onClick={() => setIsTestingSuiteOpen(true)}
                  className="text-left font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  Vitest & Playwright QA Suite →
                </button>
                <button
                  onClick={() => setIsDockerOpen(true)}
                  className="text-left font-semibold text-sky-600 hover:text-sky-800"
                >
                  Dockerfile & Docker Compose Configs →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <span>© 2026 UniKart OS. Open, Scalable, Platform-Independent Student Commerce.</span>
            <span>TLS 1.3 • AES-256 PII • Zero Dark Patterns Verified</span>
          </div>
        </div>
      </footer>

      {/* Slide-overs & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <LinkExtractorModal />
      <ProductDetailModal />
      <OrderTrackingModal />
      <AuthenticityModal />
      <ArchitectureModal />
      <TestingSuiteModal />
      <DockerDeploymentModal />
      <PriceAlertModal />
      <UserDashboardModal />
    </div>
  );
}
