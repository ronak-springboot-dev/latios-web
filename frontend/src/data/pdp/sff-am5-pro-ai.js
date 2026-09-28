/**
 * Latios Pro AI SFF — AMD AM5.  Rebuilt on the mt-amd-am4 design language:
 * split features with big-number rows, a bento grid, no motion devices.
 *
 * The scroll-driven reveal, the video loop and the marquee are gone. All
 * three carried content the copy already says.
 *
 * This page sells a Ryzen, so its gallery is SFF_GALLERY_CHASSIS and its
 * plates are the AMD ones -- an AM5 processor and a Radeon RX, not the
 * NVIDIA card the Intel SFF pages carry.
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
            "src": "/images/scenes/sff-reception-band.webp",
            "w": 2560,
            "h": 1120,
            "alt": "The Latios SFF on a reception counter beside a display, with its core count, memory speed and volume set over it",
            "srcSm": "/images/scenes/sff-reception-band-sm.webp",
            "wSm": 1200,
            "hSm": 1500
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Latios Pro AI SFF · AM5",
        "heading": "Ryzen AI,",
        "headingAccent": "in eight litres.",
        "body": "The Ryzen 7 8700G down to the Ryzen 3 8300G on Socket AM5, with Radeon graphics on the die and DDR5 beside it — in a chassis that fits under a monitor.",
        "image": "/images/details/sff-angle.webp",
        "alt": "The Latios SFF slim desktop at three-quarters",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "8",
            "cores",
            "Up to Ryzen 7 8700G"
          ],
          [
            "64",
            "GB",
            "DDR5-5200 ceiling"
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
        "type": "video",
        "src": "/videos/sff-am5-pro-ai-loop.mp4",
        "poster": "/images/posters/sff-am5-pro-ai-loop.webp",
        "modelName": "Latios Pro AI SFF — AMD AM5",
        "heading": "Ryzen AI, in eight litres.",
        "subline": "Ryzen 8000G with an NPU on the die, in a 95mm chassis. Engineered, assembled and finished in Ahmedabad."
      },
      {
        "type": "statWall",
        "align": "left",
        "heading": "Ryzen AI, in eight litres.",
        "body": "Everything the tower puts on this platform, in a third of the volume.",
        "stats": [
          [
            "8",
            "Cores",
            "Ryzen 8000G on socket AM5"
          ],
          [
            "5200",
            "MT/s DDR5",
            "Shared with the integrated graphics"
          ],
          [
            "8",
            "Litres",
            "95 × 296 × 330 mm, flat or upright"
          ]
        ]
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
            "image": "/images/sff/chassis-am5.webp",
            "alt": "The Latios SFF at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 32.2,
                "y1": 18,
                "y2": 80,
                "label": "330 mm"
              },
              "d": {
                "x1": 36.7,
                "x2": 63.2,
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
            "subtitle": "Dual-channel DDR5-5200 · up to 64GB",
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
            "title": "Wi-Fi 6E AX211 · TPM 2.0",
            "subtitle": "Intel I219-V 1G LAN · hardware TPM · Kensington · padlock"
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
            "subtitle": "Ryzen 7 8700G to Ryzen 3 8300G",
            "image": "/images/parts/cpu-ryzen-am5.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to 16GB AMD Radeon RX",
            "image": "/images/parts/gpu-lowprofile.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "stickySplit",
        "kicker": "Inside",
        "heading": "Eight litres,",
        "headingAccent": "still serviceable.",
        "body": "The small chassis gives up the third bay and nothing else. Memory, the drive and the cooler are all reachable.",
        "points": [
          "Dual-channel DDR5-5200 · up to 64GB",
          "M.2 NVMe · 2.5″ bay",
          "Fan cooler · TFX supply"
        ],
        "caption": "Component illustrations. Memory, storage and cooling are shown as representative parts, not as photographs of this machine's interior.",
        "media": [
          {
            "src": "/images/internals/memory.webp",
            "caption": "Dual-channel DDR5-5200 · up to 64GB"
          },
          {
            "src": "/images/internals/storage.webp",
            "caption": "M.2 NVMe · 2.5″ bay"
          },
          {
            "src": "/images/internals/cooling.webp",
            "caption": "Fan cooler · TFX supply"
          }
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Ryzen 8000G",
        "body": "Ryzen 7 8700G, Ryzen 5 8600G and 8500G, Ryzen 3 8300G — all on Socket AM5 and the AMD Pro 600 chipset, all with Radeon graphics on the die. A fleet can mix them and stay one image and one panel.",
        "image": "/images/parts/cpu-ryzen-am5.webp",
        "alt": "An AMD Ryzen processor seated in an AM5 socket",
        "aspect": "aspect-[21/9]",
        "align": "center",
        "stats": [
          [
            "8700G",
            "Ryzen 7, top of line"
          ],
          [
            "8300G",
            "Ryzen 3, entry"
          ],
          [
            "AM5",
            "Socket"
          ]
        ],
        "caption": "Figures are AMD's published specifications. The processor shown is an illustration, not the part supplied.",
        "heading": "Four processors,",
        "headingAccent": "one socket."
      },
      {
        "type": "video",
        "src": "/videos/platform-amd.mp4",
        "poster": "/images/posters/platform-amd.webp",
        "heading": "Built on AMD.",
        "subline": "Ryzen processors with Radeon graphics and an NPU on the die."
      },
      {
        "type": "band",
        "kicker": "An NPU in eight litres",
        "items": [
          {
            "src": "/bands/sff-am5-pro-ai-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro AI SFF — AMD AM5 - Ryzen 7 8700G, eight litres"
          },
          {
            "src": "/bands/sff-am5-pro-ai-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "Latios Pro AI SFF — AMD AM5 - An NPU where there is no room for a card"
          },
          {
            "src": "/bands/sff-am5-pro-ai-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios Pro AI SFF — AMD AM5 - Perforated the full height"
          }
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "The full sheet for this build. Ryzen AI on AM5 is the only eight-litre Latios on this platform."
      }
    ]
  };
