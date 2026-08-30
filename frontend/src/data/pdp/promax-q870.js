/**
 * PROMAX AI — Intel Q870.  Design language: workstation class, entry point.
 * Orange, cinematic banner up front. This is the first PROMAX, so the page
 * opens by establishing what the range is before detailing the model.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "banner",
      "image": "/images/components/gpu-pro.webp",
      "kicker": "Workstation class",
      "headline": "Where the range starts getting serious.",
      "subline": "Core Ultra 9 285 with an AI Boost NPU, 128GB of DDR5 and clearance for an RTX A6000."
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "The entry point, and not a modest one.",
      "stats": [
        [
          "A6000",
          "Graphics ready",
          "Certified professional drivers"
        ],
        [
          "128GB",
          "DDR5",
          "Four slots — a whole scene held in memory"
        ],
        [
          "NPU",
          "Intel AI Boost",
          "Local inference alongside the graphics card"
        ]
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 40, "width": 1400, "height": 1400, "pattern": "/reveal/promax-q870/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Four slots and a full-length card.",
      "body": "Scroll to open it. This is the first machine in the range specified around the graphics card rather than accommodating one.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "A workstation tower — the volume exists to be filled."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "One panel, hand-removable, as with every Latios chassis."
        },
        {
          "at": 0.54,
          "label": "Memory",
          "text": "Four DDR5 slots up to 128GB, enough to hold a large model resident."
        },
        {
          "at": 0.76,
          "label": "Graphics",
          "text": "Full-height, full-length clearance for an RTX A6000-class card."
        },
        {
          "at": 0.92,
          "label": "Power",
          "text": "A shrouded supply sized around the card, not squeezed in beside it."
        }
      ]
    },
    {
      "type": "featureGrid",
      "heading": "Specified for the work.",
      "items": [
        {
          "icon": "MonitorCheck",
          "title": "Up to RTX A6000",
          "desc": "Certified drivers for CAD, simulation and 8K editing."
        },
        {
          "icon": "Cpu",
          "title": "Core Ultra 9 285",
          "desc": "Performance cores, efficiency cores and an NPU."
        },
        {
          "icon": "MemoryStick",
          "title": "128GB DDR5",
          "desc": "Four slots, dual channel."
        },
        {
          "icon": "HardDrive",
          "title": "Gen5 NVMe + RAID",
          "desc": "Storage that keeps pace with the memory."
        },
        {
          "icon": "Wifi",
          "title": "Dual 2.5G LAN",
          "desc": "Segregated management and data paths."
        },
        {
          "icon": "Wrench",
          "title": "Serviceable",
          "desc": "Standard parts and hand-removable panels."
        }
      ]
    },
    {
      "type": "compare",
      "heading": "Across the PROMAX range.",
      "subline": "Four different machines, not four configurations of one.",
      "against": [
        "promax-t2-w880",
        "promax-t2-w680",
        "promax-t4-plus"
      ],
      "rows": [
        "CPU options",
        "Memory",
        "Graphics"
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
