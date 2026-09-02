/**
 * Latios MT — Intel H610 DDR5.  Design language: built around the bus.
 * Electric blue, motion devices, a marquee. Where the DDR4 build argues cost,
 * this one argues bandwidth — so the page leads with movement and numbers.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "marquee",
      "items": [
        "DDR5-5600",
        "Core i9-14900",
        "24 cores",
        "64GB",
        "TPM 2.0",
        "18 litres",
        "500W 80+ Bronze",
        "Made in India"
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/mt-h610-ddr5/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Two slots, twice the bus.",
      "body": "Scroll to open it. The difference between this and the DDR4 build is standing right there.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "The same 18-litre box. Everything that changed is inside it."
        },
        {
          "at": 0.28,
          "label": "Panel off",
          "text": "Hand-removable. No service manual required."
        },
        {
          "at": 0.52,
          "label": "DDR5-5600",
          "text": "Two U-DIMM slots at 5600 MT/s — considerably more data per cycle than the DDR4 build of the same machine."
        },
        {
          "at": 0.74,
          "label": "Cooling",
          "text": "A tower cooler with a clear intake path, tuned for sustained boost rather than short bursts."
        },
        {
          "at": 0.92,
          "label": "Security",
          "text": "Discrete TPM 2.0 on the board, with military-grade certification behind it."
        }
      ]
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Bandwidth is the whole argument.",
      "stats": [
        [
          "5600",
          "MT/s DDR5",
          "Where simulation and heavy virtualisation actually notice"
        ],
        [
          "24",
          "Cores",
          "Core i9-14900, eight performance and sixteen efficient"
        ],
        [
          "64GB",
          "Dual channel",
          "Two U-DIMM slots"
        ]
      ]
    },
    {
      "type": "video",
      "src": "/videos/mt-h610-ddr5-loop.mp4",
      "poster": "/images/posters/mt-h610-ddr5-loop.webp",
      "modelName": "Latios MT \u2014 Intel H610 DDR5",
      "heading": "Built around the bus.",
      "subline": "Up to Intel Core i9-14900. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "featureGrid",
      "heading": "The rest is unchanged, on purpose.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Up to Core i9-14900",
          "desc": "Twelfth to fourteenth generation on the H610 chipset."
        },
        {
          "icon": "MemoryStick",
          "title": "DDR5 at 5600MT/s",
          "desc": "The reason to pick this build over its DDR4 twin."
        },
        {
          "icon": "ShieldCheck",
          "title": "Hardware TPM 2.0",
          "desc": "Secured firmware and a discrete module, standard on every unit."
        },
        {
          "icon": "Usb",
          "title": "Complete I/O",
          "desc": "Front USB-C Gen 2; HDMI 2.1, DisplayPort, VGA and PS/2 behind."
        },
        {
          "icon": "Wifi",
          "title": "Wi-Fi 6E + 1G LAN",
          "desc": "Wired and wireless options for docked or roaming desks."
        },
        {
          "icon": "Wrench",
          "title": "Serviced from one side",
          "desc": "Memory, M.2 and both drive bays behind a single panel."
        }
      ]
    },
    {
      "type": "band",
      "kicker": "Built around the bus",
      "items": [
        {"src": "/bands/mt-h610-ddr5-0.webp", "w": 1200, "h": 1163, "alt": "Latios MT \u2014 Intel H610 DDR5 - The same Core i9, on a faster bus"},
        {"src": "/bands/mt-h610-ddr5-1.webp", "w": 1200, "h": 1523, "alt": "Latios MT \u2014 Intel H610 DDR5 - 64GB of DDR5 at 5600 MT/s"},
        {"src": "/bands/mt-h610-ddr5-2.webp", "w": 1200, "h": 1163, "alt": "Latios MT \u2014 Intel H610 DDR5 - Hardware TPM 2.0, standard"}
      ]
    },
{
      "type": "compare",
      "heading": "Against the rest of the MT range.",
      "rows": [
        "CPU options",
        "Chipset",
        "Memory"
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
