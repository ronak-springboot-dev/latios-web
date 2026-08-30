/**
 * Latios MT — AMD AM4.  Design language: the everyday workhorse.
 *
 * Warm amber accent, tight vertical rhythm, plain-spoken copy. This is the
 * cheapest machine in the range and the page should feel practical rather than
 * cinematic — dense bands, the ports laid out in full, the fleet-facing
 * audience tabs up front. Contrast it with promax-t4-plus.js, which uses a
 * different subset of sections in a different order.
 */
export default {
  sections: [
    { type: "hero" },

    {
      type: "marquee",
      items: [
        "Ryzen 7 5700G", "Radeon graphics onboard", "64GB DDR4-3200",
        "18-litre chassis", "TPM 2.0", "Wi-Fi 6E", "Tool-free service",
        "Made in India", "GeM registered",
      ],
    },

    {
      type: "statWall",
      align: "left",
      heading: "The numbers that decide a fleet.",
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
      type: "bleed",
      kicker: "Serviceability",
      heading: "The panel comes off by hand.",
      body:
        "No screwdriver, no service manual. Memory, the M.2 slot and both drive " +
        "bays are reachable from one side, which is the difference between a " +
        "desk-side upgrade and a truck roll.",
      image: "/images/details/mt-inside.webp",
    },

    {
      type: "ioMap",
      image: "/images/details/mt-side.webp",
      heading: "New docks and decade-old projectors.",
      body:
        "The reason this chassis outlives its purchase order: USB-C Gen 2 at the " +
        "front for what your team buys next year, VGA and PS/2 at the back for " +
        "what the building already has.",
    },

    {
      type: "featureGrid",
      heading: "Everything your fleet needs.",
      items: [
        { icon: "Cpu", title: "Ryzen 5000G Power", desc: "Up to Ryzen 7 5700G with 8 cores and Radeon graphics onboard — no discrete GPU required for most fleets." },
        { icon: "MemoryStick", title: "64GB DDR4 Memory", desc: "Dual-channel DDR4-3200 across two U-DIMM slots keeps heavy multitasking instant." },
        { icon: "HardDrive", title: "Triple Storage Bays", desc: 'M.2 NVMe plus 2.5" and 3.5" bays — fast boot drive and bulk archive in one box.' },
        { icon: "MonitorCheck", title: "Up to 16GB Radeon RX", desc: "Optional discrete graphics for design review, multi-display control rooms and light rendering." },
        { icon: "Wifi", title: "Wi-Fi 6E + 1G LAN", desc: "Intel I219-V wired and AX211 wireless options keep every desk connected, docked or roaming." },
        { icon: "Usb", title: "Complete I/O Array", desc: "Front USB-C Gen2 within reach; HDMI 2.1, DisplayPort, VGA and PS/2 at the back." },
        { icon: "ShieldCheck", title: "Hardware TPM 2.0", desc: "Hardware root-of-trust with Kensington and padlock loops — certified for environments where failure isn't an option." },
        { icon: "Wrench", title: "Service in Seconds", desc: "Quick-access chassis: memory and drive swaps take minutes, keeping fleets current for years." },
      ],
    },

    {
      type: "audiences",
      heading: "One platform. Every team.",
      items: [
        {
          id: "enterprise",
          label: "Enterprise IT",
          heading: "Fleets that stay current, not retired",
          desc: "Standard tools, standard parts, TPM 2.0 at the metal. Roll out hundreds of units knowing each one can be serviced or upgraded in minutes, not truck-rolls.",
          bullets: ["TPM 2.0 + secured firmware", "Tool-fast memory and drive access", "Legacy VGA / PS/2 alongside USB-C"],
          image: "/images/ops.webp",
        },
        {
          id: "education",
          label: "Education",
          heading: "Labs that survive the semester",
          desc: "Radeon graphics onboard handle coding labs, design coursework and exam kiosks — with padlock loops that keep hardware exactly where you left it.",
          bullets: ["Ryzen 5/7 options for every budget", "Kensington + padlock physical security", "Wi-Fi 6E for dense classrooms"],
          image: "/images/av-ifp.jpg",
        },
        {
          id: "government",
          label: "Government",
          heading: "GeM-ready, Made in India",
          desc: "Designed, manufactured and supported at our Ahmedabad facility. Direct public-sector procurement through GeM with local lifecycle support.",
          bullets: ["GeM-registered OEM", "ISO 9001 / 14001 / 27001 certified plant", "Decade-long parts availability"],
          image: "/images/factory.jpg",
        },
        {
          id: "frontoffice",
          label: "Front Office & SMB",
          heading: "A workhorse that disappears into the desk",
          desc: "Quiet fan cooling, an 18-litre footprint and every port accounting teams still rely on — from receipt printers to dual displays.",
          bullets: ["Only 312 × 166 × 354 mm", "Dual-display 4K out of the box", "Up to 500W 80+ Bronze PSU headroom"],
          image: "/images/av-monitor.jpg",
        },
      ],
    },

    {
      type: "compare",
      heading: "AM4, or one of the Intel boards?",
      rows: ["CPU options", "Chipset", "Memory", "Graphics"],
    },

    {
      // Replaces the turntable that used to sit here. All three MT source photos
      // are side and back panels — no front shot exists — so the turntable read
      // as a dark slab rotating. This says something the photography cannot.
      type: "thermal",
      src: "/videos/mt-airflow.mp4",
      poster: "/images/posters/mt-airflow.webp",
      heading: "You can see it breathe.",
      body:
        "Cool air drawn across the board, heat carried straight out the back. " +
        "The 18-litre chassis is vented on three faces so the fan never has to " +
        "work hard enough for the office to notice.",
      stats: [
        ["3 faces", "Vented — front intake, side mesh, rear exhaust"],
        ["Fan cooler", "Tuned for sustained boost, not short bursts"],
        ["500W", "80+ Bronze, with headroom for a discrete card"],
      ],
    },

    { type: "specTeaser" },
  ],
};
