/**
 * PROMAX T4 Plus — Intel W780.  Design language: the top of the range.
 *
 * Near-black surface, molten orange accent, airy rhythm, very few very large
 * statements. Where mt-amd-am4.js is dense and practical with the ports listed
 * in full, this page opens on a cinematic full-bleed, states three enormous
 * numbers, and lets the component breakdown carry the middle. Different
 * sections, different order, deliberately.
 */
export default {
  sections: [
    { type: "hero" },

    {
      type: "banner",
      image: "/images/components/gpu-pro.webp",
      kicker: "The top of the range",
      headline: "Two terabytes of memory, and the lanes to feed it.",
      subline:
        "Xeon W-3400 on the W780 platform: the highest core counts, the most " +
        "PCIe lanes and the memory channels a four-card machine actually needs.",
    },

    {
      type: "statWall",
      align: "center",
      heading: "Numbers that stop being desktop numbers.",
      stats: [
        ["2TB", "ECC DDR5", "Across the full Xeon W channel count — datasets that used to be a server-room problem"],
        ["2700W", "Redundant power", "Dual supplies. A failed PSU is a scheduled swap, not a stopped queue"],
        ["Xeon W", "3400 series", "The platform the rest of the range steps up to"],
      ],
    },

    {
      type: "stickySplit",
      kicker: "Why a workstation",
      heading: "The difference is what happens when it is wrong.",
      body:
        "A large desktop and a workstation look similar until a bit flips in " +
        "hour ninety of a run. Error-correcting memory, redundant power and " +
        "certified drivers exist so the answer you get is the answer.",
      points: [
        "ECC DDR5 across every channel",
        "Dual redundant 2700W supplies",
        "Certified professional graphics drivers",
        "Lane count for several full-size accelerators",
      ],
      media: [
        { src: "/images/components/pcb-macro.webp", caption: "Dense multi-layer board — the lane count is physical, not a firmware setting." },
        { src: "/images/components/gpu-pro-2.webp", caption: "Full-height, full-length clearance sized around the card." },
        { src: "/images/ddr5.webp", caption: "Error-correcting DDR5 in capacities ordinary desktops cannot reach." },
      ],
    },

    {
      type: "exploded",
      heading: "What goes in it.",
      body:
        "The T4 Plus is specified around its parts rather than shipped as a " +
        "sealed unit. Memory, storage, cooling and power are all chosen at order " +
        "and all replaceable in service.",
      video: "/videos/components-loop.mp4",
      poster: "/images/posters/components-loop.webp",
      parts: [
        { name: "DDR5 ECC module", note: "Up to 2TB across the Xeon W channel count", image: "/images/components/ddr5.webp" },
        { name: "M.2 NVMe drive", note: "Gen5 boot and scratch, RAID options", image: "/images/components/m2.webp" },
        { name: "Tower air cooler", note: "Sized for sustained all-core load", image: "/images/components/cooler.webp" },
        { name: "Modular PSU", note: "Dual redundant supplies totalling 2700W", image: "/images/components/psu.webp" },
      ],
    },

    {
      type: "compare",
      heading: "Across the PROMAX range.",
      subline:
        "Each PROMAX is a different chassis, so these are not configurations of one box — they are four different machines.",
      against: ["promax-q870", "promax-t2-w880", "promax-t2-w680"],
      rows: ["CPU options", "Memory", "Graphics"],
    },

    {
      type: "featureGrid",
      heading: "Specified for the work, not the spec sheet.",
      items: [
        { icon: "Cpu", title: "Xeon W-3400", desc: "The highest core counts and PCIe lane budget in the Latios range." },
        { icon: "MemoryStick", title: "2TB ECC DDR5", desc: "Error-correcting memory across the full channel count — week-long computations stay honest." },
        { icon: "MonitorCheck", title: "Multiple Pro GPUs", desc: "Power and lanes for several full-size accelerators at once." },
        { icon: "ShieldCheck", title: "Redundant 2700W", desc: "Dual supplies, so a PSU failure becomes a maintenance ticket." },
        { icon: "HardDrive", title: "Gen5 NVMe + RAID", desc: "Storage that keeps up with the memory bandwidth behind it." },
        { icon: "Wifi", title: "Dual 2.5G LAN", desc: "Segregated management and data paths without spending a slot." },
        { icon: "Wrench", title: "Serviceable", desc: "Standard parts and hand-removable panels — a memory upgrade in year three is maintenance, not procurement." },
        { icon: "Usb", title: "Front-panel access", desc: "High-bandwidth ports where an operator can actually reach them." },
      ],
    },

    { type: "specTeaser", heading: "Two thousand gigabytes, itemised." },
  ],
};
