/**
 * Latios CX270-S5062 — 2U rack barebones.
 *
 * Supplied on the MSI platform partnership. The specification is the
 * partner's published one, transcribed rather than summarised: slot
 * counts, memory channels and DIMM populations are what a datacentre
 * buyer specifies against, and rounding them would make the page useless.
 *
 * The photograph is the partner's product render. It carries no MSI mark
 * -- a barebones chassis ships unbranded, and the red plaques on the lid
 * are service warning labels, checked at full resolution before install.
 * That is why debadge.py is not in this path, unlike dp180-* and dp80-*.
 *
 * No benchmark figures and no price. Nothing on this site carries either,
 * and a rack platform is quoted rather than listed.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "featureSplit",
        "pill": "2U platform",
        "heading": "Specified",
        "headingAccent": "to the slot.",
        "body": "Dual Xeon 6 on the DC-MHS architecture, with up to twenty-four front NVMe bays and two rear E1.S — storage and compute in two units.",
        "image": "/images/servers/cx270-s5062.webp",
        "alt": "The Latios CX270-S5062 rack server at three-quarters",
        "stats": [
          [
            "2",
            "",
            "Xeon 6 sockets"
          ],
          [
            "6400",
            "",
            "MT/s DDR5"
          ],
          [
            "24",
            "",
            "NVMe bays"
          ]
        ],
        "footnote": "Product image supplied by the platform partner. Configuration varies by order."
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a rack needs, in 2u.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Chassis",
            "subtitle": "2U rack barebones",
            "image": "/images/servers/cx270-s5062.webp",
            "alt": "The Latios CX270-S5062 rack server at three-quarters"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "32× DDR5 RDIMM, up to 6400MT/s",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "(8) or (24) Front hot-swap 2.5\" U.2 PCIe 5.0 x4 NVMe bays",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Management",
            "subtitle": "ASPEED AST2600 with IPMI 2.0 & DMTF Redfish · Dual BIOS & BMC"
          },
          {
            "col": 3,
            "size": "half",
            "title": "Expansion",
            "subtitle": "Up to (6) PCIe 5.0 x16 expansion slots",
            "glyph": "gpu"
          },
          {
            "col": 3,
            "size": "text",
            "grow": true,
            "title": "Networking",
            "subtitle": "(1) 1000Base-T Dedicated Server Management port"
          }
        ]
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "Specified by the slot, not the badge.",
        "body": "The figures a datacentre buyer specifies against, stated as the platform states them.",
        "stats": [
          [
            "2",
            "Xeon 6 sockets",
            ""
          ],
          [
            "6400",
            "MT/s DDR5",
            ""
          ],
          [
            "24",
            "NVMe bays",
            ""
          ]
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "Every channel,",
        "headingAccent": "populated.",
        "body": "(32) DDR5 RDIMM, 8 channels per CPU (2DPC), up to 6400MT/s (1DPC) and 6000MT/s (2DPC) Server memory is specified by channel and by slot, so both are stated rather than reduced to a ceiling.",
        "image": "/images/servers/cx270-s5062.webp",
        "alt": "The Latios CX270-S5062 rack server at three-quarters",
        "flip": true,
        "stats": [
          [
            "32",
            "",
            "DIMM slots"
          ]
        ]
      },
      {
        "type": "featureGrid",
        "cols": 3,
        "heading": "What the platform carries.",
        "items": [
          {
            "icon": "Cpu",
            "title": "Dual Intel Xeon 6500/6700",
            "desc": "Dual Intel® Xeon® 6500/6700 series processors, TDP up to 350W"
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5 RDIMM",
            "desc": "(32) DDR5 RDIMM, 8 channels per CPU (2DPC), up to 6400MT/s (1DPC) and 6000MT/s (2DPC)"
          },
          {
            "icon": "HardDrive",
            "title": "Hot-swap storage",
            "desc": "(8) or (24) Front hot-swap 2.5\" U.2 PCIe 5.0 x4 NVMe bays · (2) Rear hot-swap E1.S · (2) M.2 22110 PCIe 5.0"
          },
          {
            "icon": "Network",
            "title": "Networking",
            "desc": "(1) 1000Base-T Dedicated Server Management port"
          },
          {
            "icon": "ShieldCheck",
            "title": "Out-of-band management",
            "desc": "ASPEED AST2600 with IPMI 2.0 & DMTF Redfish · Dual BIOS & BMC"
          },
          {
            "icon": "Layers",
            "title": "Configurations",
            "desc": "Ordered as S5062X270RAU24, S5062X270RAU8-HE, S5062X270RAU8, S5062X270RAS12-HE."
          }
        ]
      },
      {
        "type": "compare",
        "heading": "Against the rest of the rack range.",
        "rows": [
          "CPU options",
          "Memory",
          "Storage",
          "Expansion"
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "The platform specification as published, in full."
      }
    ]
  };
