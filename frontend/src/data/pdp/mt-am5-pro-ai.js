/**
 * Latios Pro AI MT — AMD AM5.  Design language: Ryzen AI, on the die.
 * Violet, stat-wall heavy, NPU-forward. The reveal leads on the accelerator
 * rather than on the chassis, because the socket is the story here.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "The accelerator is already inside.",
      "stats": [
        [
          "NPU",
          "Ryzen AI onboard",
          "Local inference without spending the graphics slot"
        ],
        [
          "8700G",
          "Ryzen 7",
          "With Radeon graphics on the same die"
        ],
        [
          "AM5",
          "Current socket",
          "An upgrade path ahead of it, not the end of a line"
        ]
      ]
    },
    {
      "type": "reveal",
      "manifest": {
        "frames": 40,
        "width": 1400,
        "height": 1400,
        "pattern": "/reveal/mt-am5-pro-ai/{i}.webp"
      },
      "height": 260,
      "kicker": "Inside",
      "heading": "No card. No slot spent.",
      "body": "Scroll to open it. The reason this build has an empty graphics slot is that it does not need one.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "The familiar 18-litre chassis. The change is entirely on the board."
        },
        {
          "at": 0.28,
          "label": "Panel off",
          "text": "One hand-removable panel, as with every MT."
        },
        {
          "at": 0.52,
          "label": "Socket AM5",
          "text": "Current-generation AMD, with an upgrade path ahead of it rather than the end of the AM4 line."
        },
        {
          "at": 0.74,
          "label": "Ryzen AI",
          "text": "A dedicated NPU alongside the CPU and Radeon graphics — inference runs on-die instead of over the network."
        },
        {
          "at": 0.92,
          "label": "DDR5 only",
          "text": "Two DDR5-5200 slots. AM5 has no legacy memory path by design."
        }
      ]
    },
    {
      "type": "featureGrid",
      "heading": "What the NPU changes.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Ryzen 7 8700G",
          "desc": "Eight cores with Radeon graphics and Ryzen AI on one package."
        },
        {
          "icon": "ShieldCheck",
          "title": "On-device inference",
          "desc": "Noise suppression and Copilot-class features without a round trip."
        },
        {
          "icon": "MemoryStick",
          "title": "DDR5-5200",
          "desc": "Two slots, up to 64GB — the bandwidth the NPU and iGPU need."
        },
        {
          "icon": "MonitorCheck",
          "title": "Radeon onboard",
          "desc": "The graphics slot stays free for whatever comes later."
        },
        {
          "icon": "Wifi",
          "title": "Wi-Fi 6E",
          "desc": "With dTPM 2.0 on the AMD Pro 600 chipset."
        },
        {
          "icon": "Wrench",
          "title": "Same service story",
          "desc": "Whatever board is inside, the box opens the same way."
        }
      ]
    },
    {
      "type": "marquee",
      "items": [
        "Ryzen 7 8700G",
        "Ryzen AI NPU",
        "Radeon 700M",
        "DDR5-5200",
        "AMD Pro 600",
        "Wi-Fi 6E",
        "dTPM 2.0",
        "18 litres"
      ]
    },
    {
      "type": "compare",
      "heading": "AM5, or the Intel boards?",
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
