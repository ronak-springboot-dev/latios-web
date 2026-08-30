/**
 * Latios Archer LTG540Z.  Design language: 300Hz of overkill.
 * Gets a video loop as well as a walkthrough — it is the one non-tower product
 * with real high-resolution photography of its own.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "marquee",
      "items": [
        "Core Ultra 9 200HX",
        "RTX 5050 → 5080",
        "16″ 2.5K Mini LED",
        "300Hz",
        "500 nits",
        "270W OverBoost Ultra"
      ]
    },
    {
      "type": "walkthrough",
      "image": "/images/details/archer-open.webp",
      "kicker": "Walkthrough",
      "heading": "Where the 270 watts go.",
      "body": "Scroll through the parts that justify the power budget.",
      "height": 240,
      "points": [
        {
          "at": 0.0,
          "x": 0.5,
          "y": 0.26,
          "label": "2.5K Mini LED",
          "text": "A 16-inch panel at 300Hz and 500 nits — Mini LED, not an IPS panel with a marketing name."
        },
        {
          "at": 0.3,
          "x": 0.32,
          "y": 0.6,
          "label": "Core Ultra 9 200HX",
          "text": "The HX-series part, with the thermal headroom to hold its clocks."
        },
        {
          "at": 0.58,
          "x": 0.66,
          "y": 0.58,
          "label": "Up to RTX 5080",
          "text": "From RTX 5050 to 5080 on the same chassis."
        },
        {
          "at": 0.82,
          "x": 0.5,
          "y": 0.76,
          "label": "270W OverBoost",
          "text": "Combined CPU and GPU budget — the number the cooling was designed around."
        }
      ]
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "The numbers it was built around.",
      "stats": [
        [
          "300Hz",
          "2.5K Mini LED",
          "16 inches, 500 nits"
        ],
        [
          "270W",
          "OverBoost Ultra",
          "Combined CPU and GPU"
        ],
        [
          "5080",
          "Max RTX graphics",
          "From 5050 upward"
        ]
      ]
    },
    {
      "type": "video",
      "src": "/videos/archer-loop.mp4",
      "poster": "/images/posters/archer-loop.webp"
    },
    {
      "type": "featureGrid",
      "heading": "Overkill, itemised.",
      "items": [
        {
          "icon": "MonitorCheck",
          "title": "16″ 2.5K Mini LED",
          "desc": "300Hz, 500 nits."
        },
        {
          "icon": "Cpu",
          "title": "Core Ultra 9 200HX",
          "desc": "The HX-series mobile part."
        },
        {
          "icon": "Wrench",
          "title": "270W OverBoost Ultra",
          "desc": "Combined budget, sustained."
        },
        {
          "icon": "MemoryStick",
          "title": "DDR5 memory",
          "desc": "Dual channel, upgradeable."
        },
        {
          "icon": "HardDrive",
          "title": "Dual SSD",
          "desc": "Two M.2 slots."
        },
        {
          "icon": "Usb",
          "title": "Full port array",
          "desc": "Display, data and power without a dock."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
