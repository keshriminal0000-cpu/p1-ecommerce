import { create } from 'zustand';
import { 
  Product, 
  ProductCategory, 
  PlatformOrigin, 
  CartItem, 
  Order, 
  User, 
  CurrencyConfig,
  ExtractedProductPreview,
  PriceAlert 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, SAMPLE_USERS } from '../data/mockDatabase';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateAgainstUSD: 1.0 },
  INR: { code: 'INR', symbol: '₹', rateAgainstUSD: 85.5 },
  EUR: { code: 'EUR', symbol: '€', rateAgainstUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rateAgainstUSD: 0.78 },
};

interface StoreState {
  products: Product[];
  orders: Order[];
  currentUser: User;
  cart: CartItem[];
  currency: CurrencyConfig;
  selectedCategory: ProductCategory;
  searchQuery: string;
  selectedPlatform: PlatformOrigin | 'ALL';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount';
  verifiedOnly: boolean;

  // Student Wishlist (Persistent)
  wishlist: string[];
  isWishlistOpen: boolean;

  // Student Price Alerts (Persistent)
  priceAlerts: PriceAlert[];
  isPriceAlertModalOpen: boolean;
  selectedProductForAlert: Product | null;
  isUserDashboardOpen: boolean;
  activeDashboardTab: 'alerts' | 'wishlist' | 'profile' | 'orders';

  // Authentication & Student Session
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authRedirectAction: 'checkout' | null;

  // Active Modals & Viewers
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isLinkExtractorOpen: boolean;
  isOrderTrackingOpen: boolean;
  selectedOrderId: string | null;
  isAuthenticityOpen: boolean;
  selectedProductForAuthenticity: Product | null;
  isProductDetailOpen: boolean;
  selectedProduct: Product | null;
  isArchitectureOpen: boolean;
  isTestingSuiteOpen: boolean;
  isDockerOpen: boolean;
  isDarkPatternShieldActive: boolean;

  // Toast / System Notification
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;

  // Authentication Actions
  openAuthModal: (redirect?: 'checkout') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; emailOrPhone: string; password: string; studentId?: string; universityName?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Actions
  setCategory: (cat: ProductCategory) => void;
  setSearchQuery: (q: string) => void;
  setSelectedPlatform: (p: PlatformOrigin | 'ALL') => void;
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount') => void;
  setVerifiedOnly: (v: boolean) => void;
  setCurrency: (code: 'USD' | 'INR' | 'EUR' | 'GBP') => void;
  switchUserRole: (role: 'student' | 'vendor' | 'delivery' | 'admin') => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setIsWishlistOpen: (open: boolean) => void;

  // Price Alert Actions
  setPriceAlert: (productId: string, targetPriceUSD?: number) => void;
  removePriceAlert: (productId: string) => void;
  hasPriceAlert: (productId: string) => boolean;
  getPriceAlert: (productId: string) => PriceAlert | undefined;
  simulatePriceDrop: (productId: string, dropPercentage?: number) => void;
  openPriceAlertModal: (product: Product) => void;
  closePriceAlertModal: () => void;
  setIsUserDashboardOpen: (open: boolean) => void;
  setActiveDashboardTab: (tab: 'alerts' | 'wishlist' | 'profile' | 'orders') => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Checkout & Orders
  createOrder: (orderData: Partial<Order>) => Order;
  cancelOrder: (orderId: string, reason: string) => boolean;
  requestReturn: (orderId: string, reason: string) => boolean;
  advanceOrderStatus: (orderId: string) => void;

  // External Link Extractor Import
  addExtractedProduct: (extracted: ExtractedProductPreview) => Product;

  // UI Toggles
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsLinkExtractorOpen: (open: boolean) => void;
  openOrderTracking: (orderId: string) => void;
  closeOrderTracking: () => void;
  openAuthenticityModal: (product: Product) => void;
  closeAuthenticityModal: () => void;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  setIsArchitectureOpen: (open: boolean) => void;
  setIsTestingSuiteOpen: (open: boolean) => void;
  setIsDockerOpen: (open: boolean) => void;
  toggleDarkPatternShield: () => void;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;
}

const loadInitialWishlist = (): string[] => {
  if (typeof window === 'undefined') return ['prod_arduino_r4', 'prod_rotring_600'];
  try {
    const saved = localStorage.getItem('unikart_student_wishlist');
    return saved ? JSON.parse(saved) : ['prod_arduino_r4', 'prod_rotring_600'];
  } catch {
    return ['prod_arduino_r4', 'prod_rotring_600'];
  }
};

const saveWishlistToStorage = (ids: string[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('unikart_student_wishlist', JSON.stringify(ids));
    } catch {
      // ignore
    }
  }
};

const loadInitialPriceAlerts = (): PriceAlert[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('unikart_price_alerts');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [
    {
      id: 'alert_ard_01',
      productId: 'prod_arduino_r4',
      targetPriceUSD: 43.20,
      initialPriceUSD: 48.00,
      currentPriceUSD: 48.00,
      targetPriceINR: 3693.60,
      initialPriceINR: 4104.00,
      currentPriceINR: 4104.00,
      discountTriggerPercent: 10,
      createdAt: '2026-11-01T10:00:00Z',
      isActive: true,
      notified: false
    }
  ];
};

const savePriceAlertsToStorage = (alerts: PriceAlert[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('unikart_price_alerts', JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }
};

const loadInitialAuth = (): { user: User; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') {
    return { user: SAMPLE_USERS[0], isAuthenticated: false };
  }
  try {
    const isAuth = localStorage.getItem('unikart_is_authenticated') === 'true';
    const savedUser = localStorage.getItem('unikart_auth_user');
    if (isAuth && savedUser) {
      return { user: JSON.parse(savedUser), isAuthenticated: true };
    }
  } catch {
    // ignore
  }
  return { user: SAMPLE_USERS[0], isAuthenticated: false };
};

const initialAuth = loadInitialAuth();

export const useStore = create<StoreState>((set, get) => ({
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS as unknown as Order[],
  currentUser: initialAuth.user,
  isAuthenticated: initialAuth.isAuthenticated,
  isAuthModalOpen: false,
  authRedirectAction: null,
  cart: [],
  currency: CURRENCIES.INR, // Default to Indian Rupee (₹)
  selectedCategory: 'all',
  searchQuery: '',
  selectedPlatform: 'ALL',
  sortBy: 'featured',
  verifiedOnly: false,

  // Student Wishlist (Persistent)
  wishlist: loadInitialWishlist(),
  isWishlistOpen: false,

  // Student Price Alerts (Persistent)
  priceAlerts: loadInitialPriceAlerts(),
  isPriceAlertModalOpen: false,
  selectedProductForAlert: null,
  isUserDashboardOpen: false,
  activeDashboardTab: 'alerts',

  isCartOpen: false,
  isCheckoutOpen: false,
  isLinkExtractorOpen: false,
  isOrderTrackingOpen: false,
  selectedOrderId: null,
  isAuthenticityOpen: false,
  selectedProductForAuthenticity: null,
  isProductDetailOpen: false,
  selectedProduct: null,
  isArchitectureOpen: false,
  isTestingSuiteOpen: false,
  isDockerOpen: false,
  isDarkPatternShieldActive: true,
  notification: null,

  setCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedPlatform: (p) => set({ selectedPlatform: p }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setVerifiedOnly: (v) => set({ verifiedOnly: v }),
  setCurrency: (code) => set({ currency: CURRENCIES[code] || CURRENCIES.INR }),

  // Wishlist Actions
  toggleWishlist: (productId: string) => {
    const current = get().wishlist;
    const isCurrentlySaved = current.includes(productId);
    const updated = isCurrentlySaved
      ? current.filter(id => id !== productId)
      : [...current, productId];

    saveWishlistToStorage(updated);
    set({ wishlist: updated });

    const product = get().products.find(p => p.id === productId);
    const title = product ? product.title.slice(0, 30) : 'Item';

    get().setNotification({
      message: isCurrentlySaved
        ? `Removed "${title}..." from Student Wishlist`
        : `Saved "${title}..." to Student Wishlist for later!`,
      type: isCurrentlySaved ? 'info' : 'success'
    });
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.includes(productId);
  },

  clearWishlist: () => {
    saveWishlistToStorage([]);
    set({ wishlist: [] });
    get().setNotification({
      message: 'Student Wishlist cleared',
      type: 'info'
    });
  },

  setIsWishlistOpen: (open: boolean) => set({ isWishlistOpen: open }),

  // Price Alert Actions
  setPriceAlert: (productId: string, targetPriceUSD?: number) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return;

    const rate = get().currency.rateAgainstUSD || 85.5;
    const initialPrice = product.price;
    const target = targetPriceUSD !== undefined ? targetPriceUSD : Number((initialPrice * 0.90).toFixed(2));
    const discountTriggerPercent = Math.max(1, Math.round(((initialPrice - target) / initialPrice) * 100));

    const existingAlerts = get().priceAlerts;
    const existingIndex = existingAlerts.findIndex(a => a.productId === productId);

    const newAlert: PriceAlert = {
      id: existingIndex >= 0 ? existingAlerts[existingIndex].id : `alert_${Date.now()}`,
      productId,
      targetPriceUSD: target,
      initialPriceUSD: initialPrice,
      currentPriceUSD: product.price,
      targetPriceINR: Number((target * 85.5).toFixed(2)),
      initialPriceINR: Number((initialPrice * 85.5).toFixed(2)),
      currentPriceINR: Number((product.price * 85.5).toFixed(2)),
      discountTriggerPercent,
      createdAt: new Date().toISOString(),
      isActive: true,
      notified: false
    };

    let updatedAlerts: PriceAlert[];
    if (existingIndex >= 0) {
      updatedAlerts = existingAlerts.map((a, i) => i === existingIndex ? newAlert : a);
    } else {
      updatedAlerts = [newAlert, ...existingAlerts];
    }

    savePriceAlertsToStorage(updatedAlerts);

    // Also ensure product is added to student wishlist
    if (!get().isInWishlist(productId)) {
      const updatedWishlist = [...get().wishlist, productId];
      saveWishlistToStorage(updatedWishlist);
      set({ wishlist: updatedWishlist });
    }

    set({ 
      priceAlerts: updatedAlerts,
      isPriceAlertModalOpen: false,
      selectedProductForAlert: null
    });

    const targetFormatted = get().currency.code === 'INR'
      ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(target * 85.5)
      : (target * rate).toFixed(2);

    get().setNotification({
      message: `🔔 Price Alert set for "${product.title.slice(0, 26)}..." below ${get().currency.symbol}${targetFormatted}!`,
      type: 'success'
    });
  },

  removePriceAlert: (productId: string) => {
    const updated = get().priceAlerts.filter(a => a.productId !== productId);
    savePriceAlertsToStorage(updated);
    set({ priceAlerts: updated });
    get().setNotification({
      message: 'Price drop alert removed for this student item.',
      type: 'info'
    });
  },

  hasPriceAlert: (productId: string) => {
    return get().priceAlerts.some(a => a.productId === productId && a.isActive);
  },

  getPriceAlert: (productId: string) => {
    return get().priceAlerts.find(a => a.productId === productId);
  },

  simulatePriceDrop: (productId: string, dropPercentage = 15) => {
    const product = get().products.find(p => p.id === productId);
    if (!product) return;

    const discountFactor = (100 - dropPercentage) / 100;
    const newPriceUSD = Number((product.price * discountFactor).toFixed(2));
    const newTaxUSD = Number((newPriceUSD * 0.08).toFixed(2));
    const newTotalUSD = Number((newPriceUSD + newTaxUSD).toFixed(2));

    // Update product price across catalog
    const updatedProducts = get().products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: newPriceUSD,
          transparentPricing: {
            ...p.transparentPricing,
            basePrice: newPriceUSD,
            estimatedTax: newTaxUSD,
            guaranteedTotal: newTotalUSD
          }
        };
      }
      return p;
    });

    // Update alert status
    const matchingAlert = get().priceAlerts.find(a => a.productId === productId);
    let updatedAlerts = get().priceAlerts;
    if (matchingAlert) {
      updatedAlerts = get().priceAlerts.map(a => {
        if (a.productId === productId) {
          return {
            ...a,
            currentPriceUSD: newPriceUSD,
            currentPriceINR: Number((newPriceUSD * 85.5).toFixed(2)),
            notified: true,
            lastNotificationMessage: `Price dropped by ${dropPercentage}% to below your target!`
          };
        }
        return a;
      });
      savePriceAlertsToStorage(updatedAlerts);
    }

    const rate = get().currency.rateAgainstUSD || 85.5;
    const newPriceFormatted = get().currency.code === 'INR'
      ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(newPriceUSD * 85.5)
      : (newPriceUSD * rate).toFixed(2);

    set({
      products: updatedProducts,
      priceAlerts: updatedAlerts
    });

    get().setNotification({
      message: `🔔 Price Drop Triggered! "${product.title.slice(0, 24)}..." dropped to ${get().currency.symbol}${newPriceFormatted}!`,
      type: 'success'
    });
  },

  openPriceAlertModal: (product: Product) => set({ isPriceAlertModalOpen: true, selectedProductForAlert: product }),
  closePriceAlertModal: () => set({ isPriceAlertModalOpen: false, selectedProductForAlert: null }),
  setIsUserDashboardOpen: (open: boolean) => set({ isUserDashboardOpen: open }),
  setActiveDashboardTab: (tab) => set({ activeDashboardTab: tab }),

  switchUserRole: (role) => {
    const found = SAMPLE_USERS.find(u => u.role === role) || SAMPLE_USERS[0];
    set({ currentUser: found });
    get().setNotification({
      message: `Active persona switched to ${found.name} (${role.toUpperCase()})`,
      type: 'info'
    });
  },

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.cart.find(item => item.product.id === product.id);
      let updatedCart: CartItem[];
      if (existing) {
        updatedCart = state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...state.cart, { product, quantity }];
      }
      return {
        cart: updatedCart,
        notification: {
          message: `Added "${product.title.slice(0, 32)}..." to student cart.`,
          type: 'success'
        }
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Authentication Actions
  openAuthModal: (redirect?: 'checkout') => {
    set({ isAuthModalOpen: true, authRedirectAction: redirect || null });
  },
  closeAuthModal: () => {
    set({ isAuthModalOpen: false, authRedirectAction: null });
  },
  login: async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: identifier, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('unikart_is_authenticated', 'true');
          localStorage.setItem('unikart_auth_user', JSON.stringify(data.user));
        }
        const redirectAction = get().authRedirectAction;
        set({
          currentUser: data.user,
          isAuthenticated: true,
          isAuthModalOpen: false,
          authRedirectAction: null,
          isCheckoutOpen: redirectAction === 'checkout'
        });
        get().setNotification({
          message: `Logged in as ${data.user.name}. You can now place your order!`,
          type: 'success'
        });
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid email/phone or password' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login network error' };
    }
  },
  signup: async (formData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('unikart_is_authenticated', 'true');
          localStorage.setItem('unikart_auth_user', JSON.stringify(data.user));
        }
        const redirectAction = get().authRedirectAction;
        set({
          currentUser: data.user,
          isAuthenticated: true,
          isAuthModalOpen: false,
          authRedirectAction: null,
          isCheckoutOpen: redirectAction === 'checkout'
        });
        get().setNotification({
          message: `Account created for ${data.user.name}! You can now place your order.`,
          type: 'success'
        });
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to sign up' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign up network error' };
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('unikart_is_authenticated');
      localStorage.removeItem('unikart_auth_user');
    }
    set({
      isAuthenticated: false,
      currentUser: SAMPLE_USERS[0],
      isCheckoutOpen: false,
      notification: {
        message: 'Signed out successfully. Sign up or log in to place orders.',
        type: 'info'
      }
    });
  },

  createOrder: (orderData) => {
    // ENFORCE AUTHENTICATION: Student must sign up with email/phone and password first
    if (!get().isAuthenticated) {
      get().openAuthModal('checkout');
      get().setNotification({
        message: 'Sign up or log in with your email or phone and password to place this order!',
        type: 'warning'
      });
      return null as any;
    }

    const newId = `ord_student_${Date.now()}`;
    const orderNum = `UK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullOrder: Order = {
      id: newId,
      orderNumber: orderNum,
      userId: get().currentUser.id,
      items: get().cart,
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      tax: orderData.tax || 0,
      shipping: 0,
      total: orderData.total || 0,
      currency: get().currency.code,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress || {
        fullName: get().currentUser.name,
        campusDorm: 'Crothers Hall, Room 314',
        street: '450 Jane Stanford Way',
        city: 'Stanford',
        postalCode: '94305',
        phone: '+1 (650) 555-0199'
      },
      paymentMethod: orderData.paymentMethod || 'STRIPE',
      paymentTransactionId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      paymentSignatureVerified: true,
      trackingSteps: [
        {
          status: 'PLACED',
          title: 'Order Placed & Price Locked',
          description: 'Anti-fraud checks passed. Student rate guaranteed with $0 hidden fee.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'VERIFIED',
          title: 'Cryptographic Supply Chain Verified',
          description: 'Manufacturer SHA-256 hash verified against campus authenticity registry.',
          timestamp: 'Pending verification',
          completed: false,
          current: false
        },
        {
          status: 'PACKED',
          title: 'Packed by Verified Partner',
          description: 'Quality tested and tagged with campus delivery QR code.',
          timestamp: 'Pending packaging',
          completed: false,
          current: false
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Campus Courier Dispatched',
          description: 'Student delivery partner assigned for direct dorm handover.',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false
        },
        {
          status: 'DELIVERED',
          title: 'Delivered to Student',
          description: 'Handed over securely or placed in dorm smart parcel locker.',
          timestamp: 'Pending arrival',
          completed: false,
          current: false
        }
      ],
      upstreamPlatformSync: orderData.upstreamPlatformSync || {
        platform: 'UniKart',
        upstreamOrderId: `DIRECT-${newId.slice(-6)}`,
        syncStatus: 'SYNCHRONIZED'
      }
    };

    set((state) => ({
      orders: [fullOrder, ...state.orders],
      cart: [],
      isCheckoutOpen: false,
      selectedOrderId: newId,
      isOrderTrackingOpen: true,
      notification: {
        message: `Order #${orderNum} placed successfully! Zero hidden fees charged.`,
        type: 'success'
      }
    }));

    return fullOrder;
  },

  cancelOrder: (orderId, reason) => {
    const orders = get().orders;
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;
    if (target.status === 'DELIVERED') {
      get().setNotification({
        message: 'Order already delivered. Please use 1-Click Automated Return instead.',
        type: 'warning'
      });
      return false;
    }

    const updatedOrders: Order[] = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'CANCELLED' as const,
          returnReason: reason,
          refundLedgerId: `REF_LEDGER_${Date.now().toString(36).toUpperCase()}`,
          trackingSteps: ord.trackingSteps.map(step => ({
            ...step,
            completed: false,
            current: false
          })).concat([{
            status: 'CANCELLED' as const,
            title: 'Order Cancelled & 100% Refunded',
            description: `Automated cancellation processed: "${reason}". $${ord.total.toFixed(2)} refunded immediately to student wallet / card.`,
            timestamp: 'Just now',
            completed: true,
            current: true
          }])
        };
      }
      return ord;
    });

    set({
      orders: updatedOrders,
      notification: {
        message: `Order #${target.orderNumber} successfully cancelled. Full refund credited instantly.`,
        type: 'success'
      }
    });
    return true;
  },

  requestReturn: (orderId, reason) => {
    const orders = get().orders;
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    const updatedOrders: Order[] = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'RETURN_APPROVED' as const,
          returnReason: reason,
          refundLedgerId: `REF_AUTO_${Date.now().toString(36).toUpperCase()}`,
          trackingSteps: ord.trackingSteps.concat([{
            status: 'RETURN_APPROVED' as const,
            title: 'Automated 1-Click Return Approved',
            description: `Return label auto-generated. Inspection bot waived: full refund of $${ord.total.toFixed(2)} approved. Campus courier scheduled for dorm pickup.`,
            timestamp: 'Just now',
            completed: true,
            current: true
          }])
        };
      }
      return ord;
    });

    set({
      orders: updatedOrders,
      notification: {
        message: `Automated return approved for Order #${target.orderNumber}. Zero questions asked.`,
        type: 'success'
      }
    });
    return true;
  },

  advanceOrderStatus: (orderId) => {
    const order = get().orders.find(o => o.id === orderId);
    if (!order) return;

    const stepOrder = ['PLACED', 'VERIFIED', 'PACKED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = stepOrder.indexOf(order.status);
    if (currentIndex === -1 || currentIndex >= stepOrder.length - 1) return;

    const nextStatus = stepOrder[currentIndex + 1] as any;
    const updatedOrders: Order[] = get().orders.map(o => {
      if (o.id === orderId) {
        const updatedSteps = o.trackingSteps.map(step => {
          if (step.status === nextStatus) {
            return { ...step, completed: true, current: true, timestamp: 'Just now' };
          }
          if (stepOrder.indexOf(step.status) < currentIndex + 1) {
            return { ...step, completed: true, current: false };
          }
          return { ...step, current: false };
        });

        return {
          ...o,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          trackingSteps: updatedSteps
        };
      }
      return o;
    });

    set({
      orders: updatedOrders,
      notification: {
        message: `Order #${order.orderNumber} state advanced to "${nextStatus.replace(/_/g, ' ')}"`,
        type: 'info'
      }
    });
  },

  addExtractedProduct: (extracted) => {
    const newProduct: Product = {
      id: `prod_ext_${Date.now()}`,
      title: extracted.title,
      subtitle: `Imported from ${extracted.detectedPlatform} with Student Discount Guarantee`,
      description: `Automatically extracted from ${extracted.url}. Analyzed for authentic student hardware, textbooks, or stationery specifications. Direct ordering enabled through UniKart gateway.`,
      category: extracted.category,
      price: extracted.studentDiscountedPrice,
      originalPrice: extracted.extractedPrice,
      studentDiscountPercent: Math.round(((extracted.extractedPrice - extracted.studentDiscountedPrice) / extracted.extractedPrice) * 100),
      rating: 4.85,
      reviewCount: 142,
      images: [extracted.imageUrl],
      platform: extracted.detectedPlatform,
      platformUrl: extracted.url,
      platformLogo: extracted.detectedPlatform.toLowerCase(),
      inStock: extracted.inStock,
      stockCount: 25,
      tags: ['Imported', extracted.detectedPlatform, 'Student Discounted', 'Verified Match'],
      specs: extracted.specs,
      vendorName: `${extracted.vendor} (via ${extracted.detectedPlatform})`,
      vendorVerified: true,
      cryptoProvenance: {
        batchHash: extracted.authenticityHash,
        vendorSignature: `ECDSA-SHA256:${extracted.authenticityHash.slice(0, 16)}...${extracted.authenticityHash.slice(-8)}`,
        campusVerificationId: `UK-EXTRACT-SYNC-${Date.now().toString(36).toUpperCase()}`,
        manufacturer: extracted.vendor,
        authenticityStatus: 'Cryptographically Verified',
        auditTimestamp: new Date().toISOString(),
        serialNumberPattern: `${extracted.detectedPlatform.toUpperCase().slice(0, 3)}-SYNC-######`
      },
      transparentPricing: {
        basePrice: extracted.studentDiscountedPrice,
        estimatedTax: Number((extracted.studentDiscountedPrice * 0.08).toFixed(2)),
        studentShipping: 0.00,
        platformFee: 0.00,
        guaranteedTotal: Number((extracted.studentDiscountedPrice * 1.08).toFixed(2))
      },
      returnPolicyDays: 30
    };

    set((state) => ({
      products: [newProduct, ...state.products],
      isLinkExtractorOpen: false,
      notification: {
        message: `Successfully imported "${newProduct.title.slice(0, 28)}..." from ${extracted.detectedPlatform}!`,
        type: 'success'
      }
    }));

    return newProduct;
  },

  setIsCartOpen: (open) => set({ isCartOpen: open }),
  setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setIsLinkExtractorOpen: (open) => set({ isLinkExtractorOpen: open }),
  openOrderTracking: (orderId) => set({ isOrderTrackingOpen: true, selectedOrderId: orderId }),
  closeOrderTracking: () => set({ isOrderTrackingOpen: false, selectedOrderId: null }),
  openAuthenticityModal: (product) => set({ isAuthenticityOpen: true, selectedProductForAuthenticity: product }),
  closeAuthenticityModal: () => set({ isAuthenticityOpen: false, selectedProductForAuthenticity: null }),
  openProductDetail: (product) => set({ isProductDetailOpen: true, selectedProduct: product }),
  closeProductDetail: () => set({ isProductDetailOpen: false, selectedProduct: null }),
  setIsArchitectureOpen: (open) => set({ isArchitectureOpen: open }),
  setIsTestingSuiteOpen: (open) => set({ isTestingSuiteOpen: open }),
  setIsDockerOpen: (open) => set({ isDockerOpen: open }),
  toggleDarkPatternShield: () => set((state) => ({ isDarkPatternShieldActive: !state.isDarkPatternShieldActive })),
  setNotification: (notif) => {
    set({ notification: notif });
    if (notif) {
      setTimeout(() => {
        if (get().notification?.message === notif.message) {
          set({ notification: null });
        }
      }, 4000);
    }
  }
}));
