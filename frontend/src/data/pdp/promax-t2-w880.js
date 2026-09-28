/**
 * PROMAX T2 AI — Intel W880.  Design language: unlocked, error-corrected.
 * Hot orange-red. Two claims that sound contradictory — an unlocked K-series
 * part and ECC memory — so the page is built to reconcile them.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "statWall",
        "align": "left",
        "heading": "Unlocked and error-corrected, at once.",
        "body": "A K-series part usually means a consumer platform and no ECC. W880 is why this machine does not make you choose.",
        "stats": [
          [
            "285K",
            "Unlocked",
            "Core Ultra 9, with the thermal budget to use it"
          ],
          [
            "256GB",
            "ECC DDR5",
            "Four slots at 5600, ECC or non-ECC"
          ],
          [
            "40G",
            "USB-C",
            "Full bandwidth to external storage"
          ],
          [
            "2.5G",
            "Dual LAN",
            "Management separated from data"
          ]
        ]
      },
      {
        "type": "reveal",
        "manifest": {
          "frames": 64,
          "width": 1400,
          "height": 1400,
          "pattern": "/reveal/promax-t2-w880/{i}.webp"
        },
        "height": 260,
        "kicker": "Inside",
        "heading": "The platform that allows both.",
        "body": "Scroll to open it. Unlocked multipliers and error-correcting memory on the same board is a chipset decision.",
        "steps": [
          {
            "at": 0,
            "label": "Closed",
            "text": "A workstation tower built around sustained, unlocked load."
          },
          {
            "at": 0.3,
            "label": "Panel off",
            "text": "Hand-removable, so a memory upgrade stays a maintenance task."
          },
          {
            "at": 0.54,
            "label": "Four ECC slots",
            "text": "Up to 256GB of DDR5-5600, error-correcting or not, on the W880 chipset."
          },
          {
            "at": 0.76,
            "label": "Cooling",
            "text": "A tall twin-fan tower cooler, because an unlocked 285K generates the heat it promises."
          },
          {
            "at": 0.92,
            "label": "Graphics",
            "text": "Full-length clearance and the power delivery a professional card expects."
          }
        ]
      },
      {
        "type": "stickySplit",
        "kicker": "Why it matters",
        "heading": "A bit flip does not announce itself.",
        "body": "Overclocked headroom is worth nothing if the answer is quietly wrong. ECC is what makes the extra clocks safe to use.",
        "points": [
          "Core Ultra 9 285K, unlocked",
          "256GB ECC DDR5-5600",
          "Dual 2.5G LAN",
          "40G USB-C to external storage"
        ],
        "media": [
          {
            "src": "/images/ddr5.webp",
            "caption": "Error-correcting DDR5 across four slots."
          },
          {
            "src": "/images/components/cpu-intel.webp",
            "caption": "Core Ultra silicon in socket."
          },
          {
            "src": "/images/components/gpu-pro-2.webp",
            "caption": "Clearance sized around the card."
          }
        ]
      },
      {
        "type": "band",
        "kicker": "Unlocked, error-corrected",
        "items": [
          {
            "src": "/bands/promax-t2-w880-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "PROMAX T2 AI — Intel W880 - Core Ultra 9 285K, unlocked"
          },
          {
            "src": "/bands/promax-t2-w880-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "PROMAX T2 AI — Intel W880 - 256GB of ECC DDR5"
          },
          {
            "src": "/bands/promax-t2-w880-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "PROMAX T2 AI — Intel W880 - Professional cards, certified"
          }
        ]
      },
      {
        "type": "compare",
        "heading": "Against the rest of the range.",
        "against": [
          "promax-q870",
          "promax-t2-w680",
          "promax-t4-plus"
        ],
        "rows": [
          "CPU options",
          "Memory"
        ]
      },
      {
        "type": "featureGrid",
        "heading": "Workstation, not a large desktop.",
        "items": [
          {
            "icon": "Cpu",
            "title": "Core Ultra 9 285K",
            "desc": "Unlocked, on the W880 workstation chipset."
          },
          {
            "icon": "MemoryStick",
            "title": "256GB ECC DDR5",
            "desc": "Four slots at 5600, ECC or non-ECC."
          },
          {
            "icon": "MonitorCheck",
            "title": "Professional graphics",
            "desc": "Full-length clearance and certified drivers."
          },
          {
            "icon": "Usb",
            "title": "40G USB-C",
            "desc": "External arrays at full bandwidth."
          },
          {
            "icon": "Wifi",
            "title": "Dual 2.5G LAN",
            "desc": "Two paths, separately addressable."
          },
          {
            "icon": "Wrench",
            "title": "Still opens by hand",
            "desc": "A 256GB upgrade in year three is maintenance."
          }
        ]
      },
      {
        "type": "specTeaser"
      }
    ]
  };
