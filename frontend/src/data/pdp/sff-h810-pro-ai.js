/**
 * Latios Pro AI SFF — Intel H810.  Design language: volume rollout.
 * Muted teal. The leanest of the AI SFFs — the page is short and the reveal
 * comes first, because at rollout scale nobody reads past the first screen.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/sff-h810-pro-ai/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "The one you buy a hundred of.",
      "body": "Scroll to open it. Everything here is chosen for the desk, not the datacentre.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "Eight litres, and identical to the rest of the SFF range from the outside."
        },
        {
          "at": 0.32,
          "label": "Panel off",
          "text": "Hand-removable — which matters when there are a hundred of them."
        },
        {
          "at": 0.58,
          "label": "Core Ultra",
          "text": "The same Core Ultra 9 285 as the B860 build, on the leaner H810 platform."
        },
        {
          "at": 0.8,
          "label": "Memory",
          "text": "Two DDR5 slots up to 64GB, sized for the desk rather than the rack."
        },
        {
          "at": 0.93,
          "label": "Networking",
          "text": "Dual 2.5G LAN, so management traffic need not share the data path."
        }
      ]
    },

    {
      "type": "band",
      "kicker": "Volume rollout",
      "items": [
        {"src": "/bands/sff-h810-pro-ai-0.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 Intel H810 - Core Ultra 9 285, NPU included"},
        {"src": "/bands/sff-h810-pro-ai-1.webp", "w": 1200, "h": 1523, "alt": "Latios Pro AI SFF \u2014 Intel H810 - Two 2.5G ports, not one"},
        {"src": "/bands/sff-h810-pro-ai-2.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 Intel H810 - 64GB DDR5"}
      ]
    },
    {
      "type": "video",
      "src": "/videos/sff-h810-pro-ai-loop.mp4",
      "poster": "/images/posters/sff-h810-pro-ai-loop.webp",
      "modelName": "Latios Pro AI SFF \u2014 Intel H810",
      "heading": "Volume rollout.",
      "subline": "Intel Core Ultra 9 285 with AI Boost NPU. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Sized for the rollout.",
      "stats": [
        [
          "2.5G",
          "Dual LAN",
          "Redundancy or segregation without a slot"
        ],
        [
          "64GB",
          "DDR5",
          "Two slots — the desk-sized ceiling"
        ],
        [
          "NPU",
          "Intel AI Boost",
          "The same Core Ultra silicon as the B860"
        ]
      ]
    },
    {
      "type": "featureGrid",
      "heading": "Lean, not stripped.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Core Ultra 9 285",
          "desc": "With the AI Boost NPU, unchanged from the B860 build."
        },
        {
          "icon": "Wifi",
          "title": "Two 2.5G ports",
          "desc": "Link redundancy, or management on its own subnet."
        },
        {
          "icon": "MemoryStick",
          "title": "64GB DDR5",
          "desc": "Dual channel, sized for a desk."
        },
        {
          "icon": "HardDrive",
          "title": "Gen5 NVMe",
          "desc": "Fast boot and scratch in a small chassis."
        },
        {
          "icon": "Wrench",
          "title": "Fleet-serviceable",
          "desc": "One panel, no tools, a hundred times over."
        },
        {
          "icon": "ShieldCheck",
          "title": "TPM 2.0",
          "desc": "The Windows 11 Pro baseline on every unit."
        }
      ]
    },
    {
      "type": "compare",
      "heading": "H810 against the B860.",
      "rows": [
        "Memory",
        "Network"
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
