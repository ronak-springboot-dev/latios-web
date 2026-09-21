/**
 * Latios G4101 — 4U rack barebones.
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
        "pill": "4U platform",
        "heading": "Specified",
        "headingAccent": "to the slot.",
        "body": "A four-unit EPYC platform offered with a closed-loop liquid cooling module — the only member of the range that does not have to be air-cooled.",
        "image": "/images/servers/g4101.webp",
        "alt": "The Latios G4101 rack server at three-quarters",
        "stats": [
          [
            "4",
            "",
            "PCIe 5.0 x16"
          ],
          [
            "12",
            "",
            "DDR5 slots"
          ],
          [
            "500",
            "",
            "W SP5 TDP"
          ]
        ],
        "footnote": "Product image supplied by the platform partner. Configuration varies by order."
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a rack needs, in 4u.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Chassis",
            "subtitle": "4U rack barebones",
            "image": "/images/servers/g4101.webp",
            "alt": "The Latios G4101 rack server at three-quarters"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "12× DDR5 RDIMM, up to 6400MT/s",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "(12) Hot-swap 2.5\" U.2 PCIe 4.0 NVMe bays",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Management",
            "subtitle": "ASPEED AST2600 with IPMI & DMTF Redfish · Dual BMC Flash"
          },
          {
            "col": 3,
            "size": "half",
            "title": "Expansion",
            "subtitle": "(4) PCIe 5.0 x16 slots",
            "glyph": "gpu"
          },
          {
            "col": 3,
            "size": "text",
            "grow": true,
            "title": "Networking",
            "subtitle": "(1) 1000Base-T Dedicated Server Management Port"
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
            "4",
            "PCIe 5.0 x16",
            ""
          ],
          [
            "12",
            "DDR5 slots",
            ""
          ],
          [
            "500",
            "W SP5 TDP",
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
            "title": "Single AMD EPYC SP5",
            "desc": "Single Socket SP5, supports AMD EPYC™ 9005/9004 series processors"
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5 RDIMM",
            "desc": "(12) DDR5 DIMM Slots, 1DPC, up to 6400MT/s, RDIMM/RDIMM-3DS"
          },
          {
            "icon": "HardDrive",
            "title": "Hot-swap storage",
            "desc": "(12) Hot-swap 2.5\" U.2 PCIe 4.0 NVMe bays"
          },
          {
            "icon": "Network",
            "title": "Networking",
            "desc": "(1) 1000Base-T Dedicated Server Management Port"
          },
          {
            "icon": "ShieldCheck",
            "title": "Out-of-band management",
            "desc": "ASPEED AST2600 with IPMI & DMTF Redfish · Dual BMC Flash"
          },
          {
            "icon": "Layers",
            "title": "Configurations",
            "desc": "Ordered as G4101-01, G4101-03, G4101-04, G4101-05."
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
