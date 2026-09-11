/**
 * Latios Archer LTG540Z.  Design language: 300Hz of overkill.
 *
 * Rebuilt on the same vocabulary as the MT AM4 and PRO 14 pages -- splits with
 * stat rows, a bento grid, studio renders on a dark ground -- in this product's
 * red. It keeps the two things it alone has: a loop video of the real unit and
 * the walkthrough over its photograph.
 *
 * Every figure here is one Archer already published in its spec rows
 * (models.js): Core Ultra 9 200HX, RTX 5050 to 5080, 16" 2.5K Mini LED at
 * 300Hz and 500 nits, 270W combined. Nothing new is claimed -- there is no
 * spec sheet for this machine, only those rows.
 *
 * Its images are the photographs of the real unit, relit by tools/image-
 * processing/gen_archer.py; the wordmark on the chin and the lid is the
 * product's own, and the vendor stickers are left exactly as photographed.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "featureSplit",
      "pill": "Latios Archer · LTG540Z",
      "heading": "Three hundred hertz,",
      "headingAccent": "and the power to feed it.",
      "body": "A 16-inch 2.5K Mini LED panel at 300Hz, an HX-series Core Ultra 9 and up to an RTX 5080, on a 270W combined power budget the cooling was designed around.",
      "image": "/images/laptops/archer/hero.webp",
      "alt": "The Latios Archer open at three-quarters against a dark studio ground",
      "glow": "horizon",
      "frame": "rounded",
      "stats": [
        ["300", "Hz", "2.5K Mini LED"],
        ["270", "W", "CPU + GPU, combined"],
        ["5080", "", "Max RTX graphics"]
      ],
      "statCols": 3
    },
    {
      "type": "bento",
      "heading": "Overkill, itemised.",
      "cards": [
        {
          "col": 1, "size": "tall",
          "title": "16″ 2.5K Mini LED", "subtitle": "300Hz · 500 nits",
          "image": "/images/laptop-archer-2.webp",
          "alt": "The Latios Archer, open",
          "fit": "contain"
        },
        {
          "col": 1, "size": "short",
          "title": "OverBoost Ultra", "subtitle": "Combined CPU and GPU budget",
          "stat": ["270", "W", "Sustained"]
        },
        {
          "col": 2, "size": "small",
          "title": "DDR5 memory", "subtitle": "Dual channel, upgradeable",
          "glyph": "dimm"
        },
        {
          "col": 2, "size": "small",
          "title": "Dual SSD", "subtitle": "Two M.2 slots",
          "glyph": "drive"
        },
        {
          "col": 2, "size": "text",
          "title": "Core Ultra 9 200HX", "subtitle": "The HX-series mobile part, with the thermal headroom to hold its clocks"
        },
        {
          "col": 3, "size": "half",
          "title": "Rear I/O", "subtitle": "Display, data and power without a dock",
          "image": "/images/details/archer-io.webp",
          "alt": "The Latios Archer from behind, its rear ports along the foot",
          "fit": "cover"
        },
        {
          "col": 3, "size": "half",
          "title": "Brushed lid", "subtitle": "The wordmark, machined in",
          "image": "/images/laptops/archer/angle.webp",
          "alt": "The Latios Archer closed, its brushed lid and wordmark lit",
          "fit": "cover"
        }
      ]
    },
    {
      "type": "video",
      "src": "/videos/archer-loop.mp4",
      "poster": "/images/posters/archer-loop.webp"
    },
    {
      "type": "featureSplit",
      "pill": "Display",
      "heading": "Mini LED,",
      "headingAccent": "not an IPS panel with a name.",
      "body": "Sixteen inches of 2.5K at 300Hz and 500 nits. Mini LED backlighting holds its black level where an edge-lit panel washes out — the difference you see in a dark scene, not on a spec sheet.",
      "image": "/images/details/archer-open.webp",
      "alt": "The Latios Archer open, its 16-inch panel filling the frame",
      "flip": true,
      "stats": [
        ["300", "Hz", "Refresh rate"],
        ["2.5K", "", "16-inch panel"],
        ["500", "nits", "Brightness"],
        ["Mini", "LED", "Backlight"]
      ]
    },
    {
      "type": "walkthrough",
      "image": "/images/details/archer-open.webp",
      "kicker": "Walkthrough",
      "heading": "Where the 270 watts go.",
      "body": "Scroll through the parts that justify the power budget.",
      "height": 240,
      "points": [
        {
          "at": 0.0, "x": 0.5, "y": 0.26,
          "label": "2.5K Mini LED",
          "text": "A 16-inch panel at 300Hz and 500 nits — Mini LED, not an IPS panel with a marketing name."
        },
        {
          "at": 0.3, "x": 0.32, "y": 0.6,
          "label": "Core Ultra 9 200HX",
          "text": "The HX-series part, with the thermal headroom to hold its clocks."
        },
        {
          "at": 0.58, "x": 0.66, "y": 0.58,
          "label": "Up to RTX 5080",
          "text": "From RTX 5050 to 5080 on the same chassis."
        },
        {
          "at": 0.82, "x": 0.5, "y": 0.76,
          "label": "270W OverBoost",
          "text": "Combined CPU and GPU budget — the number the cooling was designed around."
        }
      ]
    },
    {
      "type": "featureSplit",
      "pill": "Graphics",
      "heading": "From 5050",
      "headingAccent": "to 5080.",
      "body": "The same chassis takes the whole RTX 50 ladder, so the machine is chosen by frame rate rather than by model name — and the cooling is built for the top of it either way.",
      "image": "/images/laptops/archer/angle.webp",
      "alt": "The Latios Archer closed, seen from above at an angle",
      "footnote": "RTX 5050 · 5060 · 5070 · 5070 Ti · 5080 configurations."
    },
    {
      "type": "specTable",
      "heading": "Every number that matters.",
      "body": "The Archer's published specification, in full."
    }
  ]
};
