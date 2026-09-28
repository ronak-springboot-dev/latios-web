/**
 * Latios Pro SFF — Intel H610.  Rebuilt on the mt-amd-am4 design language:
 * split features with big-number rows, a bento grid, no motion devices.
 *
 * The scroll-driven reveal, the video loop and the marquee are gone. All
 * three carried content the copy already says.
 *
 * No interior, rear-panel or board photograph, though SFF_GALLERY carries
 * several. The unit the shoot opened is the B860 build -- sff-b860-pro-ai.js
 * pins its port map to that silkscreen -- and a rear I/O shield is cut for
 * its board. Those frames are evidence about B860, not about this machine.
 *
 * The chassis card is built from the shoot's own cut-out of this machine
 * (images/fronts/sff.webp) and staged on the same neutral ground as every
 * component plate, by tools/image-processing/stage_chassis.py. Nothing
 * about the chassis is generated: the pixels are the photograph, and only
 * the ground, the shadow and the reflection are drawn.
 *
 * No MT imagery appears here. The MT's desk photograph, fascia close-up
 * and display composite are pictures of an 18-litre tower, and this is an
 * 8-litre slim desktop -- a visibly different machine. Component plates
 * are shared from /images/parts/ because a DIMM is a DIMM.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "band",
        "items": [
          {
            "src": "/images/scenes/sff-desk-band.webp",
            "w": 2560,
            "h": 1120,
            "alt": "The Latios SFF on a home office desk beside a display, with its volume, weight and processor set over it",
            "srcSm": "/images/scenes/sff-desk-band-sm.webp",
            "wSm": 1200,
            "hSm": 1500
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Latios Pro SFF · H610",
        "heading": "Eight litres,",
        "headingAccent": "and nothing missing.",
        "body": "Fourteenth generation Intel Core up to a Core i7-14700, DDR5 memory and a full port complement, in a chassis that lies flat under a monitor or stands on end beside one.",
        "image": "/images/details/sff-angle.webp",
        "alt": "The Latios SFF slim desktop at three-quarters",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "i7",
            "14700",
            "Up to, 14th Gen"
          ],
          [
            "64",
            "GB",
            "DDR5 ceiling"
          ],
          [
            "8",
            "L",
            "Chassis volume"
          ]
        ],
        "statCols": 3
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a desk needs, in eight litres.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Compact design",
            "subtitle": "8-litre slim desktop",
            "image": "/images/sff/chassis-card.webp",
            "alt": "The Latios SFF at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 23.5,
                "y1": 40,
                "y2": 80,
                "label": "330 mm"
              },
              "d": {
                "x1": 28,
                "x2": 71.9,
                "y": 82,
                "label": "296 mm"
              },
              "note": "Depth 95 mm · 4.74 kg"
            }
          },
          {
            "col": 1,
            "size": "short",
            "bleed": true,
            "grow": true,
            "title": "Cooling & power",
            "subtitle": "Fan cooler · TFX supply",
            "image": "/images/details/sff-vent.webp",
            "alt": "The perforated side panel of the Latios SFF",
            "stat": [
              "300",
              "W",
              "TFX, 500W option"
            ]
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "Dual-channel DDR5 · up to 64GB",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "M.2 NVMe · 2.5″ bay",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Wi-Fi 6E · TPM 2.0",
            "subtitle": "1G LAN · hardware TPM · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Display output",
            "subtitle": "HDMI · DisplayPort · VGA"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to Intel Core i7-14700",
            "image": "/images/parts/cpu-lga1700.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Intel UHD · discrete options",
            "image": "/images/parts/gpu-lowprofile.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Core i7-14700",
        "heading": "Fourteenth generation, in eight litres.",
        "body": "The same fourteenth-generation Core line the towers run, in a chassis a third of the volume. An i7 for the seat that needs it and an i3 for the counter, on one board and one service procedure.",
        "image": "/images/parts/cpu-lga1700.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "aspect": "aspect-[21/9]",
        "align": "center",
        "stats": [
          [
            "i7-14700",
            "Top of the line"
          ],
          [
            "14Gen",
            "Intel Core"
          ],
          [
            "8L",
            "Chassis volume"
          ]
        ],
        "caption": "Configurations vary by order. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "video",
        "src": "/videos/sff-h610-ddr5-loop.mp4",
        "poster": "/images/posters/sff-h610-ddr5-loop.webp",
        "modelName": "Latios Pro SFF — Intel H610",
        "heading": "Eight litres, and nothing missing.",
        "subline": "Up to Core i7-14700 in a 95mm chassis. Engineered, assembled and finished in Ahmedabad."
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "Eight litres, and nothing missing.",
        "body": "Fourteenth-generation Core, DDR5 and a discrete slot, in a third of the tower's volume.",
        "stats": [
          [
            "i7",
            "14700",
            "Fourteenth generation, in eight litres"
          ],
          [
            "8",
            "Litres",
            "95 × 296 × 330 mm"
          ],
          [
            "4.74",
            "kg",
            "Flat under a monitor, or upright beside one"
          ]
        ]
      },
      {
        "type": "video",
        "src": "/videos/platform-intel.mp4",
        "poster": "/images/posters/platform-intel.webp",
        "heading": "Built on Intel.",
        "subline": "Twelfth to fourteenth generation Core, in eight litres."
      },
      {
        "type": "band",
        "kicker": "Eight litres",
        "items": [
          {
            "src": "/bands/sff-h610-ddr5-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro SFF — Intel H610 - Eight litres that disappear into the desk"
          },
          {
            "src": "/bands/sff-h610-ddr5-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "Latios Pro SFF — Intel H610 - Core i7-14700 in a small box"
          },
          {
            "src": "/bands/sff-h610-ddr5-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro SFF — Intel H610 - A vent wall, not a vent hole"
          }
        ]
      },
      {
        "type": "compare",
        "heading": "Against the rest of the Intel SFF range.",
        "rows": [
          "CPU options",
          "Chipset",
          "Memory",
          "Graphics"
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "Every Intel SFF configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
