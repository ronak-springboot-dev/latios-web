export const SHOWCASE = {
  "mt-amd-am4": {
    bannerImage: "/images/banner/banner-amd-1.jpg",
    // Was a 4.9MB clip with a pointless AAC track behind a muted player.
    // Replaced by the MT loop built from the real chassis photographs.
    videoSrc: "/videos/mt-loop.mp4",
    videoPoster: "/images/posters/mt-loop.webp",
    bannerHeadline: "Engineered for the everyday enterprise.",
    bannerSubline:
      "AMD Ryzen 5000G processing with Radeon graphics, wrapped in an 18-litre chassis your IT team can open in seconds.",
    featureGrid: [
      { icon: "Cpu", title: "Ryzen 5000G Power", desc: "Up to Ryzen 7 5700G with 8 cores and Radeon graphics onboard — no discrete GPU required for most fleets." },
      { icon: "MemoryStick", title: "64GB DDR4 Memory", desc: "Dual-channel DDR4-3200 across two U-DIMM slots keeps heavy multitasking instant." },
      { icon: "HardDrive", title: "Triple Storage Bays", desc: 'M.2 NVMe plus 2.5" and 3.5" bays — fast boot drive and bulk archive in one box.' },
      { icon: "MonitorCheck", title: "Up to 16GB Radeon RX", desc: "Optional discrete graphics for design review, multi-display control rooms and light rendering." },
      { icon: "Wifi", title: "Wi-Fi 6E + 1G LAN", desc: "Intel I219-V wired and AX211 wireless options keep every desk connected, docked or roaming." },
      { icon: "Usb", title: "Complete I/O Array", desc: "Front USB-C Gen2 within reach; HDMI 2.1, DisplayPort, VGA and PS/2 at the back — new docks and decade-old projectors both plug in." },
      { icon: "ShieldCheck", title: "Hardware TPM 2.0", desc: "Hardware root-of-trust with Kensington and padlock loops — certified for environments where failure isn't an option." },
      { icon: "Wrench", title: "Service in Seconds", desc: "Quick-access chassis: memory and drive swaps take minutes, keeping fleets current for years." },
    ],
    audiences: [
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
    fullBleeds: [
      {
        kicker: "Thermal Design",
        heading: "Quiet by design, cool under load.",
        body: "A tuned airflow path and fan cooler keep Ryzen 5000G boost clocks sustained through the workday — without the drone your open office hates.",
        image: "/images/chassis.webp",
      },
      {
        kicker: "Expandability",
        heading: "Grows with the workload.",
        body: "Discrete Radeon graphics, extra storage, more memory — the chassis opens fast and takes it all, so today's purchase stays tomorrow's platform.",
        image: "/images/easy.webp",
      },
    ],
  },
};
