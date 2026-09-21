/**
 * Latios CX170-S5062 — 1U rack barebones.
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
        "pill": "1U platform",
        "heading": "Specified",
        "headingAccent": "to the slot.",
        "body": "Two Xeon 6 sockets and thirty-two DIMM slots in a single rack unit — the densest compute node in the range.",
        "image": "/images/servers/cx170-s5062.webp",
        "alt": "The Latios CX170-S5062 rack server at three-quarters",
        "stats": [
          [
            "2",
            "",
            "Xeon 6 sockets"
          ],
          [
            "32",
            "",
            "DIMM slots"
          ],
          [
            "1",
            "",
            "Rack unit"
          ]
        ],
        "footnote": "Product image supplied by the platform partner. Configuration varies by order."
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "Every channel,",
        "headingAccent": "populated.",
        "body": "(32) DDR5 RDIMM, 8 channels per CPU (2DPC), up to 6400MT/s (1DPC) and 6000MT/s (2DPC) Server memory is specified by channel and by slot, so both are stated rather than reduced to a ceiling.",
        "image": "/images/servers/cx170-s5062.webp",
        "alt": "The Latios CX170-S5062 rack server at three-quarters",
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
            "32",
            "DIMM slots",
            ""
          ],
          [
            "1",
            "Rack unit",
            ""
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
            "desc": "(12) Front hot-swap 2.5\" U.2 NVMe bays · (2) Rear hot-swap E1.S · (2) M.2 22110 PCIe 5.0"
          },
          {
            "icon": "Network",
            "title": "Networking",
            "desc": "(1) 1000Base-T Dedicated Server Management port per node"
          },
          {
            "icon": "ShieldCheck",
            "title": "Out-of-band management",
            "desc": "ASPEED AST2600 with IPMI 2.0 & DMTF Redfish · Dual BIOS & BMC"
          },
          {
            "icon": "Layers",
            "title": "Configurations",
            "desc": "Ordered as S5062X170RAU12."
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
