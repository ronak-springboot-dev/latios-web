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
                "y1": 18.0,
                "y2": 80.0,
                "label": "330 mm"
              },
              "d": {
                "x1": 36.7,
                "x2": 63.2,
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
        "type": "featureSplit",
        "pill": "Ryzen 8000G",
        "heading": "Four processors,",
        "headingAccent": "one socket.",
        "body": "Ryzen 7 8700G, Ryzen 5 8600G and 8500G, Ryzen 3 8300G — all on Socket AM5 and the AMD Pro 600 chipset, all with Radeon graphics on the die. A fleet can mix them and stay one image and one panel.",
        "image": "/images/parts/cpu-ryzen-am5.webp",
        "alt": "An AMD Ryzen processor seated in an AM5 socket",
        "stats": [
          [
            "8700G",
            "",
            "Ryzen 7, top of line"
          ],
          [
            "8300G",
            "",
            "Ryzen 3, entry"
          ],
          [
            "AM5",
            "",
            "Socket"
          ]
        ],
        "footnote": "Figures are AMD's published specifications. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5-5200,",
        "headingAccent": "shared with the graphics.",
        "body": "Two U-DIMM slots at 5200 MHz. Radeon graphics on the die draw on system memory rather than their own, so this row does more work on this configuration than it does on a build with a card in the slot.",
        "image": "/images/parts/ddr5-pair.webp",
        "alt": "Two DDR5 desktop memory modules, rendered",
        "flip": true,
        "stats": [
          [
            "5200",
            "MHz",
            "Dual DDR5 channels"
          ],
          [
            "64",
            "GB",
            "Maximum supported",
            "Up to"
          ]
        ],
        "footnote": "Image is an illustration, not the modules supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Graphics",
        "heading": "Radeon on the die,",
        "headingAccent": "and room beside it.",
        "body": "Integrated Radeon graphics cover most desks without a card at all. Where one is wanted, the chassis takes a low-profile Radeon RX — which is why the side of this machine is a vent wall rather than a vent hole.",
        "image": "/images/parts/gpu-lowprofile.webp",
        "alt": "A desktop Radeon graphics card, rendered",
        "stats": [
          [
            "16",
            "GB",
            "Radeon RX card memory",
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
        "pill": "On the counter",
        "heading": "Small enough",
        "headingAccent": "for the front desk.",
        "body": "Eight litres fits where a tower does not — a reception counter, a kiosk, a consulting room — with Ryzen AI on the die for the inference work those desks are starting to do locally.",
        "image": "/images/scenes/sff-reception.webp",
        "alt": "A Latios machine on a working desk, photographed and composited into a studio scene",
        "aspect": "aspect-[16/10]",
        "footnote": "The machine is photographed. The room is a studio composite — furniture, display and peripherals are not supplied.",
        "flip": true
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
        "body": "Every SFF configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
