/**
 * Latios MT — Intel Q670 DDR5.  Design language: specified for managed fleets.
 * Steel blue, systematic, grid-heavy.
 *
 * This is the MT the product shoot actually photographed: the front panel in
 * `io/mt-q670-front.webp` carries one Type-C, two Type-A and two jacks, which
 * is this model's Front I/O row and no other MT's, and the board in the
 * spotlights is an Intel LGA with the retention frame in shot. So every
 * photograph on this page is of the machine the page is selling, and the port
 * map can be pinned against the specification instead of illustrated near it.
 *
 * The comparison stays late rather than early: the reference page earns its
 * side-by-side by showing the thing first, and Q670-versus-H610 is a decision
 * a reader makes after they have seen the chassis open, not before.
 *
 * The memory and graphics plates are NOT photographs and are captioned as
 * illustrations. They come from the shared library in images/parts, rendered
 * once and reused by spec match rather than per page -- a render costs 7-10
 * minutes, and these two plates serve every DDR5 MT and SFF page between them.
 * The card is the single-slot blower kind on purpose: this page sells "up to
 * RTX A4000", and the dual-fan consumer card on the AM4 page would be the wrong
 * class of part, which is the same error as showing the wrong socket.
 */
export default {
    "sections": [
      {
        "type": "hero"
      },
      {
        "type": "statWall",
        "align": "center",
        "heading": "The chipset is the product.",
        "body": "Where H610 covers the desk, Q670 adds the manageability and lane count that large managed estates are specified around.",
        "stats": [
          [
            "Q670",
            "Business chipset",
            "The row on the tender that H610 cannot satisfy"
          ],
          [
            "24",
            "Cores",
            "Up to Core i9-14900, unchanged from the H610 builds"
          ],
          [
            "64GB",
            "DDR5-5600",
            "With PCIe and storage lanes that do not compete"
          ],
          [
            "A4000",
            "Graphics ready",
            "Full-height slot, certified drivers"
          ]
        ]
      },
      {
        "type": "bento",
        "stage": true,
        "heading": "Everything a managed desk needs, in eighteen litres.",
        "cards": [
          {
            "col": 1,
            "size": "tall",
            "bleed": true,
            "title": "Compact design",
            "subtitle": "18-litre micro tower",
            "image": "/images/mt/chassis-q670.webp",
            "alt": "The Latios MT tower at three-quarters on a lit backdrop, with its height and width marked",
            "dims": {
              "box": [
                1000,
                1400
              ],
              "h": {
                "x": 20.1,
                "y1": 22.0,
                "y2": 80.0,
                "label": "354 mm"
              },
              "d": {
                "x1": 24.6,
                "x2": 75.4,
                "y": 82.0,
                "label": "166 mm"
              },
              "note": "Depth 312 mm · 7.59 kg"
            }
          },
          {
            "col": 1,
            "size": "short",
            "bleed": true,
            "grow": true,
            "title": "Cooling & power",
            "subtitle": "Fan cooler · 80+ Bronze supply",
            "image": "/images/mt/cooler-card.webp",
            "alt": "A round desktop fan cooler, rendered",
            "stat": [
              "500",
              "W",
              "ATX power"
            ]
          },
          {
            "col": 2,
            "size": "small",
            "title": "Memory",
            "subtitle": "Dual-channel DDR5-5600 · up to 64GB",
            "glyph": "dimm"
          },
          {
            "col": 2,
            "size": "small",
            "title": "Storage",
            "subtitle": "M.2 · 2.5″ bay · 3.5″ bay",
            "glyph": "drive"
          },
          {
            "col": 2,
            "size": "text",
            "title": "Wi-Fi 6E · TPM 2.0",
            "subtitle": "1G LAN · hardware TPM · Kensington · padlock"
          },
          {
            "col": 2,
            "size": "short",
            "bleed": true,
            "foot": true,
            "grow": true,
            "title": "4K display output",
            "subtitle": "HDMI 2.1 4K@60 · DisplayPort 1.4 · VGA",
            "image": "/images/mt/desk-card.webp",
            "alt": "A Latios desktop on a desk beside a display showing the Latios wallpaper"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "title": "Processor",
            "subtitle": "Up to Intel Core i9-14900",
            "image": "/images/parts/cpu-lga1700.webp",
            "alt": "A processor seated in its socket"
          },
          {
            "col": 3,
            "size": "half",
            "bleed": true,
            "grow": true,
            "title": "Graphics",
            "subtitle": "Up to NVIDIA RTX A4000",
            "image": "/images/parts/gpu-workstation.webp",
            "alt": "A desktop graphics card, rendered"
          }
        ]
      },
      {
        "type": "spotlight",
        "kicker": "The board",
        "heading": "Lanes that are not shared away.",
        "body": "Q670 is chosen for what it does not make you trade. The M.2 socket does not borrow from the graphics slot, and the storage controllers do not sit behind the same link as the network.",
        "image": "/images/spotlight/mt-q670-board.webp",
        "alt": "The Intel Q670 board inside the Latios MT, with the processor socket, M.2 socket and expansion slots in one frame",
        "stats": [
          [
            "PCIe",
            "Graphics slot",
            "Full-height, full-length, mechanically supported"
          ],
          [
            "M.2",
            "Direct to chipset",
            "Not borrowed from the graphics lanes"
          ],
          [
            "2×",
            "DDR5 U-DIMM",
            "Dual channel at 5600MHz"
          ]
        ]
      },
      {
        "type": "spotlight",
        "kicker": "Serviceable",
        "heading": "A socket, not a solder joint.",
        "body": "The processor sits in a standard socket under a standard cooler mount. Nothing on the critical path of a repair is proprietary, which is what keeps a fleet in service for a decade rather than for a warranty term.",
        "image": "/images/spotlight/mt-q670-socket.webp",
        "alt": "The processor socket and its retention frame inside the Latios MT, photographed with the side panel removed",
        "columns": [
          {
            "title": "Standard parts",
            "desc": "ATX supply, standard cooler mount, standard memory. A spare is a purchase order, not a support case."
          },
          {
            "title": "Opened by hand",
            "desc": "One panel, no tools. A technician working a floor of desks does not carry a kit for it."
          },
          {
            "title": "Ten-year horizon",
            "desc": "The chassis, the supply and the mounting have to outlast three refreshes of what is bolted to them."
          }
        ]
      },
      {
        "type": "band",
        "kicker": "Specified for managed fleets",
        "items": [
          {
            "src": "/bands/mt-q670-ddr5-0.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios MT — Intel Q670 DDR5 - Q670: the chipset IT actually asks for"
          },
          {
            "src": "/bands/mt-q670-ddr5-1.webp",
            "w": 1200,
            "h": 1523,
            "alt": "Latios MT — Intel Q670 DDR5 - Up to a Core i9-14900"
          },
          {
            "src": "/bands/mt-q670-ddr5-2.webp",
            "w": 1200,
            "h": 1163,
            "alt": "Latios MT — Intel Q670 DDR5 - DDR5 at full chipset bandwidth"
          }
        ]
      },
      {
        "type": "featureSplit",
        "pill": "Memory",
        "heading": "DDR5-5600,",
        "headingAccent": "at full chipset bandwidth.",
        "body": "Two U-DIMM slots running at 5600 MHz. Ship a fleet at 16GB and take any seat in it to 64GB later without opening a second purchase order for anything else.",
        "image": "/images/parts/ddr5-pair.webp",
        "alt": "Two DDR5 desktop memory modules, rendered",
        "stats": [
          [
            "5600",
            "MHz",
            "Dual DDR5 channels"
          ],
          [
            "64",
            "GB",
            "Maximum supported",
            "Up to"
          ]
        ],
        "footnote": "Image is an illustration, not the modules supplied."
      },
      {
        "type": "featureSplit",
        "pill": "Graphics",
        "heading": "Room for a",
        "headingAccent": "professional card.",
        "body": "Integrated Intel graphics drive the desks that only need a display. Where a seat needs certified drivers — CAD, design review, a control-room wall — the chassis takes a single-slot professional card, and the 500W supply has the headroom for it.",
        "image": "/images/parts/gpu-workstation.webp",
        "alt": "A single-slot blower-style professional graphics card, rendered",
        "flip": true,
        "stats": [
          [
            "A4000",
            "",
            "NVIDIA RTX class",
            "Up to"
          ],
          [
            "500",
            "W",
            "80+ Bronze ATX supply"
          ]
        ],
        "footnote": "A discrete graphics card is an optional configuration. Image is an illustration, not the card supplied."
      },
      {
        "type": "featureSplit",
        "pill": "On the desk",
        "heading": "Specified once,",
        "headingAccent": "deployed everywhere.",
        "body": "The managed estate's point is that every seat is the same seat. One image, one service procedure, one panel that comes off by hand — whether the desk is a control room or an office.",
        "image": "/images/scenes/mt-control.webp",
        "alt": "A Latios machine on a working desk, photographed and composited into a studio scene",
        "aspect": "aspect-[16/10]",
        "footnote": "The machine is photographed. The room is a studio composite — furniture, display and peripherals are not supplied."
      },
      {
        "type": "ioMap",
        "aspect": "aspect-[16/9]",
        "heading": "Every port a managed estate still needs.",
        "body": "Front USB-C for current docks, and a rear panel that has not dropped the ports the equipment already on the floor still uses.",
        "caption": "Photographed on a production unit. Port population varies with the configuration ordered — the specification table below is the authority for your build.",
        "faces": [
          {
            "label": "Front",
            "image": "/images/io/mt-q670-front.webp",
            "pins": [
              {
                "x": 0.163,
                "y": 0.665,
                "port": "USB-C 10Gbps",
                "side": "top"
              },
              {
                "x": 0.29,
                "y": 0.6,
                "port": "2× USB 5Gbps",
                "side": "top"
              },
              {
                "x": 0.402,
                "y": 0.665,
                "port": "Mic-in",
                "side": "top"
              },
              {
                "x": 0.489,
                "y": 0.665,
                "port": "Headphone",
                "side": "bottom"
              }
            ]
          },
          {
            "label": "Rear",
            "image": "/images/io/mt-q670-rear.webp",
            "pins": [
              {
                "x": 0.12,
                "y": 0.56,
                "port": "DisplayPort 1.4",
                "side": "top"
              },
              {
                "x": 0.12,
                "y": 0.79,
                "port": "HDMI 2.1",
                "side": "bottom"
              },
              {
                "x": 0.3,
                "y": 0.6,
                "port": "USB 10Gbps",
                "side": "bottom"
              },
              {
                "x": 0.505,
                "y": 0.45,
                "port": "1G LAN",
                "side": "top"
              },
              {
                "x": 0.505,
                "y": 0.75,
                "port": "USB 2.0",
                "side": "bottom"
              },
              {
                "x": 0.79,
                "y": 0.545,
                "port": "3× audio",
                "side": "top"
              }
            ]
          },
          {
            "label": "Side",
            "image": "/images/io/mt-q670-side.webp",
            "pins": []
          }
        ]
      },
      {
        "type": "featureGrid",
        "cols": 3,
        "heading": "Chosen on the tender, not the spec sheet.",
        "body": "The rows that decide a fleet purchase, in the order a procurement team reads them.",
        "items": [
          {
            "icon": "Cpu",
            "title": "Up to Core i9-14900",
            "desc": "Twelfth through fourteenth generation."
          },
          {
            "icon": "ShieldCheck",
            "title": "Q670 manageability",
            "desc": "The chipset large managed fleets are specified around."
          },
          {
            "icon": "MemoryStick",
            "title": "DDR5-5600",
            "desc": "Dual channel, up to 64GB."
          },
          {
            "icon": "MonitorCheck",
            "title": "RTX A4000 ready",
            "desc": "Certified drivers for CAD and control rooms."
          },
          {
            "icon": "Wifi",
            "title": "Wi-Fi 6E + 1G LAN",
            "desc": "Wired and wireless across the estate."
          },
          {
            "icon": "Wrench",
            "title": "Fleet-serviceable",
            "desc": "Standard parts, hand-removable panel, decade-long availability."
          }
        ]
      },
      {
        "type": "compare",
        "heading": "Why Q670 and not H610.",
        "subline": "Same chassis, same processors. The platform underneath is the difference.",
        "rows": [
          "Chipset",
          "CPU options",
          "Memory",
          "Graphics"
        ]
      },
      {
        "type": "specTable",
        "heading": "Every number that matters.",
        "body": "Every MT configuration on this chassis, side by side. The rows that differ are the decision."
      }
    ]
  };
