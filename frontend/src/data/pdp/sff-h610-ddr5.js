/**
 * Latios Pro SFF — Intel H610.  Design language: eight litres.
 * Cyan, airy, generous whitespace. The reveal comes first: the whole claim is
 * that a Core i7 fits in this volume, and opening it is the proof.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "reveal",
      "manifest": {
        "frames": 40,
        "width": 1400,
        "height": 1400,
        "pattern": "/reveal/sff-h610-ddr5/{i}.webp"
      },
      "height": 260,
      "kicker": "Inside",
      "heading": "A Core i7, in eight litres.",
      "body": "Scroll to open it. Nothing here is a cut-down part — the volume is the only thing that shrank.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "95 × 296 × 330 mm. Under a desk, behind a monitor, or standing slim beside it."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "The side comes away and the whole board is in front of you."
        },
        {
          "at": 0.55,
          "label": "Cooling",
          "text": "A low-profile cooler under a fully perforated side wall — surface area doing what a tower does with volume."
        },
        {
          "at": 0.78,
          "label": "Memory",
          "text": "Two DDR5 U-DIMM slots up to 64GB, feeding twenty cores of Core i7-14700."
        },
        {
          "at": 0.93,
          "label": "Storage",
          "text": "An M.2 drive under a slim heatsink, with the TFX supply at the far end."
        }
      ]
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Small is the specification, not the compromise.",
      "stats": [
        [
          "8 L",
          "Chassis volume",
          "95 × 296 × 330 mm"
        ],
        [
          "20",
          "Cores",
          "Core i7-14700, uncut"
        ],
        [
          "64GB",
          "DDR5",
          "Two U-DIMM slots"
        ]
      ]
    },
    {
      "type": "bleed",
      "kicker": "Thermal",
      "heading": "A vent wall, not a vent hole.",
      "body": "The full side is perforated, so air is pulled across the board rather than around it. That is how a 500W TFX build stays quiet in this volume.",
      "image": "/images/details/sff-vent.webp"
    },
    {
      "type": "featureGrid",
      "heading": "Everything, minus the volume.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Up to Core i7-14700",
          "desc": "Twenty cores of fourteenth-generation Intel."
        },
        {
          "icon": "MemoryStick",
          "title": "64GB DDR5",
          "desc": "Dual channel across two U-DIMM slots."
        },
        {
          "icon": "HardDrive",
          "title": "M.2 NVMe",
          "desc": "Under a slim heatsink, with the TFX supply opposite."
        },
        {
          "icon": "Wrench",
          "title": "Vertical or horizontal",
          "desc": "Finished on every face, with thermals that hold either way."
        },
        {
          "icon": "ShieldCheck",
          "title": "TPM 2.0",
          "desc": "Small footprint, enterprise posture."
        },
        {
          "icon": "Usb",
          "title": "Card reader and speaker",
          "desc": "Built in — no dongles, no desk clutter."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
