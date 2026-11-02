# UniKart | Student Commerce & Multi-Platform Aggregator

> **A production-ready, platform-independent e-commerce web application engineered specifically for university students, campus robotics/electronics labs, and academic communities.**
>
> Built with zero dark patterns, transparent pricing in Indian Rupees (₹), cryptographic supply-chain provenance, cross-platform product extraction (Amazon, Flipkart, Best Buy, Arduino Store), real-time price drop alerts, and automated 1-click returns.

---

## 📌 Table of Contents
1. [Strategic Differentiation (Zero Dark Patterns)](#1-strategic-differentiation-zero-dark-patterns)
2. [Student-Centric Catalog](#2-student-centric-catalog)
3. [Multi-Platform Product Extractor & Direct Ordering](#3-multi-platform-product-extractor--direct-ordering)
4. [Cross-Platform Search & Live Store Availability](#4-cross-platform-search--live-store-availability)
5. [Persistent Student Wishlist & Price Drop Alerts](#5-persistent-student-wishlist--price-drop-alerts)
6. [Order Lifecycle State Machine & 1-Click Returns](#6-order-lifecycle-state-machine--1-click-returns)
7. [System Architecture & Tech Stack](#7-system-architecture--tech-stack)
8. [Database Schema (PostgreSQL 16)](#8-database-schema-postgresql-16)
9. [Enterprise Security & OWASP Mitigation](#9-enterprise-security--owasp-mitigation)
10. [Local Development & Docker Deployment](#10-local-development--docker-deployment)
11. [Testing & QA Suite](#11-testing--qa-suite)

---

## 1. Strategic Differentiation (Zero Dark Patterns)

UniKart was explicitly architected to overcome the structural, predatory, and UX disadvantages common in legacy platforms such as Amazon and Flipkart:

* **Zero Deceptive Urgency:** Eliminates synthetic countdown timers ("Only 4 minutes left!") and fabricated stock scarcity counters ("Only 1 left in stock!").
* **Transparent Pricing Guarantee:** Every product card and cart displays an upfront itemized formula:
  $$\text{Guaranteed Total} = \text{Base Price} + \text{Exact Category Tax} + \text{Free Student Shipping (₹0.00)} + \text{Platform Fee (₹0.00)}$$
  No hidden convenience charges or surprise delivery fees added at the final review step.
* **Cryptographic Anti-Counterfeit Architecture:** Every hardware component (microcontrollers, sensors, development boards) and textbook ISBN carries an immutable **SHA-256 Merkle batch hash**, vendor ECDSA digital signature, and campus lab audit registry verification.
* **Automated 1-Click Returns & Zero-Fee Cancellations:** Eliminates customer service hold times and bureaucratic disputes. Verified students receive instant automated return approvals and immediate refunds credited to their student wallet or payment source.

---

## 2. Student-Centric Catalog

UniKart caters exclusively to academic, engineering, and campus dorm needs:

* **Project Electronics & Robotics:**
  * Official Arduino Uno R4 WiFi + IoT Starter Lab Kit
  * Raspberry Pi 5 (8GB RAM) Developer Bundle
  * ESP32-S3 Dual-Core WiFi & Bluetooth 5.0 Development Board
  * 37-in-1 Sensor Modules & Actuators STEM Pack
  * Precision Soldering Stations & OLED Temp-Control Wire Kits
* **Textbooks & Engineering Study:**
  * *Introduction to Algorithms (CLRS)* 4th Edition Hardcover (MIT Press)
  * *Halliday & Resnick Fundamentals of Physics* (Wiley Student Global Edition)
  * GATE, GRE, and College Computer Science Compendiums
* **Precision Stationery & Technical Drafting:**
  * rOtring 600 Mechanical Drafting Pencil (0.5mm Full Brass Metal)
  * Pilot G2 Premium Rolling Ball Gel Pens (Pack of 12 Archival Ink)
  * Staedtler Textsurfer Pastel Highlighters
* **STEM Calculators & Gadgets:**
  * Texas Instruments TI-84 Plus CE Color Graphing Calculator
  * Casio FX-991CW ClassWiz Advanced Engineering Scientific Calculator
  * Anker 737 Power Bank (24,000mAh, 140W Fast Charging for Laptops in libraries)
* **Laptops & Student Workstations:**
  * Apple MacBook Air 13-inch (M3 Chip, 16GB Unified RAM, Education Bundle)
  * Lenovo ThinkPad E14 Gen 5 (AMD Ryzen 7, 16GB RAM, Spill-Resistant Keyboard)
* **Smartphones & Wearables:**
  * Google Pixel 8a 5G (Titan M2 Security, Audio Magic Eraser for Lectures)
  * Samsung Galaxy S24 FE Student Edition
* **Campus Backpacks & Dorm Essentials:**
  * The North Face Recon 30L Ergonomic Campus Backpack (16" Laptop Sleeve)
  * BenQ ScreenBar Halo Eye-Care LED Monitor Lamp with Ambient Dial

---

## 3. Multi-Platform Product Extractor & Direct Ordering

UniKart allows students to extract products from any major external e-commerce platform and order them directly through the unified UniKart gateway:

1. **Paste External URL:** Paste any product link from **Amazon**, **Flipkart**, **Best Buy**, or **Arduino Store**.
2. **Automated Parsing (`POST /api/products/extract`):** The backend extractor parses the product title, image, category, brand badge, specifications, and original listing price.
3. **Guaranteed Student Discount:** Calculates a subsidized student tier discount (up to 25% off).
4. **Cryptographic Provenance Token:** Generates an immutable SHA-256 provenance hash.
5. **Direct 1-Click Ordering:** Students complete payment via UniKart without needing separate accounts on external stores.
6. **Upstream Order Sync:** The order state machine links directly to upstream platform fulfillment logs.

---

## 4. Cross-Platform Search & Live Store Availability

The **Multi-Platform Search Explorer (`GET /api/products/search?q=...`)** allows students to search for any item and instantly see where it is available:

* **Direct Availability Badging:** Identifies whether an item is in stock on **Amazon Prime**, **Flipkart Assured**, **Arduino Store Official**, or **Best Buy Campus**.
* **Dual Action Capabilities:**
  * **View on External Platform:** Direct link to original product listing.
  * **Direct Order with Student Discount:** Order directly through UniKart in Indian Rupees (`₹`) with verified student discounts.
* **Instant Dynamic Synthesis:** Even if an item is not in the local catalog, the search engine synthesizes live multi-platform availability with price comparisons in Indian Rupees.

---

## 5. Persistent Student Wishlist & Price Drop Alerts

* **Persistent Student Wishlist (`localStorage`):**
  * Students can save products for upcoming semesters via the interactive **Heart toggle button** on each product card.
  * Dedicated **Student Wishlist Drawer** with 1-click **"Move to Cart"** and **"Add All Saved Items to Cart"**.
* **Smart Price Drop Alert Engine:**
  * Interactive **Bell icon toggle** on each product card and wishlist item.
  * Configure custom target price drop thresholds in Indian Rupees (`-5%`, `-10%`, `-15%`, `-20%`, or custom target in `₹`).
  * Automated real-time notification engine triggers the instant a product's price drops to or below the target threshold.
  * **"Manage Price Alerts"** tab in the User Dashboard with interactive simulation buttons (`⚡ Simulate Price Drop Now`) for instant testing.

---

## 6. Order Lifecycle State Machine & 1-Click Returns

Every order adheres to a deterministic state machine:

$$\text{PLACED} \longrightarrow \text{VERIFIED} \longrightarrow \text{PACKED} \longrightarrow \text{DISPATCHED} \longrightarrow \text{OUT\_FOR\_DELIVERY} \longrightarrow \text{DELIVERED}$$

* **Live State Machine Simulation:** Reviewers and delivery partners can advance order status step-by-step in real time.
* **Automated 1-Click Return Pipeline (`POST /api/orders/:id/return`):**
  * Auto-generates Return Merchandise Authorization (RMA) labels.
  * Automated inspection bot waives deductions for verified `.edu` students.
  * Immediate ledger refund credit dispatched with zero bureaucratic delays.
* **100% Zero-Penalty Order Cancellation (`POST /api/orders/:id/cancel`):**
  * Instant full refund prior to campus dorm courier dispatch.

---

## 7. System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│             Presentation Layer (Client SPA)            │
│  React 19 • TypeScript • Tailwind CSS • Zustand • Vite │
│  Zero Dark Pattern Shield • Indian Rupee (₹) Display   │
└──────────────────────────┬─────────────────────────────┘
                           │ TLS 1.3 / JSON REST API
┌──────────────────────────▼─────────────────────────────┐
│          API Gateway & Security Middleware             │
│  Sliding-Window Rate Limiting • Strict CORS • OWASP    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                Express Service Layer                   │
│  AuthController • ProductController • OrderController │
│  ExtractorService • DistributedLockService (Redis)     │
│  WebhookSignatureService (HMAC-SHA256)                 │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
┌─────────────▼──────────────┐ ┌───────────▼─────────────┐
│   PostgreSQL 16 Database   │ │      Redis 7 Cache      │
│  ACID Relational Storage   │ │ Distributed Locks (TTL) │
│  Users, Orders, Crypto Logs│ │ Cart Cache, Rate Limiter│
└────────────────────────────┘ └─────────────────────────┘
```

* **Frontend:** React 19, TypeScript, Tailwind CSS, Zustand, Lucide Icons, Vite
* **Backend:** Node.js, Express (Controller-Service-Repository pattern), tsx
* **Currency:** Indian Rupee (INR `₹`) with `en-IN` number formatting and multi-currency support (USD, EUR, GBP)
* **Databases:** PostgreSQL 16 (ACID Relational) + Redis 7 (Distributed Locking & Sliding Window Rate Limiting)

---

## 8. Database Schema (PostgreSQL 16)

```sql
-- Core Relational Tables Overview
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) DEFAULT 'student' NOT NULL, -- student, vendor, delivery, admin
    student_id VARCHAR(64),
    verified_student BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    platform VARCHAR(32) NOT NULL, -- UniKart, Amazon, Flipkart, BestBuy, ArduinoStore
    platform_url TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    crypto_batch_hash VARCHAR(64) NOT NULL,
    campus_verification_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(32) DEFAULT 'PLACED' NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) NOT NULL,
    shipping NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    payment_transaction_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cryptographic_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) NOT NULL,
    entry_type VARCHAR(32) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    immutable_sha256_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

*(Full DDL migration script is viewable and copyable via the in-app **Architecture & ER** modal).*

---

## 9. Enterprise Security & OWASP Mitigation

* **Sliding-Window Rate Limiting:** Prevents denial-of-service and credential stuffing attacks on sensitive endpoints.
* **Cryptographic Webhook Verification:** Validates HMAC-SHA256 signatures for payment callbacks (Stripe, UPI/Razorpay, PayPal) using timing-safe comparisons to prevent spoofing.
* **Distributed Locking (Redis SETNX):** Enforces distributed locks during flash sales to prevent race conditions, double charging, and inventory overselling.
* **Data Sanitization & Injection Defense:** Parameterized queries and strict Zod input validation schemas.

---

## 10. Local Development & Docker Deployment

### Prerequisites
* Node.js 20+ / 22+
* npm 10+
* Docker & Docker Compose (optional for containerized run)

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Express backend + Vite client)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Containerized Deployment (Docker Compose)
To start the entire production stack (App + PostgreSQL 16 + Redis 7) with a single command:
```bash
docker compose up --build -d
```
* **App:** `http://localhost:3000`
* **PostgreSQL:** Port `5432`
* **Redis:** Port `6379`

---

## 11. Testing & QA Suite

UniKart includes an interactive, in-app test runner accessible from the top navigation bar:

* **Unit Tests (Vitest/Jest):**
  * `DistributedLockService.test.ts`: Verifies distributed lock acquisition, release, and race condition prevention.
  * `WebhookSignatureService.test.ts`: Validates HMAC-SHA256 signature verification and payload spoofing rejection.
  * `TransparentPricingEngine.test.ts`: Asserts zero hidden convenience fees and upfront itemization.
  * `CryptoProvenance.test.ts`: Validates Merkle batch hashes against campus lab public keys.
* **End-to-End Tests (Playwright):**
  * `student_checkout_journey.spec.ts`: Signup $\rightarrow$ Search $\rightarrow$ Extract Amazon URL $\rightarrow$ Zero Hidden Fee Cart $\rightarrow$ Campus ID Checkout $\rightarrow$ Order Lifecycle Tracking.
  * `automated_returns.spec.ts`: Order $\rightarrow$ Request 1-Click Return $\rightarrow$ Automated Bot Approval $\rightarrow$ Immediate Ledger Refund Credit.

---

## 📄 License
Apache-2.0 License. Designed for students, academic maker labs, and open e-commerce innovation.
