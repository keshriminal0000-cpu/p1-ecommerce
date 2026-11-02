import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Link2, 
  ShoppingCart, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown, 
  Terminal, 
  Database, 
  Container, 
  Sparkles,
  Layers,
  ArrowRight,
  Heart,
  Bell
} from 'lucide-react';
import { useStore, CURRENCIES } from '../store/useStore';
import { UserRole } from '../types';
import { MultiPlatformSearchModal } from './MultiPlatformSearchModal';
import { SearchBarWithRelated } from './SearchBarWithRelated';
import { LogIn, LogOut, KeyRound } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    cart,
    wishlist,
    setIsWishlistOpen,
    priceAlerts,
    setIsUserDashboardOpen,
    setActiveDashboardTab,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    setIsLinkExtractorOpen,
    setIsArchitectureOpen,
    setIsTestingSuiteOpen,
    setIsDockerOpen,
    isDarkPatternShieldActive,
    toggleDarkPatternShield,
    orders,
    openOrderTracking,
    isAuthenticated,
    openAuthModal,
    logout
  } = useStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isMultiSearchOpen, setIsMultiSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartSubtotalConverted = cartSubtotalUSD * currency.rateAgainstUSD;
  const cartSubtotalDisplay = currency.code === 'INR'
    ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(cartSubtotalConverted)
    : cartSubtotalConverted.toFixed(2);

  const roles: { id: UserRole; label: string; badge: string; desc: string }[] = [
    { id: 'student', label: 'Alex Rivera', badge: 'Verified Student', desc: 'Stanford .edu ID verified • Free Shipping' },
    { id: 'vendor', label: 'Campus Hardware Lab', badge: 'Verified Vendor', desc: 'Catalog & Cryptographic Log Admin' },
    { id: 'delivery', label: 'Campus Swift Express', badge: 'Dorm Courier', desc: 'Scan & Advance Delivery States' },
    { id: 'admin', label: 'Security Ops', badge: 'Super Admin', desc: 'OWASP Logs & Webhook Signature Audits' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top micro-bar: Student Guarantee & Platform stats */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero Dark Patterns Verified</span>
            </span>
            <span className="hidden text-slate-500 sm:inline">•</span>
            <span className="hidden text-slate-400 sm:inline">
              Guaranteed $0 Hidden Fees • 100% Cryptographic Supply-Chain Provenance
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Quick Architecture / System Specs links */}
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              title="System Architecture & Database ER Diagrams"
            >
              <Database className="h-3 w-3 text-indigo-400" />
              <span className="hidden md:inline">Architecture & ER</span>
            </button>
            <button
              onClick={() => setIsTestingSuiteOpen(true)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              title="Interactive Jest & Playwright Test Runner"
            >
              <Terminal className="h-3 w-3 text-emerald-400" />
              <span className="hidden md:inline">QA Test Suite</span>
            </button>
            <button
              onClick={() => setIsDockerOpen(true)}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              title="Production Dockerfile & Compose configs"
            >
              <Container className="h-3 w-3 text-sky-400" />
              <span className="hidden md:inline">Docker Deployment</span>
            </button>

            {orders.length > 0 && (
              <button
                onClick={() => openOrderTracking(orders[0].id)}
                className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>Track Active Order</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Uni<span className="text-indigo-600">Kart</span>
                </span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-200">
                  Student OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Direct Ordering & Multi-Platform E-Commerce
              </p>
            </div>
          </div>
        </div>

        {/* Global Multi-Platform Search Bar with Live Related Products Dropdown */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBarWithRelated
            onOpenMultiPlatformSearch={() => setIsMultiSearchOpen(true)}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-indigo-600 transition"
            aria-label="Search"
            title="Search related products"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Cross-Platform Product Link Extractor Trigger Button */}
          <button
            onClick={() => setIsLinkExtractorOpen(true)}
            className="group relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 transition-all hover:shadow-indigo-500/25 active:scale-95"
            title="Import and order directly from Amazon, Flipkart, BestBuy, Arduino Store..."
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span className="font-medium hidden sm:inline">Extract Link</span>
            <span className="sm:hidden">Extract</span>
            <span className="rounded bg-white/20 px-1 py-0.2 text-[9px] font-black uppercase tracking-wider text-white hidden sm:inline">
              Direct
            </span>
          </button>

          {/* Dark Pattern Shield Toggle */}
          <button
            onClick={toggleDarkPatternShield}
            className={`hidden xl:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition ${
              isDarkPatternShieldActive 
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
            title="Click to toggle comparison of UniKart vs predatory dark patterns"
          >
            <ShieldCheck className={`h-4 w-4 ${isDarkPatternShieldActive ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Shield {isDarkPatternShieldActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>{currency.symbol}</span>
              <span>{currency.code}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-lg z-50 animate-in fade-in zoom-in-95">
                {Object.values(CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code as any);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      currency.code === c.code 
                        ? 'bg-indigo-50 text-indigo-700 font-bold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{c.code}</span>
                    <span className="text-slate-400 font-normal">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authentication & Role Persona */}
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition active:scale-95"
              title="Sign up with email or phone to place orders"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-1 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 transition"
                title="Student logged in. Click to manage profile or switch RBAC persona"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-400"
                />
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold leading-tight flex items-center gap-1">
                    <span>Verified</span>
                    <span>•</span>
                    <span>{currentUser.role.toUpperCase()}</span>
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email || currentUser.phone}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Verified Student Access Active
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveDashboardTab('profile');
                      setIsUserDashboardOpen(true);
                      setRoleDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                    <span>My Student Dashboard</span>
                  </button>

                  <div className="pt-1.5 mt-1 border-t border-slate-100">
                    <p className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Simulate RBAC Persona
                    </p>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          switchUserRole(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`flex w-full flex-col text-left rounded-lg p-1.5 transition ${
                          currentUser.role === r.id
                            ? 'bg-indigo-50 border border-indigo-200/60'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">{r.label}</span>
                          <span className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                            r.id === 'student' ? 'bg-emerald-100 text-emerald-800' :
                            r.id === 'vendor' ? 'bg-amber-100 text-amber-800' :
                            r.id === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {r.badge}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setRoleDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student Price Alerts Button */}
          <button
            onClick={() => {
              setActiveDashboardTab('alerts');
              setIsUserDashboardOpen(true);
            }}
            className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition active:scale-95"
            aria-label="Manage Price Alerts"
            title="Manage Student Price Drop Alerts"
          >
            <Bell className={`h-4 w-4 ${priceAlerts.length > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Price Alerts</span>
            {priceAlerts.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white">
                {priceAlerts.length}
              </span>
            )}
          </button>

          {/* Student Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition active:scale-95"
            aria-label="Student Wishlist"
            title="Saved Student Wishlist Items"
          >
            <Heart className={`h-4 w-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
            aria-label="Student Cart"
          >
            <ShoppingCart className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartTotalItems > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-slate-950">
                {cartTotalItems}
              </span>
            )}
            {cartTotalItems > 0 && (
              <span className="hidden lg:inline text-slate-300 font-mono text-[11px] border-l border-slate-700 pl-2">
                {currency.symbol}{cartSubtotalDisplay}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white p-3 shadow-inner animate-in slide-in-from-top-2">
          <SearchBarWithRelated
            onOpenMultiPlatformSearch={() => {
              setIsMobileSearchOpen(false);
              setIsMultiSearchOpen(true);
            }}
          />
        </div>
      )}

      {/* Multi-Platform Search & Availability Modal */}
      <MultiPlatformSearchModal
        isOpen={isMultiSearchOpen}
        onClose={() => setIsMultiSearchOpen(false)}
        initialQuery={searchQuery}
      />
    </header>
  );
};
