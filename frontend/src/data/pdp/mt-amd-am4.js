/**
 * Latios MT — AMD AM4.  Design language: the everyday workhorse, told the
 * Minisforum way — a cinematic dark banner up top, big two-tone section
 * headings ("muted lead | bold tail"), a three-tier feature strip (benefit /
 * spec / description), and full-bleed product moments. Scroll animation is
 * deliberately off; the drama is in the imagery and typography, not motion.
 */
export default {
  sections: [
    { type: "hero" },

    {
      // Cinematic opener — a dramatic still of the chassis on black with an
      // accent floor-glow and a big two-tone headline over it.
      type: "banner",
      image: "/reveal/mt-amd-am4/002.webp",
      kicker: "The everyday workhorse",
      headline: "Built to be opened. | Built to last.",
      subline:
        "AMD Ryzen 5000G with Radeon graphics on the die, a full array of I/O, " +
        "and an 18-litre chassis your IT team can open by hand.",
    },

    {
      type: "statWall",
      align: "left",
      heading: "The numbers | that decide a fleet.",
      body:
        "Nothing here is a headline figure you will never reach. These are the " +
        "ceilings of the machine as shipped, and the reasons it is still worth " +
        "servicing in year six.",
      stats: [
        ["8", "Ryzen cores", "Ryzen 7 5700G, down to a Ryzen 3 5305G on the same board"],
        ["64GB", "DDR4-3200 ceiling", "Two U-DIMM slots — ship at 16GB, finish at 64GB"],
        ["18 L", "Chassis volume", "312 × 166 × 354 mm, 7.59 kg"],
        ["500W", "80+ Bronze PSU", "Headroom for a discrete Radeon card later"],
      ],
    },

    {
      type: "featureGrid",
      heading: "Everything | your fleet needs.",
      items: [
        { icon: "Cpu", title: "Ryzen 5000G power", spec: "Up to Ryzen 7 5700G · 8C/16T", desc: "Eight cores with Radeon graphics onboard — no discrete GPU required for most fleets." },
        { icon: "MemoryStick", title: "Big, fast memory", spec: "Dual-channel DDR4-3200", desc: "Two U-DIMM slots up to 64GB keep heavy multitasking instant." },
        { icon: "HardDrive", title: "Triple storage bays", spec: 'M.2 · 2.5" · 3.5"', desc: "A fast NVMe boot drive and bulk archive in one box." },
        { icon: "MonitorCheck", title: "Discrete-ready", spec: "Full-height PCIe slot", desc: "Up to 16GB Radeon RX for design review, control rooms and light rendering." },
        { icon: "Wifi", title: "Connected everywhere", spec: "Wi-Fi 6E AX211 · 1G LAN", desc: "Wired I219-V and Wi-Fi 6E keep every desk connected, docked or roaming." },
        { icon: "Usb", title: "Complete I/O array", spec: "USB-C Gen2 · HDMI 2.1 · DP · VGA", desc: "Front USB-C within reach; legacy VGA and PS/2 at the back for what the building already has." },
        { icon: "ShieldCheck", title: "Hardware root of trust", spec: "TPM 2.0 · Kensington · Padlock", desc: "Certified for environments where failure isn't an option." },
        { icon: "Wrench", title: "Service in seconds", spec: "Tool-free side panel", desc: "Memory and drive swaps take minutes, keeping fleets current for years." },
      ],
    },

    {
      type: "capabilityTabs",
      heading: "Core capability | upgrades.",
      body:
        "Three decisions define this build. Switch between them to see what each " +
        "one buys — the cores, the memory, and the panel that comes off by hand.",
      tabs: [
        {
          label: "Processor",
          image: "/bands/mt-amd-am4-0.webp",
          spec: "Up to Ryzen 7 5700G · 8C/16T",
          title: "Eight cores, graphics on the die.",
          text: "The Ryzen 7 5700G tops a Socket AM4 line-up that runs down to the Ryzen 3 5305G — with Radeon graphics built in, so most desks never need a discrete card.",
        },
        {
          label: "Memory",
          image: "/bands/mt-amd-am4-1.webp",
          spec: "Dual-channel DDR4-3200",
          title: "64GB across two slots.",
          text: "Two U-DIMM slots ship at 16GB and finish at 64GB of dual-channel DDR4-3200 — enough headroom to keep heavy multitasking instant for years.",
        },
        {
          label: "Serviceability",
          image: "/bands/mt-amd-am4-2.webp",
          spec: "Tool-free side panel",
          title: "Opens by hand, in seconds.",
          text: "One hand-removable panel, standard parts inside and spares that ship for a decade. Built to be worked on rather than replaced.",
        },
      ],
    },

    {
      type: "reveal",
      manifest: { frames: 64, width: 1400, height: 1120, pattern: "/reveal/mt-amd-am4/{i}.webp" },
      height: 260,
      kicker: "Serviceability",
      heading: "It opens by hand.",
      body:
        "No screwdriver, no service manual. A panel off, standard parts inside, " +
        "and spares that ship for a decade.",
      steps: [
        { at: 0.00, label: "Closed", text: "312 × 166 × 354 mm, 7.59 kg. An 18-litre box that sits under a desk without asking for room." },
        { at: 0.30, label: "Panel off", text: "One hand-removable side panel. No tools, and nothing to lose on the floor." },
        { at: 0.55, label: "Cooling", text: "A tower cooler over the socket with a clear intake path from the front mesh." },
        { at: 0.75, label: "Memory and storage", text: "Two DDR4 U-DIMM slots, an M.2 slot, plus 2.5-inch and 3.5-inch bays — all reachable from this side." },
        { at: 0.92, label: "Expansion", text: "Full-height slots and a 500W 80+ Bronze supply, so a discrete Radeon card goes in later without a new chassis." },
      ],
    },

    {
      "type": "video",
      "src": "/videos/mt-amd-am4-loop.mp4",
      "poster": "/images/posters/mt-amd-am4-loop.webp",
      "modelName": "Latios MT \u2014 AMD AM4",
      "heading": "The everyday workhorse.",
      "subline": "AMD Ryzen 7 5700G / 5 5600G / 3 5305G. Engineered, assembled and finished in Ahmedabad.",
    },

    {
      type: "audiences",
      heading: "One platform. | Every team.",
      items: [
        {
          id: "enterprise",
          label: "Enterprise IT",
          heading: "Fleets that stay current, not retired",
          desc: "Standard tools, standard parts, TPM 2.0 at the metal. Roll out hundreds of units knowing each one can be serviced or upgraded in minutes, not truck-rolls.",
          bullets: ["TPM 2.0 + secured firmware", "Tool-fast memory and drive access", "Legacy VGA / PS/2 alongside USB-C"],
          image: "/images/personas/enterprise.jpg",
        },
        {
          id: "education",
          label: "Education",
          heading: "Labs that survive the semester",
          desc: "Radeon graphics onboard handle coding labs, design coursework and exam kiosks — with padlock loops that keep hardware exactly where you left it.",
          bullets: ["Ryzen 5/7 options for every budget", "Kensington + padlock physical security", "Wi-Fi 6E for dense classrooms"],
          image: "/images/personas/education.jpg",
        },
        {
          id: "government",
          label: "Government",
          heading: "GeM-ready, Made in India",
          desc: "Designed, manufactured and supported at our Ahmedabad facility. Direct public-sector procurement through GeM with local lifecycle support.",
          bullets: ["GeM-registered OEM", "ISO 9001 / 14001 / 27001 certified plant", "Decade-long parts availability"],
          image: "/images/personas/government.jpg",
        },
        {
          id: "frontoffice",
          label: "Front Office & SMB",
          heading: "A workhorse that disappears into the desk",
          desc: "Quiet fan cooling, an 18-litre footprint and every port accounting teams still rely on — from receipt printers to dual displays.",
          bullets: ["Only 312 × 166 × 354 mm", "Dual-display 4K out of the box", "Up to 500W 80+ Bronze PSU headroom"],
          image: "/images/personas/frontoffice.jpg",
        },
      ],
    },

    {
      type: "ioMap",
      image: "/images/details/mt-rear.webp",
      heading: "New docks | and decade-old projectors.",
      body:
        "The reason this chassis outlives its purchase order: USB-C Gen 2 at the " +
        "front for what your team buys next year, VGA and PS/2 at the back for " +
        "what the building already has.",
    },

    {
      type: "compare",
      heading: "AM4, | or one of the Intel boards?",
      rows: ["CPU options", "Chipset", "Memory", "Graphics"],
    },

    { type: "specTeaser", heading: "Every number | that matters." },
  ],
};
