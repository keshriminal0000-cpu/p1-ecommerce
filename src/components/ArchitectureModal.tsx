import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureOpen, setIsArchitectureOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'architecture' | 'er-diagram' | 'sql-ddl'>('architecture');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isArchitectureOpen) return null;

  const sqlDDL = `-- ====================================================================
-- UniKart Enterprise PostgreSQL 16 DDL Migration Script
-- Production-Ready Relational Schema with Constraints, Indexes & Triggers
-- ====================================================================

-- Enable UUID & Crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & RBAC TABLE
CREATE TYPE user_role_enum AS ENUM ('student', 'vendor', 'delivery', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role user_role_enum DEFAULT 'student' NOT NULL,
    student_id VARCHAR(64),
    university_name VARCHAR(255),
    verified_student BOOLEAN DEFAULT FALSE NOT NULL,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (wallet_balance >= 0),
    mfa_secret VARCHAR(128),
    mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);

-- 2. VENDORS & SUPPLIERS TABLE
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    tax_id_encrypted BYTEA,
    campus_partner_certified BOOLEAN DEFAULT FALSE NOT NULL,
    ecdsa_public_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. PRODUCTS & INVENTORY TABLE
CREATE TYPE platform_origin_enum AS ENUM ('UniKart', 'Amazon', 'Flipkart', 'BestBuy', 'ArduinoStore', 'CampusStore');
CREATE TYPE product_category_enum AS ENUM (
    'books', 'stationery', 'project-electronics', 
    'gadgets-calculators', 'laptops-tablets', 
    'mobiles-wearables', 'backpacks-bags', 'dorm-essentials'
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    category product_category_enum NOT NULL,
    platform platform_origin_enum DEFAULT 'UniKart' NOT NULL,
    platform_url TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) NOT NULL,
    student_discount_percent INT DEFAULT 0 CHECK (student_discount_percent BETWEEN 0 AND 100),
    stock_count INT DEFAULT 0 NOT NULL CHECK (stock_count >= 0),
    specs JSONB DEFAULT '{}'::jsonb NOT NULL,
    crypto_batch_hash VARCHAR(64) NOT NULL,
    campus_verification_id VARCHAR(64) NOT NULL,
    return_policy_days INT DEFAULT 30 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_platform ON products(platform);
CREATE INDEX idx_products_crypto_hash ON products(crypto_batch_hash);

-- 4. ORDERS & STATE MACHINE
CREATE TYPE order_status_enum AS ENUM (
    'PLACED', 'VERIFIED', 'PACKED', 'DISPATCHED', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_REQUESTED', 
    'RETURN_APPROVED', 'RETURNED', 'CANCELLED'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    status order_status_enum DEFAULT 'PLACED' NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    tax NUMERIC(12, 2) NOT NULL,
    shipping NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    payment_transaction_id VARCHAR(128) NOT NULL,
    payment_signature_verified BOOLEAN DEFAULT TRUE NOT NULL,
    shipping_address JSONB NOT NULL,
    upstream_platform_sync JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_idempotency ON orders(idempotency_key);

-- 5. ORDER LINE ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 6. IMMUTABLE CRYPTOGRAPHIC LEDGER & REFUND LOGS
CREATE TABLE cryptographic_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE RESTRICT NOT NULL,
    entry_type VARCHAR(32) NOT NULL, -- 'CHARGE', 'REFUND_AUTO', 'REVERSAL'
    amount NUMERIC(12, 2) NOT NULL,
    immutable_sha256_hash VARCHAR(64) NOT NULL,
    gateway_callback_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_ledger_order_id ON cryptographic_ledger(order_id);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                System Architecture & Database Specifications
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Clean Architecture (Controller-Service-Repository) • PostgreSQL 16 DDL & ER
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArchitectureOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'architecture'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            High-Level Architecture & Layers
          </button>
          <button
            onClick={() => setActiveTab('er-diagram')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'er-diagram'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Entity-Relationship (ER) Model
          </button>
          <button
            onClick={() => setActiveTab('sql-ddl')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'sql-ddl'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            PostgreSQL 16 Production DDL
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Layer 1: Client & Frontend */}
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <span>Presentation Layer (SPA/PWA)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>• React 19 + TypeScript + Vite</li>
                    <li>• Zustand State Store (Cart, User, Orders)</li>
                    <li>• Tailwind CSS Design System</li>
                    <li>• Zero Dark Pattern Shield Engine</li>
                    <li>• Multi-Platform URL Extractor Interface</li>
                  </ul>
                </div>

                {/* Layer 2: API Gateway & Application Services */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <Server className="h-4 w-4 text-emerald-600" />
                    <span>API Gateway & Clean Services</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>• Express TS Controller-Service-Repo Pattern</li>
                    <li>• Sliding-Window Rate Limiting (DDoS)</li>
                    <li>• HMAC-SHA256 Webhook Verification</li>
                    <li>• Redis Distributed Locking (Flash Sales)</li>
                    <li>• 1-Click Automated Return Engine</li>
                  </ul>
                </div>

                {/* Layer 3: Persistence & Upstream Sync */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <Database className="h-4 w-4 text-amber-600" />
                    <span>Data & Upstream Integration</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>• PostgreSQL 16 (ACID Relational)</li>
                    <li>• Redis 7 (Cart cache, Locks, Rates)</li>
                    <li>• SHA-256 Provenance Merkle Logs</li>
                    <li>• Cross-Platform Extractor (Amazon, Flipkart)</li>
                    <li>• Multi-Gateway (Stripe, UPI, PayPal)</li>
                  </ul>
                </div>
              </div>

              {/* Zero Dark Pattern Architectural Controls */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  OWASP & Strategic Architectural Defenses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Idempotent Transactions:</strong>
                    Prevents duplicate orders on network re-transmits via client-generated UUID idempotency keys stored in Redis.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Anti-Counterfeit Provenance:</strong>
                    Each hardware component and book ISBN is tied to a cryptographically signed batch hash verified against campus lab keys.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Transparent Pricing Guard:</strong>
                    Server-enforced formula: Base + GST/Tax + $0 Student Shipping + $0 Convenience Fee. Injected fees rejected at API layer.
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Zero-Bureaucracy Returns:</strong>
                    State machine handles returns automatically without human customer support queues, crediting student ledger instantly.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'er-diagram' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-5 font-mono text-xs overflow-x-auto leading-relaxed">
                <p className="text-emerald-400 font-bold mb-3">// UniKart Relational Entity Relationship (ER) Schema</p>
                <pre>{`[users]
  id: UUID (PK)
  email: VARCHAR(255) (UNIQUE)
  role: ENUM('student', 'vendor', 'delivery', 'admin')
  student_id: VARCHAR(64)
  verified_student: BOOLEAN
  wallet_balance: NUMERIC(12, 2)
  created_at: TIMESTAMPTZ
      |
      |-- 1:N --> [orders]
      |             id: UUID (PK)
      |             order_number: VARCHAR(32) (UNIQUE)
      |             user_id: UUID (FK -> users.id)
      |             status: ENUM('PLACED', 'VERIFIED', 'PACKED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_APPROVED', 'CANCELLED')
      |             subtotal: NUMERIC(12,2)
      |             tax: NUMERIC(12,2)
      |             shipping: NUMERIC(12,2) [0.00]
      |             total: NUMERIC(12,2)
      |             idempotency_key: VARCHAR(128) (UNIQUE)
      |             payment_transaction_id: VARCHAR(128)
      |                 |
      |                 |-- 1:N --> [order_items]
      |                 |             id: UUID (PK)
      |                 |             order_id: UUID (FK -> orders.id)
      |                 |             product_id: UUID (FK -> products.id)
      |                 |             quantity: INT
      |                 |             unit_price: NUMERIC(10,2)
      |                 |
      |                 |-- 1:1 --> [cryptographic_ledger]
      |                               id: UUID (PK)
      |                               order_id: UUID (FK -> orders.id)
      |                               immutable_sha256_hash: VARCHAR(64)
      |                               gateway_callback_signature: TEXT
      |
      |-- 1:1 --> [vendors]
                    id: UUID (PK)
                    user_id: UUID (FK -> users.id)
                    campus_partner_certified: BOOLEAN
                    ecdsa_public_key: TEXT
                        |
                        |-- 1:N --> [products]
                                      id: UUID (PK)
                                      vendor_id: UUID (FK -> vendors.id)
                                      title: VARCHAR(255)
                                      category: ENUM(...)
                                      platform: ENUM('UniKart', 'Amazon', 'Flipkart', 'BestBuy', 'ArduinoStore', 'CampusStore')
                                      platform_url: TEXT
                                      price: NUMERIC(10,2)
                                      crypto_batch_hash: VARCHAR(64)
                                      campus_verification_id: VARCHAR(64)`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'sql-ddl' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  PostgreSQL 16 Migration SQL (Copyable)
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                >
                  {copiedSql ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSql ? 'Copied SQL' : 'Copy Full Migration Script'}</span>
                </button>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-emerald-300 max-h-96 overflow-y-auto">
                <pre>{sqlDDL}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
