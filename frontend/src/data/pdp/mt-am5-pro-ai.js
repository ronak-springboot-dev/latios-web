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
        "type": "statWall",
        "align": "center",
        "heading": "An NPU on the die, not in the budget.",
        "body": "Ryzen 8000G puts neural processing on the same package as the cores and the graphics.",
        "stats": [
          [
            "8",
            "Cores, 16 threads",
            "Ryzen 7 8700G on socket AM5"
          ],
          [
            "16",
            "TOPS NPU",
            "On the die, for local inference"
          ],
          [
            "5200",
            "MT/s DDR5",
            "Two slots, shared with the integrated graphics"
          ],
          [
            "18",
            "Litres",
            "The same chassis as every other MT"
          ]
        ]
      },
      {
        "type": "video",
        "src": "/videos/mt-am5-pro-ai-loop.mp4",
        "poster": "/images/posters/mt-am5-pro-ai-loop.webp",
        "modelName": "Latios Pro AI MT — AMD AM5",
        "heading": "The AI build.",
        "subline": "Ryzen 8000G with an NPU on the die. Engineered, assembled and finished in Ahmedabad."
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
                "y1": 20,
                "y2": 80,
                "label": "354 mm"
              },
              "d": {
                "x1": 29.9,
                "x2": 70,
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
        "type": "spotlight",
        "kicker": "Ryzen 7 8700G",
        "heading": "Eight cores, and an NPU on the same die.",
        "body": "Zen 4 cores, Radeon 700M graphics and a Ryzen AI NPU in one package on Socket AM5, on the AMD Pro 600 chipset. The inference work that would otherwise need a card runs on silicon the machine already has.",
        "image": "/images/parts/cpu-ryzen-am5.webp",
        "alt": "An AMD Ryzen processor seated in an AM5 socket",
        "aspect": "aspect-[21/9]",
        "align": "center",
        "stats": [
          [
            "8",
            "Zen 4 cores"
          ],
          [
            "700M",
            "Radeon graphics"
          ],
          [
            "AM5",
            "Socket"
          ]
        ],
        "caption": "Figures are AMD's published specification for the Ryzen 7 8700G. The processor shown is an illustration, not the part supplied."
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
        "type": "video",
        "src": "/videos/platform-amd.mp4",
        "poster": "/images/posters/platform-amd.webp",
        "heading": "Built on AMD.",
        "subline": "Ryzen processors with Radeon graphics and an NPU on the die."
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
