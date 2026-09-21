/**
 * Latios Pro AI SFF — Intel B860.  Design language: Core Ultra, small footprint.
 * Teal, normal rhythm.
 *
 * This is the SFF the product shoot photographed, and the rear panel proves it:
 * the silkscreen in `io/sff-b860-rear.webp` reads Thunderbolt on the Type-C and
 * carries two 2.5G LAN ports and a COM header, which is this model's Rear I/O
 * row and not the H610 build's. So the port map is pinned against the
 * specification rather than illustrated near it.
 *
 * Memory leads, because four slots instead of two is the whole reason this
 * configuration exists, and the spotlight shows the SLOTS rather than modules
 * standing on a plate: what is being sold here is the board, not the DIMMs.
 *
 * Those three spotlight images ARE renders, whatever the shoot-like filenames
 * suggest, and their alt text and captions already say so. An earlier note here
 * claimed the board's own silkscreen named all four slots and was better
 * evidence than a render could be; it is not, because the image IS the render.
 * Corrected rather than deleted, because the reasoning about slots over modules
 * still holds and is why no memory plate was added here.
 *
 * Graphics had no picture at all while the specification said "up to RTX
 * A4000". It gets one from the shared library in images/parts, and a
 * single-slot blower card rather than the dual-fan consumer one on the AM4
 * page: in eight litres a full-height dual-fan card does not fit, so the wrong
 * plate would contradict the chassis as well as the spec row.
 */
export default {
  sections: [
    {
      "type": "hero"
    },
    {
      "type": "statWall",
      "align": "center",
      "heading": "Twice the ceiling of its sibling.",
      "body": "Four DIMM slots instead of two is the whole reason this configuration exists. Large datasets and many virtual machines stop being a reason to buy a tower.",
      "stats": [
        [
          "128GB",
          "Max DDR5",
          "Four U-DIMM slots, twice the H810 build"
        ],
        [
          "40G",
          "Thunderbolt 4",
          "Dock, storage array and dual 4K on one cable"
        ],
        [
          "NPU",
          "Intel AI Boost",
          "Core Ultra 9 285 with a dedicated accelerator"
        ],
        [
          "8 L",
          "Chassis",
          "None of it spent on the ceiling"
        ]
      ]
    },
    {
      "type": "spotlight",
      "kicker": "Memory",
      "heading": "Four slots, not two.",
      "body": "Two channels, two slots each, up to 128GB of DDR5. The eight-litre sibling stops at two slots and 64GB, and that one row on the specification below is the whole reason this configuration exists.",
      "image": "/images/spotlight/sff-b860-memory.webp",
      "aspect": "aspect-[3/1]",
      "alt": "Four DDR5 memory slots in a row, rendered on a dark ground",
      "stats": [
        ["128GB", "Maximum", "Across four U-DIMM slots"],
        ["4", "DIMM slots", "Two per channel, populated in pairs"],
        ["2", "Channels", "Dual channel at full bandwidth"]
      ],
      "caption": "Illustration. Component appearance varies with the configuration ordered."
    },
    {
      "type": "reveal",
      "manifest": { "frames": 64, "width": 1400, "height": 1120, "pattern": "/reveal/sff-b860-pro-ai/{i}.webp" },
      "height": 260,
      "kicker": "Inside",
      "heading": "Four slots, in eight litres.",
      "body": "Scroll to open it. The row of four DIMM slots is what you are paying for.",
      "steps": [
        {
          "at": 0.0,
          "label": "Closed",
          "text": "The same eight-litre chassis as the rest of the SFF range."
        },
        {
          "at": 0.3,
          "label": "Panel off",
          "text": "One side removed and the board is in front of you."
        },
        {
          "at": 0.55,
          "label": "Four DIMM slots",
          "text": "A row of four, up to 128GB — the H810 build has two."
        },
        {
          "at": 0.78,
          "label": "Core Ultra",
          "text": "Performance cores, efficiency cores and an AI Boost NPU on one package."
        },
        {
          "at": 0.93,
          "label": "Storage",
          "text": "An M.2 drive under a heatsink, with Thunderbolt 4 handling anything external."
        }
      ]
    },
    {
      "type": "spotlight",
      "kicker": "Storage",
      "heading": "Two M.2 sockets, one of them Gen5.",
      "body": "A Gen5x4 socket for the working drive and a Gen4x4 beside it, with a 2.5-inch and a 3.5-inch bay still in the chassis behind them. Storage that keeps up with 128GB of memory rather than becoming the thing that waits.",
      "image": "/images/spotlight/sff-b860-storage.webp",
      "aspect": "aspect-[3/1]",
      "alt": "An M.2 NVMe solid state drive, rendered on a dark ground",
      "columns": [
        {
          "title": "Gen5x4",
          "desc": "The primary socket, wired direct rather than shared down from the graphics lanes."
        },
        {
          "title": "Gen4x4",
          "desc": "A second M.2 for capacity, a scratch volume, or a mirrored pair."
        },
        {
          "title": "Bays as well",
          "desc": "A 2.5-inch and a 3.5-inch, because eight litres did not mean giving up spinning capacity."
        }
      ],
      "caption": "Illustration. Component appearance varies with the configuration ordered."
    },
    {
      "type": "band",
      "kicker": "Core Ultra, small footprint",
      "items": [
        {"src": "/bands/sff-b860-pro-ai-0.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF — Intel B860 - Core Ultra 9 285 with Intel AI Boost"},
        {"src": "/bands/sff-b860-pro-ai-1.webp", "w": 1200, "h": 1523, "alt": "Latios Pro AI SFF — Intel B860 - 128GB of DDR5 in a small box"},
        {"src": "/bands/sff-b860-pro-ai-2.webp", "w": 1200, "h": 1163, "alt": "Latios Pro AI SFF — Intel B860 - Thunderbolt 4 at 40Gb/s"}
      ]
    },
    {
      "type": "spotlight",
      "kicker": "Thermal",
      "heading": "A vent wall, not a vent hole.",
      "body": "A low-profile cooler sits under a fully perforated side, so air is pulled across the board rather than around it. That is how a Core Ultra 9 holds its clocks in a volume this small, and why the machine is as quiet lying flat as it is standing.",
      "image": "/images/spotlight/sff-b860-cooling.webp",
      "aspect": "aspect-[3/1]",
      "alt": "A low-profile blower cooler seen from above, rendered on a dark ground",
      "caption": "Illustration. Component appearance varies with the configuration ordered."
    },
    {
      "type": "ioMap",
      "aspect": "aspect-[3/4]",
      "heading": "One cable for all of it.",
      "body": "Thunderbolt 4 at 40Gb/s carries a docking station, an external array and dual 4K displays. Behind it, two 2.5G LAN ports and a COM header for the equipment a small machine is usually asked to replace.",
      "caption": "Front and rear are photographs of a production unit; the top view is a rendered illustration. Port population varies with the configuration ordered — the specification table below is the authority for your build.",
      "faces": [
        {
          "label": "Front",
          "image": "/images/io/sff-b860-front.webp",
          "pins": [
            {"x": 0.145, "y": 0.345, "port": "Headphone", "side": "top"},
            {"x": 0.145, "y": 0.425, "port": "Mic-in", "side": "bottom"},
            {"x": 0.145, "y": 0.620, "port": "2× USB 5Gbps", "side": "top"},
            {"x": 0.145, "y": 0.815, "port": "USB-C 10Gbps", "side": "bottom"}
          ]
        },
        {
          "label": "Rear",
          "image": "/images/io/sff-b860-rear.webp",
          "pins": [
            {"x": 0.075, "y": 0.135, "port": "Thunderbolt 4", "side": "bottom"},
            {"x": 0.400, "y": 0.075, "port": "COM", "side": "bottom"},
            {"x": 0.065, "y": 0.315, "port": "HDMI 2.1", "side": "top"},
            {"x": 0.150, "y": 0.315, "port": "DisplayPort", "side": "bottom"},
            {"x": 0.065, "y": 0.655, "port": "USB 10Gbps", "side": "top"},
            {"x": 0.240, "y": 0.875, "port": "2× 2.5G LAN", "side": "bottom"}
          ]
        },
        {
          "label": "Top",
          "image": "/images/io/sff-b860-top.webp",
          "pins": []
        }
      ]
    },
    {
      "type": "featureGrid",
      "cols": 3,
      "heading": "Where the eight litres go.",
      "body": "Nothing here is a cut-down part. The volume is the only thing that shrank.",
      "items": [
        {
          "icon": "Cpu",
          "title": "Core Ultra 9 285",
          "desc": "Performance and efficiency cores with an AI Boost NPU."
        },
        {
          "icon": "MemoryStick",
          "title": "128GB across four slots",
          "desc": "Twice the ceiling of the H810 configuration."
        },
        {
          "icon": "Usb",
          "title": "Thunderbolt 4",
          "desc": "40Gb/s for dock, storage and displays on one cable."
        },
        {
          "icon": "Wifi",
          "title": "Dual 2.5G LAN",
          "desc": "Redundancy or a segregated management path."
        },
        {
          "icon": "HardDrive",
          "title": "Gen5 NVMe",
          "desc": "Storage that keeps up with the memory behind it."
        },
        {
          "icon": "ShieldCheck",
          "title": "TPM 2.0",
          "desc": "Enterprise posture at desk-side footprint."
        }
      ]
    },
    {
      "type": "compare",
      "heading": "B860 or H810?",
      "subline": "Same chassis, same processor family. Slots and ports are the decision.",
      "rows": [
        "Memory",
        "Storage",
        "Network",
        "Chipset"
      ]
    },
    {
      "type": "specTable",
      "heading": "Every number that matters.",
      "body": "Every Pro AI SFF configuration on this chassis, side by side. The rows that differ are the decision."
    }
  ],
};
