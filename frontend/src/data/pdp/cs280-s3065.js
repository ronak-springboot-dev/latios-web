/**
 * Latios CS280-S3065 — 2U rack barebones.
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
        "body": "Twenty-four three-and-a-half-inch bays and two 25G SFP28 ports on board — the storage node of the range rather than a compute one.",
        "image": "/images/servers/cs280-s3065.webp",
        "alt": "The Latios CS280-S3065 rack server at three-quarters",
        "stats": [
          [
            "24",
            "",
            "× 3.5″ bays"
          ],
          [
            "25",
            "",
            "G SFP28 ×2"
          ],
          [
            "8",
            "",
            "DIMM slots"
          ]
        ],
        "footnote": "Product image supplied by the platform partner. Configuration varies by order."
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "Specified by the slot, not the badge.",
        "body": "The figures a datacentre buyer specifies against, stated as the platform states them.",
        "stats": [
          [
            "24",
            "× 3.5″ bays",
            ""
          ],
          [
            "25",
            "G SFP28 ×2",
            ""
          ],
          [
            "8",
            "DIMM slots",
            ""
          ]
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "Every channel,",
        "headingAccent": "populated.",
        "body": "(8) DDR5 RDIMM, 8 channels (1DPC), up to 6400MT/s Server memory is specified by channel and by slot, so both are stated rather than reduced to a ceiling.",
        "image": "/images/servers/cs280-s3065.webp",
        "alt": "The Latios CS280-S3065 rack server at three-quarters",
        "flip": true,
        "stats": [
          [
            "8",
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
            "title": "Single Intel Xeon 6500/6700",
            "desc": "Single Intel® Xeon® 6500/6700 series processor, TDP up to 350W"
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5 RDIMM",
            "desc": "(8) DDR5 RDIMM, 8 channels (1DPC), up to 6400MT/s"
          },
          {
            "icon": "HardDrive",
            "title": "Hot-swap storage",
            "desc": "(24) Hot-swap 3.5\" SATA/SAS bays · (2) Hot-swap 2.5\" U.2 NVMe · (2) M.2 22110 PCIe 5.0"
          },
          {
            "icon": "Network",
            "title": "Networking",
            "desc": "(2) 25G SFP28 and (2) 1000Base-T Ethernet ports on board"
          },
          {
            "icon": "ShieldCheck",
            "title": "Out-of-band management",
            "desc": "ASPEED AST2600 with IPMI 2.0 & DMTF Redfish"
          },
          {
            "icon": "Layers",
            "title": "Configurations",
            "desc": "Ordered as S3065S280RAS24U2."
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
