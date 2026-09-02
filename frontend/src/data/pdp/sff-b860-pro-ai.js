/**
 * Latios Pro AI SFF — Intel B860.  Design language: Core Ultra, small footprint.
 * Teal, normal rhythm. This is the four-slot SFF, so memory ceiling and
 * Thunderbolt lead — the things that separate it from the H810 build.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "video",
      "src": "/videos/sff-b860-pro-ai-loop.mp4",
      "poster": "/images/posters/sff-b860-pro-ai-loop.webp",
      "modelName": "Latios Pro AI SFF \u2014 Intel B860",
      "heading": "Core Ultra, small footprint.",
      "subline": "Intel Core Ultra 9 285 with AI Boost NPU. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "statWall",
      "align": "left",
      "heading": "Twice the ceiling of its sibling.",
      "body": "Four DIMM slots instead of two is the whole reason this configuration exists. Large datasets and many virtual machines stop being a reason to buy a tower.",
      "stats": [
        [
          "128GB",
          "Max DDR5",
          "Four U-DIMM slots, twice the H810 build"
        ],
        [
          "40G",
          "Thunderbolt 4",
          "Dock, storage array and dual 4K on one cable"
        ],
        [
          "NPU",
          "Intel AI Boost",
          "Core Ultra 9 285 with a dedicated accelerator"
        ],
        [
          "8 L",
          "Chassis",
          "None of it spent on the ceiling"
        ]
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/sff-b860-pro-ai/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Four slots, in eight litres.",
      "body": "Scroll to open it. The row of four DIMM slots is what you are paying for.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "The same eight-litre chassis as the rest of the SFF range."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "One side removed and the board is in front of you."
        },
        {
          "at": 0.55,
          "label": "Four DIMM slots",
          "text": "A row of four, up to 128GB — the H810 build has two."
        },
        {
          "at": 0.78,
          "label": "Core Ultra",
          "text": "Performance cores, efficiency cores and an AI Boost NPU on one package."
        },
        {
          "at": 0.93,
          "label": "Storage",
          "text": "An M.2 drive under a heatsink, with Thunderbolt 4 handling anything external."
        }
      ]
    },
    {
      "type": "ioMap",
      "image": "/images/dp80-1.webp",
      "heading": "One cable for all of it.",
      "body": "Thunderbolt 4 at 40Gb/s carries a docking station, an external array and dual 4K displays — the port that makes a small machine behave like a large one."
    },
    {
      "type": "band",
      "kicker": "Core Ultra, small footprint",
      "items": [
        {"src": "/bands/sff-b860-pro-ai-0.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 Intel B860 - Core Ultra 9 285 with Intel AI Boost"},
        {"src": "/bands/sff-b860-pro-ai-1.webp", "w": 1200, "h": 1523, "alt": "Latios Pro AI SFF \u2014 Intel B860 - 128GB of DDR5 in a small box"},
        {"src": "/bands/sff-b860-pro-ai-2.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 Intel B860 - Thunderbolt 4 at 40Gb/s"}
      ]
    },
{
      "type": "featureGrid",
      "heading": "Where the eight litres go.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Core Ultra 9 285",
          "desc": "Performance and efficiency cores with an AI Boost NPU."
        },
        {
          "icon": "MemoryStick",
          "title": "128GB across four slots",
          "desc": "Twice the ceiling of the H810 configuration."
        },
        {
          "icon": "Usb",
          "title": "Thunderbolt 4",
          "desc": "40Gb/s for dock, storage and displays on one cable."
        },
        {
          "icon": "Wifi",
          "title": "Dual 2.5G LAN",
          "desc": "Redundancy or a segregated management path."
        },
        {
          "icon": "HardDrive",
          "title": "Gen5 NVMe",
          "desc": "Storage that keeps up with the memory behind it."
        },
        {
          "icon": "ShieldCheck",
          "title": "TPM 2.0",
          "desc": "Enterprise posture at desk-side footprint."
        }
      ]
    },
    {
      "type": "compare",
      "heading": "B860 or H810?",
      "subline": "Same chassis, same processor. Slots and ports are the decision.",
      "rows": [
        "Memory",
        "Network",
        "Chipset"
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
