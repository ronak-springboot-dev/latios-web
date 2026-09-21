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
                "y1": 20.0,
                "y2": 80.0,
                "label": "354 mm"
              },
              "d": {
                "x1": 14.7,
                "x2": 85.3,
                "y": 82.0,
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
        "type": "featureSplit",
        "pill": "Core i9-14900",
        "heading": "Twenty-four cores,",
        "headingAccent": "on the cheaper bus.",
        "body": "Eight performance cores for the thread someone is waiting on, sixteen efficient ones for everything behind it. The same processor line as the DDR5 build, on a memory bus that costs less — which is the whole argument for this configuration.",
        "image": "/images/parts/cpu-lga1700.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "stats": [
          [
            "8",
            "",
            "Performance cores"
          ],
          [
            "16",
            "",
            "Efficient cores"
          ],
          [
            "24",
            "",
            "Cores in total"
          ],
          [
            "12–14",
            "Gen",
            "On one socket"
          ]
        ],
        "footnote": "Figures are Intel's published specification for the Core i9-14900. Lower configurations in this line have fewer cores. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR4-3200,",
        "headingAccent": "and the money it frees.",
        "body": "Two U-DIMM slots at 3200 MHz. Ship a desk at 16GB today and take it to 64GB years later without changing anything else in the box — and spend the difference on the card in the slot rather than the bus underneath it.",
        "image": "/images/parts/ddr4-pair.webp",
        "alt": "Two DDR4 desktop memory modules, rendered",
        "flip": true,
        "stats": [
          [
            "3200",
            "MHz",
            "Dual DDR4 channels"
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
        "heading": "Room for a",
        "headingAccent": "professional card.",
        "body": "Integrated Intel graphics cover the desks that only need displays. Where a seat needs certified drivers — CAD, design review, a control-room wall — the chassis takes a single-slot professional card, and the 500W supply has the headroom for it.",
        "image": "/images/parts/gpu-workstation.webp",
        "alt": "A single-slot blower-style professional graphics card, rendered",
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
            "80+ Bronze ATX supply"
          ]
        ],
        "footnote": "A discrete graphics card is an optional configuration. Image is an illustration, not the card supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Design",
        "heading": "Extruded lines, and the mark",
        "headingAccent": "that earns them.",
        "body": "The fascia is drawn as one extrusion — a field of fine ribs broken by a single band, with the Latios wordmark cut into it. It is the part of the machine a desk actually looks at, and it is photographed rather than rendered.",
        "image": "/images/mt/fascia.webp",
        "alt": "A close photograph of the Latios MT’s ribbed front panel, with the Latios wordmark",
        "aspect": "aspect-[16/10]",
        "flip": true,
        "stats": [
          [
            "18",
            "L",
            "312 × 166 × 354 mm"
          ],
          [
            "7.59",
            "kg",
            "Weight"
          ]
        ]
      },
      {
        "type": "compare",
        "heading": "Against the rest of the MT range.",
        "rows": [
          "CPU options",
          "Chipset",
          "Memory",
          "Graphics"
        ]
      },
      {
        "type": "band",
        "kicker": "Cores where the budget goes",
        "items": [
          {
            "src": "/images/scenes/mt-office-band.webp",
            "w": 2000,
            "h": 1115,
            "alt": "The Latios MT on an office desk beside two displays, with the model's core count, memory ceiling and volume set over it"
          }
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "Every MT configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
