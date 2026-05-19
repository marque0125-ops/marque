export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  country: string;
  established: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  date: string;
  avatar: string;
  images?: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceOverride?: number;
  stockQty: number;
  attributes: {
    color?: string;
    battery?: string;
  };
}

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number;
  sku: string;
  weightGrams: number;
  scale: string;
  terrainType: 'On-Road' | 'Off-Road' | 'Crawler' | 'Drift';
  isFeatured: boolean;
  isActive: boolean;
  speedKmh: number;
  buildType: 'RTR' | 'Kit';
  images: string[];
  videoUrl?: string;
  whatsInTheBox: string[];
  specs: Record<string, string>;
  compatibleParts: { name: string; price: number; sku: string }[];
  variants: ProductVariant[];
  stockQty: number;
  averageRating: number;
  reviewCount: number;
}

export interface RCGuide {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageUrl: string;
  content: string;
}

export const BRANDS: Brand[] = [
  {
    id: "b1",
    name: "TRAXXAS",
    slug: "traxxas",
    logoUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    description: "The absolute gold standard in high-performance RC. Traxxas is renowned for unmatched durability, waterproof electronics, and brutal speed. From the legendary Slash to the massive X-Maxx, Traxxas dominates both off-road bashers and extreme speed runs.",
    country: "USA",
    established: "1986"
  },
  {
    id: "b2",
    name: "ARRMA",
    slug: "arrma",
    logoUrl: "https://images.unsplash.com/photo-1531693251400-38df35776dc7?w=400&q=80",
    description: "Built for high-speed, heavy-duty bashing. ARRMA designs machines that take incredible punishment and keep going. Known for their metal chassis plates and aggressive stance, they define what it means to be 'Designed Fast, Designed Tough'.",
    country: "UK",
    established: "2009"
  },
  {
    id: "b3",
    name: "RLAARLO",
    slug: "rlaarlo",
    logoUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
    description: "The rising star of carbon-fiber and all-metal micro speed demons. Rlaarlo delivers incredible value with high-spec, aluminum-upgraded chassis right out of the box, perfect for drift enthusiasts and high-speed enthusiasts looking for premium pocket-rockets.",
    country: "Hong Kong",
    established: "2021"
  },
  {
    id: "b4",
    name: "MJX",
    slug: "mjx",
    logoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
    description: "The ultimate choice for budget-friendly brushless power. Under their 'Hyper Go' series, MJX makes ultra-durable, insanely fast 1:16 and 1:14 bashers that defy their price point, equipped with GPS telemetry support and metal drivetrains.",
    country: "China",
    established: "1983"
  },
  {
    id: "b5",
    name: "FMS",
    slug: "fms",
    logoUrl: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&q=80",
    description: "Masterpieces of scale realism. FMS focuses on hyper-detailed, officially licensed scale crawlers and military rigs. From functional lights and folding windshields to two-speed metal gearboxes, they look as stunning on a display shelf as they do crawling technical trails.",
    country: "China",
    established: "2007"
  },
  {
    id: "b6",
    name: "MN MODEL",
    slug: "mn-model",
    logoUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80",
    description: "The gateway to hardcore scale crawling and upgrades. Famous for their highly accurate Defender and Land Cruiser representations, MN Model offers the perfect foundation for customization, custom weathering, and trail crawling on a budget.",
    country: "China",
    established: "2013"
  },
  {
    id: "b7",
    name: "HOT WHEELS",
    slug: "hot-wheels",
    logoUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    description: "Pure performance and custom speed on a miniature scale. Their premium R/C line brings the iconic, wild custom car designs from toy boxes to real-life living room drift tracks and stunt ramps, built with high-frequency control and fast charging.",
    country: "USA",
    established: "1968"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    brandId: "b1",
    categoryId: "crawler",
    name: "Traxxas X-Maxx 8S Brushless",
    slug: "traxxas-x-maxx-8s-brushless",
    description: "The ultimate monster truck. Brutal 8S power, massive scale size, and an innovative self-righting system make the Traxxas X-Maxx a force of nature. It features a revolutionary clipless body mount, modular chassis design, and steel driveshafts that handle the violent torque of its Velineon 1200XL brushless motor.",
    price: 99900,
    comparePrice: 114900,
    sku: "TX-XMAXX-8S-BLK",
    weightGrams: 8660,
    scale: "1:8",
    terrainType: "Off-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 80,
    buildType: "RTR",
    images: [
      "/rc_traxxas_xmaxx.png",
      "/rc_traxxas_xmaxx.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Simulated review video
    whatsInTheBox: [
      "X-Maxx Ready-To-Race model with Traxxas Big Block brushless motor",
      "VXL-8s Waterproof Electronic Speed Control",
      "TQi™ 2.4GHz Radio System with Traxxas Link Wireless Module",
      "Quick Start Guide",
      "Maintenance Tools (Hex & Suspension wrenches)"
    ],
    specs: {
      "Length": "779 mm",
      "Width": "540 mm",
      "Ground Clearance": "102 mm",
      "Weight": "8.66 kg",
      "Speed Control": "Velineon VXL-8s™",
      "Motor (electric)": "Velineon® 1200XL Brushless",
      "Chassis Material": "Composite Nylon Tub",
      "Drive System": "Shaft-Driven 4WD",
      "Steering": "Dual Bellcrank with High-Torque Servo",
      "Radio System": "TQi™ 2.4GHz Transmitter with TSM® Receiver"
    },
    compatibleParts: [
      { name: "Traxxas 4S 6700mAh LiPo Battery Pack", price: 9500, sku: "TX-2890X" },
      { name: "Heavy Duty Suspension Arm Set (Red)", price: 2900, sku: "TX-7730R" },
      { name: "EZ-Peak Live Dual 8-Amp LiPo Charger", price: 11900, sku: "TX-2973" },
      { name: "Steel Center Driveshaft Upgrade", price: 4200, sku: "TX-7756" }
    ],
    variants: [
      {
        id: "p1-v1",
        name: "Solar Flare Orange / No Batteries",
        sku: "TX-XMAXX-8S-ORN",
        stockQty: 8,
        attributes: { color: "Solar Flare Orange", battery: "No Batteries (Requires 2x 4S)" }
      },
      {
        id: "p1-v2",
        name: "Rock n Roll Blue / No Batteries",
        sku: "TX-XMAXX-8S-BLU",
        stockQty: 4,
        attributes: { color: "Rock n Roll Blue", battery: "No Batteries (Requires 2x 4S)" }
      },
      {
        id: "p1-v3",
        name: "Solar Flare Orange / Dual 4S LiPo & Charger Bundle",
        sku: "TX-XMAXX-8S-ORN-BNDL",
        priceOverride: 124900,
        stockQty: 3,
        attributes: { color: "Solar Flare Orange", battery: "Dual 4S LiPo + Dual Charger Bundle" }
      },
      {
        id: "p1-v4",
        name: "Stealth Carbon / No Batteries",
        sku: "TX-XMAXX-8S-BLK",
        stockQty: 2,
        attributes: { color: "Stealth Carbon Black", battery: "No Batteries (Requires 2x 4S)" }
      }
    ],
    stockQty: 17,
    averageRating: 4.9,
    reviewCount: 42
  },
  {
    id: "p2",
    brandId: "b2",
    categoryId: "street-basher",
    name: "Arrma Infraction 6S BLX V2",
    slug: "arrma-infraction-6s-blx-v2",
    description: "The ultimate street basher. Take pavement drifting and high-speed highway pulls to the next level with 130+ km/h out-of-the-box performance. Featuring an active handbrake operated from the DX3 transmitter, Spektrum Smart electronics, and a stunning aerodynamics pack, the Infraction is designed to shred tires with raw 6S brushless power.",
    price: 74900,
    comparePrice: 82900,
    sku: "AR-INFRACTION-6S",
    weightGrams: 5000,
    scale: "1:8",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 130,
    buildType: "RTR",
    images: [
      "/rc_arrma_infraction.png",
      "/rc_arrma_infraction.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "ARRMA® INFRACTION® 6S BLX 1/7 All-Road Street Bash Truck",
      "Spektrum® Firma™ 150A Smart ESC (installed)",
      "Spektrum® Firma™ 4074 2050Kv Brushless Motor (installed)",
      "Spektrum® SPMS651 Metal-Geared Digital Servo (installed)",
      "Spektrum® DX3™ Smart 2.4GHz Transmitter",
      "Product Manual & Tool Set"
    ],
    specs: {
      "Length": "695 mm",
      "Width": "310 mm",
      "Chassis": "6061-T6 Aluminum Plate",
      "Suspension": "Independent, oil-filled shocks",
      "Drivetrain": "4WD Shaft-Driven",
      "Speed Control": "Spektrum Firma 150A Smart ESC",
      "Motor": "Spektrum Firma 4074 2050Kv Brushless",
      "Handbrake": "Mechanical disc system operated via servo"
    },
    compatibleParts: [
      { name: "Hoons 42/100 2.9 Belted Tires (Silver compound)", price: 3500, sku: "AR-550085" },
      { name: "Spektrum 3S 5000mAh Smart LiPo Battery", price: 6200, sku: "SP-3S-5000" },
      { name: "Rear Carbon Fiber Diffuser", price: 4800, sku: "AR-320500" }
    ],
    variants: [
      {
        id: "p2-v1",
        name: "Matte Blue/Bronze Finish / No Battery",
        sku: "AR-INF-6S-BLU",
        stockQty: 5,
        attributes: { color: "Matte Blue & Bronze", battery: "No Batteries (Requires 2x 3S)" }
      },
      {
        id: "p2-v2",
        name: "Fire Smoke Red / No Battery",
        sku: "AR-INF-6S-RED",
        stockQty: 3,
        attributes: { color: "Fire Smoke Red", battery: "No Batteries (Requires 2x 3S)" }
      },
      {
        id: "p2-v3",
        name: "Fire Smoke Red / Dual Spektrum 3S & Charger Bundle",
        sku: "AR-INF-6S-RED-BNDL",
        priceOverride: 91900,
        stockQty: 2,
        attributes: { color: "Fire Smoke Red", battery: "Dual 3S Smart LiPo + Smart Charger" }
      }
    ],
    stockQty: 10,
    averageRating: 4.8,
    reviewCount: 29
  },
  {
    id: "p3",
    brandId: "b3",
    categoryId: "speed-car",
    name: "Rlaarlo AM-X12 All-Metal Brushless",
    slug: "rlaarlo-am-x12-all-metal",
    description: "The carbon-fiber and aluminum micro pocket rocket. This 1:12 scale racer is packed with high-end carbon fiber plates, full aluminum oil-filled shocks, metal differentials, and a brutal 45A brushless setup that rocket-propels it to 80+ km/h. It offers standard tuning setups usually reserved for high-end track kits.",
    price: 24900,
    comparePrice: 29900,
    sku: "RL-AMX12-CARBON",
    weightGrams: 1800,
    scale: "1:12",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 80,
    buildType: "RTR",
    images: [
      "/rc_rlaarlo_amx12.png",
      "/rc_rlaarlo_amx12.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "AM-X12 1/12 Scale Brushless Speed Car",
      "2.4GHz Transmitter",
      "7.4V 2800mAh 30C LiPo Battery",
      "USB Quick Charger",
      "Rear Wing Options & Hex Wrench"
    ],
    specs: {
      "Scale": "1/12",
      "Chassis Material": "T300 Carbon Fiber & 6061 Aluminum",
      "Motor": "2847 3800KV Brushless Motor",
      "ESC": "Independent 45A Brushless (2S/3S Capable)",
      "Differentials": "Full metal front & rear",
      "Shock Absorbers": "Anodized Aluminum Threaded Oil Shocks"
    },
    compatibleParts: [
      { name: "Rlaarlo 3S 3000mAh Extreme LiPo Battery", price: 3200, sku: "RL-3S-3000" },
      { name: "Metal Spur Gear Upgrade (44T)", price: 800, sku: "RL-SPUR-44" },
      { name: "Carbon Fiber Lower Chassis Plate", price: 2500, sku: "RL-LC-CF" }
    ],
    variants: [
      {
        id: "p3-v1",
        name: "Cyberpunk Pink / 2S Battery Included",
        sku: "RL-AMX12-PNK-2S",
        stockQty: 12,
        attributes: { color: "Cyberpunk Pink", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p3-v2",
        name: "Venom Green / 2S Battery Included",
        sku: "RL-AMX12-GRN-2S",
        stockQty: 8,
        attributes: { color: "Venom Green", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p3-v3",
        name: "Venom Green / 3S Extreme Speed Bundle",
        sku: "RL-AMX12-GRN-3S",
        priceOverride: 27900,
        stockQty: 5,
        attributes: { color: "Venom Green", battery: "1x 3S High Performance LiPo" }
      }
    ],
    stockQty: 25,
    averageRating: 4.7,
    reviewCount: 38
  },
  {
    id: "p4",
    brandId: "b4",
    categoryId: "off-road-truggy",
    name: "MJX Hyper Go 14210 Brushless",
    slug: "mjx-hyper-go-14210-brushless",
    description: "The indestructible mini-truggy. Equipped with a high-torque 2852 brushless motor, metal gear differentials, steel CVD driveshafts, and a built-in wheelie bar, this little beast reaches speeds up to 55+ km/h. It supports 3S battery packs out of the box and is infamous for taking heavy crash impacts without breaking a sweat.",
    price: 18900,
    comparePrice: 22900,
    sku: "MJX-14210-BL",
    weightGrams: 1450,
    scale: "1:14",
    terrainType: "Off-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 55,
    buildType: "RTR",
    images: [
      "/rc_mjx_hypergo.png",
      "/rc_mjx_hypergo.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "MJX Hyper Go 14210 Truggy",
      "2.4GHz Professional Remote Control",
      "7.4V 2000mAh 25C LiPo Battery",
      "Additional High-Downforce Rear Wing",
      "Spare Body Shell (Clear for custom paint)",
      "USB Charger & Wheelie Bar"
    ],
    specs: {
      "Scale": "1/14",
      "Motor": "2852 4400KV 4-Pole Brushless",
      "ESC": "45A Independent ESC with Cooling Fan",
      "Chassis": "Heavy Duty Modular Nylon",
      "Drivetrain": "4WD Shaft Drive with Metal Gears",
      "Shocks": "Aluminum Cap Oil Shocks"
    },
    compatibleParts: [
      { name: "MJX 11.1V 2000mAh 3S LiPo Battery", price: 2100, sku: "MJX-3S-2000" },
      { name: "Sand Paddle Mud Tires (Pair)", price: 1400, sku: "MJX-PADDLE" },
      { name: "Full Aluminum Shock Upgrade Set", price: 1800, sku: "MJX-SHOCK-AL" }
    ],
    variants: [
      {
        id: "p4-v1",
        name: "Lava Orange / 2S Battery",
        sku: "MJX-14210-ORN",
        stockQty: 15,
        attributes: { color: "Lava Orange", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p4-v2",
        name: "Stealth Black / 2S Battery",
        sku: "MJX-14210-BLK",
        stockQty: 11,
        attributes: { color: "Stealth Black", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p4-v3",
        name: "Stealth Black / Dual 2S Battery Pack",
        sku: "MJX-14210-BLK-2B",
        priceOverride: 20900,
        stockQty: 8,
        attributes: { color: "Stealth Black", battery: "2x 2S LiPo Batteries" }
      }
    ],
    stockQty: 34,
    averageRating: 4.6,
    reviewCount: 54
  },
  {
    id: "p5",
    brandId: "b5",
    categoryId: "scale-crawler",
    name: "FMS FCX24 Chevrolet K5 Blazer",
    slug: "fms-fcx24-chevrolet-k5-blazer",
    description: "Highly detailed 1:24 scale crawler officially licensed by General Motors. FMS delivers a masterfully sculpted hard body Chevy K5 Blazer equipped with functional portal axles, a revolutionary remote-controlled two-speed gearbox, oil-filled shock absorbers, and pre-installed LED lights. An incredible crawler that looks perfectly scale on your desk and dominates indoor rock piles.",
    price: 15900,
    comparePrice: 18500,
    sku: "FMS-FCX24-BLAZER",
    weightGrams: 650,
    scale: "1:24",
    terrainType: "Crawler",
    isFeatured: true,
    isActive: true,
    speedKmh: 10,
    buildType: "RTR",
    images: [
      "/rc_fms_blazer.png",
      "/rc_fms_blazer.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "FMS Chevrolet K5 Blazer 1/24 Crawler",
      "2.4GHz Transmitter",
      "7.4V 380mAh LiPo Battery",
      "USB Charger",
      "Detailed Scale Accessories (chrome mirrors, wipers)",
      "Spare Parts Bag & Screwdriver"
    ],
    specs: {
      "Scale": "1/24",
      "Axles": "Portal Axles (higher ground clearance)",
      "Transmission": "2-Speed Remote Shifting (High/Low)",
      "Motor": "130 Brushed Motor",
      "Steering Servo": "Metal Gear Digital Servo",
      "Body": "ABS Hard Shell with Chrome Details"
    },
    compatibleParts: [
      { name: "Brass Wheel Hex Hub Adapters (4pc)", price: 950, sku: "FMS-BR-HEX" },
      { name: "Spare 7.4V 380mAh LiPo Battery", price: 1100, sku: "FMS-2S-380" },
      { name: "Metal Portal Gear set", price: 1500, sku: "FMS-MTL-GEARS" }
    ],
    variants: [
      {
        id: "p5-v1",
        name: "Retro Red & White / Brushed",
        sku: "FMS-FCX24-RED",
        stockQty: 6,
        attributes: { color: "Retro Red & White", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p5-v2",
        name: "Two-Tone Black & Silver / Brushed",
        sku: "FMS-FCX24-BLK",
        stockQty: 4,
        attributes: { color: "Classic Black & Silver", battery: "1x 2S LiPo Battery" }
      },
      {
        id: "p5-v3",
        name: "Classic Blue & White / Brushed",
        sku: "FMS-FCX24-BLU",
        stockQty: 0, // Out of stock to show low/out of stock indicators!
        attributes: { color: "Classic Blue & White", battery: "1x 2S LiPo Battery" }
      }
    ],
    stockQty: 10,
    averageRating: 4.9,
    reviewCount: 16
  },
  {
    id: "p6",
    brandId: "b6",
    categoryId: "scale-crawler",
    name: "MN Model MN99S Defender D90",
    slug: "mn-model-mn99s-defender",
    description: "The classic Land Rover Defender D90 crawler. Excellent entry-level trail crawler featuring proportional steering, a powerful 260 brushed motor, multi-link suspension, and bright LED headlamps. This truck is highly celebrated for its accurate proportions, scale hard body, and its massive catalog of affordable custom metal aftermarket upgrades.",
    price: 9900,
    comparePrice: 12900,
    sku: "MN-99S-DEFENDER",
    weightGrams: 1200,
    scale: "1:12",
    terrainType: "Crawler",
    isFeatured: false,
    isActive: true,
    speedKmh: 15,
    buildType: "RTR",
    images: [
      "/rc_mn_defender.png",
      "/rc_mn_defender.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "MN99S Defender 1/12 Scale Truck",
      "2.4GHz Full Proportional Remote Controller",
      "7.4V 1200mAh Lithium Battery",
      "USB Charging Cable",
      "Roof Rack Accessories"
    ],
    specs: {
      "Scale": "1/12",
      "Body Style": "Land Rover Defender D90 SUV",
      "Motor": "260 High-Torque Brushed Motor",
      "Drivetrain": "4WD Shaft Drive with lock diffs",
      "Battery Capacity": "7.4V 1200mAh Li-ion",
      "Suspension": "Coil-spring multi-link"
    },
    compatibleParts: [
      { name: "Full Brass/Metal Axle and Gears Upgrade Kit", price: 3200, sku: "MN-MET-AXLE" },
      { name: "Heavy Duty Metal Luggage Roof Rack", price: 1100, sku: "MN-ROOF-RACK" },
      { name: "Upgrade 7.4V 2000mAh Battery Pack", price: 1400, sku: "MN-2S-2000" }
    ],
    variants: [
      {
        id: "p6-v1",
        name: "Desert Sand / 1200mAh Battery",
        sku: "MN-99S-SND",
        stockQty: 2, // Low stock indicator triggered (< 3 units)
        attributes: { color: "Desert Sand", battery: "1x 7.4V Battery" }
      },
      {
        id: "p6-v2",
        name: "Nardo Grey / 1200mAh Battery",
        sku: "MN-99S-GRY",
        stockQty: 8,
        attributes: { color: "Nardo Grey", battery: "1x 7.4V Battery" }
      }
    ],
    stockQty: 10,
    averageRating: 4.4,
    reviewCount: 65
  },
  {
    id: "p7",
    brandId: "b1",
    categoryId: "basher",
    name: "Traxxas Slash 4X4 VXL Brushless",
    slug: "traxxas-slash-4x4-vxl",
    description: "The Short-Course basher that defined an entire category. The Slash 4X4 VXL offers jaw-dropping speed (95+ km/h on 3S) and Traxxas Stability Management (TSM) to keep your tail in line over gravel, mud, or water. Equipped with extreme heavy-duty driveshafts, a modular chassis, and a waterproof brushless ESC, the Slash is built to survive high-flying stunts and full-throttle mud shredding.",
    price: 49900,
    comparePrice: 56900,
    sku: "TX-SLASH-4X4-VXL",
    weightGrams: 2640,
    scale: "1:10",
    terrainType: "Off-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 95,
    buildType: "RTR",
    images: [
      "/rc_traxxas_slash.png",
      "/rc_traxxas_slash.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "Slash 4X4 VXL Short Course Truck with Velineon brushless system",
      "TQi™ 2.4GHz Transmitter with Traxxas Link",
      "High quality tool set",
      "Quick Start Guide & suspension spacers"
    ],
    specs: {
      "Scale": "1/10",
      "Motor": "Velineon® 3500 Brushless",
      "ESC": "Velineon VXL-3s™ Waterproof",
      "Speed Control": "TSM (Traxxas Stability Management) Ready",
      "Transmission": "Single Speed with Slipper Clutch",
      "Weight": "2.64 kg"
    },
    compatibleParts: [
      { name: "Traxxas 3S 5000mAh Power Cell LiPo", price: 6800, sku: "TX-2872X" },
      { name: "Pro-Line BFGoodrich All-Terrain Tires", price: 3400, sku: "PL-BFG-10" },
      { name: "Aluminum Front Steering Blocks (Blue)", price: 2900, sku: "TX-6837X" }
    ],
    variants: [
      {
        id: "p7-v1",
        name: "Fox Racing Edition / No Battery",
        sku: "TX-SLASH-4X4-FOX",
        stockQty: 6,
        attributes: { color: "Fox Racing White & Orange", battery: "No Battery (Requires 2S/3S)" }
      },
      {
        id: "p7-v2",
        name: "Traxxas Green Edition / No Battery",
        sku: "TX-SLASH-4X4-GRN",
        stockQty: 4,
        attributes: { color: "Traxxas Green", battery: "No Battery (Requires 2S/3S)" }
      }
    ],
    stockQty: 10,
    averageRating: 4.7,
    reviewCount: 31
  },
  {
    id: "p8",
    brandId: "b7",
    categoryId: "drift",
    name: "Hot Wheels Premium R/C Tesla Roadster",
    slug: "hot-wheels-rc-tesla-roadster",
    description: "Iconic scale design met with high speed. The Hot Wheels Premium R/C 1:10 Tesla Roadster delivers stunning scale body lines, working proportional headlights, and high-frequency drift controls that let you perform hairpin slides on kitchen floors and paved driveways. Charges quickly via micro-USB.",
    price: 14900,
    comparePrice: 17900,
    sku: "HW-TESLA-RC",
    weightGrams: 890,
    scale: "1:10",
    terrainType: "Drift",
    isFeatured: false,
    isActive: true,
    speedKmh: 25,
    buildType: "RTR",
    images: [
      "/rc_hotwheels_tesla.png",
      "/rc_hotwheels_tesla.png"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    whatsInTheBox: [
      "Hot Wheels Premium 1:10 Tesla Roadster R/C",
      "Pistol grip high-frequency 2.4GHz transmitter",
      "USB Charging Cable",
      "Drift Tire Set (Hard compound for slick sliding)",
      "Premium Display Stand"
    ],
    specs: {
      "Scale": "1/10",
      "Drive System": "Rear Wheel Drive (RWD) with gyro lock",
      "Battery": "Built-in Li-Po rechargeable",
      "Control Range": "100+ feet",
      "Steering": "Proportional steering rack"
    },
    compatibleParts: [
      { name: "Replacement Premium Slick Tires (4pc)", price: 990, sku: "HW-SLICK-TIRES" },
      { name: "Dual Port Fast Charging Adaptor", price: 1490, sku: "HW-FAST-CHG" }
    ],
    variants: [
      {
        id: "p8-v1",
        name: "Metallic Cyber Red / Standard Built-in Battery",
        sku: "HW-TESLA-RED",
        stockQty: 10,
        attributes: { color: "Metallic Cyber Red", battery: "Rechargeable Internal" }
      }
    ],
    stockQty: 10,
    averageRating: 4.3,
    reviewCount: 14
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    userName: "Vikram Malhotra",
    rating: 5,
    title: "An absolute beast on Indian terrain!",
    body: "Purchased the Solar Flare Orange X-Maxx and it has been absolute insanity. Handled rocky terrains in Lonavala and water streams effortlessly. The self-righting works perfectly when it rolls over on high grass. Unbelievable construction and raw power!",
    verifiedPurchase: true,
    date: "2026-04-12",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  },
  {
    id: "r2",
    productId: "p1",
    userName: "Rohan Das",
    rating: 5,
    title: "Brutal speed, extremely robust",
    body: "I've jumped this off a 6-foot mud ramp at least 30 times. Not a single arm or gear broke. It's expensive but you get exactly what you pay for: bulletproof RC engineering. Highly recommend getting the 8S battery bundle.",
    verifiedPurchase: true,
    date: "2026-05-02",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
  },
  {
    id: "r3",
    productId: "p2",
    userName: "Amit Verma",
    rating: 5,
    title: "Pure tarmac shredder!",
    body: "This thing is scary fast! Speeds clocked at 134 km/h on a closed runway in Noida. The active handbrake is pure genius for pulling long drift angles around corners. Absolute street shredder, Spektrum SMART telemetry gives cell-by-cell voltage in real-time.",
    verifiedPurchase: true,
    date: "2026-04-20",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
  },
  {
    id: "r4",
    productId: "p3",
    userName: "Priyanjali Sen",
    rating: 4,
    title: "Crazy pocket rocket, incredible value",
    body: "For the price, the amount of carbon fiber and anodized aluminum on the AM-X12 is unbelievable. The car is super responsive and literally flies on a 3S pack. Docked one star because the wing mount got slightly loose on high speed rolls, but easily tightened.",
    verifiedPurchase: true,
    date: "2026-05-10",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  }
];

export const RC_GUIDES: RCGuide[] = [
  {
    id: "g1",
    title: "The Ultimate RC Scale Guide: From 1:24 to 1:8 Explained",
    excerpt: "Confused by what 1:10 or 1:24 actually means? Learn how RC dimensions work and pick the perfect size for your driveway or local bashing spot.",
    category: "Buying Guides",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80",
    content: "When shopping for a remote control car, you'll immediately notice ratios like 1:10, 1:8, or 1:24. This represents the 'Scale' of the vehicle, indicating its size relative to a full-sized real car. A 1:10 scale car is exactly one-tenth the size of the actual vehicle it's based on. 1:8 scale cars are massive powerhouses (e.g., Traxxas X-Maxx) best suited for open dirt parks. 1:10 is the most popular standard basher size, 1:14-1:18 are excellent pocket-friendly park blasters, and 1:24 scale crawlers are ideal for living room obstacle courses."
  },
  {
    id: "g2",
    title: "LiPo Battery Safety & Maintenance Checklist for Beginners",
    excerpt: "Lithium Polymer (LiPo) batteries are the heart of brushless RC speed, but they require strict safety guidelines. Follow these rules to avoid issues.",
    category: "Maintenance",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80",
    content: "Brushless RCs draw massive currents, which only LiPo batteries can supply. However, LiPos require specialized care: 1) Never charge them unattended. 2) Always use a Balance Charger in a fire-proof LiPo Safe Bag. 3) Never discharge below 3.0V per cell (use low-voltage detection on your ESC). 4) If you aren't running your car for more than 48 hours, discharge or charge your packs to a Storage Voltage of 3.8V-3.85V per cell. Storing them fully charged or empty will swell and ruin the cells!"
  },
  {
    id: "g3",
    title: "RTR vs Unassembled Kits: Which should you choose?",
    excerpt: "Should you buy a Ready-To-Run model or spend 20 hours building your machine from scratch? We breakdown the pros and cons of both styles.",
    category: "Buying Guides",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1531693251400-38df35776dc7?w=600&q=80",
    content: "Ready-To-Run (RTR) models come fully assembled, pre-painted, and with all servos, motors, and speed controllers pre-installed. You just add batteries and drive! Unassembled Kits come as bags of gears, screws, and molded plastic/carbon parts. Kits are phenomenal if you want to understand the exact mechanics of your car, select custom high-end electronics, and love the mechanical process of building. For beginners, RTR is highly recommended to get rolling immediately."
  }
];

export interface PinCodeDetail {
  pincode: string;
  city: string;
  state: string;
  deliveryDays: number;
  shippingCost: number;
  codAvailable: boolean;
  serviceable: boolean;
}

export const PIN_CODES: Record<string, PinCodeDetail> = {
  "600091": { pincode: "600091", city: "Madipakkam, Chennai", state: "Tamil Nadu", deliveryDays: 1, shippingCost: 0, codAvailable: true, serviceable: true },
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", deliveryDays: 2, shippingCost: 450, codAvailable: true, serviceable: true },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", deliveryDays: 3, shippingCost: 550, codAvailable: true, serviceable: true },
  "560001": { pincode: "560001", city: "Bengaluru", state: "Karnataka", deliveryDays: 3, shippingCost: 500, codAvailable: true, serviceable: true },
  "600001": { pincode: "600001", city: "Chennai", state: "Tamil Nadu", deliveryDays: 3, shippingCost: 520, codAvailable: true, serviceable: true },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", deliveryDays: 4, shippingCost: 600, codAvailable: false, serviceable: true }, // Prepaid only
  "799001": { pincode: "799001", city: "Agartala", state: "Tripura", deliveryDays: 6, shippingCost: 850, codAvailable: false, serviceable: true }, // Remote
  "141001": { pincode: "141001", city: "Ludhiana", state: "Punjab", deliveryDays: 3, shippingCost: 480, codAvailable: true, serviceable: true },
  "302001": { pincode: "302001", city: "Jaipur", state: "Rajasthan", deliveryDays: 2, shippingCost: 450, codAvailable: true, serviceable: true },
  "500001": { pincode: "500001", city: "Hyderabad", state: "Telangana", deliveryDays: 3, shippingCost: 500, codAvailable: true, serviceable: true },
};
