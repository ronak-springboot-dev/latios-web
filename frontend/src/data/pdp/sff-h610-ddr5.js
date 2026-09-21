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
                "y1": 40.0,
                "y2": 80.0,
                "label": "330 mm"
              },
              "d": {
                "x1": 28.0,
                "x2": 71.9,
                "y": 82.0,
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
        "type": "featureSplit",
        "pill": "Core i7-14700",
        "heading": "Fourteenth generation,",
        "headingAccent": "in eight litres.",
        "body": "The same fourteenth-generation Core line the towers run, in a chassis a third of the volume. An i7 for the seat that needs it and an i3 for the counter, on one board and one service procedure.",
        "image": "/images/parts/cpu-lga1700.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "stats": [
          [
            "i7-14700",
            "",
            "Top of the line"
          ],
          [
            "14",
            "Gen",
            "Intel Core"
          ],
          [
            "8",
            "L",
            "Chassis volume"
          ]
        ],
        "footnote": "Configurations vary by order. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5,",
        "headingAccent": "in the small box.",
        "body": "Two U-DIMM slots, up to 64GB. The slim chassis gives up a card slot and a drive bay against the tower; it does not give up the memory architecture.",
        "image": "/images/parts/ddr5-pair.webp",
        "alt": "Two DDR5 desktop memory modules, rendered",
        "flip": true,
        "stats": [
          [
            "64",
            "GB",
            "Maximum supported",
            "Up to"
          ],
          [
            "2",
            "slots",
            "Dual channel U-DIMM"
          ]
        ],
        "footnote": "Image is an illustration, not the modules supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Graphics",
        "heading": "Integrated first,",
        "headingAccent": "discrete if needed.",
        "body": "Intel UHD graphics drive the displays most desks ask for. Where a seat needs more, the chassis takes a low-profile card — which is why the cooler is a blower and the side is a vent wall rather than a vent hole.",
        "image": "/images/parts/gpu-lowprofile.webp",
        "alt": "A single-slot low-profile professional graphics card, rendered",
        "stats": [
          [
            "UHD",
            "",
            "Intel integrated"
          ],
          [
            "500",
            "W",
            "TFX supply option"
          ]
        ],
        "footnote": "A discrete graphics card is an optional configuration. Image is an illustration, not the card supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Design",
        "heading": "Flat under a monitor,",
        "headingAccent": "or upright beside one.",
        "body": "Ninety-five millimetres thick, so it lies under a display on a shallow desk or stands on end in the gap beside it. The same hand-removable panel discipline as the tower, in a third of the volume.",
        "image": "/images/details/sff-top.webp",
        "alt": "The Latios SFF seen from above, showing its perforated top",
        "aspect": "aspect-[16/10]",
        "flip": true,
        "stats": [
          [
            "8",
            "L",
            "95 × 296 × 330 mm"
          ],
          [
            "4.74",
            "kg",
            "Weight"
          ]
        ]
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
        "heading": "Against the rest of the SFF range.",
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
        "body": "Every SFF configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
