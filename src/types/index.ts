export type PlatformOrigin = 'UniKart' | 'Amazon' | 'Flipkart' | 'BestBuy' | 'ArduinoStore' | 'CampusStore';

export type UserRole = 'student' | 'vendor' | 'delivery' | 'admin';

export type ProductCategory = 
  | 'all'
  | 'books'
  | 'stationery'
  | 'project-electronics'
  | 'gadgets-calculators'
  | 'laptops-tablets'
  | 'mobiles-wearables'
  | 'backpacks-bags'
  | 'dorm-essentials';

export interface CryptoProvenance {
  batchHash: string;
  vendorSignature: string;
  campusVerificationId: string;
  manufacturer: string;
  authenticityStatus: 'Cryptographically Verified' | 'Campus Authorized' | 'Original Batch Audited';
  auditTimestamp: string;
  serialNumberPattern: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  price: number; // in USD base
  originalPrice: number;
  studentDiscountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  platform: PlatformOrigin;
  platformUrl?: string;
  platformLogo: string; // SVG or brand icon identifier
  inStock: boolean;
  stockCount: number;
  tags: string[];
  specs: Record<string, string>;
  vendorName: string;
  vendorVerified: boolean;
  cryptoProvenance: CryptoProvenance;
  transparentPricing: {
    basePrice: number;
    estimatedTax: number;
    studentShipping: number;
    platformFee: number; // Always $0.00
    guaranteedTotal: number;
  };
  returnPolicyDays: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  universityName?: string;
  verifiedStudent: boolean;
  avatar: string;
  walletBalance: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSpec?: string;
}

export type OrderStatus = 
  | 'PLACED'
  | 'VERIFIED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURNED'
  | 'CANCELLED';

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    fullName: string;
    campusDorm: string;
    street: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'STRIPE' | 'RAZORPAY_UPI' | 'PAYPAL' | 'CAMPUS_CARD';
  paymentTransactionId: string;
  paymentSignatureVerified: boolean;
  trackingSteps: OrderTrackingStep[];
  upstreamPlatformSync?: {
    platform: PlatformOrigin;
    upstreamOrderId: string;
    syncStatus: 'SYNCHRONIZED' | 'PROCESSING' | 'RETURN_MIRRORED';
  };
  returnReason?: string;
  refundLedgerId?: string;
}

export interface CurrencyConfig {
  code: 'USD' | 'INR' | 'EUR' | 'GBP';
  symbol: string;
  rateAgainstUSD: number;
}

export interface ExtractedProductPreview {
  url: string;
  detectedPlatform: PlatformOrigin;
  title: string;
  category: ProductCategory;
  extractedPrice: number;
  studentDiscountedPrice: number;
  savings: number;
  imageUrl: string;
  specs: Record<string, string>;
  vendor: string;
  authenticityHash: string;
  inStock: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPriceUSD: number;
  initialPriceUSD: number;
  currentPriceUSD: number;
  targetPriceINR: number;
  initialPriceINR: number;
  currentPriceINR: number;
  discountTriggerPercent: number;
  createdAt: string;
  isActive: boolean;
  notified: boolean;
  lastNotificationMessage?: string;
}

