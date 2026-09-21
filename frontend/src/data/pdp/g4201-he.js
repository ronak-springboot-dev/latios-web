/**
 * Latios G4201-HE — 4U rack barebones.
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
        "body": "A four-rack-unit dual-socket platform with nine PCIe 5.0 x16 slots — built for accelerator density rather than drive count.",
        "image": "/images/servers/g4201-he.webp",
        "alt": "The Latios G4201-HE rack server at three-quarters",
        "stats": [
          [
            "9",
            "",
            "PCIe 5.0 x16"
          ],
          [
            "32",
            "",
            "DIMM slots"
          ],
          [
            "12",
            "",
            "Hot-swap bays"
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
            "image": "/images/servers/g4201-he.webp",
            "alt": "The Latios G4201-HE rack server at three-quarters"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "32× DDR5 RDIMM, up to 5600MT/s",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "(12) Hot-swap 3.5\"/2.5\" drive bays support (2) NVMe + (10) SATA",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Management",
            "subtitle": "BMC ASPEED AST2600 with IPMI & DMTF Redfish Support"
          },
          {
            "col": 3,
            "size": "half",
            "title": "Expansion",
            "subtitle": "(9) PCIe 5.0 x16 slots",
            "glyph": "gpu"
          },
          {
            "col": 3,
            "size": "text",
            "grow": true,
            "title": "Networking",
            "subtitle": "(1) 1000Base-T Ethernet port (Intel® I210AT)"
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
            "9",
            "PCIe 5.0 x16",
            ""
          ],
          [
            "32",
            "DIMM slots",
            ""
          ],
          [
            "12",
            "Hot-swap bays",
            ""
          ]
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "Every channel,",
        "headingAccent": "populated.",
        "body": "(32) DDR5 DIMM Slots, 2DPC, up to 5600MT/s, RDIMM Server memory is specified by channel and by slot, so both are stated rather than reduced to a ceiling.",
        "image": "/images/servers/g4201-he.webp",
        "alt": "The Latios G4201-HE rack server at three-quarters",
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
        "type": "featureSplit",
        "pill": "Expansion",
        "heading": "Lanes",
        "headingAccent": "that are not shared away.",
        "body": "(9) PCIe 5.0 x16 slots · (1) PCIe 4.0 x16 slot (with x8 signal). (12) Hot-swap 3.5\"/2.5\" drive bays support (2) NVMe + (10) SATA",
        "image": "/images/servers/g4201-he.webp",
        "alt": "The Latios G4201-HE rack server at three-quarters",
        "stats": [
          [
            "4U",
            "",
            "Rack units"
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
            "title": "Dual Intel Xeon Scalable",
            "desc": "Dual 4th/5th Generation Intel® Xeon® Scalable Processors"
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5 RDIMM",
            "desc": "(32) DDR5 DIMM Slots, 2DPC, up to 5600MT/s, RDIMM"
          },
          {
            "icon": "HardDrive",
            "title": "Hot-swap storage",
            "desc": "(12) Hot-swap 3.5\"/2.5\" drive bays support (2) NVMe + (10) SATA"
          },
          {
            "icon": "Network",
            "title": "Networking",
            "desc": "(1) 1000Base-T Ethernet port (Intel® I210AT)"
          },
          {
            "icon": "ShieldCheck",
            "title": "Out-of-band management",
            "desc": "BMC ASPEED AST2600 with IPMI & DMTF Redfish Support"
          },
          {
            "icon": "Layers",
            "title": "Configurations",
            "desc": "Ordered as G4201RAS10U2-HE."
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
