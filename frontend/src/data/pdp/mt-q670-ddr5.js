/**
 * Latios MT — Intel Q670 DDR5.  Design language: specified for managed fleets.
 * Steel blue, systematic, grid-heavy. The comparison table comes early because
 * this model is chosen by IT against its siblings, not on its own merits.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "statWall",
      "align": "left",
      "heading": "The chipset is the product.",
      "body": "Where H610 covers the desk, Q670 adds the manageability and lane count that large managed estates are specified around.",
      "stats": [
        [
          "Q670",
          "Business chipset",
          "The row on the tender that H610 cannot satisfy"
        ],
        [
          "24",
          "Cores",
          "Up to Core i9-14900, unchanged from the H610 builds"
        ],
        [
          "64GB",
          "DDR5-5600",
          "With PCIe and storage lanes that do not compete"
        ],
        [
          "A4000",
          "Graphics ready",
          "Full-height slot, certified drivers"
        ]
      ]
    },
    {
      "type": "compare",
      "heading": "Why Q670 and not H610.",
      "subline": "Same chassis, same processors. The platform underneath is the difference.",
      "rows": [
        "Chipset",
        "CPU options",
        "Memory",
        "Graphics"
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/mt-q670-ddr5/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "See the board, reach the board.",
      "body": "Scroll to open it. The mesh window is over the component side, and the panel carrying it comes off by hand.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "18 litres. Identical to every other MT from the outside — deliberately."
        },
        {
          "at": 0.28,
          "label": "Panel off",
          "text": "Hand-removable, so a fleet technician needs no kit to open one."
        },
        {
          "at": 0.5,
          "label": "Q670 board",
          "text": "The business chipset, with the extra PCIe and storage lanes that separate it from H610."
        },
        {
          "at": 0.74,
          "label": "Memory",
          "text": "Two DDR5-5600 U-DIMM slots at full chipset bandwidth."
        },
        {
          "at": 0.92,
          "label": "Expansion",
          "text": "Full-height slots for an RTX A4000, and lanes that are not shared away."
        }
      ]
    },

    {
      "type": "band",
      "kicker": "Specified for managed fleets",
      "items": [
        {"src": "/bands/mt-q670-ddr5-0.webp", "w": 1200, "h": 1163, "alt": "Latios MT \u2014 Intel Q670 DDR5 - Q670: the chipset IT actually asks for"},
        {"src": "/bands/mt-q670-ddr5-1.webp", "w": 1200, "h": 1523, "alt": "Latios MT \u2014 Intel Q670 DDR5 - Up to a Core i9-14900"},
        {"src": "/bands/mt-q670-ddr5-2.webp", "w": 1200, "h": 1163, "alt": "Latios MT \u2014 Intel Q670 DDR5 - DDR5 at full chipset bandwidth"}
      ]
    },
    {
      "type": "video",
      "src": "/videos/mt-q670-ddr5-loop.mp4",
      "poster": "/images/posters/mt-q670-ddr5-loop.webp",
      "modelName": "Latios MT \u2014 Intel Q670 DDR5",
      "heading": "Specified for managed fleets.",
      "subline": "Up to Intel Core i9-14900. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "ioMap",
      "image": "/images/dp180-2.webp",
      "heading": "Every port a managed estate still needs.",
      "body": "Front USB-C Gen 2 for current docks; VGA and PS/2 at the back for the equipment already deployed."
    },
    {
      "type": "featureGrid",
      "heading": "Chosen on the tender, not the spec sheet.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Up to Core i9-14900",
          "desc": "Twelfth through fourteenth generation."
        },
        {
          "icon": "ShieldCheck",
          "title": "Q670 manageability",
          "desc": "The chipset large managed fleets are specified around."
        },
        {
          "icon": "MemoryStick",
          "title": "DDR5-5600",
          "desc": "Dual channel, up to 64GB."
        },
        {
          "icon": "MonitorCheck",
          "title": "RTX A4000 ready",
          "desc": "Certified drivers for CAD and control rooms."
        },
        {
          "icon": "Wifi",
          "title": "Wi-Fi 6E + 1G LAN",
          "desc": "Wired and wireless across the estate."
        },
        {
          "icon": "Wrench",
          "title": "Fleet-serviceable",
          "desc": "Standard parts, hand-removable panel, decade-long availability."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
