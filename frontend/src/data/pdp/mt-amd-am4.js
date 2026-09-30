/**
 * Latios MT — AMD AM4.  Built on the Minisforum 790S7 page: split features with
 * big-number rows, a bento grid of feature cards. Amber, this product's own
 * accent.
 *
 * The chassis, the fascia and the desk are photographs of the real machine. The
 * four component plates -- graphics, memory, storage, cooling -- are renders,
 * captioned as illustrations, and they are finally good ones.
 *
 * What was wrong with them for a long time was one phrase. Every component
 * prompt appended a style string that said "low-key lighting", inherited from
 * this page's dark ground, and low-key means murky: the parts came back soft and
 * dim and read as AI renders beside a photograph, however they were staged,
 * angled or cut. Bright, even, high-key lighting fixed all four at once. See
 * gen_am4.py, which now also records the three prompt habits that each cost a
 * render: similes get drawn, numerals get silkscreened, and naming the lighting
 * equipment puts the softbox in the frame.
 *
 * The storage plate shows two drives rather than three. Four renders of an M.2
 * alternated between correct proportions with the contacts down a long edge and
 * correct contacts on a square board -- the model treats a long thin green board
 * with an edge connector as a DIMM, and that is the one thing an M.2 must not
 * look like directly under a section showing real DIMMs. It stays in the spec
 * row, the footnote and the bento glyph until someone photographs one.
 *
 * The two drives that are shown read as plain sealed enclosures because every
 * attempt to give them a connector edge produced something else -- hinge tabs
 * on the 2.5", a latch clasp on the 3.5". gen_am4.py records the wording and
 * the result. Blank is the deliberate choice, not the default one.
 *
 * Every number on this page is either a row of this model's specGroups
 * (models.js) or AMD's published figure for the Ryzen 7 5700G the spec names:
 * 8 cores, 16 threads, 3.8 GHz base, up to 4.6 GHz boost, 16 MB L3.
 *
 * What is deliberately NOT here, and why:
 *
 *   - No benchmark chart. The reference has one; the spec sheet has no scores,
 *     and a chart is a claim.
 *   - No scroll reveal and no interior photographs. The MT shoot is of the Intel
 *     Q670 unit -- an LGA socket, its own rear panel -- so every interior here is
 *     a rendered component, captioned as an illustration. For the same reason
 *     this model has its own gallery (MT_GALLERY_CHASSIS): the shared MT one
 *     carries four frames of that board, and showing an LGA socket to someone
 *     shopping for a Ryzen is the same error in a smaller place.
 *   - No port diagram. The photographed rear panel is the Intel board's, and the
 *     photographed front panel disagrees with this model's Front I/O row. The
 *     ports are listed in the specification table until that is confirmed.
 *   - No board-callout diagram and no "smaller than a tower" comparison, both of
 *     which the reference has: one would invent a layout, the other a figure.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "featureSplit",
        "pill": "Latios MT · AM4",
        "heading": "The everyday",
        "headingAccent": "workhorse.",
        "body": "AMD Ryzen 5000G processing with Radeon graphics on the die, dual-channel DDR4 and a full array of I/O, in an 18-litre chassis your IT team can open by hand.",
        "image": "/images/mt/hero-front.webp",
        "alt": "The Latios MT tower from the front, its ribbed fascia and Latios wordmark lit against a warm horizon glow",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "8",
            "cores",
            "Up to Ryzen 7 5700G"
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
        "type": "statWall",
        "align": "center",
        "heading": "What eighteen litres buys.",
        "body": "The AM4 build spends its budget on cores and a graphics slot rather than on a faster memory controller.",
        "stats": [
          [
            "8",
            "Cores, 16 threads",
            "Ryzen 7 5700G, with Radeon graphics on the same die"
          ],
          [
            "64",
            "GB DDR4-3200",
            "Two U-DIMM slots, dual channel"
          ],
          [
            "18",
            "Litres",
            "312 × 166 × 354 mm, upright beside a display"
          ],
          [
            "RX",
            "Radeon ready",
            "Full-height slot for up to 16GB AMD Radeon RX"
          ]
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
            "image": "/images/mt/chassis-card.webp",
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
            "subtitle": "Up to Intel AX211 with Bluetooth 5.3 · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "short",
            "bleed": true,
            "foot": true,
            "grow": true,
            "title": "4K display output",
            "subtitle": "HDMI 4K@60 · DisplayPort 1.4 · VGA (opt)",
            "image": "/images/mt/desk-card.webp",
            "alt": "The Latios MT on a desk beside a display showing the Latios wallpaper"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to AMD Ryzen 7 5700G",
            "image": "/images/am4/cpu-ryzen.webp",
            "alt": "An AMD Ryzen processor seated in an AM4 socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to 16GB AMD Radeon RX",
            "image": "/images/parts/gpu-radeon.webp",
            "alt": "A full-height desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "capabilityTabs",
        "heading": "Core capability upgrades.",
        "body": "Three decisions define this build. Switch between them to see what each one buys — the cores, the memory, and the panel that comes off by hand.",
        "tabs": [
          {
            "label": "Processor",
            "image": "/bands/mt-amd-am4-0.webp",
            "spec": "Up to Ryzen 7 5700G · 8C/16T",
            "title": "Eight cores, graphics on the die.",
            "text": "The Ryzen 7 5700G tops a Socket AM4 line-up that runs down to the Ryzen 3 5305G — with Radeon graphics built in, so most desks never need a discrete card."
          },
          {
            "label": "Memory",
            "image": "/bands/mt-amd-am4-1.webp",
            "spec": "Dual-channel DDR4-3200",
            "title": "64GB across two slots.",
            "text": "Two U-DIMM slots ship at 16GB and finish at 64GB of dual-channel DDR4-3200 — enough headroom to keep heavy multitasking instant for years."
          },
          {
            "label": "Serviceability",
            "image": "/bands/mt-amd-am4-2.webp",
            "spec": "Tool-free side panel",
            "title": "Opens by hand, in seconds.",
            "text": "One hand-removable panel, standard parts inside and spares that ship for a decade. Built to be worked on rather than replaced."
          }
        ]
      },
      {
        "type": "stickySplit",
        "kicker": "Inside",
        "heading": "Opens by hand,",
        "headingAccent": "and stays open.",
        "body": "A panel off without tools, standard parts inside, and spares that ship for a decade. The eighteen-litre chassis is built to be worked on rather than replaced.",
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
        "type": "spotlight",
        "kicker": "Ryzen 7 5700G",
        "body": "The Ryzen 7 5700G tops a Socket AM4 line-up that runs down to the Ryzen 3 5305G, on the AMD Pro 500 chipset. Radeon graphics are built into the processor, so most desks never need a discrete card at all.",
        "image": "/images/am4/cpu-ryzen.webp",
        "alt": "An AMD Ryzen processor seated in an AM4 socket under a warm key light",
        "aspect": "aspect-[21/9]",
        "align": "center",
        "stats": [
          [
            "8",
            "Cores"
          ],
          [
            "16",
            "Threads"
          ],
          [
            "4.6GHz",
            "Max boost clock"
          ],
          [
            "16MB",
            "L3 cache"
          ]
        ],
        "caption": "Figures are AMD's published specification for the Ryzen 7 5700G. Ryzen 5 5600G/5605G and Ryzen 3 5305G configurations have fewer cores and lower clocks. The processor shown is a Ryzen 7 of an earlier generation.",
        "heading": "Eight cores, and the graphics",
        "headingAccent": "on the same die."
      },
      {
        "type": "featureSplit",
        "pill": "On the desk",
        "heading": "Eighteen litres,",
        "headingAccent": "beside the screen.",
        "body": "It stands upright in the footprint of a ream of paper, so it shares a desk with the display rather than competing with it — and drives two 4K screens from HDMI and DisplayPort without a card in the slot.",
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
        "subline": "Ryzen processors with Radeon graphics on the die — the platform this build is specified around."
      },
      {
        "type": "compare",
        "heading": "AM4, or AM5 with the NPU?",
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
