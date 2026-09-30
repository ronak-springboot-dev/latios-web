/**
 * Latios processor campaign landing pages — the Latios equivalents of Dell's
 * "latest Intel processors" and "AMD" campaign LPs. Reached from the "Learn
 * more about Intel / AMD" callouts on the desktop listing and from a chip in
 * the top-right of every product page. Each drives ProcessorPage via
 * /processors/:vendor.
 *
 * The pages render dark (keep-dark) in both themes on purpose: a bold,
 * cinematic campaign page like the reference, immune to the site's light-mode
 * inversion, and always readable.
 */
export const PROCESSORS = {
  intel: {
    vendor: "intel",
    wordmark: "intel",
    name: "Intel\u00ae Core\u2122 & Xeon\u00ae",
    accent: "#0068b5",
    accentSoft: "#4aa3e0",
    hero: "/reveal/mt-q670-ddr5/002.webp",
    heroProduct: "/images/fronts/mt.webp",
    kicker: "Latios \u00d7 Intel",
    headline: "Latest Intel processors. | Latios-built desktops.",
    sub: "From 12th\u201314th Gen Core on H610 and Q670 to Xeon-class workstation power \u2014 specified, assembled and supported in India by Latios.",
    intro: "Every Intel-powered Latios ships on a socketed, serviceable board with vPro-class manageability where you need it. Pick the tier that fits the desk; keep the chassis for years.",
    gallery: [
      { img: "/images/fronts/mt.webp", cap: "Latios MT", sub: "H610 & Q670 micro-tower" },
      { img: "/images/fronts/sff.webp", cap: "Latios SFF", sub: "Small-form-factor Intel" },
      { img: "/images/details/mt-interior.webp", cap: "Serviceable inside", sub: "Socketed CPU, tool-free access" },
    ],
    tiers: [
      { name: "Core i3", blurb: "Front-office and kiosk desks. Cool, quiet, and cost-right." },
      { name: "Core i5", blurb: "The volume fleet processor \u2014 responsive for every knowledge worker." },
      { name: "Core i7", blurb: "Power users, design review and heavy multitasking." },
      { name: "Q670 vPro\u00ae", blurb: "Remote manageability and hardware security for managed fleets." },
    ],
    features: [
      { icon: "Cpu", title: "Up to 14th Gen Core", desc: "Performance and efficiency cores scale from the front office to the workstation." },
      { icon: "ShieldCheck", title: "vPro\u00ae manageability", desc: "Remote provisioning, KVM and hardware security IT can rely on at scale." },
      { icon: "Layers", title: "DDR4 or DDR5", desc: "Choose the memory generation and price point the deployment actually needs." },
      { icon: "Zap", title: "Built to be serviced", desc: "Socketed CPU, standard parts and tool-free access keep fleets current for years." },
    ],
    ctaHref: "/towers?cpu=intel",
    ctaLabel: "Explore Intel-powered Latios",
  },
  amd: {
    vendor: "amd",
    wordmark: "AMD",
    name: "AMD Ryzen\u2122",
    accent: "#ed1c24",
    accentSoft: "#ff6a70",
    hero: "/reveal/mt-amd-am4/002.webp",
    heroProduct: "/images/fronts/mt.webp",
    kicker: "Latios \u00d7 AMD",
    headline: "AMD Ryzen power. | Radeon graphics on the die.",
    sub: "Socket AM4 and AM5 Ryzen with Radeon graphics built in \u2014 most desks never need a discrete card. Engineered and finished in Ahmedabad by Latios.",
    intro: "Ryzen brings cores and graphics together on one chip, so a Latios AMD desktop handles design coursework, control rooms and everyday work without a separate GPU \u2014 and stays open to one when you want it.",
    gallery: [
      { img: "/images/fronts/mt.webp", cap: "Latios MT", sub: "Ryzen AM4 & AM5" },
      { img: "/bands/mt-amd-am4-0.webp", cap: "Eight Ryzen cores", sub: "Radeon graphics on the die" },
      { img: "/images/details/mt-interior.webp", cap: "Opens by hand", sub: "AM4/AM5 socket, upgradeable" },
    ],
    tiers: [
      { name: "Ryzen 3", blurb: "Efficient quad-core for kiosks and single-task desks." },
      { name: "Ryzen 5", blurb: "The value fleet choice \u2014 six cores and Radeon graphics." },
      { name: "Ryzen 7", blurb: "Eight cores for power users and light rendering." },
      { name: "Ryzen AI (AM5)", blurb: "On-device AI acceleration and DDR5 headroom for what's next." },
    ],
    features: [
      { icon: "Cpu", title: "Up to Ryzen 7 / Ryzen AI", desc: "Eight cores and an on-die NPU on AM5 for on-device acceleration." },
      { icon: "Layers", title: "Radeon graphics onboard", desc: "Integrated Radeon handles most fleets with no discrete GPU required." },
      { icon: "Zap", title: "AM4 & AM5 sockets", desc: "A serviceable, upgradeable platform \u2014 add memory, storage or a card later." },
      { icon: "ShieldCheck", title: "TPM 2.0 secured", desc: "Hardware root of trust for environments where failure isn't an option." },
    ],
    ctaHref: "/towers?cpu=amd",
    ctaLabel: "Explore AMD-powered Latios",
  },
};

export const getProcessor = (vendor) => PROCESSORS[String(vendor || "").toLowerCase()];
