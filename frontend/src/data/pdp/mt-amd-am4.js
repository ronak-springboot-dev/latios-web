/**
 * Latios MT — AMD AM4.  Built on the Minisforum 790S7 page: split features with
 * big-number rows, a bento grid of feature cards, component renders on a dark
 * ground. Amber, this product's own accent.
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
 *     a rendered component, captioned as an illustration.
 *   - No port diagram. The photographed rear panel is the Intel board's, and the
 *     photographed front panel disagrees with this model's Front I/O row. The
 *     ports are listed in the specification table until that is confirmed.
 *   - No board-callout diagram and no "smaller than a tower" comparison, both of
 *     which the reference has: one would invent a layout, the other a figure.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "featureSplit",
      "pill": "Latios MT · AM4",
      "heading": "The everyday",
      "headingAccent": "workhorse.",
      "body": "AMD Ryzen 5000G processing with Radeon graphics on the die, dual-channel DDR4 and a full array of I/O, in an 18-litre chassis your IT team can open by hand.",
      "image": "/images/am4/hero-front.webp",
      "alt": "The Latios MT tower from the front, its ribbed fascia and Latios wordmark lit against a warm horizon glow",
      "glow": "horizon",
      "frame": "rounded",
      "stats": [
        ["8", "cores", "Up to Ryzen 7 5700G"],
        ["64", "GB", "DDR4-3200 ceiling"],
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
          "image": "/images/am4/chassis-card.webp",
          "alt": "The Latios MT chassis from the side in a warm glow, with its height and depth marked",
          "dims": {
            "box": [1000, 1400],
            "h": { "x": 18.8, "y1": 28.2, "y2": 78.0, "label": "354 mm" },
            "d": { "x1": 22.3, "x2": 83.6, "y": 79.8, "label": "312 mm" },
            "note": "Width 166 mm · 7.59 kg"
          }
        },
        {
          "col": 1, "size": "short", "bleed": true, "grow": true,
          "title": "Cooling & power", "subtitle": "Fan cooler · 80+ Bronze supply",
          "image": "/images/am4/cooler-card.webp",
          "alt": "A round desktop fan cooler, rendered",
          "stat": ["500", "W", "ATX power"]
        },
        {
          "col": 2, "size": "small",
          "title": "Memory", "subtitle": "Dual-channel DDR4-3200 · up to 64GB",
          "glyph": "dimm"
        },
        {
          "col": 2, "size": "small",
          "title": "Storage", "subtitle": "M.2 · 2.5″ bay · 3.5″ bay",
          "glyph": "drive"
        },
        {
          "col": 2, "size": "text",
          "title": "Wi-Fi 6E · TPM 2.0", "subtitle": "Up to Intel AX211 with Bluetooth 5.3 · Kensington · padlock"
        },
        {
          "col": 2, "size": "short", "bleed": true, "foot": true, "grow": true,
          "title": "Dual 4K display", "subtitle": "HDMI 4K@60 · DisplayPort 1.4 · VGA (opt)",
          "image": "/images/am4/desk-card.webp",
          "alt": "A desk with two monitors, rendered"
        },
        {
          "col": 3, "size": "half", "bleed": true,
          "title": "Processor", "subtitle": "Up to AMD Ryzen 7 5700G",
          "image": "/images/am4/cpu-ryzen.webp",
          "alt": "An AMD Ryzen processor seated in an AM4 socket"
        },
        {
          "col": 3, "size": "half", "bleed": true, "grow": true,
          "title": "Graphics", "subtitle": "Up to 16GB AMD Radeon RX",
          "image": "/images/am4/gpu-radeon.webp",
          "alt": "A full-height desktop graphics card, rendered"
        }
      ]
    },
    {
      "type": "featureSplit",
      "pill": "Ryzen 7 5700G",
      "heading": "Eight cores, and the graphics",
      "headingAccent": "on the same die.",
      "body": "The Ryzen 7 5700G tops a Socket AM4 line-up that runs down to the Ryzen 3 5305G, on the AMD Pro 500 chipset. Radeon graphics are built into the processor, so most desks never need a discrete card at all.",
      "image": "/images/am4/cpu-ryzen.webp",
      "alt": "An AMD Ryzen processor seated in an AM4 socket under a warm key light",
      "stats": [
        ["8", "", "Cores"],
        ["16", "", "Threads"],
        ["4.6", "GHz", "Max boost clock"],
        ["16", "MB", "L3 cache"]
      ],
      "footnote": "Figures are AMD's published specification for the Ryzen 7 5700G. Ryzen 5 5600G/5605G and Ryzen 3 5305G configurations have fewer cores and lower clocks. Image is an illustration."
    },
    {
      "type": "featureSplit",
      "pill": "Graphics",
      "heading": "Room for a",
      "headingAccent": "Radeon RX card.",
      "body": "Integrated Radeon graphics drive two 4K displays out of the box. When a desk needs more — design review, a control-room wall, light rendering — the chassis takes a discrete AMD Radeon RX card, and the 500W supply has the headroom for it.",
      "image": "/images/am4/gpu-radeon.webp",
      "alt": "A full-height desktop graphics card with two fans, rendered",
      "flip": true,
      "stats": [
        ["16", "GB", "Up to, Radeon RX", "Up to"],
        ["500", "W", "80+ Bronze ATX supply"]
      ],
      "footnote": "A discrete graphics card is an optional configuration. Image is an illustration, not the card supplied."
    },
    {
      "type": "featureSplit",
      "pill": "Memory",
      "heading": "Dual-channel DDR4,",
      "headingAccent": "up to 64GB.",
      "body": "Two U-DIMM slots at 3200 MHz. Ship a desk at 16GB today and take it to 64GB years later without changing anything else in the box.",
      "image": "/images/am4/ddr4-pair.webp",
      "alt": "Two desktop memory modules on a reflective surface, rendered",
      "stats": [
        ["3200", "MHz", "Dual DDR4 channels", "Up to"],
        ["64", "GB", "Maximum supported", "Up to"]
      ],
      "footnote": "Image is an illustration."
    },
    {
      "type": "featureSplit",
      "pill": "Storage",
      "heading": "A fast drive and a big one,",
      "headingAccent": "in the same box.",
      "body": "An M.2 SSD for the operating system and working files, with a 2.5-inch bay and a 3.5-inch bay beside it for bulk storage — all reachable from the one hand-removable side panel.",
      "image": "/images/am4/storage-set.webp",
      "alt": "An M.2 drive, a 2.5-inch drive and a 3.5-inch drive, rendered",
      "flip": true,
      "footnote": "1× M.2 SSD (auto-switch) · 1× 2.5″ HDD/SSD · 1× 3.5″ HDD. Image is an illustration."
    },
    {
      "type": "audiences",
      "heading": "One platform. Every team.",
      "items": [
        {
          "id": "enterprise",
          "label": "Enterprise IT",
          "heading": "Fleets that stay current, not retired",
          "desc": "Standard tools, standard parts, TPM 2.0 at the metal. Roll out hundreds of units knowing each one can be serviced or upgraded in minutes, not truck-rolls.",
          "bullets": ["Hardware TPM 2.0", "Tool-fast memory and drive access", "PS/2 and optional VGA alongside USB-C"],
          "image": "/images/ops.webp"
        },
        {
          "id": "education",
          "label": "Education",
          "heading": "Labs that survive the semester",
          "desc": "Radeon graphics onboard handle coding labs, design coursework and exam kiosks — with padlock loops that keep hardware exactly where you left it.",
          "bullets": ["Ryzen 5/7 options for every budget", "Kensington + padlock physical security", "Wi-Fi 6E for dense classrooms"],
          "image": "/images/av-ifp.jpg"
        },
        {
          "id": "government",
          "label": "Government",
          "heading": "GeM-ready, Made in India",
          "desc": "Designed, manufactured and supported at our Ahmedabad facility. Direct public-sector procurement through GeM with local lifecycle support.",
          "bullets": ["GeM-registered OEM", "ISO 9001 / 14001 / 27001 certified plant", "Decade-long parts availability"],
          "image": "/images/factory.jpg"
        },
        {
          "id": "frontoffice",
          "label": "Front Office & SMB",
          "heading": "A workhorse that disappears into the desk",
          "desc": "Fan cooling, an 18-litre footprint and every port accounting teams still rely on — from receipt printers to dual displays.",
          "bullets": ["Only 312 × 166 × 354 mm", "Dual-display 4K out of the box", "Up to 500W 80+ Bronze PSU headroom"],
          "image": "/images/av-monitor.jpg"
        }
      ]
    },
    {
      "type": "compare",
      "heading": "AM4, or one of the Intel boards?",
      "rows": ["CPU options", "Chipset", "Memory", "Graphics"]
    },
    {
      "type": "specTable",
      "heading": "Every number that matters.",
      "body": "Every MT configuration on this chassis, side by side. The rows that differ are the decision."
    }
  ]
};
