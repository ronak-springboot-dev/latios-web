/**
 * Latios Pro MT — Intel H610 DDR5.  Design language: the Pro build.
 * Steel, restrained, airy. Fewer sections and more whitespace than its
 * siblings — this one is sold on temperament rather than on peak numbers.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "banner",
      "image": "/images/components/board-neutral.webp",
      "kicker": "The Pro build",
      "headline": "Tuned for the ninth hour, not the first minute.",
      "subline": "Twenty cores of Core i7-14700 with a cooling profile set for sustained boost rather than short bursts."
    },
    {
      "type": "reveal",
      "manifest": { "frames": 40, "width": 1400, "height": 1400, "pattern": "/reveal/mt-pro-h610-ddr5/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Built to hold its clocks.",
      "body": "Scroll to open it. What separates the Pro build is thermal, and thermal is a matter of what is in the box.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "18 litres, 7.59 kg. Quiet enough for an open office at full load."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "One panel, by hand. The same service story as the rest of the range."
        },
        {
          "at": 0.55,
          "label": "Cooling",
          "text": "A tower cooler with copper heatpipes over the socket, and a clear front-to-back air path."
        },
        {
          "at": 0.78,
          "label": "Memory",
          "text": "Two DDR5 U-DIMM slots up to 64GB, keeping twenty cores fed across applications."
        },
        {
          "at": 0.93,
          "label": "Graphics",
          "text": "A full-height slot for an RTX A4000-class card with certified drivers."
        }
      ]
    },
    {
      "type": "stickySplit",
      "kicker": "Sustained load",
      "heading": "Peak numbers are the easy part.",
      "body": "Any machine can hit its boost clock once. The Pro build is specified around what happens on the ninth hour of a render queue.",
      "points": [
        "Core i7-14700, twenty cores",
        "Cooling profile set for sustained boost",
        "Certified professional graphics drivers",
        "dTPM 2.0 with hardware TPM support"
      ],
      "media": [
        {
          "src": "/images/components/cpu-intel.webp",
          "caption": "Fourteenth-generation Intel silicon in socket."
        },
        {
          "src": "/images/ddr5.webp",
          "caption": "Dual-channel DDR5 across two U-DIMM slots."
        },
        {
          "src": "/images/details/mt-panel.webp",
          "caption": "The panel that comes off by hand."
        }
      ]
    },
    {
      "type": "statWall",
      "align": "left",
      "heading": "What it holds, not what it peaks at.",
      "stats": [
        [
          "20",
          "Cores, Core i7-14700",
          "Also i5-14500 and i3-14100 on the same board"
        ],
        [
          "64GB",
          "DDR5",
          "Two U-DIMM slots"
        ],
        [
          "18 L",
          "Chassis",
          "312 × 166 × 354 mm, 7.59 kg"
        ]
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
