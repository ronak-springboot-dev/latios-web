/**
 * Latios Pro MFF — DP10 A14MG.  Design language: 1.1 litres.
 * Monochrome, tight, minimal — the page is deliberately the shortest in the
 * range, because the product's entire argument is that there is less of it.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "A desktop, minus the desk.",
        "stats": [
          [
            "1.1 L",
            "Chassis volume",
            "VESA-mounts behind the monitor it drives"
          ],
          [
            "3",
            "Displays",
            "HDMI, DisplayPort and a configurable third"
          ],
          [
            "64GB",
            "DDR5 SO-DIMM",
            "Laptop-format modules, desktop capacity"
          ]
        ]
      },
      {
        "type": "reveal",
        "manifest": {
          "frames": 64,
          "width": 1400,
          "height": 1120,
          "pattern": "/reveal/mff-dp10/{i}.webp"
        },
        "height": 260,
        "kicker": "Inside",
        "heading": "All of it, in 1.1 litres.",
        "body": "Scroll to open it. There is no trick — the parts are simply smaller.",
        "steps": [
          {
            "at": 0,
            "label": "Closed",
            "text": "1.1 litres. It mounts behind the screen and the desk is yours again."
          },
          {
            "at": 0.32,
            "label": "Opened",
            "text": "The base lifts away and the whole board is exposed at once."
          },
          {
            "at": 0.58,
            "label": "SO-DIMM",
            "text": "Two laptop-format memory slots up to 64GB — accessible, not soldered down."
          },
          {
            "at": 0.8,
            "label": "Storage",
            "text": "A single M.2 drive, with the blower fan and heatsink alongside it."
          },
          {
            "at": 0.93,
            "label": "Power",
            "text": "External supply, which is most of how the 1.1 litres was found."
          }
        ]
      },
      {
        "type": "band",
        "kicker": "1.1 litres",
        "items": [
          {
            "src": "/bands/mff-dp10-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro MFF — DP10 A14MG - A full Windows 11 Pro PC in 1.1 litres"
          },
          {
            "src": "/bands/mff-dp10-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "Latios Pro MFF — DP10 A14MG - Three monitors from a 1.1-litre box"
          },
          {
            "src": "/bands/mff-dp10-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro MFF — DP10 A14MG - Core i7-14700 class performance"
          }
        ]
      },
      {
        "type": "featureGrid",
        "heading": "Nothing given up but the volume.",
        "items": [
          {
            "icon": "Cpu",
            "title": "Up to Core i7-14700",
            "desc": "Fourteenth-generation Intel in a mini chassis."
          },
          {
            "icon": "MonitorCheck",
            "title": "Triple display",
            "desc": "HDMI, DisplayPort and a configurable third output."
          },
          {
            "icon": "MemoryStick",
            "title": "64GB SO-DIMM",
            "desc": "Two slots that stay user-accessible."
          },
          {
            "icon": "Usb",
            "title": "Nine USB ports",
            "desc": "Eight Type-A and one Type-C."
          },
          {
            "icon": "Wifi",
            "title": "Dual 2.5G LAN",
            "desc": "Two wired paths from something this size."
          },
          {
            "icon": "Wrench",
            "title": "VESA-mountable",
            "desc": "Behind the monitor, out of the way."
          }
        ]
      },
      {
        "type": "specTeaser"
      }
    ]
  };
