/**
 * Latios Pro MT — Intel H610 DDR5.  Rebuilt on the mt-amd-am4 design
 * language: split features with big-number rows, a bento grid, no motion.
 *
 * The scroll-driven reveal, the video loop and the marquee are gone. All
 * three carried content the copy already says.
 *
 * The bento's chassis card carries NO dimension callouts here, and that is
 * deliberate. This model's Dimensions row reads 168 x 335.1 x 369.4 mm and
 * also says 18 litres, which those figures do not make -- they come to
 * about 20.8. Every other MT reads 312 x 166 x 354. Until someone says
 * which is right, this page states no measurement it cannot stand behind.
 *
 * No board, socket, interior or rear-panel photograph, though MT_GALLERY
 * carries all four. The unit the shoot photographed is the Q670 build --
 * mt-q670-ddr5.js says so and pins its port map to it -- and a rear I/O
 * shield is cut for its board, so those frames are evidence about Q670 and
 * not about this machine. The ports stay in the specification table until
 * this build is photographed.
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
        "pill": "Latios Pro MT · H610 DDR5",
        "heading": "One platform,",
        "headingAccent": "four price points.",
        "body": "Core i7-14700 down to Core i3-14100 on the same board and the same chassis, with DDR5 on every one of them. A fleet can mix all four and still be one service procedure, one image and one spare part.",
        "image": "/images/mt/hero-front.webp",
        "alt": "The Latios MT tower from the front, its ribbed fascia and Latios wordmark lit against a warm horizon glow",
        "glow": "horizon",
        "frame": "rounded",
        "stats": [
          [
            "i7",
            "14700",
            "Top of the line"
          ],
          [
            "64",
            "GB",
            "DDR5 ceiling"
          ],
          [
            "4",
            "SKUs",
            "On one board"
          ]
        ],
        "statCols": 3
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a desk needs, in one chassis.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Compact design",
            "subtitle": "18-litre micro tower",
            "image": "/images/mt/chassis-pro.webp",
            "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked"
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
            "subtitle": "Dual-channel DDR5 · up to 64GB",
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
            "subtitle": "Intel I219-V 1G LAN · hardware TPM support · Kensington · padlock"
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
            "subtitle": "Core i7-14700 to i3-14100",
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
        "pill": "Processor",
        "heading": "Four processors,",
        "headingAccent": "one service procedure.",
        "body": "An i3 for the counter, an i5 for the desk, an i7 for the seat that renders. Each one drops into the same socket on the same H610 board, so a fleet specified across all four is still one image to deploy and one panel to open.",
        "image": "/images/parts/cpu-lga1700.webp",
        "alt": "An Intel processor seated in an LGA socket",
        "stats": [
          [
            "i7-14700",
            "",
            "Top of the line"
          ],
          [
            "i3-14100",
            "",
            "Entry"
          ],
          [
            "14",
            "Gen",
            "Intel Core"
          ]
        ],
        "footnote": "Configurations vary by order. The processor shown is an illustration, not the part supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5 across",
        "headingAccent": "the whole line.",
        "body": "Two U-DIMM slots on every configuration, including the i3. The entry seat and the workstation seat run the same memory architecture, so an upgrade later is a module rather than a machine.",
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
        "heading": "Room for a",
        "headingAccent": "professional card.",
        "body": "Integrated Intel graphics cover the desks that only need displays. Where a seat needs certified drivers, the chassis takes a single-slot professional card and the 500W supply has the headroom for it.",
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
        "pill": "On the desk",
        "heading": "One box,",
        "headingAccent": "four specifications.",
        "body": "The same chassis whichever processor the order names, so a studio running an i3 at reception and an i7 at the workstation still buys one shape, one panel and one spare part.",
        "image": "/images/scenes/mt-studio.webp",
        "alt": "A Latios machine on a working desk, photographed and composited into a studio scene",
        "aspect": "aspect-[16/10]",
        "footnote": "The machine is photographed. The room is a studio composite — furniture, display and peripherals are not supplied.",
        "flip": true
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
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "Every MT configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
