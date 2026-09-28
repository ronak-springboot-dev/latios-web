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
  sections: [
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
        ["24", "cores", "Up to Core i9-14900"],
        ["5600", "MT/s", "DDR5 dual channel"],
        ["18", "L", "Chassis volume"]
      ],
      "statCols": 3
    },
    {
      "type": "bento",
      "stage": true,
      "heading": "Everything a desk needs, in eighteen litres.",
      "cards": [
        {
          "col": 1, "size": "tall", "bleed": true,
          "title": "Compact design", "subtitle": "18-litre micro tower",
          "image": "/images/mt/chassis-ddr5.webp",
          "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked",
          "dims": {
            "box": [1000, 1400],
            "h": { "x": 14.9, "y1": 22.0, "y2": 80.0, "label": "354 mm" },
            "d": { "x1": 19.4, "x2": 80.4, "y": 82.0, "label": "166 mm" },
            "note": "Depth 312 mm · 7.59 kg"
          }
        },
        {
          "col": 1, "size": "short", "bleed": true, "grow": true,
          "title": "Cooling & power", "subtitle": "Fan cooler · 80+ Bronze supply",
          "image": "/images/mt/cooler-card.webp",
          "alt": "A round desktop fan cooler, rendered",
          "stat": ["500", "W", "ATX power"]
        },
        {
          "col": 2, "size": "small",
          "title": "Memory", "subtitle": "Dual-channel DDR5-5600 · up to 64GB",
          "glyph": "dimm"
        },
        {
          "col": 2, "size": "small",
          "title": "Storage", "subtitle": "M.2 · 2.5″ bay · 3.5″ bay",
          "glyph": "drive"
        },
        {
          "col": 2, "size": "text",
          "title": "Wi-Fi 6E · TPM 2.0", "subtitle": "Secured firmware and a discrete module · Kensington · padlock"
        },
        {
          "col": 2, "size": "short", "bleed": true, "foot": true, "grow": true,
          "title": "4K display output", "subtitle": "HDMI 2.1 4K@60 · DisplayPort · VGA",
          "image": "/images/mt/desk-card.webp",
          "alt": "The Latios MT on a desk beside a display showing the Latios wallpaper"
        },
        {
          "col": 3, "size": "half", "bleed": true,
          "title": "Processor", "subtitle": "Up to Intel Core i9-14900",
          "image": "/images/parts/cpu-lga1700.webp",
          "alt": "An Intel processor seated in an LGA socket"
        },
        {
          "col": 3, "size": "half", "bleed": true, "grow": true,
          "title": "Graphics", "subtitle": "Up to NVIDIA RTX A4000",
          "image": "/images/parts/gpu-workstation.webp",
          "alt": "A single-slot professional graphics card, rendered"
        }
      ]
    },
    {
      "type": "featureSplit",
      "pill": "Core i9-14900",
      "heading": "Twenty-four cores,",
      "headingAccent": "two kinds of them.",
      "body": "Eight performance cores for the thread that the operator is waiting on, sixteen efficient ones for everything running behind it. The line runs down to an i3 for kiosks and counters, on the same socket and the same board.",
      "image": "/images/parts/cpu-lga1700.webp",
      "alt": "An Intel processor seated in an LGA socket",
      "stats": [
        ["8", "", "Performance cores"],
        ["16", "", "Efficient cores"],
        ["24", "", "Cores in total"],
        ["12–14", "Gen", "On one socket"]
      ],
      "footnote": "Figures are Intel's published specification for the Core i9-14900. Lower configurations in this line have fewer cores. The processor shown is an illustration, not the part supplied."
    },
    {
      "type": "featureSplit",
      "pill": "Memory",
      "heading": "DDR5-5600,",
      "headingAccent": "and that is the argument.",
      "body": "Two U-DIMM slots at 5600 MT/s. This is the one row that separates this build from its DDR4 twin, and it is the row that simulation, heavy virtualisation and large spreadsheets actually notice.",
      "image": "/images/parts/ddr5-pair.webp",
      "alt": "Two DDR5 desktop memory modules, rendered",
      "flip": true,
      "stats": [
        ["5600", "MT/s", "Dual DDR5 channels"],
        ["64", "GB", "Maximum supported", "Up to"]
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
        ["A4000", "", "NVIDIA RTX class", "Up to"],
        ["500", "W", "80+ Bronze ATX supply"]
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
        ["18", "L", "312 × 166 × 354 mm"],
        ["7.59", "kg", "Weight"]
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
      "type": "compare",
      "heading": "Against the rest of the Intel MT range.",
      "rows": ["CPU options", "Chipset", "Memory", "Graphics"]
    },
    {
      "type": "specTable",
      "heading": "Every number that matters.",
      "body": "Every Intel MT configuration on this chassis, side by side. The rows that differ are the decision."
    }
  ],
};
