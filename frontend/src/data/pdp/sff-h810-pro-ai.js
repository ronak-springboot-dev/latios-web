/**
 * Latios Pro AI SFF — Intel H810.  Rebuilt on the mt-amd-am4 design
 * language: split features with big-number rows, a bento grid, no motion.
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
            "src": "/images/scenes/sff-lab-band.webp",
            "w": 2560,
            "h": 1120,
            "alt": "The Latios SFF on a teaching lab bench beside a display, with its network ports, memory ceiling and volume set over it",
            "srcSm": "/images/scenes/sff-lab-band-sm.webp",
            "wSm": 1200,
            "hSm": 1500
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Latios Pro AI SFF · H810",
        "heading": "Core Ultra,",
        "headingAccent": "and two 2.5G ports.",
        "body": "Intel Core Ultra with its on-package NPU, DDR5 memory and two 2.5-gigabit network ports — in the eight-litre chassis, for the desks that need inference and bandwidth rather than slots.",
        "image": "/images/details/sff-angle.webp",
        "alt": "The Latios SFF slim desktop at three-quarters",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "Ultra 9",
            "285",
            "Up to, Intel Core Ultra"
          ],
          [
            "64",
            "GB",
            "DDR5 ceiling"
          ],
          [
            "2.5",
            "GbE",
            "Two ports"
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
            "image": "/images/sff/chassis-h810.webp",
            "alt": "The Latios SFF at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 19.6,
                "y1": 34.0,
                "y2": 80.0,
                "label": "330 mm"
              },
              "d": {
                "x1": 24.1,
                "x2": 75.8,
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
            "subtitle": "Active fan cooler · TFX supply",
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
            "subtitle": "M.2 NVMe SSD",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Wi-Fi 7 BE200 · TPM 2.0",
            "subtitle": "2× Intel I226-V 2.5G LAN · hardware TPM · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Display output",
            "subtitle": "HDMI · DisplayPort"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to Intel Core Ultra 9 285",
            "image": "/images/parts/cpu-core-ultra.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to NVIDIA RTX A4000",
            "image": "/images/parts/gpu-lowprofile.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Core Ultra",
        "heading": "An NPU on the package,",
        "headingAccent": "not in the slot.",
        "body": "Core Ultra 9 285 down to Ultra 5 225, each with an NPU alongside the performance and efficient cores. The inference work that would otherwise need a card runs on silicon the machine already has — which matters more in eight litres than in eighteen.",
        "image": "/images/parts/cpu-core-ultra.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "stats": [
          [
            "Ultra 9",
            "285",
            "Top of the line"
          ],
          [
            "Ultra 5",
            "225",
            "Entry"
          ],
          [
            "NPU",
            "",
            "On package"
          ]
        ],
        "footnote": "Configurations vary by order. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5,",
        "headingAccent": "two slots deep.",
        "body": "Two U-DIMM slots, up to 64GB. The B860 build in the same chassis takes four and reaches 128GB; this one trades that for a lower entry price on the same footprint.",
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
        "pill": "Network",
        "heading": "Two 2.5-gigabit ports,",
        "headingAccent": "not one.",
        "body": "Two Intel I226-V controllers, with Wi-Fi 7 or Wi-Fi 6E beside them. Enough for a machine that is a workstation on one segment and a capture or control node on another, without a card in a chassis that has little room for one.",
        "image": "/images/details/sff-vent.webp",
        "alt": "The perforated side panel of the Latios SFF",
        "aspect": "aspect-[16/10]",
        "stats": [
          [
            "2",
            "× 2.5G",
            "Intel I226-V"
          ],
          [
            "BE200",
            "",
            "Wi-Fi 7 option"
          ]
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Graphics",
        "heading": "Integrated first,",
        "headingAccent": "discrete if needed.",
        "body": "Intel graphics cover the displays most desks ask for. Where a seat needs certified drivers, the chassis takes a low-profile professional card and the TFX supply has a 500W option for it.",
        "image": "/images/parts/gpu-lowprofile.webp",
        "alt": "A single-slot low-profile professional graphics card, rendered",
        "flip": true,
        "stats": [
          [
            "A4000",
            "",
            "NVIDIA RTX class",
            "Up to"
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
        "kicker": "Volume rollout",
        "items": [
          {
            "src": "/bands/sff-h810-pro-ai-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro AI SFF — Intel H810 - Core Ultra 9 285, NPU included"
          },
          {
            "src": "/bands/sff-h810-pro-ai-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "Latios Pro AI SFF — Intel H810 - Two 2.5G ports, not one"
          },
          {
            "src": "/bands/sff-h810-pro-ai-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro AI SFF — Intel H810 - 64GB DDR5"
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
