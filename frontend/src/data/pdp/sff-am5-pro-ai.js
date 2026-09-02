/**
 * Latios Pro AI SFF — AMD AM5.  Design language: an NPU in eight litres.
 * Violet, airy. The pairing of the AI story with the small-volume story, so the
 * marquee leads and the reveal explains why there is no card in there.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "marquee",
      "items": [
        "Ryzen 7 8700G",
        "Ryzen AI NPU",
        "8 litres",
        "DDR5-5200",
        "Card reader",
        "Built-in speaker",
        "AMD Pro 600"
      ]
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/sff-am5-pro-ai/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "The accelerator that needed no slot.",
      "body": "Scroll to open it. The small-form-factor argument against local AI used to be the missing graphics slot.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "Eight litres — small enough to VESA-mount behind the display it drives."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "One side away and the entire board is accessible."
        },
        {
          "at": 0.55,
          "label": "Ryzen AI",
          "text": "The NPU sits on the processor package, so inference does not cost the expansion slot."
        },
        {
          "at": 0.78,
          "label": "Memory",
          "text": "Two DDR5-5200 slots. AM5 is DDR5-only by design."
        },
        {
          "at": 0.93,
          "label": "Everyday",
          "text": "A card reader and a built-in speaker up front, because this one lives on the desk."
        }
      ]
    },

    {
      "type": "band",
      "kicker": "An NPU in eight litres",
      "items": [
        {"src": "/bands/sff-am5-pro-ai-0.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 AMD AM5 - Ryzen 7 8700G, eight litres"},
        {"src": "/bands/sff-am5-pro-ai-1.webp", "w": 1200, "h": 1523, "alt": "Latios Pro AI SFF \u2014 AMD AM5 - An NPU where there is no room for a card"},
        {"src": "/bands/sff-am5-pro-ai-2.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF \u2014 AMD AM5 - Perforated the full height"}
      ]
    },
    {
      "type": "video",
      "src": "/videos/sff-am5-pro-ai-loop.mp4",
      "poster": "/images/posters/sff-am5-pro-ai-loop.webp",
      "modelName": "Latios Pro AI SFF \u2014 AMD AM5",
      "heading": "An NPU in eight litres.",
      "subline": "AMD Ryzen 7 8700G / 5 8600G / 5 8500G / 3 8300G. Engineered, assembled and finished in Ahmedabad.",
    },
    {
      "type": "statWall",
      "align": "left",
      "heading": "Two arguments, one box.",
      "stats": [
        [
          "NPU",
          "Ryzen AI",
          "On the package, not in a slot"
        ],
        [
          "8 L",
          "Chassis",
          "VESA-mountable behind the monitor"
        ],
        [
          "8700G",
          "Ryzen 7",
          "Down to a Ryzen 3 8300G on the same board"
        ]
      ]
    },
    {
      "type": "featureGrid",
      "heading": "Small, and still complete.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Ryzen 7 8700G",
          "desc": "Also 5 8600G, 5 8500G and 3 8300G on the AMD Pro 600 chipset."
        },
        {
          "icon": "ShieldCheck",
          "title": "Ryzen AI onboard",
          "desc": "Local inference with the graphics slot left free."
        },
        {
          "icon": "MemoryStick",
          "title": "DDR5-5200",
          "desc": "Two slots, up to 64GB."
        },
        {
          "icon": "Usb",
          "title": "Card reader + speaker",
          "desc": "SD and microSD up front, with audio for calls."
        },
        {
          "icon": "Wrench",
          "title": "Any orientation",
          "desc": "Stand it, lay it, or hide it behind the screen."
        },
        {
          "icon": "MonitorCheck",
          "title": "Radeon graphics",
          "desc": "On the die, driving the desk without a card."
        }
      ]
    },
    {
      "type": "specTeaser"
    }
  ],
};
