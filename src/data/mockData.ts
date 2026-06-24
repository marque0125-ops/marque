export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  country: string;
  established: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "crawler", name: "RC Crawlers", image: "/61fyHVbcNqL._SX466_.jpg" },
  { id: "mini-car", name: "Mini RC Car", image: "/remote-control-car-high-speed-mini-type-c-usb-rechargeable-rc-original-imahegx4pnfv2p3d.webp" },
  { id: "accessories", name: "RC Car Accessories", image: "/accessories1-600x600.png" },
  { id: "helicopter", name: "RC Helicopter", image: "/3-5-ch-metal-romote-control-helicopter-toys-436.jpg" },
  { id: "excavator", name: "RC Excavator", image: "/71xPrnxkAhL.jpg" },
  { id: "RCBoat", name: "RC Boat", image: "/shopping.webp" }
];

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
  imageUrl?: string;
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
  batteryAddonPrice?: number;
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
  },
  {
    id: "b8",
    name: "LEGO",
    slug: "lego",
    logoUrl: "https://images.unsplash.com/photo-1513384312027-9fa62a244fd2?w=400&q=80",
    description: "The legendary interlocking brick toy brand. Officially licensed Disney theme kits containing castles, houses, and magical sleighs. Perfect for display and hobby collectors.",
    country: "Denmark",
    established: "1932"
  },
  {
    id: "b9",
    name: "MARQUE SHOWCASE",
    slug: "marque-showcase",
    logoUrl: "/logo.png",
    description: "Premium custom accessories designed by MARQUE, including acrylic showcase enclosures and display stands tailored for high-end hobby gear and collectibles.",
    country: "India",
    established: "2026"
  },
  {
    id: "b10",
    name: "SPEED DRIVER R/C",
    slug: "speed-driver",
    logoUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80",
    description: "High performance consumer-grade remote control racers, drifters, wall climbers, and excavators built for maximum indoor and outdoor action.",
    country: "India",
    established: "2026"
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
        attributes: { color: "Solar Flare Orange", battery: "No Batteries (Requires 2x 4S)" },
        imageUrl: "/rc_traxxas_xmaxx.png"
      },
      {
        id: "p1-v2",
        name: "Rock n Roll Blue / No Batteries",
        sku: "TX-XMAXX-8S-BLU",
        stockQty: 4,
        attributes: { color: "Rock n Roll Blue", battery: "No Batteries (Requires 2x 4S)" },
        imageUrl: "/rc_traxxas_xmaxx.png"
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
  },
  {
    id: "p9",
    brandId: "b9",
    categoryId: "accessories",
    name: "Acrylic Display Box, Compatible with Lego",
    slug: "acrylic-display-box-compatible-with-lego",
    description: "High-quality, crystal clear premium acrylic display showcase enclosure. Dust-proof, heavy-duty build with a black polished base to display your prized LEGO builds, models, or art pieces with elegant premium visibility.",
    price: 9999,
    comparePrice: 12999,
    sku: "MQ-ACRYLIC-BOX",
    weightGrams: 1800,
    scale: "Custom",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 0,
    buildType: "RTR",
    images: ["/acrylic_box.png"],
    whatsInTheBox: ["Acrylic panels", "Polished black base", "Assembly screws", "Microfiber cleaning cloth"],
    specs: {
      "Material": "Crystal Clear Acrylic",
      "Base Color": "Glossy Black",
      "Thickness": "3.5 mm",
      "Dimensions": "40 x 30 x 25 cm"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p9-v1",
        name: "Glossy Black Base / Standard Enclosure",
        sku: "MQ-AC-BLK",
        stockQty: 12,
        attributes: { color: "Glossy Black" }
      }
    ],
    stockQty: 12,
    averageRating: 4.8,
    reviewCount: 8
  },
  {
    id: "p10",
    brandId: "b8",
    categoryId: "accessories",
    name: "LEGO | Disney Encanto Mirabel's Mini House",
    slug: "lego-disney-encanto-mini-house",
    description: "Step inside Mirabel's colorful world! This miniature LEGO build features the magical Casa Madrigal from Disney's Encanto. Includes Mirabel mini-doll figure and detailed, colorful accessories inside her bedroom.",
    price: 2499,
    comparePrice: 2999,
    sku: "LG-EN-MINI-HSE",
    weightGrams: 350,
    scale: "Micro",
    terrainType: "On-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 0,
    buildType: "Kit",
    images: ["/lego_encanto.png"],
    whatsInTheBox: ["Lego Bricks", "Mirabel mini-doll", "Decorative stickers", "Manual instructions"],
    specs: {
      "Pieces": "148 Pcs",
      "Age Range": "5+",
      "Dimensions": "15.7 x 14.1 x 4.5 cm",
      "Released": "2024"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p10-v1",
        name: "Standard Retail Box",
        sku: "LG-EN-MINI-STD",
        stockQty: 25,
        attributes: { color: "Multicolor" }
      }
    ],
    stockQty: 25,
    averageRating: 4.9,
    reviewCount: 14
  },
  {
    id: "p11",
    brandId: "b8",
    categoryId: "accessories",
    name: "LEGO | Disney Frozen Anna's Sleigh Adventure",
    slug: "lego-disney-frozen-annas-sleigh",
    description: "Embark on a snowy journey with Princess Anna and Sven the reindeer! Help Anna pack the sleigh with hot chocolate, and explore the winter woods. Includes Anna mini-doll, Sven, a sleigh, and a feeding station for Sven.",
    price: 4499,
    comparePrice: 4999,
    sku: "LG-FR-ANNA-SLG",
    weightGrams: 420,
    scale: "Micro",
    terrainType: "On-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 0,
    buildType: "Kit",
    images: ["/lego_sleigh.png"],
    whatsInTheBox: ["Lego Bricks", "Anna mini-doll", "Sven reindeer", "Sleigh", "Instruction guide"],
    specs: {
      "Pieces": "174 Pcs",
      "Age Range": "4+",
      "Dimensions": "26.2 x 19.1 x 6.1 cm"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p11-v1",
        name: "Standard Retail Box",
        sku: "LG-FR-ANNA-STD",
        stockQty: 18,
        attributes: { color: "Sky Blue & White" }
      }
    ],
    stockQty: 18,
    averageRating: 4.8,
    reviewCount: 11
  },
  {
    id: "p12",
    brandId: "b8",
    categoryId: "accessories",
    name: "LEGO | Disney Frozen Arendelle Castle Celebration",
    slug: "lego-disney-frozen-arendelle-castle",
    description: "Celebrate Anna's birthday in the glorious Arendelle Castle! Help Elsa and Kristoff prepare the grand dining hall, bake an enormous cake, and play hide-and-seek with mini snowmen. Includes Anna, Elsa, Kristoff, and Olaf!",
    price: 3499,
    comparePrice: 3999,
    sku: "LG-FR-AR-CASTLE",
    weightGrams: 550,
    scale: "Micro",
    terrainType: "On-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 0,
    buildType: "Kit",
    images: ["/lego_castle.png"],
    whatsInTheBox: ["Lego Bricks", "Anna, Elsa, Kristoff mini-dolls", "Olaf snowman", "Giant castle stickers", "Manual instructions"],
    specs: {
      "Pieces": "477 Pcs",
      "Age Range": "6+",
      "Dimensions": "38.2 x 26.2 x 5.6 cm"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p12-v1",
        name: "Standard Retail Box",
        sku: "LG-FR-AR-STD",
        stockQty: 15,
        attributes: { color: "Purple & Aqua" }
      }
    ],
    stockQty: 15,
    averageRating: 4.9,
    reviewCount: 19
  },
  {
    id: "p13",
    brandId: "b8",
    categoryId: "accessories",
    name: "LEGO | Disney Frozen Elsa's Frozen Ice Palace",
    slug: "lego-disney-frozen-elsas-ice-palace",
    description: "Behold Elsa's breathtaking crystal ice palace! Features a magical sliding bridge, spinning staircase, dynamic ice chandelier, and an outdoor playground slide. Comes with Elsa, Anna, Olaf, and Marshmallow the giant snow monster.",
    price: 5499,
    comparePrice: 5999,
    sku: "LG-FR-EL-PALACE",
    weightGrams: 680,
    scale: "Micro",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 0,
    buildType: "Kit",
    images: ["/lego_palace.png"],
    whatsInTheBox: ["Lego Bricks", "Elsa & Anna mini-dolls", "Olaf snowman", "Marshmallow snow monster", "Instruction guide"],
    specs: {
      "Pieces": "701 Pcs",
      "Age Range": "6+",
      "Dimensions": "37.8 x 35.5 x 7.4 cm"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p13-v1",
        name: "Standard Retail Box",
        sku: "LG-FR-EL-STD",
        stockQty: 9,
        attributes: { color: "Crystal Ice Blue" }
      }
    ],
    stockQty: 9,
    averageRating: 4.7,
    reviewCount: 22
  },
  {
    id: "p14",
    brandId: "b10",
    categoryId: "drift",
    name: "1:16 Model 4WD RC Drift Car 4X4 High Speed",
    slug: "1-16-model-4wd-rc-drift-car-4x4-high-speed",
    description: "High-octane yellow & black racing drifter. Equipped with proportional steering, a powerful high-torque motor, custom slick drift tires, and rubber grip racing tires to easily swap out. Perfect for doing high-speed hairpins and street slides.",
    price: 2899,
    comparePrice: 4599,
    sku: "SD-DRIFT-4X4-YLW",
    weightGrams: 980,
    scale: "1:16",
    terrainType: "Drift",
    isFeatured: true,
    isActive: true,
    speedKmh: 30,
    buildType: "RTR",
    images: ["/rc_mjx_hypergo.png"],
    whatsInTheBox: ["Drift Car", "2.4GHz Remote Controller", "7.4V 1200mAh Battery", "Spare high-grip tires", "Screwdriver"],
    specs: {
      "Scale": "1:16",
      "Drive System": "4WD",
      "Frequency": "2.4GHz Proportional",
      "Top Speed": "30 km/h",
      "Battery": "7.4V 1200mAh Li-ion"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p14-v1",
        name: "Viper Yellow / Standard Battery Pack",
        sku: "SD-DR-YL-STD",
        stockQty: 8,
        attributes: { color: "Viper Yellow & Black" }
      }
    ],
    stockQty: 8,
    averageRating: 4.5,
    reviewCount: 17
  },
  {
    id: "p15",
    brandId: "b10",
    categoryId: "crawler",
    name: "1:14 Rc Wall Climbing Car 20km/h",
    slug: "1-14-rc-wall-climbing-car-20km-h",
    description: "Defy gravity with this extreme vacuum wall climbing stunt car! Featuring dual-mode transition (Ground and Wall mode) and a high-efficiency suction fan, this vehicle crawls seamlessly up glass windows, vertical walls, and ceilings.",
    price: 2650,
    comparePrice: 4500,
    sku: "SD-WALL-CLIMBER",
    weightGrams: 550,
    scale: "1:14",
    terrainType: "Crawler",
    isFeatured: false,
    isActive: true,
    speedKmh: 20,
    buildType: "RTR",
    images: ["/rc_hotwheels_tesla.png"],
    whatsInTheBox: ["Wall Climbing Car", "Infrared Transmitter", "Built-in Rechargeable battery", "USB Charger cable"],
    specs: {
      "Suction Power": "Vacuum Fan Suction",
      "Modes": "Wall / Floor Dual Mode",
      "Remote Control": "Infrared 2.4GHz",
      "Battery": "3.7V Rechargeable Li-Po"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p15-v1",
        name: "Deep Blue / Standard vacuum setup",
        sku: "SD-WC-BLU",
        stockQty: 14,
        attributes: { color: "Metallic Blue" }
      }
    ],
    stockQty: 14,
    averageRating: 4.3,
    reviewCount: 9
  },
  {
    id: "p16",
    brandId: "b10",
    categoryId: "street-basher",
    name: "1:16 Porsche GT3 RS 2.4Ghz Sport Racer",
    slug: "1-16-porsche-gt3-rs-2-4ghz-racer",
    description: "A stunning scale model of the legendary track weapon Porsche GT3 RS. Features high-fidelity white aerodynamic styling with iconic black and red racing decals, functional brake lights, working headlamps, and responsive rear-wheel drive.",
    price: 2850,
    comparePrice: 3599,
    sku: "SD-PORSCHE-GT3",
    weightGrams: 850,
    scale: "1:16",
    terrainType: "On-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 25,
    buildType: "RTR",
    images: ["/rc_arrma_infraction.png"],
    whatsInTheBox: ["Porsche GT3 RS Model", "2.4GHz Pistol Transmitter", "Rechargeable Battery Pack", "USB Fast Charger"],
    specs: {
      "Official License": "Inspired by GT3 RS Design",
      "Radio Control": "2.4GHz Multi-Frequency",
      "Scale": "1:16",
      "Drive System": "2WD High Speed"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p16-v1",
        name: "Pure White & Red racing stripes",
        sku: "SD-GT3-WHT",
        stockQty: 5,
        attributes: { color: "Chalk White" }
      }
    ],
    stockQty: 5,
    averageRating: 4.6,
    reviewCount: 15
  },
  {
    id: "p17",
    brandId: "b10",
    categoryId: "drift",
    name: "1:16 RC Drift Car, 20KM/H 4WD (Toyota AE86)",
    slug: "1-16-rc-drift-car-20km-h-4wd-ae86",
    description: "Step into retro drifting with the legendary Hachiroku AE86! Features the classic white & black panda paint scheme, pop-up style headlamps, full 4WD traction, and dual tire sets (slick drift and high-grip rubber). PERFECT FOR SLIDING!",
    price: 1799,
    comparePrice: 2799,
    sku: "SD-AE86-PANDA",
    weightGrams: 900,
    scale: "1:16",
    terrainType: "Drift",
    isFeatured: false,
    isActive: true,
    speedKmh: 20,
    buildType: "RTR",
    images: ["/rc_fms_blazer.png"],
    whatsInTheBox: ["AE86 Drift Car", "2.4GHz Remote", "7.4V Rechargeable Battery", "4x Slick Drift tires", "4x Rubber tires"],
    specs: {
      "Nostalgia Factor": "Initial D Tribute Panda Scheme",
      "Top Speed": "20 km/h",
      "Drive": "Full Time 4WD",
      "Chassis": "Nylon Impact Resistant"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p17-v1",
        name: "Classic Panda White & Black",
        sku: "SD-AE86-WHT",
        stockQty: 0,
        attributes: { color: "Panda White & Black" }
      }
    ],
    stockQty: 0,
    averageRating: 4.7,
    reviewCount: 32
  },
  {
    id: "p18",
    brandId: "b10",
    categoryId: "drift",
    name: "1:16 RC Drift Car, 25KM/H 4WD (BMW E30)",
    slug: "1-16-rc-drift-car-25km-h-4wd-e30",
    description: "An absolute classic track drifter! Featuring retro BMW E30 lines with premium racing decals, full-time 4WD shaft drive, and custom slick performance drift tires. Built to handle hairpin slides and long slick arcs.",
    price: 3299,
    comparePrice: 6899,
    sku: "SD-BMW-E30",
    weightGrams: 950,
    scale: "1:16",
    terrainType: "Drift",
    isFeatured: false,
    isActive: true,
    speedKmh: 25,
    buildType: "RTR",
    images: ["/rc_traxxas_slash.png"],
    whatsInTheBox: ["E30 Drift Car", "2.4GHz Controller", "7.4V Lithium Battery", "USB Charging cable", "Custom decals set"],
    specs: {
      "Body Style": "Classic BMW E30 Coupe",
      "Top Speed": "25 km/h",
      "Drivetrain": "4WD Shaft-Driven",
      "Lighting": "Full Functional Headlamps"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p18-v1",
        name: "Alpine White / Classic M-Decals",
        sku: "SD-E30-WHT",
        stockQty: 10,
        attributes: { color: "Alpine White with Decals" }
      }
    ],
    stockQty: 10,
    averageRating: 4.8,
    reviewCount: 23
  },
  {
    id: "p19",
    brandId: "b10",
    categoryId: "off-road-truggy",
    name: "1:16 Scale RC Cars Off-Road Alloy Truck",
    slug: "1-16-scale-rc-cars-off-road-alloy-truck",
    description: "Rugged alloy-bodied off-road sand buggy! Heavy duty impact-resistant orange outer cage, high-efficiency coil-over spring shocks, and knobby deep tread tires. Delivers exceptional stability and fun bashing off dirt ramps.",
    price: 1950,
    comparePrice: 2399,
    sku: "SD-ALLOY-ORANGE",
    weightGrams: 1100,
    scale: "1:16",
    terrainType: "Off-Road",
    isFeatured: false,
    isActive: true,
    speedKmh: 18,
    buildType: "RTR",
    images: ["/rc_rlaarlo_amx12.png"],
    whatsInTheBox: ["Buggy Chassis", "2.4GHz Controller", "4.8V Ni-MH Battery", "USB wall adapter"],
    specs: {
      "Body material": "High Strength Alloy Sheet",
      "Suspension": "Heavy Coil Springs",
      "Top Speed": "18 km/h",
      "Battery": "4.8V Ni-MH Rechargeable"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p19-v1",
        name: "Blaze Orange Alloy Cage",
        sku: "SD-AL-ORN",
        stockQty: 7,
        attributes: { color: "Blaze Orange" },
        imageUrl: "/a.png"
      }
    ],
    stockQty: 7,
    averageRating: 4.4,
    reviewCount: 16
  },
  {
    id: "p20",
    brandId: "b10",
    categoryId: "crawler",
    name: "1:16 Scale RC Crawler, 38KM/H Off-Road",
    slug: "1-16-scale-rc-crawler-38km-h-4wd",
    description: "A beastly 4WD off-road crawler and basher combined! Capable of hitting a blistering 38 km/h over rugged rocks, mud paths, and sandy dunes. Equipped with dynamic metal differentials, full four-wheel drive, and long-travel shocks.",
    price: 9500,
    comparePrice: 15999,
    sku: "SD-CRAWLER-38K",
    weightGrams: 1350,
    scale: "1:16",
    terrainType: "Crawler",
    isFeatured: true,
    isActive: true,
    speedKmh: 38,
    buildType: "RTR",
    images: ["/rc_traxxas_xmaxx.png"],
    whatsInTheBox: ["4WD Crawler", "2.4GHz Pistol controller", "7.4V 1500mAh Li-Po battery", "Balance Charger adapter", "Hex key wrenches"],
    specs: {
      "Axles": "Locked Front & Rear Diffs",
      "Top Speed": "38 km/h",
      "Drive System": "Heavy Duty 4WD",
      "Chassis": "Reinforced Nylon Composite"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p20-v1",
        name: "Stealth Black / Dual Speed Gearbox",
        sku: "SD-CR-38-BLK",
        stockQty: 11,
        attributes: { color: "Stealth Black" }
      }
    ],
    stockQty: 11,
    averageRating: 4.7,
    reviewCount: 20
  },
  {
    id: "p21",
    brandId: "b10",
    categoryId: "drift",
    name: "1:16 Scale RC Mustang Drift Car 4WD",
    slug: "1-16-scale-rc-mustang-drift-car-4wd",
    description: "American muscle meets high-speed sliding. High-fidelity custom Mustang body styling with aggressive hood scoop, working bright LED lights, 4WD shaft drive, and custom compound drift wheels. Out of stock due to massive demand!",
    price: 3499,
    comparePrice: 4899,
    sku: "SD-MUSTANG-DRIFT",
    weightGrams: 960,
    scale: "1:16",
    terrainType: "Drift",
    isFeatured: false,
    isActive: true,
    speedKmh: 22,
    buildType: "RTR",
    images: ["/hero_rc_car.png"],
    whatsInTheBox: ["Mustang Drift Car", "2.4GHz Transmitter", "7.4V Rechargeable Battery pack", "4x Hard compound tires", "4x Rubber street tires"],
    specs: {
      "Chassis Style": "Mustang Muscle Coupe",
      "Drivetrain": "4WD Shaft Drive",
      "Drive Tires": "Drift Slick Compound",
      "Lighting": "Front & Rear LEDs"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p21-v1",
        name: "Carbon Shadow Stripe",
        sku: "SD-MU-BLK",
        stockQty: 0,
        attributes: { color: "Carbon Shadow Black" }
      }
    ],
    stockQty: 0,
    averageRating: 4.5,
    reviewCount: 19
  },
  {
    id: "p22",
    brandId: "b10",
    categoryId: "crawler",
    name: "1:16 Scale Remote Control Monster Truck",
    slug: "1-16-scale-remote-control-monster-truck",
    description: "A classic heavy-duty climbing crawler designed to run over high grass, mud fields, and rocky slopes. Heavy-duty suspension, extra-wide high grip wheels, and a solid steel cage design. Completely sold out!",
    price: 1850,
    comparePrice: 2500,
    sku: "SD-MONSTER-TRK",
    weightGrams: 1200,
    scale: "1:16",
    terrainType: "Crawler",
    isFeatured: false,
    isActive: true,
    speedKmh: 15,
    buildType: "RTR",
    images: ["/rc_mn_defender.png"],
    whatsInTheBox: ["Monster Truck Rig", "2.4GHz Controller", "Rechargeable internal battery pack", "USB charger"],
    specs: {
      "Drivetrain": "4WD Solid Axle",
      "Wheels": "High-Density Rubber Off-Road",
      "Frequency": "2.4GHz",
      "Suspension": "Heavy Travel Springs"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p22-v1",
        name: "Stealth Black / Rock Crawler",
        sku: "SD-MN-BLK",
        stockQty: 0,
        attributes: { color: "Stealth Black" }
      }
    ],
    stockQty: 0,
    averageRating: 4.2,
    reviewCount: 12
  },
  {
    id: "p23",
    brandId: "b10",
    categoryId: "excavator",
    name: "1:20 Scale J-C-B Excavator Construction Truck",
    slug: "1-20-scale-jcb-excavator-toy",
    description: "Experience real construction action! Highly accurate 1:20 scale model of a classic yellow excavator loader. Fully proportional multi-channel control lets you move the boom, stick, and bucket up and down, and spin the cab 680 degrees.",
    price: 1999,
    comparePrice: 2999,
    sku: "SD-JCB-EXCAVATOR",
    weightGrams: 1400,
    scale: "1:20",
    terrainType: "Crawler",
    isFeatured: false,
    isActive: true,
    speedKmh: 5,
    buildType: "RTR",
    images: ["/rc_mjx_hypergo.png"],
    whatsInTheBox: ["Excavator Rig", "Proportional Remote Controller", "Rechargeable 4.8V Battery", "USB Quick charging adapter"],
    specs: {
      "Cab Rotation": "680 Degrees",
      "Bucket Material": "Alloy Metal",
      "Control Channels": "11 Channels Proportional",
      "Tracks": "Independent Rubber Tracks"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p23-v1",
        name: "Classic Construction Yellow",
        sku: "SD-JCB-YLW",
        stockQty: 6,
        attributes: { color: "Construction Yellow" }
      }
    ],
    stockQty: 6,
    averageRating: 4.6,
    reviewCount: 14
  },
  {
    id: "p24",
    brandId: "b10",
    categoryId: "drift",
    name: "1:24 Scale RC Drift Car, 4WD 2.4G Spray Drift",
    slug: "1-24-scale-rc-drift-car-4wd-spray",
    description: "Add a gorgeous mist effect to your slides! This 1:24 mini drifter features a water-refillable exhaust that emits a lighted spray mist while drifting, replicating drag racing exhaust exhaust fumes. Insanely popular with kids & indoor racers.",
    price: 1850,
    comparePrice: 2499,
    sku: "SD-SPRAY-DRIFT",
    weightGrams: 600,
    scale: "1:24",
    terrainType: "Drift",
    isFeatured: false,
    isActive: true,
    speedKmh: 15,
    buildType: "RTR",
    images: ["/rc_traxxas_slash.png"],
    whatsInTheBox: ["Drift Car", "Remote controller", "Rechargeable battery pack", "Water filling bottle", "USB charging adaptor"],
    specs: {
      "Special Feature": "LED Exhaust Spray Mist",
      "Scale": "1:24",
      "Drivetrain": "4WD",
      "Chassis Material": "High Elasticity PVC"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p24-v1",
        name: "Dynamic Yellow / Spray Exhaust",
        sku: "SD-SPY-YLW",
        stockQty: 9,
        attributes: { color: "Racing Yellow & Black" }
      }
    ],
    stockQty: 9,
    averageRating: 4.5,
    reviewCount: 18
  },
  {
    id: "p25",
    brandId: "b10",
    categoryId: "mini-car",
    name: "1:64 Die Cast Metal F1 Mini RC Racer",
    slug: "1-64-die-cast-metal-f1-mini-rc-racer",
    description: "The ultimate micro-scale speed formula racer! Extremely detailed die-cast alloy F1 chassis with a micro-motor and high-frequency remote. Small enough to race on your computer desk, complete with a mini-helmet and high speed traction tires.",
    price: 1490,
    comparePrice: 2750,
    sku: "SD-F1-MINI-DIE",
    weightGrams: 180,
    scale: "1:64",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 12,
    buildType: "RTR",
    images: ["/rc_arrma_infraction.png"],
    whatsInTheBox: ["F1 Micro racer", "Desk transmitter", "Built-in micro battery", "Charger adapter cord"],
    specs: {
      "Scale": "1:64 Ultra Micro",
      "Chassis": "Die-Cast Alloy Metal",
      "Top Speed": "12 km/h",
      "Charging Time": "15 min fast-charge"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p25-v1",
        name: "Formula Red / Die-Cast",
        sku: "SD-F1-RED",
        stockQty: 15,
        attributes: { color: "Formula Red & White" }
      }
    ],
    stockQty: 15,
    averageRating: 4.4,
    reviewCount: 21
  },
  {
    id: "p26",
    brandId: "b10",
    categoryId: "helicopter",
    name: "3.5CH RC Helicopter with Gyro",
    slug: "3-5ch-rc-helicopter-gyro",
    description: "Stable and easy to fly remote control helicopter. Built-in gyro stabilization makes it perfect for beginners and indoor flying.",
    price: 3499,
    comparePrice: 4500,
    sku: "SD-HELI-35CH",
    weightGrams: 200,
    scale: "1:18",
    terrainType: "Off-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 10,
    buildType: "RTR",
    images: ["https://images.unsplash.com/photo-1579624536768-3be3a7b11d9a?w=800&q=80"],
    whatsInTheBox: ["Helicopter", "Controller", "USB Charger", "Spare Blades"],
    specs: {
      "Channels": "3.5CH",
      "Flight Time": "10-15 mins",
      "Control Range": "30 meters"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p26-v1",
        name: "Rescue Red",
        sku: "SD-HELI-RED",
        stockQty: 12,
        attributes: { color: "Red" }
      }
    ],
    stockQty: 12,
    averageRating: 4.6,
    reviewCount: 8
  },
  {
    id: "p27",
    brandId: "b10",
    categoryId: "RCBoat",
    name: "High Speed RC Racing Boat 30km/h",
    slug: "high-speed-rc-racing-boat",
    description: "Tear across the water with this high-speed remote control racing boat. Features anti-flip design and low battery alarm.",
    price: 4999,
    comparePrice: 6500,
    sku: "SD-BOAT-30K",
    weightGrams: 800,
    scale: "1:14",
    terrainType: "On-Road",
    isFeatured: true,
    isActive: true,
    speedKmh: 30,
    buildType: "RTR",
    images: ["https://images.unsplash.com/photo-1542617950-8b019b88e1bb?w=800&q=80"],
    whatsInTheBox: ["Racing Boat", "2.4GHz Controller", "Battery", "USB Charger", "Display Stand"],
    specs: {
      "Top Speed": "30 km/h",
      "Drive System": "Water Cooled Motor",
      "Range": "150 meters"
    },
    compatibleParts: [],
    variants: [
      {
        id: "p27-v1",
        name: "Vector Red",
        sku: "SD-BOAT-RED",
        stockQty: 5,
        attributes: { color: "Red" }
      }
    ],
    stockQty: 5,
    averageRating: 4.8,
    reviewCount: 15
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
