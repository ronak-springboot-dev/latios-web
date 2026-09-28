/**
 * Latios MT — Intel H610 DDR4.  Rebuilt on the mt-amd-am4 design language:
 * split features with big-number rows, a bento grid, no motion devices.
 *
 * The scroll-driven reveal, the video loop and the marquee are gone. All
 * three carried content the copy already says: the reveal's captions are now
 * the argument of the feature sections, the video's heading repeated the
 * hero's, and the marquee was the specification table read aloud.
 *
 * The argument is arithmetic: DDR4 costs less, so the money buys an i9 and a
 * professional card instead of a faster memory bus. Every number is a row of
 * this model's specGroups in models.js, or Intel's published figure for the
 * Core i9-14900 the CPU row names.
 *
 * What is deliberately NOT here: no board, socket, interior or rear-panel
 * photograph, though MT_GALLERY carries all four. The unit the shoot
 * photographed is the Q670 build -- mt-q670-ddr5.js says so and pins its port
 * map to it on that basis -- and a rear I/O shield is cut for its board, so
 * those frames are evidence about Q670 and not about this one. The ports stay
 * in the specification table until this build is photographed. No benchmark
 * chart either: the spec sheet carries no scores, and a chart is a claim.
 *
 * Chassis images come from /images/mt/, shared across all six MT
 * configurations because the MT is one box -- shoot_deploy.py records that
 * they differ by board, CPU and memory rather than by case. Component plates
 * come from /images/parts/, rendered once and reused by spec match.
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
            "src": "/images/scenes/mt-office-band.webp",
            "w": 2560,
            "h": 1120,
            "alt": "The Latios MT on an office desk beside two displays, with the model's core count, memory ceiling and volume set over it",
            "srcSm": "/images/scenes/mt-office-band-sm.webp",
            "wSm": 1200,
            "hSm": 1500
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Latios MT · H610 DDR4",
        "heading": "Where the money",
        "headingAccent": "actually goes.",
        "body": "DDR4 is the cheaper bus, and on this platform that saving is not lost — it is spent on cores and on the professional card the DDR5 build often goes without. Twelfth through fourteenth generation Intel Core, in an 18-litre chassis your IT team can open by hand.",
        "image": "/images/mt/hero-front.webp",
        "alt": "The Latios MT tower from the front, its ribbed fascia and Latios wordmark lit against a warm horizon glow",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "24",
            "cores",
            "Up to Core i9-14900"
          ],
          [
            "64",
            "GB",
            "DDR4-3200 ceiling"
          ],
          [
            "18",
            "L",
            "Chassis volume"
          ]
        ],
        "statCols": 3
      },
      {
        "type": "stickySplit",
        "kicker": "Inside",
        "heading": "Serviceable,",
        "headingAccent": "not disposable.",
        "body": "Standard parts in standard slots. The money the DDR4 bus saves goes into the processor, and everything inside stays replaceable.",
        "points": [
          "Dual-channel DDR4-3200 · up to 64GB",
          "M.2 · 2.5″ bay · 3.5″ bay",
          "Fan cooler · 80+ Bronze supply"
        ],
        "caption": "Component illustrations. Memory, storage and cooling are shown as representative parts, not as photographs of this machine's interior.",
        "media": [
          {
            "src": "/images/internals/memory.webp",
            "caption": "Dual-channel DDR4-3200 · up to 64GB"
          },
          {
            "src": "/images/internals/storage.webp",
            "caption": "M.2 · 2.5″ bay · 3.5″ bay"
          },
          {
            "src": "/images/internals/cooling.webp",
            "caption": "Fan cooler · 80+ Bronze supply"
          }
        ]
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a desk needs, in eighteen litres.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Compact design",
            "subtitle": "18-litre micro tower",
            "image": "/images/mt/chassis-ddr4.webp",
            "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 10.2,
                "y1": 20,
                "y2": 80,
                "label": "354 mm"
              },
              "d": {
                "x1": 14.7,
                "x2": 85.3,
                "y": 82,
                "label": "166 mm"
              },
              "note": "Depth 312 mm · 7.59 kg"
            }
          },
          {
            "col": 1,
            "size": "short",
            "bleed": true,
            "grow": true,
            "title": "Cooling & power",
            "subtitle": "Fan cooler · 80+ Bronze supply",
            "image": "/images/mt/cooler-card.webp",
            "alt": "A round desktop fan cooler, rendered",
            "stat": [
              "500",
              "W",
              "ATX power"
            ]
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "Dual-channel DDR4-3200 · up to 64GB",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "M.2 · 2.5″ bay · 3.5″ bay",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Wi-Fi 6E · TPM 2.0",
            "subtitle": "Intel I219-V 1G LAN · hardware TPM · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "short",
            "bleed": true,
            "foot": true,
            "grow": true,
            "title": "4K display output",
            "subtitle": "HDMI 2.1 4K@60 · DisplayPort · VGA",
            "image": "/images/mt/desk-card.webp",
            "alt": "A Latios desktop on a desk beside a display showing the Latios wallpaper"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to Intel Core i9-14900",
            "image": "/images/parts/cpu-lga1700.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to NVIDIA RTX A4000",
            "image": "/images/parts/gpu-workstation.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Core i9-14900",
        "body": "Eight performance cores for the thread someone is waiting on, sixteen efficient ones for everything behind it. The same processor line as the DDR5 build, on a memory bus that costs less — which is the whole argument for this configuration.",
        "image": "/images/parts/cpu-lga1700.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "aspect": "aspect-[21/9]",
        "align": "center",
        "stats": [
          [
            "8",
            "Performance cores"
          ],
          [
            "16",
            "Efficient cores"
          ],
          [
            "24",
            "Cores in total"
          ],
          [
            "12–14Gen",
            "On one socket"
          ]
        ],
        "caption": "Figures are Intel's published specification for the Core i9-14900. Lower configurations in this line have fewer cores. The processor shown is an illustration, not the part supplied.",
        "heading": "Twenty-four cores,",
        "headingAccent": "on the cheaper bus."
      },
      {
        "type": "statWall",
        "align": "left",
        "heading": "The cheaper bus, and what it frees.",
        "body": "DDR4 on H610 leaves budget for an i9 and a professional card instead of a faster memory controller.",
        "stats": [
          [
            "24",
            "Cores",
            "Up to Core i9-14900, eight performance and sixteen efficient"
          ],
          [
            "3200",
            "MT/s DDR4",
            "Two U-DIMM slots, dual channel, to 64GB"
          ],
          [
            "A4000",
            "Graphics ready",
            "A full-height slot for a professional card"
          ]
        ]
      },
      {
        "type": "video",
        "src": "/videos/platform-intel.mp4",
        "poster": "/images/posters/platform-intel.webp",
        "heading": "Built on Intel.",
        "subline": "Twelfth to fourteenth generation Core, on the chipset this build is specified around."
      },
      {
        "type": "compare",
        "heading": "Against the rest of the Intel MT range.",
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
        "body": "Every Intel MT configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
