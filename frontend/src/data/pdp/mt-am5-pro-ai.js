/**
 * Latios Pro AI MT — AMD AM5.  Rebuilt on the mt-amd-am4 design language:
 * split features with big-number rows, a bento grid, no motion devices.
 *
 * The scroll-driven reveal, the video loop and the marquee are gone. All
 * three carried content the copy already says.
 *
 * This page sells a Ryzen, so its gallery is MT_GALLERY_CHASSIS and its
 * component plates are the AMD ones: an AM5 processor and a dual-fan
 * Radeon RX rather than the single-slot NVIDIA card the Intel pages carry.
 * Showing an LGA socket or a professional NVIDIA card here would be the
 * same error in two different places.
 *
 * Chassis images come from /images/mt/, shared across the MT range because
 * the MT is one box; component plates come from /images/parts/, rendered
 * once and reused by spec match.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "featureSplit",
        "pill": "Latios Pro AI MT · AM5",
        "heading": "An NPU on the die,",
        "headingAccent": "not in the budget.",
        "body": "The Ryzen 7 8700G puts a Ryzen AI NPU, eight Zen 4 cores and Radeon 700M graphics on one piece of silicon. Local inference without a card in the slot, in the same 18-litre chassis the rest of the range uses.",
        "image": "/images/mt/hero-front.webp",
        "alt": "The Latios MT tower from the front, its ribbed fascia and Latios wordmark lit against a warm horizon glow",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "8",
            "cores",
            "Ryzen 7 8700G"
          ],
          [
            "64",
            "GB",
            "DDR5-5200 ceiling"
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
            "image": "/images/mt/chassis-am5.webp",
            "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 25.4,
                "y1": 20.0,
                "y2": 80.0,
                "label": "354 mm"
              },
              "d": {
                "x1": 29.9,
                "x2": 70.0,
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
            "subtitle": "Dual-channel DDR5-5200 · up to 64GB",
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
            "title": "Wi-Fi 6E AX211 · dTPM 2.0",
            "subtitle": "Intel I219-V 1G LAN · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "short",
            "bleed": true,
            "foot": true,
            "grow": true,
            "title": "4K display output",
            "subtitle": "HDMI 4K@60 · DisplayPort · VGA (opt)",
            "image": "/images/mt/desk-card.webp",
            "alt": "A Latios desktop on a desk beside a display showing the Latios wallpaper"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "AMD Ryzen 7 8700G with Ryzen AI",
            "image": "/images/parts/cpu-ryzen-am5.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Radeon 700M · up to 16GB Radeon RX",
            "image": "/images/parts/gpu-radeon.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Ryzen 7 8700G",
        "heading": "Eight cores, and an NPU",
        "headingAccent": "on the same die.",
        "body": "Zen 4 cores, Radeon 700M graphics and a Ryzen AI NPU in one package on Socket AM5, on the AMD Pro 600 chipset. The inference work that would otherwise need a card runs on silicon the machine already has.",
        "image": "/images/parts/cpu-ryzen-am5.webp",
        "alt": "An AMD Ryzen processor seated in an AM5 socket",
        "stats": [
          [
            "8",
            "",
            "Zen 4 cores"
          ],
          [
            "700M",
            "",
            "Radeon graphics"
          ],
          [
            "AM5",
            "",
            "Socket"
          ]
        ],
        "footnote": "Figures are AMD's published specification for the Ryzen 7 8700G. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5-5200,",
        "headingAccent": "feeding the NPU too.",
        "body": "Two U-DIMM slots at 5200 MHz. Integrated graphics and an on-die NPU both draw on system memory rather than their own, so the memory row on this configuration is doing more work than it does elsewhere in the range.",
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
        "headingAccent": "and room for more.",
        "body": "Radeon 700M graphics are built into the processor, so most desks never need a discrete card at all. When one does — design review, a control-room wall, light rendering — the chassis takes a Radeon RX card and the 500W supply has the headroom.",
        "image": "/images/parts/gpu-radeon.webp",
        "alt": "A full-height desktop graphics card with two fans, rendered",
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
            "80+ Bronze ATX supply"
          ]
        ],
        "footnote": "A discrete graphics card is an optional configuration. Image is an illustration, not the card supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Storage",
        "heading": "A fast drive and a big one,",
        "headingAccent": "in the same box.",
        "body": "An M.2 SSD for the operating system and working files, with a 2.5-inch and a 3.5-inch bay beside it for bulk storage — all reachable from the one hand-removable side panel.",
        "image": "/images/parts/storage-set.webp",
        "alt": "A 2.5-inch drive and a 3.5-inch drive shown at their true relative sizes, rendered",
        "flip": true,
        "footnote": "Image is an illustration. Drive types and capacities vary with the configuration ordered."
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
        "type": "featureSplit",
        "pill": "On the desk",
        "heading": "Eighteen litres,",
        "headingAccent": "beside the screen.",
        "body": "It stands upright in the footprint of a ream of paper, so it shares a desk with the display rather than competing with it — and drives two 4K screens from the processor's own graphics.",
        "image": "/images/mt/desk-photo.webp",
        "alt": "The Latios MT standing on a desk beside a monitor showing the Latios wallpaper",
        "aspect": "aspect-[16/10]",
        "flip": true,
        "footnote": "Photographed. Display and peripherals are not supplied."
      },
      {
        "type": "compare",
        "heading": "Against the other AMD MT build.",
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
        "body": "Every AMD MT configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
