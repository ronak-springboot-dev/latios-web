const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export const CATEGORIES = [
  {
    slug: "laptops",
    index: "01",
    name: "Laptops",
    model: "Latios Book 16",
    title: ["WORK,", "UNPLUGGED."],
    tagline: "Flagship compute that disappears into a carry-on.",
    hero: U("photo-1517336714731-489689fd1ca8"),
    intro:
      "A 16-inch mobile workstation milled from a single billet of aluminium. Desktop-class silicon, all-day silence, and a display that tells the truth.",
    chapters: [
      {
        n: "01",
        kicker: "Chassis",
        heading: "CNC-milled, not assembled",
        body: "Every Book 16 begins as a solid block of 6000-series aluminium. Two hours of machining leave a unibody with zero flex, invisible seams, and a finish that shrugs off a decade of travel.",
        image: U("photo-1611078489935-0cb964de46d6"),
      },
      {
        n: "02",
        kicker: "Thermals",
        heading: "Silence under full load",
        body: "A full-width vapor chamber and dual counter-rotating fans move heat without moving air you can hear. Sustained 55W CPU load at under 24 decibels — quieter than the room you're sitting in.",
        image: U("photo-1496181133206-80ce9b88a853"),
      },
      {
        n: "03",
        kicker: "Display",
        heading: "A screen that tells the truth",
        body: "4K OLED at 120Hz, factory-calibrated to ΔE < 1 across 100% of DCI-P3. What you grade in the field is what ships. No surprises in the edit suite.",
        image: U("photo-1531297484001-80022131f5a1"),
      },
    ],
    specs: [
      ["Processor", "Core Ultra 9 / Ryzen AI 9"],
      ["Graphics", "RTX 5070 Laptop, 12GB"],
      ["Display", '16" 4K 120Hz OLED, ΔE<1'],
      ["Battery", "99.9Wh — up to 18 hours"],
      ["Memory", "Up to 64GB LPDDR5X"],
      ["Weight", "1.6 kg, 14.9 mm thin"],
      ["Security", "TPM 2.0 + IR presence lock"],
      ["Wireless", "Wi-Fi 7 + BT 5.4"],
    ],
  },
  {
    slug: "towers",
    index: "02",
    name: "Towers",
    model: "Latios MT Series",
    title: ["BUSINESS,", "UNSTOPPABLE."],
    tagline: "Be your window to the world.",
    hero: P("7858769"),
    intro:
      "The Latios desktop range: six business MT and SFF configurations from Ryzen 3 to Core i9, and four PROMAX AI workstations scaling up to Xeon W with 2TB of ECC memory — every one tool-friendly, TPM-secured and built to be opened, not replaced.",
    chapters: [
      {
        n: "01",
        kicker: "Compute",
        heading: "From Ryzen 3 to Core i9",
        body: "Choose AMD AM4 with Ryzen 5000G graphics onboard, Intel H610 or Q670 with up to 14th Gen Core i9, or the Pro AI edition on AM5 with Ryzen 8000G neural processing. One chassis, five ways to work.",
        image: U("photo-1587202372775-e229f172b9d7"),
      },
      {
        n: "02",
        kicker: "Connectivity",
        heading: "Every port you'll ever need",
        body: "Two front USB-C Gen 2, USB-A and mic-in up front. HDMI 2.1 with 4K@60, DisplayPort 1.4, optional VGA, gigabit LAN, PS/2 and triple audio jacks at the back — plus Wi-Fi 6E for cable-free fleets.",
        image: U("photo-1613258176465-eb77f3a050d2"),
      },
      {
        n: "03",
        kicker: "Security & Software",
        heading: "TPM 2.0 meets Latios Center",
        body: "Firmware TPM 2.0 encryption, Kensington and padlock points, military-grade certified durability. Latios Center monitors hardware, frees memory and recovers the system; Latios Cloud Center syncs and shares files across your team.",
        image: U("photo-1624705002806-5d72df19c3ad"),
      },
    ],
    specs: [
      ["Desktops", "MT + SFF · Ryzen 3 → Core i9"],
      ["Workstations", "PROMAX · Core Ultra → Xeon W"],
      ["Memory", "Up to 2TB DDR5 ECC (T4 Plus)"],
      ["Graphics", "Up to RTX A6000 / Blackwell"],
      ["Storage", "Gen5 NVMe + RAID options"],
      ["Network", "Wi-Fi 6E · Dual 2.5G LAN"],
      ["Power", "300W → 2700W redundant"],
      ["Security", "HW TPM 2.0 · Kensington"],
    ],
    families: [
      {
        kicker: "Business Desktops",
        title: "The MT & SFF family.",
        blurb:
          "Six micro-tower and small-form-factor configurations for the modern office — from Ryzen 3 to Core i9, with Wi-Fi 6E, TPM 2.0 and tool-friendly upgrade paths.",
        models: [
          {
            name: "Latios MT — AMD AM4",
            tag: "Ryzen 5000 · DDR4",
            highlights: [
              "AMD Ryzen 7 5700G / 5 5600G / 3 5305G",
              "AMD Pro 500 chipset",
              "2× DDR4 3200MHz, up to 64GB",
              "Up to 16GB Radeon RX graphics",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/5ieip2my_Latios%20Desktop%20Computer%20MT%20AMD%20AM4_Chipset%20DDR4%2064GB%2025072026.pdf",
          },
          {
            name: "Latios MT — Intel H610 DDR4",
            tag: "12th–14th Gen · DDR4",
            highlights: [
              "Up to Intel Core i9-14900",
              "Intel H610 chipset",
              "2× DDR4 3200MHz, up to 64GB",
              "Up to NVIDIA RTX A4000",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/cpvue3ja_Latios%20Desktop%20Computer%20MT%20Intel%20H610%20DDR4%2064GB%2025072026.pdf",
          },
          {
            name: "Latios MT — Intel H610 DDR5",
            tag: "12th–14th Gen · DDR5",
            highlights: [
              "Up to Intel Core i9-14900",
              "Intel H610 chipset",
              "2× DDR5 5600MHz, up to 64GB",
              "TPM 2.0 · military-grade certified",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/2hhajq9k_Latios%20Desktop%20Computer%20MT%20Intel%20H610%20DDR5%2064GB%2025072026.pdf",
          },
          {
            name: "Latios MT — Intel Q670 DDR5",
            tag: "12th–14th Gen · Q670",
            highlights: [
              "Up to Intel Core i9-14900",
              "Intel Q670 chipset",
              "2× DDR5 5600MHz, up to 64GB",
              "Up to NVIDIA RTX A4000",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/zzjxskf1_Latios%20Desktop%20Computer%20MT%20Intel%20Q670%20DDR5%2064GB%2025072026.pdf",
          },
          {
            name: "Latios Pro SFF — Intel H610",
            tag: "14th Gen · 9.3 litres",
            highlights: [
              "Up to Intel Core i7-14700",
              "Intel H610 chipset",
              "2× DDR5, up to 64GB",
              "95 × 296 × 330 mm small form factor",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/xg8yezhd_Latios%20Pro%20Desktop%20Computer%20SFF%20Intel%20H610%20DDR5%2064GB%2025072026.pdf",
          },
          {
            name: "Latios Pro AI MT — AMD AM5",
            tag: "Ryzen 8000G AI · DDR5",
            highlights: [
              "AMD Ryzen 7 8700G with Ryzen AI",
              "AMD Pro 600 chipset",
              "2× DDR5 5200MHz, up to 64GB",
              "dTPM 2.0 · Wi-Fi 6E",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/ijdspbfh_Latios%20Pro%20AI%20Desktop%20Computer%20MT%20AMD%20AM5_Chipset%20DDR5%2064GB%2025072026.pdf",
          },
        ],
      },
      {
        kicker: "PROMAX AI Workstations",
        title: "When the work gets heavy.",
        blurb:
          "Four towers for engineering, AI and content creation — scaling from Core Ultra with a built-in NPU to Xeon W with 2TB of ECC memory and redundant 2700W power.",
        models: [
          {
            name: "PROMAX AI — Intel Q870",
            tag: "Core Ultra · NPU · 128GB",
            highlights: [
              "Intel Core Ultra 9 285 with AI Boost NPU",
              "Intel Q870 chipset",
              "4× DDR5, up to 128GB",
              "Up to NVIDIA RTX A6000",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/rr859wfc_Latios%20PROMAX%20AI%20Workstation%20MT%20Intel%20Q870%20DDR5%20128GB%2027072026.pdf",
          },
          {
            name: "PROMAX T2 AI — Intel W880",
            tag: "Core Ultra K · ECC",
            highlights: [
              "Up to Core Ultra 9 285K, unlocked",
              "Intel W880 chipset",
              "4× DDR5 5600 ECC/non-ECC, up to 256GB",
              "Dual 2.5G LAN · 40G USB-C",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/h9b1xnao_Latios%20PROMAX%20T2%20AI%20Workstation%20MT%20Intel%20W880%20DDR5%20256GB%2027072026.pdf",
          },
          {
            name: "PROMAX T2 — Intel W680",
            tag: "14th Gen K · 256GB",
            highlights: [
              "Up to Intel Core i9-14900K",
              "Intel W680 chipset",
              "4× DDR5 5600 ECC/non-ECC, up to 256GB",
              "Up to NVIDIA RTX A6000",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/f9nd29y4_Latios%20PROMAX%20T2%20Workstation%20MT%20Intel%20W680%20DDR5%20256GB%2027072026.pdf",
          },
          {
            name: "PROMAX T4 Plus — Intel W780",
            tag: "Xeon W · 2TB ECC",
            highlights: [
              "Intel Xeon W-2400 / 3400 series",
              "8× DIMM DDR5 ECC, up to 2TB",
              "NVIDIA Blackwell / RTX A6000 ready",
              "1600–2700W redundant PSU",
            ],
            datasheet:
              "https://customer-assets-agu9un31.emergentagent.net/job_tech-gallery-14/artifacts/elz4wjri_Latios%20PROMAX%20T4%20Plus%20Workstation%20MT%20Intel%20W780%20DDR5%202TB%2027072026.pdf",
          },
        ],
      },
    ],
  },
  {
    slug: "audio",
    index: "03",
    name: "Audio",
    model: "Latios Pulse",
    title: ["HEAR", "EVERYTHING."],
    tagline: "Reference sound for people who listen for a living.",
    hero: P("9154411"),
    intro:
      "Beryllium drivers tuned by hand in an anechoic chamber. Silence engineered to -48dB. From the boardroom to the broadcast booth, nothing gets past you.",
    chapters: [
      {
        n: "01",
        kicker: "Drivers",
        heading: "Tuned by hand, not algorithm",
        body: "Each 50mm beryllium driver is measured, matched to its pair within 0.5dB, and signed off by an engineer — not a curve on a spreadsheet.",
        image: U("photo-1505740420928-5e560c06d30e"),
      },
      {
        n: "02",
        kicker: "Isolation",
        heading: "Silence, engineered",
        body: "Eight microphones sample the room 48,000 times a second. Jet cabins, open offices, server halls — all of it drops to a library hush at the flip of a switch.",
        image: U("photo-1608043152269-423dbba4e7e1"),
      },
      {
        n: "03",
        kicker: "Versatility",
        heading: "Boardroom to broadcast",
        body: "A beamforming mic array tuned for speech intelligibility, lossless wireless for the mix, and a 60-hour battery that outlasts the longest production week.",
        image: U("photo-1590658268037-6bf12165a8df"),
      },
    ],
    specs: [
      ["Driver", "50mm beryllium, hand-matched"],
      ["ANC", "Adaptive, up to -48 dB"],
      ["Battery", "60 hours, 10-min = 5h"],
      ["Codecs", "LDAC + aptX Lossless"],
      ["Microphones", "8-mic beamforming array"],
      ["Weight", "254 g, memory-foam"],
      ["Connection", "BT 5.4, USB-C, 3.5mm"],
      ["Warranty", "3-year, advance swap"],
    ],
  },
  {
    slug: "video",
    index: "04",
    name: "Video",
    model: "Latios Vision",
    title: ["SEE", "THE DETAIL."],
    tagline: "Displays and cameras that never miss a frame.",
    hero: U("photo-1593640408182-31c70c8268f5"),
    intro:
      'A 32-inch 6K reference display calibrated at the factory and a 4K AI camera that tracks the room — one cable carries power, pixels and data.',
    chapters: [
      {
        n: "01",
        kicker: "Panel",
        heading: "Color you can grade on",
        body: "6K IPS Black with 99% DCI-P3 coverage, hardware LUT calibration and ΔE < 1 out of the box. Client-approved color, straight from the shipping carton.",
        image: U("photo-1527443224154-c4a3942d3acf"),
      },
      {
        n: "02",
        kicker: "Optics",
        heading: "Glass, not plastic",
        body: "An 8-element all-glass lens in front of a 1-inch sensor. 4K60 with optical-grade clarity that makes the boardroom feel like a studio.",
        image: U("photo-1516035069371-29a1b244cc32"),
      },
      {
        n: "03",
        kicker: "Connectivity",
        heading: "One cable. Everything.",
        body: "Thunderbolt 4 carries 6K video, 96W of power, gigabit ethernet and your entire desk of peripherals through a single connector.",
        image: U("photo-1502920917128-1aa500764cbd"),
      },
    ],
    specs: [
      ["Panel", '32" 6K IPS Black, 120Hz'],
      ["Color", "99% DCI-P3, ΔE < 1"],
      ["HDR", "DisplayHDR 1000"],
      ["Camera", "4K60 AI auto-framing PTZ"],
      ["Calibration", "Hardware 3D LUT"],
      ["Hub", "TB4, 96W PD, 2.5GbE"],
      ["Stand", "Height, tilt, pivot"],
      ["Warranty", "3-year zero-dead-pixel"],
    ],
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);

export const nextCategory = (slug) => {
  const i = CATEGORIES.findIndex((c) => c.slug === slug);
  return CATEGORIES[(i + 1) % CATEGORIES.length];
};
