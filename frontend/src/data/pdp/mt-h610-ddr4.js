/**
 * Latios MT — Intel H610 DDR4.  Design language: cores where the budget goes.
 * Graphite with a safety-orange accent, tight rhythm, spec-forward copy. The
 * argument here is arithmetic: DDR4 costs less, so the money buys an i9 and a
 * professional card instead of a faster memory bus.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "banner",
      "image": "/reveal/mt-h610-ddr4/002.webp",
      "kicker": "The value build",
      "headline": "Cores where | the budget goes.",
      "subline": "Intel H610 with cost-right DDR4 in the 18-litre Latios MT chassis \u2014 every rupee spent on cores and storage, not on the label."
    },
    {
      "type": "statWall",
      "align": "left",
      "heading": "Where the money actually goes.",
      "body": "DDR4 is the cheaper bus, and on this platform that saving is not lost — it is spent on cores and on the graphics card the DDR5 build often goes without.",
      "stats": [
        [
          "24",
          "Cores, Core i9-14900",
          "Eight performance, sixteen efficient"
        ],
        [
          "64GB",
          "DDR4-3200",
          "Two U-DIMM slots, dual channel"
        ],
        [
          "A4000",
          "Professional graphics",
          "Certified drivers, full-height slot"
        ],
        [
          "500W",
          "80+ Bronze",
          "Headroom the card actually needs"
        ]
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/mt-h610-ddr4/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "The card goes in here.",
      "body": "Scroll to take the panel off. The slot the RTX A4000 occupies is the reason this build exists.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "18 litres, 312 × 166 × 354 mm. The same chassis as every other MT."
        },
        {
          "at": 0.28,
          "label": "Panel off",
          "text": "One hand-removable side panel — no tools, nothing to lose on the floor."
        },
        {
          "at": 0.52,
          "label": "DDR4",
          "text": "Two U-DIMM slots at 3200MHz. The cheaper bus, and the whole point of this configuration."
        },
        {
          "at": 0.74,
          "label": "Graphics",
          "text": "A full-height slot carrying the RTX A4000, fed by the 500W 80+ Bronze supply."
        },
        {
          "at": 0.92,
          "label": "Storage",
          "text": "M.2 NVMe plus 2.5-inch and 3.5-inch bays, all reachable from this side."
        }
      ]
    },
{
      "type": "compare",
      "heading": "DDR4 or DDR5 on the same board?",
      "subline": "Identical chassis, identical chipset. The bus is the decision.",
      "rows": [
        "CPU options",
        "Memory",
        "Graphics"
      ]
    },
    {
      "type": "video",
      "src": "/videos/mt-h610-ddr4-loop.mp4",
      "poster": "/images/posters/mt-h610-ddr4-loop.webp",
      "modelName": "Latios MT \u2014 Intel H610 DDR4",
      "heading": "Cores where the budget goes.",
      "subline": "Up to Intel Core i9-14900. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "ioMap",
      "image": "/images/dp180-2.webp",
      "heading": "Ports the building already has.",
      "body": "HDMI 2.1 and DisplayPort for what your team buys next year; VGA and PS/2 for what is already bolted to the wall."
    },
    {
      "type": "featureGrid",
      "heading": "Specified without waste.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Up to Core i9-14900",
          "desc": "Twelfth through fourteenth generation on one socket — an i3 kiosk and a 24-core seat from the same order."
        },
        {
          "icon": "MemoryStick",
          "title": "64GB DDR4-3200",
          "desc": "Dual channel across two U-DIMM slots."
        },
        {
          "icon": "MonitorCheck",
          "title": "RTX A4000 ready",
          "desc": "Certified professional drivers for CAD and design review."
        },
        {
          "icon": "HardDrive",
          "title": "Triple storage",
          "desc": "M.2 NVMe with 2.5-inch and 3.5-inch bays alongside."
        },
        {
          "icon": "ShieldCheck",
          "title": "TPM 2.0",
          "desc": "Hardware root-of-trust with Kensington and padlock points."
        },
        {
          "icon": "Wrench",
          "title": "Opens by hand",
          "desc": "Memory and drives swap in minutes, for years."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
