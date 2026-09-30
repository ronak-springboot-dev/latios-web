/**
 * Latios processor campaign landing pages (Intel / AMD). Structure mirrors a
 * Dell-style processor campaign LP — hero, anchor nav, an on-device-AI split,
 * benefit blocks, a "Built by Latios" showcase, the Latios range tiers, a spec
 * comparison table and a CTA band — but every word and image is Latios's own.
 * Rendered dark (keep-dark) in both themes. Drives ProcessorPage.
 */
const RANGE = (v) => [
  { name: "Latios MT", tagline: "Everyday productivity, done right", points: ["18-litre micro-tower", "Opens by hand for service", "Up to 64GB memory"], image: "/images/fronts/mt.webp", href: `/towers?cpu=${v}&b=mt` },
  { name: "Latios SFF", tagline: "A full desktop, half the footprint", points: ["Small-form-factor chassis", "Tucks behind the monitor", "Quiet at the desk"], image: "/images/fronts/sff.webp", href: `/towers?cpu=${v}&b=sff` },
  { name: "Latios PRO MAX", tagline: "Workstation-class headroom", points: ["High-core configurations", "ECC-capable memory", "For creators & engineers"], image: "/images/fronts/mff-dp10.webp", href: `/towers?cpu=${v}` },
];

export const PROCESSORS = {
  intel: {
    vendor: "intel", wordmark: "intel", name: "Intel\u00ae Core\u2122 & Xeon\u00ae",
    accent: "#0068b5", accentSoft: "#4aa3e0",
    hero: "/reveal/mt-q670-ddr5/002.webp", heroProduct: "/images/fronts/mt.webp",
    kicker: "Latios \u00d7 Intel",
    headline: "Latest Intel processors. | Latios-built desktops.",
    sub: "From 12th\u201314th Gen Core on H610 and Q670 to Xeon-class workstation power \u2014 specified, assembled and supported in India by Latios.",
    intro: "Every Intel-powered Latios ships on a socketed, serviceable board with vPro-class manageability where you need it. Pick the tier that fits the desk; keep the chassis for years.",
    anchors: ["Manageability", "Everyday work", "The range", "Compare"],
    aiSplit: {
      image: "/images/details/mt-angle.webp",
      heading: "vPro control, built into the fleet.",
      body: "12th\u201314th Gen Core with vPro brings remote provisioning, KVM and hardware security to every Latios desk \u2014 so IT can image, secure and service hundreds of machines without a truck-roll.",
      link: { label: "How Intel vPro powers Latios", href: "/towers?cpu=intel" },
    },
    benefits: [
      { image: "/images/details/mt-interior.webp", title: "Multitasking without slowdowns", points: ["Up to Core i9, many-core", "Dual-channel DDR4 or DDR5", "Heavy apps stay responsive together"] },
      { image: "/images/details/mt-panel.webp", title: "Graphics that just work", points: ["Intel UHD / Arc graphics onboard", "Dual 4K displays out of the box", "A full-height slot when you need more"] },
      { image: "/images/personas/enterprise.jpg", title: "Managed by design", points: ["vPro remote manageability", "TPM 2.0 hardware root of trust", "Standardised images across the fleet"] },
    ],
    gallery: [
      { img: "/images/fronts/mt.webp", cap: "Latios MT", sub: "H610 & Q670 micro-tower" },
      { img: "/images/fronts/sff.webp", cap: "Latios SFF", sub: "Small-form-factor Intel" },
      { img: "/images/details/mt-interior.webp", cap: "Serviceable inside", sub: "Socketed CPU, tool-free access" },
    ],
    range: RANGE("intel"),
    compare: {
      cols: ["Range", "Best for", "Memory", "Processor", "Details"],
      rows: [
        ["Latios MT \u2014 H610", "Fleets & front office", "Up to 64GB DDR4/DDR5", "Core i3 / i5 / i7", "/towers/mt-h610-ddr5"],
        ["Latios MT \u2014 Q670", "Managed fleets (vPro)", "Up to 64GB DDR5", "Core i5 / i7 vPro", "/towers/mt-q670-ddr5"],
        ["Latios PRO MAX", "Creators & engineers", "Up to 128GB ECC", "Core / Xeon high-core", "/towers"],
      ],
    },
    tiers: [
      { name: "Core i3", blurb: "Front-office and kiosk desks. Cool, quiet, cost-right." },
      { name: "Core i5", blurb: "The volume fleet processor \u2014 responsive for every worker." },
      { name: "Core i7", blurb: "Power users, design review and heavy multitasking." },
      { name: "Q670 vPro\u00ae", blurb: "Remote manageability and hardware security at scale." },
    ],
    features: [
      { icon: "Cpu", title: "Up to 14th Gen Core", desc: "Performance and efficiency cores scale from the front office to the workstation." },
      { icon: "ShieldCheck", title: "vPro\u00ae manageability", desc: "Remote provisioning, KVM and hardware security IT can rely on at scale." },
      { icon: "Layers", title: "DDR4 or DDR5", desc: "Choose the memory generation and price point the deployment needs." },
      { icon: "Zap", title: "Built to be serviced", desc: "Socketed CPU and tool-free access keep fleets current for years." },
    ],
    ctaHref: "/towers?cpu=intel", ctaLabel: "Explore Intel-powered Latios",
  },
  amd: {
    vendor: "amd", wordmark: "AMD", name: "AMD Ryzen\u2122",
    accent: "#ed1c24", accentSoft: "#ff6a70",
    hero: "/reveal/mt-amd-am4/002.webp", heroProduct: "/images/fronts/mt.webp",
    kicker: "Latios \u00d7 AMD",
    headline: "AMD Ryzen power. | Radeon graphics on the die.",
    sub: "Socket AM4 and AM5 Ryzen with Radeon graphics built in \u2014 most desks never need a discrete card. Engineered and finished in Ahmedabad by Latios.",
    intro: "Ryzen brings cores and graphics together on one chip, so a Latios AMD desktop handles design coursework, control rooms and everyday work without a separate GPU \u2014 and stays open to one when you want it.",
    anchors: ["On-device AI", "Everyday work", "The range", "Compare"],
    aiSplit: {
      image: "/bands/mt-amd-am4-0.webp",
      heading: "On-device AI, built into the desk.",
      body: "Ryzen AI on Socket AM5 runs assistants and local models on an on-die NPU \u2014 fast, private and off the cloud. Latios ships it on a serviceable board you keep for years, not a sealed box you replace.",
      link: { label: "How Ryzen AI powers Latios", href: "/towers?cpu=amd" },
    },
    benefits: [
      { image: "/images/details/mt-interior.webp", title: "Multitasking without slowdowns", points: ["Up to 8 Ryzen cores / 16 threads", "Dual-channel DDR4/DDR5 headroom", "Heavy apps stay responsive together"] },
      { image: "/bands/mt-amd-am4-1.webp", title: "Graphics on the die", points: ["Integrated Radeon graphics", "No discrete GPU for most desks", "A full-height slot when you want one"] },
      { image: "/images/personas/enterprise.jpg", title: "AI-ready by design", points: ["On-die NPU on AM5", "Local Copilot-class experiences", "Sensitive data stays on the machine"] },
    ],
    gallery: [
      { img: "/images/fronts/mt.webp", cap: "Latios MT", sub: "Ryzen AM4 & AM5" },
      { img: "/bands/mt-amd-am4-0.webp", cap: "Eight Ryzen cores", sub: "Radeon graphics on the die" },
      { img: "/images/details/mt-interior.webp", cap: "Opens by hand", sub: "AM4/AM5 socket, upgradeable" },
    ],
    range: RANGE("amd"),
    compare: {
      cols: ["Range", "Best for", "Memory", "Processor", "Details"],
      rows: [
        ["Latios MT \u2014 AM4", "Fleets & front office", "Up to 64GB DDR4", "Ryzen 3 / 5 / 7 5000G", "/towers/mt-amd-am4"],
        ["Latios MT \u2014 AM5", "AI-ready desks", "Up to 64GB DDR5", "Ryzen AI (AM5)", "/towers/mt-am5-pro-ai"],
        ["Latios PRO MAX", "Creators & engineers", "Up to 128GB ECC", "Ryzen high-core", "/towers"],
      ],
    },
    tiers: [
      { name: "Ryzen 3", blurb: "Efficient quad-core for kiosks and single-task desks." },
      { name: "Ryzen 5", blurb: "The value fleet choice \u2014 six cores and Radeon graphics." },
      { name: "Ryzen 7", blurb: "Eight cores for power users and light rendering." },
      { name: "Ryzen AI (AM5)", blurb: "On-device AI acceleration and DDR5 headroom." },
    ],
    features: [
      { icon: "Cpu", title: "Up to Ryzen 7 / Ryzen AI", desc: "Eight cores and an on-die NPU on AM5 for on-device acceleration." },
      { icon: "Layers", title: "Radeon graphics onboard", desc: "Integrated Radeon handles most fleets with no discrete GPU required." },
      { icon: "Zap", title: "AM4 & AM5 sockets", desc: "A serviceable, upgradeable platform \u2014 add memory, storage or a card later." },
      { icon: "ShieldCheck", title: "TPM 2.0 secured", desc: "Hardware root of trust for environments where failure isn't an option." },
    ],
    ctaHref: "/towers?cpu=amd", ctaLabel: "Explore AMD-powered Latios",
  },
};

export const getProcessor = (vendor) => PROCESSORS[String(vendor || "").toLowerCase()];
