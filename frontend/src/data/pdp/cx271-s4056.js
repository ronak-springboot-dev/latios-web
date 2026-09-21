/**
 * Latios CX271-S4056 — 2U rack barebones.
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
        "body": "Twelve memory channels on one EPYC socket, at up to 500W — the bandwidth-per-socket answer in the range.",
        "image": "/images/servers/cx271-s4056.webp",
        "alt": "The Latios CX271-S4056 rack server at three-quarters",
        "stats": [
          [
            "12",
            "",
            "Memory channels"
          ],
          [
            "500",
            "",
            "W CPU TDP"
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
            "image": "/images/servers/cx271-s4056.webp",
            "alt": "The Latios CX271-S4056 rack server at three-quarters"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "24× DDR5 RDIMM, 12 channels",
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
            "subtitle": "Up to (2) PCIe 5.0 x16 expansion slots",
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
            "12",
            "Memory channels",
            ""
          ],
          [
            "500",
            "W CPU TDP",
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
        "body": "(24) DDR5 RDIMM, 12 channels (2DPC), up to 5200MT/s Server memory is specified by channel and by slot, so both are stated rather than reduced to a ceiling.",
        "image": "/images/servers/cx271-s4056.webp",
        "alt": "The Latios CX271-S4056 rack server at three-quarters",
        "flip": true,
        "stats": [
          [
            "24",
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
            "title": "Single AMD EPYC 9004/9005",
            "desc": "Single AMD EPYC™ 9004/9005 Series processor, TDP up to 500W"
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5 RDIMM",
            "desc": "(24) DDR5 RDIMM, 12 channels (2DPC), up to 5200MT/s"
          },
          {
            "icon": "HardDrive",
            "title": "Hot-swap storage",
            "desc": "(8) or (24) Front hot-swap 2.5\" U.2 PCIe 5.0 x4 NVMe bays · (2) M.2 22110 PCIe 3.0"
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
            "desc": "Ordered as S4056X271RAU8, S4056X271RAU24, S4056X271RAU8-HE."
          }
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "The platform specification as published, in full."
      }
    ]
  };
