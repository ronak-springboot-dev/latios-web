/**
 * Latios MT — Intel H610 DDR5.  Rebuilt on the mt-amd-am4 design language:
 * split features with big-number rows, a bento grid, no motion devices.
 *
 * What went, and why. This page ran a scroll-driven reveal, an autoplaying
 * video loop and a marquee — three animations carrying content that the copy
 * already says. The reveal's five captions are now the argument of the feature
 * sections; the video's heading and subline were a repeat of the hero's; the
 * marquee was the specification table read aloud. Nothing that was true has
 * been dropped, only the movement that was carrying it.
 *
 * Every number is a row of this model's specGroups in models.js, or Intel's
 * published figure for the Core i9-14900 that the CPU row names: 24 cores, 8
 * performance and 16 efficient.
 *
 * What is deliberately NOT here:
 *
 *   - No board, socket, interior or rear-panel photograph, though MT_GALLERY
 *     carries all four. The unit the shoot photographed is the Q670 build —
 *     mt-q670-ddr5.js says so, and pins its port map to it on that basis. A
 *     rear I/O shield is cut for its board, so those frames are evidence about
 *     Q670, not about H610. The ports stay in the specification table until an
 *     H610 build is photographed. Same call mt-h610-ddr4.js records.
 *   - No benchmark chart. The spec sheet has no scores, and a chart is a claim.
 *
 * The chassis images live under /images/mt/ and are shared deliberately: the
 * MT is one box across all six configurations, which shoot_deploy.py already
 * establishes, and they differ by board, CPU and memory rather than by case.
 * The component plates come from /images/parts/, rendered once and reused by
 * spec match. Only cpu-ryzen is still page-specific enough to live in am4/.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "featureSplit",
        "pill": "Latios MT · H610 DDR5",
        "heading": "The same machine,",
        "headingAccent": "on a faster bus.",
        "body": "Twelfth through fourteenth generation Intel Core on the H610 chipset, with DDR5 at 5600 MT/s instead of DDR4 at 3200 — in the same 18-litre chassis, opened by hand, serviced from one side.",
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
            "5600",
            "MT/s",
            "DDR5 dual channel"
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
            "image": "/images/mt/chassis-ddr5.webp",
            "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 14.9,
                "y1": 22,
                "y2": 80,
                "label": "354 mm"
              },
              "d": {
                "x1": 19.4,
                "x2": 80.4,
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
            "subtitle": "Dual-channel DDR5-5600 · up to 64GB",
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
            "subtitle": "Secured firmware and a discrete module · Kensington · padlock"
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
            "alt": "The Latios MT on a desk beside a display showing the Latios wallpaper"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to Intel Core i9-14900",
            "image": "/images/parts/cpu-lga1700.webp",
            "alt": "An Intel processor seated in an LGA socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to NVIDIA RTX A4000",
            "image": "/images/parts/gpu-workstation.webp",
            "alt": "A single-slot professional graphics card, rendered"
          }
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Core i9-14900",
        "body": "Eight performance cores for the thread that the operator is waiting on, sixteen efficient ones for everything running behind it. The line runs down to an i3 for kiosks and counters, on the same socket and the same board.",
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
        "headingAccent": "two kinds of them."
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "The same machine, on a faster bus.",
        "body": "Identical board, chassis and processor line as the DDR4 build. The memory controller is the difference.",
        "stats": [
          [
            "5600",
            "MT/s DDR5",
            "Against 3200 on the DDR4 build — the argument for this one"
          ],
          [
            "24",
            "Cores",
            "Up to Core i9-14900, unchanged"
          ],
          [
            "64",
            "GB",
            "Two U-DIMM slots, dual channel"
          ]
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Memory",
        "body": "Two U-DIMM slots at 5600 MT/s. This is the one row that separates this build from its DDR4 twin, and it is the row that simulation, heavy virtualisation and large spreadsheets actually notice.",
        "image": "/images/parts/ddr5-pair.webp",
        "alt": "Two DDR5 desktop memory modules, rendered",
        "aspect": "aspect-[16/9]",
        "align": "center",
        "stats": [
          [
            "5600MT/s",
            "Dual DDR5 channels"
          ],
          [
            "Up to 64GB",
            "Maximum supported"
          ]
        ],
        "caption": "Image is an illustration, not the modules supplied.",
        "heading": "DDR5-5600,",
        "headingAccent": "and that is the argument."
      },
      {
        "type": "stickySplit",
        "kicker": "Inside",
        "heading": "The faster bus,",
        "headingAccent": "and room beside it.",
        "body": "DDR5-5600 in two U-DIMM slots, with the drive bays and the cooler reachable behind the same hand-removable panel.",
        "points": [
          "Dual-channel DDR5-5600 · up to 64GB",
          "M.2 · 2.5″ bay · 3.5″ bay",
          "Fan cooler · 80+ Bronze supply"
        ],
        "caption": "Component illustrations. Memory, storage and cooling are shown as representative parts, not as photographs of this machine's interior.",
        "media": [
          {
            "src": "/images/internals/memory.webp",
            "caption": "Dual-channel DDR5-5600 · up to 64GB"
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
        "type": "featureSplit",
        "pill": "On the desk",
        "heading": "Eighteen litres,",
        "headingAccent": "beside the screen.",
        "body": "It stands upright in the footprint of a ream of paper, so it shares a desk with the display rather than competing with it — and drives 4K over HDMI 2.1 and DisplayPort without a card in the slot.",
        "image": "/images/mt/desk-photo.webp",
        "alt": "The Latios MT standing on a desk beside a monitor showing the Latios wallpaper",
        "aspect": "aspect-[16/10]",
        "footnote": "Photographed. Display and peripherals are not supplied."
      },
      {
        "type": "video",
        "src": "/videos/platform-intel.mp4",
        "poster": "/images/posters/platform-intel.webp",
        "heading": "Built on Intel.",
        "subline": "Twelfth to fourteenth generation Core, on a memory bus that keeps up with it."
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
