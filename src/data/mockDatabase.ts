import { Product, User } from '../types';

export const SAMPLE_USERS: User[] = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@stanford.edu',
    role: 'student',
    studentId: 'STU-2026-8894',
    universityName: 'Stanford University (CS & Robotics)',
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletBalance: 145.50,
  },
  {
    id: 'usr_vendor_01',
    name: 'Campus Hardware & Electronics Lab',
    email: 'lab-supplies@campus-vendor.org',
    role: 'vendor',
    verifiedStudent: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    walletBalance: 4280.00,
  },
  {
    id: 'usr_delivery_01',
    name: 'Campus Swift Express',
    email: 'dispatch@campusswift.edu',
    role: 'delivery',
    verifiedStudent: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    walletBalance: 320.00,
  },
  {
    id: 'usr_admin_01',
    name: 'UniKart Security Operations',
    email: 'superadmin@unikart.internal',
    role: 'admin',
    verifiedStudent: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    walletBalance: 0.00,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_arduino_r4',
    title: 'Official Arduino Uno R4 WiFi + IoT Starter Kit',
    subtitle: 'Renesas RA4M1 32-bit ARM Cortex-M4 + ESP32-S3 WiFi & Bluetooth with 35 Project Components',
    description: 'Designed specifically for engineering students, robotics labs, and IoT semester projects. Comes with an onboard 12x8 LED matrix, Qwiic I2C connector, sensors, relays, breadboard, and step-by-step lab tutorials.',
    category: 'project-electronics',
    price: 48.00,
    originalPrice: 65.00,
    studentDiscountPercent: 26,
    rating: 4.9,
    reviewCount: 382,
    images: [
      'https://images.unsplash.com/photo-1608555855762-2b657eb1c348?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    ],
    platform: 'ArduinoStore',
    platformUrl: 'https://store.arduino.cc/products/uno-r4-wifi',
    platformLogo: 'arduino',
    inStock: true,
    stockCount: 84,
    tags: ['Arduino', 'Robotics', 'IoT', 'Microcontroller', 'Semester Project'],
    specs: {
      'Microcontroller': 'Renesas RA4M1 (Arm Cortex-M4)',
      'Wireless': 'ESP32-S3 (Wi-Fi 802.11 b/g/n + BT 5.0)',
      'Operating Voltage': '5V',
      'Clock Speed': '48 MHz',
      'LED Matrix': '12x8 (96 red LEDs)'
    },
    vendorName: 'Arduino Official Lab Supply',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '8f7a6b2c9d1e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      vendorSignature: 'ECDSA-SHA256:3045022100e4b89d421...9b1f09',
      campusVerificationId: 'STANFORD-EE-LAB-2026-A12',
      manufacturer: 'Arduino S.r.l. (Ivrea, Italy)',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-15T14:30:00Z',
      serialNumberPattern: 'ARD-UNO-R4-WF-######'
    },
    transparentPricing: {
      basePrice: 48.00,
      estimatedTax: 3.84,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 51.84
    },
    returnPolicyDays: 14
  },
  {
    id: 'prod_rpi_5',
    title: 'Raspberry Pi 5 (8GB RAM) Complete Student Developer Bundle',
    subtitle: 'Quad-core Arm Cortex-A76 2.4GHz with Active Cooler, 128GB A2 MicroSD & 27W USB-C PSU',
    description: 'Perfect for computer science coursework, computer vision, AI model edge inference, and home server labs. Includes official cooling fan, aluminum case, and pre-flashed Debian Bookworm OS.',
    category: 'project-electronics',
    price: 94.00,
    originalPrice: 120.00,
    studentDiscountPercent: 21,
    rating: 4.95,
    reviewCount: 512,
    images: [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    ],
    platform: 'Amazon',
    platformUrl: 'https://www.amazon.com/dp/B0CSK7XJ15',
    platformLogo: 'amazon',
    inStock: true,
    stockCount: 42,
    tags: ['Raspberry Pi', 'Linux', 'Single Board Computer', 'Python', 'AI Edge'],
    specs: {
      'CPU': 'Broadcom BCM2712 2.4GHz quad-core 64-bit Arm Cortex-A76',
      'RAM': '8GB LPDDR4X-4267 SDRAM',
      'Display Output': 'Dual 4Kp60 HDMI',
      'PCIe Interface': 'PCIe 2.0 x1 for fast M.2 NVMe'
    },
    vendorName: 'Raspberry Pi Foundation Authorized Distro',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '4d8e2a1b9c0f3e7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
      vendorSignature: 'ECDSA-SHA256:71a24d8b9e...01c4f52',
      campusVerificationId: 'RPI-VERIFIED-DIST-902',
      manufacturer: 'Raspberry Pi Ltd (Cambridge, UK)',
      authenticityStatus: 'Original Batch Audited',
      auditTimestamp: '2026-10-20T09:15:00Z',
      serialNumberPattern: 'RPI5-8GB-GB-######'
    },
    transparentPricing: {
      basePrice: 94.00,
      estimatedTax: 7.52,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 101.52
    },
    returnPolicyDays: 14
  },
  {
    id: 'prod_clrs_algorithms',
    title: 'Introduction to Algorithms (CLRS) 4th Edition Hardcover',
    subtitle: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein - MIT Press',
    description: 'The authoritative global standard textbook for computer science data structures and algorithm design. Completely updated with new chapters on bipartite graphs, online algorithms, and machine learning foundation.',
    category: 'books',
    price: 68.00,
    originalPrice: 110.00,
    studentDiscountPercent: 38,
    rating: 4.88,
    reviewCount: 940,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb9?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'Flipkart',
    platformUrl: 'https://www.flipkart.com/introduction-algorithms-4th-edition/p/itmf873',
    platformLogo: 'flipkart',
    inStock: true,
    stockCount: 65,
    tags: ['Algorithms', 'Computer Science', 'Textbook', 'MIT Press', 'Data Structures'],
    specs: {
      'Edition': '4th Revised Global Edition',
      'Publisher': 'The MIT Press',
      'Pages': '1,312 pages',
      'ISBN-13': '978-0262046305',
      'Format': 'Hardcover with digital solution key'
    },
    vendorName: 'Academic Bookstore Consortium',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '3a5b7c9d1e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b',
      vendorSignature: 'ECDSA-SHA256:88fa2b1049c...99de23a',
      campusVerificationId: 'MIT-PRESS-AUTH-8821',
      manufacturer: 'MIT Press / Academic Direct',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-09-28T11:00:00Z',
      serialNumberPattern: 'MIT-CLRS-4E-######'
    },
    transparentPricing: {
      basePrice: 68.00,
      estimatedTax: 5.44,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 73.44
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_rotring_600',
    title: 'rOtring 600 Precision Mechanical Drafting Pencil 0.5mm',
    subtitle: 'Full Metal Hexagonal Brass Barrel, Fixed Lead Guidance Sleeve, Matte Black Finish',
    description: 'Iconic tool of engineering, architecture, and mathematics students worldwide. Ergonomic knurled grip prevents slipping during 4-hour exam sessions and drafting labs.',
    category: 'stationery',
    price: 24.50,
    originalPrice: 38.00,
    studentDiscountPercent: 35,
    rating: 4.92,
    reviewCount: 620,
    images: [
      'https://images.unsplash.com/photo-1585336261026-62187f5d6f83?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'Amazon',
    platformUrl: 'https://www.amazon.com/dp/B00JEY327A',
    platformLogo: 'amazon',
    inStock: true,
    stockCount: 110,
    tags: ['Stationery', 'Drafting', 'Engineering', 'Mechanical Pencil', 'Rotring'],
    specs: {
      'Lead Size': '0.5 mm',
      'Body Material': 'Full Brass Metal',
      'Grip Type': 'Non-slip Knurled Metal',
      'Weight': '22 grams'
    },
    vendorName: 'Newell Brands Student Desk',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a',
      vendorSignature: 'ECDSA-SHA256:12c45f9a...32dd89',
      campusVerificationId: 'ROTRING-CERT-GERMANY-404',
      manufacturer: 'rOtring (Hamburg, Germany)',
      authenticityStatus: 'Original Batch Audited',
      auditTimestamp: '2026-10-01T10:00:00Z',
      serialNumberPattern: 'RTR-600-05-######'
    },
    transparentPricing: {
      basePrice: 24.50,
      estimatedTax: 1.96,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 26.46
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_ti84_ce',
    title: 'Texas Instruments TI-84 Plus CE Color Graphing Calculator',
    subtitle: 'Backlit High-Res Color Screen, Rechargeable Battery, MathPrint Equation Display',
    description: 'Approved for SAT, ACT, AP Calculus, AP Statistics, and college engineering exams. Slim durable casing with preloaded Python programming application for math simulations.',
    category: 'gadgets-calculators',
    price: 118.00,
    originalPrice: 155.00,
    studentDiscountPercent: 24,
    rating: 4.86,
    reviewCount: 1240,
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'BestBuy',
    platformUrl: 'https://www.bestbuy.com/site/texas-instruments-ti-84-plus-ce/6334521.p',
    platformLogo: 'bestbuy',
    inStock: true,
    stockCount: 38,
    tags: ['Calculator', 'TI-84', 'Calculus', 'STEM', 'Graphing', 'Exam Approved'],
    specs: {
      'Screen': '320 x 240 pixels (2.8" diagonal) 16-bit color',
      'Battery': 'Rechargeable TI lithium-ion battery (up to 1 month per charge)',
      'Storage': '3.0 MB Flash ROM / 154 KB RAM',
      'Connectivity': 'USB computer link cable included'
    },
    vendorName: 'BestBuy Campus Tech Depot',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '9c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d',
      vendorSignature: 'ECDSA-SHA256:45bc90fe...77102a',
      campusVerificationId: 'TI-AUTH-DIST-2026-US',
      manufacturer: 'Texas Instruments Education Technology',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-18T16:00:00Z',
      serialNumberPattern: 'TI84CE-CLR-######'
    },
    transparentPricing: {
      basePrice: 118.00,
      estimatedTax: 9.44,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 127.44
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_macbook_air_m3',
    title: 'Apple MacBook Air 13-inch (M3 Chip, 16GB RAM, 512GB SSD)',
    subtitle: 'Midnight Finish, Liquid Retina Display, 18-Hour Battery Life, MagSafe 3 Charging',
    description: 'The supreme student workstation for code compilation, data science notebooks, video editing, and all-day lecture notes without carrying a charger. Verified student discount tier applied.',
    category: 'laptops-tablets',
    price: 1049.00,
    originalPrice: 1299.00,
    studentDiscountPercent: 19,
    rating: 4.97,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'CampusStore',
    platformUrl: 'https://campus-store.edu/apple/macbook-air-m3',
    platformLogo: 'campus',
    inStock: true,
    stockCount: 15,
    tags: ['MacBook', 'Apple Silicon', 'M3', 'Laptop', 'Student Education Bundle'],
    specs: {
      'Processor': 'Apple M3 8-core CPU / 10-core GPU',
      'Unified Memory': '16GB Unified RAM (Fast compile times)',
      'Storage': '512GB High-speed NVMe SSD',
      'Weight': '2.7 pounds (1.24 kg)'
    },
    vendorName: 'Official University Campus Tech Store',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      vendorSignature: 'ECDSA-SHA256:9988aaff...112233',
      campusVerificationId: 'APPLE-CAMPUS-EDU-AFFILIATE-01',
      manufacturer: 'Apple Inc. (Cupertino, CA)',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-25T08:00:00Z',
      serialNumberPattern: 'APL-M3-MBA-######'
    },
    transparentPricing: {
      basePrice: 1049.00,
      estimatedTax: 83.92,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 1132.92
    },
    returnPolicyDays: 14
  },
  {
    id: 'prod_pixel_8a',
    title: 'Google Pixel 8a 5G (128GB, Bay Blue) - Student Flagship',
    subtitle: 'Google Tensor G3, Best-in-Class Student AI Camera, 120Hz OLED, 7 Years OS Updates',
    description: 'Perfect student smartphone with Audio Magic Eraser for lecture recordings, Circle to Search for homework problems, and Titan M2 hardware security chip.',
    category: 'mobiles-wearables',
    price: 399.00,
    originalPrice: 499.00,
    studentDiscountPercent: 20,
    rating: 4.81,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'Flipkart',
    platformUrl: 'https://www.flipkart.com/google-pixel-8a-bay-128-gb/p/itmd5b12',
    platformLogo: 'flipkart',
    inStock: true,
    stockCount: 22,
    tags: ['Google Pixel', 'Android', 'Tensor G3', 'Smartphone', '5G'],
    specs: {
      'Display': '6.1" Actua OLED 120Hz HDR',
      'Processor': 'Google Tensor G3 + Titan M2 security',
      'Battery': '4492 mAh with 24+ hour Adaptive Battery',
      'Security': 'Fingerprint Unlock + Face Unlock'
    },
    vendorName: 'Google Verified Electronics Partner',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
      vendorSignature: 'ECDSA-SHA256:334455aa...667788',
      campusVerificationId: 'GOOG-HW-AUTH-5501',
      manufacturer: 'Google LLC (Mountain View, CA)',
      authenticityStatus: 'Original Batch Audited',
      auditTimestamp: '2026-10-12T13:45:00Z',
      serialNumberPattern: 'GPX-8A-BAY-######'
    },
    transparentPricing: {
      basePrice: 399.00,
      estimatedTax: 31.92,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 430.92
    },
    returnPolicyDays: 15
  },
  {
    id: 'prod_north_face_recon',
    title: 'The North Face Recon 30L Campus & Tech Backpack',
    subtitle: 'Endorsed by American Chiropractic Association, FlexVent Suspension, 16" Padded Laptop Pocket',
    description: 'Built to haul heavy textbooks, laptops, electronics project boards, and water bottles across sprawling campuses without shoulder strain. Stand-up design keeps books dry.',
    category: 'backpacks-bags',
    price: 79.00,
    originalPrice: 109.00,
    studentDiscountPercent: 27,
    rating: 4.91,
    reviewCount: 780,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'Amazon',
    platformUrl: 'https://www.amazon.com/dp/B082T2V99J',
    platformLogo: 'amazon',
    inStock: true,
    stockCount: 54,
    tags: ['Backpack', 'The North Face', 'Laptop Bag', 'Campus Commuter', 'Waterproof'],
    specs: {
      'Capacity': '30 Liters',
      'Laptop Sleeve': 'Fits up to 16-inch MacBook Pro / ThinkPad',
      'Fabric': 'Recycled 210D ripstop nylon with non-PFC DWR water finish',
      'Certification': 'ACA Certified Ergonomic Support'
    },
    vendorName: 'The North Face Authorized Campus Retailer',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      vendorSignature: 'ECDSA-SHA256:778899bb...223344',
      campusVerificationId: 'TNF-GENUINE-GEAR-880',
      manufacturer: 'The North Face / VF Corporation',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-10T12:00:00Z',
      serialNumberPattern: 'TNF-RCN-30L-######'
    },
    transparentPricing: {
      basePrice: 79.00,
      estimatedTax: 6.32,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 85.32
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_benq_screenbar',
    title: 'BenQ ScreenBar Halo Eye-Care LED Monitor Study Lamp',
    subtitle: 'Auto-Dimming Ambient Sensor, Zero Screen Glare, Wireless Desktop Dial Controller',
    description: 'Saves desk space in tight dorm rooms and library cubicles. Patented asymmetrical optical design illuminates keyboard and study notes with 0% screen reflection to prevent late-night eye fatigue.',
    category: 'dorm-essentials',
    price: 129.00,
    originalPrice: 179.00,
    studentDiscountPercent: 28,
    rating: 4.89,
    reviewCount: 360,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'UniKart',
    platformLogo: 'unikart',
    inStock: true,
    stockCount: 29,
    tags: ['Study Light', 'Eye Care', 'BenQ', 'Dorm Desk', 'Ergonomics'],
    specs: {
      'Light Source': 'Dual Color LED (2700K - 6500K ANSI White)',
      'Illuminance': '1000 Lux in center (height 45cm)',
      'Power Input': 'USB-A / USB-C 5V 1.3A',
      'Backlight': 'Integrated rear ambient bias lighting'
    },
    vendorName: 'BenQ Campus Ergonomics Lab',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      vendorSignature: 'ECDSA-SHA256:556677cc...889900',
      campusVerificationId: 'BENQ-STUDY-EYECARE-331',
      manufacturer: 'BenQ Corp (Taipei, Taiwan)',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-14T17:20:00Z',
      serialNumberPattern: 'BNQ-SBH-LED-######'
    },
    transparentPricing: {
      basePrice: 129.00,
      estimatedTax: 10.32,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 139.32
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_iot_sensors_pack',
    title: '37-in-1 Ultimate STEM Sensors & Actuators Lab Pack',
    subtitle: 'Ultrasonic Distance, Gyro/Accel MPU6050, DHT22 Temp/Humidity, Relay, Soil Moisture & Servo',
    description: 'Everything an engineering, robotics, or physics student needs for semester projects and capstones. Compatible with Arduino, Raspberry Pi, ESP32, and STM32.',
    category: 'project-electronics',
    price: 32.00,
    originalPrice: 45.00,
    studentDiscountPercent: 29,
    rating: 4.87,
    reviewCount: 240,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'UniKart',
    platformLogo: 'unikart',
    inStock: true,
    stockCount: 75,
    tags: ['Sensors', 'Robotics', 'Arduino', 'Capstones', 'STEM Modules'],
    specs: {
      'Modules Count': '37 distinct sensor & module boards',
      'Pinout': 'Standard 2.54mm pitch DuPont header pinouts',
      'Voltage Range': '3.3V to 5V dual compatibility',
      'Case': 'Organized dual-tier snap lock component box'
    },
    vendorName: 'Campus Hardware & Electronics Lab',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
      vendorSignature: 'ECDSA-SHA256:112233dd...445566',
      campusVerificationId: 'STEM-SENSOR-CERT-2026',
      manufacturer: 'MakerSpace Global Supplies',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-19T10:00:00Z',
      serialNumberPattern: 'ST-37S-KIT-######'
    },
    transparentPricing: {
      basePrice: 32.00,
      estimatedTax: 2.56,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 34.56
    },
    returnPolicyDays: 14
  },
  {
    id: 'prod_pilot_g2_pens',
    title: 'Pilot G2 Premium Rolling Ball Gel Pens (Pack of 12, 0.7mm Fine)',
    subtitle: 'Archival-Quality Smooth Black Ink, Contoured Rubber Grip, Longest Writing Gel Pen',
    description: 'The ubiquitous student classic for lecture notes, problem sets, and lab write-ups. Smear-resistant, quick-drying formula with refillable ink.',
    category: 'stationery',
    price: 13.99,
    originalPrice: 19.99,
    studentDiscountPercent: 30,
    rating: 4.94,
    reviewCount: 1890,
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'Amazon',
    platformUrl: 'https://www.amazon.com/dp/B001GAOTSW',
    platformLogo: 'amazon',
    inStock: true,
    stockCount: 180,
    tags: ['Pens', 'Pilot G2', 'Stationery', 'Notes', 'Exams'],
    specs: {
      'Point Size': '0.7 mm Fine',
      'Ink Color': 'Black (Archival Safe)',
      'Quantity': '12 pens in box',
      'Refillable': 'Yes (Pilot G2 Refills)'
    },
    vendorName: 'Pilot Pen Official Campus Distro',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
      vendorSignature: 'ECDSA-SHA256:667788ee...990011',
      campusVerificationId: 'PILOT-JAPAN-AUTHENTIC-220',
      manufacturer: 'Pilot Corporation (Tokyo, Japan)',
      authenticityStatus: 'Original Batch Audited',
      auditTimestamp: '2026-10-05T09:30:00Z',
      serialNumberPattern: 'PLT-G2-07-######'
    },
    transparentPricing: {
      basePrice: 13.99,
      estimatedTax: 1.12,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 15.11
    },
    returnPolicyDays: 30
  },
  {
    id: 'prod_thinkpad_e14',
    title: 'Lenovo ThinkPad E14 Gen 5 (AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD)',
    subtitle: 'Legendary Spill-Resistant Keyboard, TrackPoint, MIL-STD 810H Military Durability, WUXGA IPS',
    description: 'Designed for STEM and coding students needing indestructible build quality, exceptional tactile keyboard travel, and Linux-certified hardware compatibility.',
    category: 'laptops-tablets',
    price: 649.00,
    originalPrice: 899.00,
    studentDiscountPercent: 28,
    rating: 4.84,
    reviewCount: 195,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    platform: 'BestBuy',
    platformUrl: 'https://www.bestbuy.com/site/lenovo-thinkpad-e14/6548901.p',
    platformLogo: 'bestbuy',
    inStock: true,
    stockCount: 18,
    tags: ['ThinkPad', 'Lenovo', 'Laptop', 'Linux Ready', 'Coding'],
    specs: {
      'CPU': 'AMD Ryzen 7 7730U (8 cores, 16 threads, up to 4.5 GHz)',
      'Display': '14.0" WUXGA (1920 x 1200) IPS Anti-glare 300 nits',
      'Keyboard': 'Backlit, Spill-resistant with TrackPoint',
      'Ports': 'USB-C 3.2 Gen 2, HDMI 1.4b, RJ45 Gigabit Ethernet, Audio Jack'
    },
    vendorName: 'Lenovo University Direct',
    vendorVerified: true,
    cryptoProvenance: {
      batchHash: '3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
      vendorSignature: 'ECDSA-SHA256:443322aa...778899',
      campusVerificationId: 'LNV-EDU-THINK-2026',
      manufacturer: 'Lenovo Group Ltd',
      authenticityStatus: 'Cryptographically Verified',
      auditTimestamp: '2026-10-22T14:15:00Z',
      serialNumberPattern: 'LNV-TP-E14-######'
    },
    transparentPricing: {
      basePrice: 649.00,
      estimatedTax: 51.92,
      studentShipping: 0.00,
      platformFee: 0.00,
      guaranteedTotal: 700.92
    },
    returnPolicyDays: 14
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord_student_78901',
    orderNumber: 'UK-2026-89410',
    userId: 'usr_student_01',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Arduino Uno R4
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[3], // Rotring pencil
        quantity: 1
      }
    ],
    subtotal: 72.50,
    discount: 0.00,
    tax: 5.80,
    shipping: 0.00,
    total: 78.30,
    currency: 'USD',
    status: 'OUT_FOR_DELIVERY' as const,
    createdAt: '2026-11-01T15:24:00Z',
    updatedAt: '2026-11-02T08:45:00Z',
    shippingAddress: {
      fullName: 'Alex Rivera',
      campusDorm: 'Crothers Memorial Hall, Room 314-B',
      street: '450 Jane Stanford Way',
      city: 'Stanford',
      postalCode: '94305',
      phone: '+1 (650) 555-0199'
    },
    paymentMethod: 'CAMPUS_CARD' as const,
    paymentTransactionId: 'TXN_CAMPUS_CARD_99214',
    paymentSignatureVerified: true,
    trackingSteps: [
      {
        status: 'PLACED' as const,
        title: 'Order Placed & Price Guaranteed',
        description: 'Zero hidden fees verified. Student discount applied.',
        timestamp: 'Nov 1, 2026, 3:24 PM',
        completed: true,
        current: false
      },
      {
        status: 'VERIFIED' as const,
        title: 'Cryptographic Authenticity Verified',
        description: 'SHA-256 batch hash match confirmed with Arduino Official Lab.',
        timestamp: 'Nov 1, 2026, 3:30 PM',
        completed: true,
        current: false
      },
      {
        status: 'PACKED' as const,
        title: 'Dispatched to Campus Fulfillment Hub',
        description: 'Packed in eco-friendly protective sleeve with lab warranty card.',
        timestamp: 'Nov 1, 2026, 6:15 PM',
        completed: true,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY' as const,
        title: 'Out for Campus Dorm Delivery',
        description: 'Campus Swift courier is en route to Crothers Memorial Hall.',
        timestamp: 'Nov 2, 2026, 8:45 AM',
        completed: true,
        current: true
      },
      {
        status: 'DELIVERED' as const,
        title: 'Delivered to Student',
        description: 'Handed over directly or secured at campus mail lockers.',
        timestamp: 'Estimated Today by 11:30 AM',
        completed: false,
        current: false
      }
    ],
    upstreamPlatformSync: {
      platform: 'ArduinoStore' as const,
      upstreamOrderId: 'ARD-STORE-DIRECT-7821',
      syncStatus: 'SYNCHRONIZED' as const
    }
  }
];
