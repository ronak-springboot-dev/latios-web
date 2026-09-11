/**
 * Latios PRO 14.  Built the way the MT AM4 page was: split features with stat
 * rows, a bento grid, studio renders on a dark ground. Blue, this product's accent.
 *
 * Every figure is the factory sales kit's for this chassis -- the kit is the
 * only spec source, and it is the factory's document, so it is not linked as a
 * datasheet. Pages cited: display p.7, lay-flat p.8, Wi-Fi 6E p.9, charging
 * p.11, camera p.12, DDR5 p.13, platforms pp.15-19, spec tables pp.24-26,
 * ports p.28, materials p.29.
 *
 * Not here, because the kit does not say: storage, operating system, and
 * Wi-Fi 7 (offered "by customer request only").
 *
 * Every image is one of the factory's CAD views of this chassis, with the
 * Latios wordmark and screen composited on (tools/image-processing/laptop_refs).
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "featureSplit",
      "pill": "Latios PRO 14",
      "heading": "Business,",
      "headingAccent": "in aluminium.",
      "body": "A 14-inch 2880 × 1800 display at 120Hz, a hinge that lays flat, and your choice of Intel Core or AMD Ryzen — up to Ryzen AI 300, a Copilot+ PC — in a sandblasted aluminium body of 1.5 kg.",
      "image": "/images/laptops/pro14/hero.webp",
      "alt": "The Latios PRO 14 open at 45 degrees, the Latios screen lit, against a dark studio ground",
      "glow": "horizon",
      "frame": "rounded",
      "stats": [
        ["1.5", "kg", "All-aluminium body"],
        ["18.5", "mm", "Thin, closed"],
        ["80", "Wh", "Battery (AMD)"]
      ],
      "statCols": 3
    },
    {
      "type": "bento",
      "heading": "A full-size office, in fourteen inches.",
      "cards": [
        {
          "col": 1, "size": "tall",
          "title": "Design", "subtitle": "Sandblasted, anodised aluminium",
          "image": "/images/laptops/pro14/top.webp",
          "alt": "The Latios PRO 14 closed, seen from above, with its width and depth marked",
          "dims": {
            "aspect": "1600 / 1235",
            "h": { "x": 13.6, "y1": 18.4, "y2": 79.3, "label": "220 mm" },
            "d": { "x1": 16.6, "x2": 83.5, "y": 82.3, "label": "311 mm" },
            "note": "18.5 mm thin · 1.5 kg"
          }
        },
        {
          "col": 1, "size": "short",
          "title": "150W USB-C", "subtitle": "40% charged in under 30 minutes",
          "stat": ["150", "W", "USB-C charging"]
        },
        {
          "col": 2, "size": "small",
          "title": "DDR5-5600", "subtitle": "Two SO-DIMM slots · up to 32GB",
          "glyph": "dimm"
        },
        {
          "col": 2, "size": "text",
          "title": "Wi-Fi 6E", "subtitle": "The 6 GHz band, for offices full of devices"
        },
        {
          "col": 2, "size": "short",
          "title": "Hinge", "subtitle": "Opens flat to 180° for sharing",
          "image": "/images/laptops/pro14/layflat.webp",
          "alt": "The Latios PRO 14 opened wide, seen from above",
          "fit": "cover"
        },
        {
          "col": 3, "size": "half",
          "title": "FHD + IR camera", "subtitle": "Face unlock · privacy shutter",
          "image": "/images/laptops/pro14/camera.webp",
          "alt": "The camera and IR sensor in the Latios PRO 14's top bezel",
          "fit": "cover"
        },
        {
          "col": 3, "size": "half",
          "title": "Backlit keyboard", "subtitle": "With the Copilot key",
          "image": "/images/laptops/pro14/keyboard.webp",
          "alt": "The Latios PRO 14's backlit keyboard",
          "fit": "cover"
        }
      ]
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Three platforms, one chassis.",
      "stats": [
        ["AI 300", "AMD Ryzen AI", "Radeon 860M · up to 50+ TOPS · USB4 · 80Wh"],
        ["8040", "AMD Ryzen", "Radeon 780M · 8 cores / 16 threads · USB4 · 80Wh"],
        ["Core", "Intel", "Iris Xe · up to 10 cores / 12 threads · Thunderbolt 4 · 60Wh"]
      ]
    },
    {
      "type": "featureSplit",
      "pill": "Display",
      "heading": "2880 × 1800,",
      "headingAccent": "at 120Hz.",
      "body": "A 14-inch 16:10 panel with the whole sRGB gamut at ΔE under 2 — colour you can sign off on — and 120Hz that makes a long day of scrolling and dragging feel lighter.",
      "image": "/images/laptops/pro14/front.webp",
      "alt": "The Latios PRO 14 open, straight on, the Latios screen lit",
      "flip": true,
      "stats": [
        ["2.8K", "", "2880 × 1800, 16:10"],
        ["120", "Hz", "Refresh rate"],
        ["400", "nits", "Brightness"],
        ["100", "%", "sRGB, ΔE < 2"]
      ],
      "footnote": "A 1920 × 1200 60Hz panel with 100% sRGB is also available."
    },
    {
      "type": "featureSplit",
      "pill": "Ryzen AI 300",
      "heading": "A Copilot+ PC,",
      "headingAccent": "with the NPU on board.",
      "body": "The Ryzen AI 300 configuration runs AI work locally on an NPU of up to 50+ TOPS, beside up to 8 Zen 5 cores and Radeon 860M graphics — and the Copilot key puts it one press away.",
      "image": "/images/laptops/pro14/copilot.webp",
      "alt": "The Copilot key on the Latios PRO 14's keyboard",
      "stats": [
        ["50+", "TOPS", "NPU, up to"],
        ["8", "", "Cores, up to"],
        ["16", "", "Threads, up to"]
      ],
      "footnote": "Copilot+ PC features need the AMD Ryzen AI 300 configuration. Ryzen 8040 carries an NPU of its own; the Intel configuration does not."
    },
    {
      "type": "featureSplit",
      "pill": "Build",
      "heading": "Sandblasted, anodised,",
      "headingAccent": "diamond-cut.",
      "body": "Lid, top case and base are aluminium, sandblasted and anodised, with a diamond-cut edge round the keyboard deck. At the back: USB4 or Thunderbolt 4, HDMI 2.1 and gigabit Ethernet — a desk's worth of cables without a dock.",
      "image": "/images/laptops/pro14/back.webp",
      "alt": "The Latios PRO 14 from behind, the Latios wordmark on its lid and its rear ports along the foot",
      "flip": true
    },
    {
      "type": "audiences",
      "heading": "One chassis, three kinds of day.",
      "items": [
        {
          "id": "business",
          "label": "Business",
          "heading": "The travelling office",
          "desc": "Video calls on the road at 2.8K, a full rear panel for the desk you land at, and a battery sized for the day in between.",
          "bullets": ["Wi-Fi 6E", "FHD + IR camera with privacy shutter", "HDMI 2.1 and RJ45 on board"],
          "image": "/images/laptops/pro14/back.webp"
        },
        {
          "id": "creators",
          "label": "Creators",
          "heading": "Colour you can sign off on",
          "desc": "100% sRGB at ΔE under 2 on a 16:10 panel, with the Ryzen AI 300's NPU and Radeon 860M for the work around the edit.",
          "bullets": ["2880 × 1800 at 120Hz", "Up to 50+ TOPS NPU", "Full-size card reader"],
          "image": "/images/laptops/pro14/hero.webp"
        },
        {
          "id": "students",
          "label": "Students",
          "heading": "Everything in 1.5 kg",
          "desc": "Assignments, streaming and everything else on one light, lay-flat machine — and memory you can take to 32GB later.",
          "bullets": ["1.5 kg, 18.5 mm", "180° lay-flat hinge", "DDR5, two SO-DIMM slots"],
          "image": "/images/laptops/pro14/top.webp"
        }
      ]
    },
    {
      "type": "specTable",
      "heading": "Every number that matters.",
      "body": "One chassis in three platforms. Where a row differs by platform, it says which."
    }
  ]
};
