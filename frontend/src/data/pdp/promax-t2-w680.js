/**
 * PROMAX T2 — Intel W680.  Design language: twenty-four cores.
 * Amber. The core-count machine of the range, so the page leads with a marquee
 * of what those cores are for rather than with a banner.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "marquee",
      "items": [
        "Core i9-14900K",
        "24 cores",
        "256GB ECC DDR5",
        "RTX A6000 ready",
        "W680 chipset",
        "High-airflow cooling"
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 40, "width": 1400, "height": 1400, "pattern": "/reveal/promax-t2-w680/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Twenty-four cores, fed properly.",
      "body": "Scroll to open it. Core count is easy to print; keeping it supplied is the engineering.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "A workstation tower with the airflow path to match its core count."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "The panel comes away by hand, as it does across the range."
        },
        {
          "at": 0.54,
          "label": "Memory",
          "text": "Four DDR5-5600 slots to 256GB — W680 brings ECC to a Core-series platform."
        },
        {
          "at": 0.76,
          "label": "Cooling",
          "text": "High-airflow fan cooling, specified for eight performance and sixteen efficiency cores under load."
        },
        {
          "at": 0.92,
          "label": "Graphics",
          "text": "Slot clearance and power headroom sized around an RTX A6000."
        }
      ]
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "ECC without a Xeon socket.",
      "stats": [
        [
          "24",
          "Cores",
          "Core i9-14900K — eight performance, sixteen efficient"
        ],
        [
          "256GB",
          "ECC DDR5",
          "W680 brings it to a Core-series platform"
        ],
        [
          "A6000",
          "Graphics ready",
          "Full clearance and power headroom"
        ]
      ]
    },
    {
      "type": "compare",
      "heading": "Where it sits in the range.",
      "against": [
        "promax-q870",
        "promax-t2-w880",
        "promax-t4-plus"
      ],
      "rows": [
        "CPU options",
        "Memory",
        "Graphics"
      ]
    },
    {
      "type": "featureGrid",
      "heading": "The core-count machine.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Core i9-14900K",
          "desc": "Twenty-four cores, unlocked."
        },
        {
          "icon": "MemoryStick",
          "title": "256GB ECC DDR5",
          "desc": "Memory integrity without moving to Xeon."
        },
        {
          "icon": "MonitorCheck",
          "title": "RTX A6000 ready",
          "desc": "Specified around the card, not accommodating it."
        },
        {
          "icon": "Wrench",
          "title": "High-airflow cooling",
          "desc": "Sized for all-core load, not a single boost."
        },
        {
          "icon": "HardDrive",
          "title": "Gen5 NVMe + RAID",
          "desc": "Storage matched to the memory bandwidth."
        },
        {
          "icon": "ShieldCheck",
          "title": "Workstation build",
          "desc": "Familiar panels, standard parts, long availability."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
