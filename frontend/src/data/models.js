const MT_GALLERY = [
  "/images/dp180-1.webp",
  "/images/dp180-2.webp",
  "/images/dp180-3.webp",
  "/images/dp180-4.webp",
];
const SFF_GALLERY = ["/images/dp80-1.webp", "/images/dp80-2.webp"];
const MFF_GALLERY = ["/images/dp10-1.webp", "/images/dp10-2.webp"];

const MT_FEATURES = [
  {
    kicker: "Performance",
    heading: "Performance that keeps up with you",
    body: "Latest-generation processors, dual-channel memory and NVMe storage keep heavy multitasking instant — from sprawling spreadsheets to overnight render queues.",
    image: "/images/perf.png",
  },
  {
    kicker: "Connectivity",
    heading: "A complete array of I/O",
    body: "Front USB-C and USB-A within easy reach; HDMI 2.1, DisplayPort, legacy VGA and PS/2 at the back. New docks and decade-old projectors both plug straight in.",
    image: "/images/io-right.png",
  },
  {
    kicker: "Serviceability",
    heading: "Easy to upgrade design",
    body: "Quick access to memory, M.2, 2.5-inch and 3.5-inch bays means upgrades and servicing take minutes — keeping fleets current for years, not cycles.",
    image: "/images/easy.png",
  },
  {
    kicker: "Security",
    heading: "Secure inside and out",
    body: "Hardware TPM 2.0 encryption, Kensington and padlock points, and Latios Center keeping hardware health visible to IT at all times.",
    image: "/images/chassis.png",
  },
];

const SFF_FEATURES = [
  {
    kicker: "Design",
    heading: "Compact. Sleek. Powerful.",
    body: "Eight litres that disappear into any workspace — under the desk, behind the monitor, or standing slim beside it.",
    image: "/images/office.png",
  },
  {
    kicker: "Placement",
    heading: "Versatile placement",
    body: "Position it vertically or horizontally; the chassis is designed to look deliberate either way, with thermals that cope with both.",
    image: "/images/versatile.png",
  },
  {
    kicker: "Everyday",
    heading: "Speaker and card reader, built in",
    body: "Clear audio for calls and notifications, plus SD and microSD support up front — no dongles, no desk clutter.",
    image: "/images/speaker.png",
  },
  {
    kicker: "Security",
    heading: "Secure inside and out",
    body: "Hardware TPM 2.0, chassis lock points and Latios Center diagnostics — small footprint, enterprise posture.",
    image: "/images/chassis.png",
  },
];

const MFF_FEATURES = [
  {
    kicker: "Size",
    heading: "Power in the palm of your hand",
    body: "A full Windows 11 Pro PC in 1.1 litres. VESA-mount it behind a monitor and the desk is yours again.",
    image: "/images/palm.jpg",
  },
  {
    kicker: "Displays",
    heading: "Triple display support",
    body: "Drive up to three monitors through HDMI, DisplayPort and the configurable port — a control-room layout from something pocketable.",
    image: "/images/triple.png",
  },
  {
    kicker: "Detail",
    heading: "Cable organizer design",
    body: "The included cable organizer keeps connections locked and tidy, even in tight or vibration-prone installations.",
    image: "/images/cable.png",
  },
];

const PROMAX_FEATURES = [
  {
    kicker: "Graphics",
    heading: "Professional NVIDIA power",
    body: "Up to NVIDIA RTX A6000-class graphics for CAD, simulation, 8K editing and local AI inference — certified drivers, workstation stability.",
    image: "/images/rtx.jpg",
  },
  {
    kicker: "Memory",
    heading: "ECC memory at scale",
    body: "Error-correcting DDR5 in capacities ordinary desktops can't touch, keeping week-long computations honest.",
    image: "/images/ddr5.jpg",
  },
  {
    kicker: "Workflow",
    heading: "Drive every display",
    body: "Multiple 4K outputs for design walls, review suites and control rooms — one machine, every screen.",
    image: "/images/display.jpg",
  },
];

const MT_HERO = "/images/ops.jpg";
const SFF_HERO = "/images/dp80kv.jpg";
const MFF_HERO = "/images/dp10kv.jpg";
const PROMAX_HERO = "/images/rtx.jpg";

export const TOWERS_FAMILIES = [
  {
    kicker: "Business Desktops",
    title: "The MT · SFF · MFF family.",
    blurb:
      "Eleven configurations spanning micro-tower, small-form-factor and a 1.1-litre mini PC — from Ryzen 3 to Core Ultra 9, with Wi-Fi 6E/7, TPM 2.0 and tool-friendly upgrade paths.",
    models: [
      {
        slug: "mt-amd-am4",
        name: "Latios MT — AMD AM4",
        tag: "Ryzen 5000 · DDR4",
        image: "/images/dp180-3.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Ryzen 7 5700G", "64GB DDR4", "Wi-Fi 6E"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["64GB", "Max DDR4 memory"],
        ],
        intro:
          "The value workhorse of the range: AMD Ryzen 5000G processing with Radeon graphics onboard, a full array of front and rear I/O, and a chassis your IT team can open in seconds.",
        highlights: [
          "AMD Ryzen 7 5700G / 5 5600G / 3 5305G",
          "AMD Pro 500 chipset",
          "2× DDR4 3200MHz, up to 64GB",
          "Up to 16GB Radeon RX graphics",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "AMD Ryzen 7 5700G · Ryzen 5 5600G/5605G · Ryzen 3 5305G"],
              ["Chipset", "AMD Pro 500"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR4 3200MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD (auto-switch) · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to 16GB AMD Radeon RX"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "2× USB 3.2 Gen2 Type-C · 2× USB 3.2 Gen1 Type-A · Mic-in"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA (opt) · 5× USB-A · PS/2 · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E AX211 / Wi-Fi 6 + BT 5.2 options"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "312 × 166 × 354 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mt-h610-ddr4",
        name: "Latios MT — Intel H610 DDR4",
        tag: "12th–14th Gen · DDR4",
        image: "/images/dp180-1.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Core i9-14900", "64GB DDR4", "RTX A4000"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["64GB", "Max DDR4 memory"],
        ],
        intro:
          "Intel muscle on a sensible budget: up to a 14th Gen Core i9 with workstation-class RTX A4000 graphics, without giving up the DDR4 memory economics your fleet already owns.",
        highlights: [
          "Up to Intel Core i9-14900",
          "Intel H610 chipset",
          "2× DDR4 3200MHz, up to 64GB",
          "Up to NVIDIA RTX A4000",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 12th–14th Gen Core, up to Core i9-14900"],
              ["Chipset", "Intel H610"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR4 3200MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Mic-in · Headphone-out"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA · 4× USB 2.0 · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E optional"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "312 × 166 × 354 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mt-h610-ddr5",
        name: "Latios MT — Intel H610 DDR5",
        tag: "12th–14th Gen · DDR5",
        image: "/images/dp180-2.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Core i9-14900", "64GB DDR5", "TPM 2.0"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["5600", "DDR5 MT/s"],
        ],
        intro:
          "The mainstream fleet standard: 14th Gen Intel Core with DDR5-5600 memory, hardware TPM 2.0 and military-grade certification — ready to image, deploy and forget.",
        highlights: [
          "Up to Intel Core i9-14900",
          "Intel H610 chipset",
          "2× DDR5 5600MHz, up to 64GB",
          "TPM 2.0 · military-grade certified",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 12th–14th Gen Core, up to Core i9-14900"],
              ["Chipset", "Intel H610"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 5600MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD (PCIe Gen3x4) · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Mic-in · Headphone-out"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA · 4× USB 2.0 · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E optional"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "312 × 166 × 354 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mt-pro-h610-ddr5",
        name: "Latios Pro MT — Intel H610 DDR5",
        tag: "14th Gen · DDR5 · Pro",
        image: "/images/dp180-4.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Core i7-14700", "64GB DDR5", "RTX A4000"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["64GB", "Max DDR5 memory"],
        ],
        intro:
          "The Pro-badged tower for managed fleets: 14th Gen Core i7 performance, dTPM-secured by hardware, and a front I/O layout built for hot-desk reality.",
        highlights: [
          "Intel Core i7-14700 / i5-14500 / i3-14100",
          "Intel H610 chipset",
          "2× DDR5, up to 64GB",
          "dTPM 2.0 · hardware TPM support",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Core i7-14700 · i5-14500 · i5-14400 · i3-14100"],
              ["Chipset", "Intel H610"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 2280 PCIe Gen3x4 (pre-installed) · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Mic-in · Headphone-out · ODD (opt)"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA · 4× USB 2.0 · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E AX211 optional"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "168 × 335.1 × 369.4 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "dTPM 2.0 · hardware TPM support · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mt-q670-ddr5",
        name: "Latios MT — Intel Q670 DDR5",
        tag: "12th–14th Gen · Q670",
        image: "/images/dp180-4.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Core i9-14900", "Intel Q670", "RTX A4000"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["Q670", "Business chipset"],
        ],
        intro:
          "The enterprise chipset flagship: Q670 brings Intel's business-grade manageability and expansion headroom to the same serviceable 18-litre tower.",
        highlights: [
          "Up to Intel Core i9-14900",
          "Intel Q670 chipset",
          "2× DDR5 5600MHz, up to 64GB",
          "Up to NVIDIA RTX A4000",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 12th–14th Gen Core, up to Core i9-14900"],
              ["Chipset", "Intel Q670"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 5600MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Mic-in · Headphone-out"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA · USB-A array · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "1G LAN · Wi-Fi 6E optional"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "312 × 166 × 354 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "sff-h610-ddr5",
        name: "Latios Pro SFF — Intel H610",
        tag: "14th Gen · 9.3 litres",
        image: "/images/dp80-1.webp",
        gallery: SFF_GALLERY,
        heroImage: SFF_HERO,
        chips: ["Core i7-14700", "64GB DDR5", "8 litres"],
        stats: [
          ["8 L", "Chassis volume"],
          ["500W", "TFX 80+ PSU"],
          ["64GB", "Max DDR5 memory"],
        ],
        intro:
          "Full desktop power at a third of the size: 14th Gen Intel Core in an eight-litre small-form-factor that stands, lies flat, or hides behind the monitor.",
        highlights: [
          "Up to Intel Core i7-14700",
          "Intel H610 chipset",
          "2× DDR5, up to 64GB",
          "95 × 296 × 330 mm small form factor",
        ],
        features: SFF_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 14th Gen Core, up to Core i7-14700"],
              ["Chipset", "Intel H610"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Intel UHD integrated · discrete options"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Mic-in · Headphone-out"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA · 4× USB 2.0 · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "1G LAN · Wi-Fi 6E optional"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "95 × 296 × 330 mm · 8 litres"],
              ["Weight", "4.74 kg"],
              ["Power", "TFX 300W / 500W 80+ options"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mt-am5-pro-ai",
        name: "Latios Pro AI MT — AMD AM5",
        tag: "Ryzen 8000G AI · DDR5",
        image: "/images/dp180-1.webp",
        gallery: MT_GALLERY,
        heroImage: MT_HERO,
        chips: ["Ryzen 7 8700G", "Ryzen AI", "Wi-Fi 6E"],
        stats: [
          ["18 L", "Chassis volume"],
          ["500W", "80+ Bronze PSU"],
          ["NPU", "Ryzen AI onboard"],
        ],
        intro:
          "AMD's AI PC platform in a full-size tower: Ryzen 8000G with a dedicated neural engine, Radeon 700M graphics and the Pro 600 chipset — AI acceleration without the GPU budget.",
        highlights: [
          "AMD Ryzen 7 8700G with Ryzen AI",
          "AMD Pro 600 chipset",
          "2× DDR5 5200MHz, up to 64GB",
          "dTPM 2.0 · Wi-Fi 6E",
        ],
        features: MT_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "AMD Ryzen 7 8700G with Ryzen AI NPU"],
              ["Chipset", "AMD Pro 600"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 5200MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Radeon 700M integrated · up to 16GB Radeon RX"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "2× USB 3.2 Gen2 Type-C · 2× USB 3.2 Gen1 Type-A · Mic-in"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA (opt) · USB-A array · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E AX211"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "312 × 166 × 354 mm · 18 litres"],
              ["Weight", "7.59 kg"],
              ["Power", "Up to 500W ATX 80+ Bronze"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "dTPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "sff-am5-pro-ai",
        name: "Latios Pro AI SFF — AMD AM5",
        tag: "Ryzen 8000G AI · 8 litres",
        image: "/images/dp80-2.webp",
        gallery: SFF_GALLERY,
        heroImage: SFF_HERO,
        chips: ["Ryzen 7 8700G", "Ryzen AI", "8 litres"],
        stats: [
          ["8 L", "Chassis volume"],
          ["500W", "TFX 80+ PSU"],
          ["NPU", "Ryzen AI onboard"],
        ],
        intro:
          "The AI PC, shrunk: Ryzen 8000G neural processing and Radeon graphics in eight litres, with a card reader and speaker built in for frontline desks.",
        highlights: [
          "AMD Ryzen 7 8700G / 5 8600G / 5 8500G / 3 8300G",
          "AMD Pro 600 chipset",
          "2× DDR5 5200MHz, up to 64GB",
          "Card reader + built-in speaker",
        ],
        features: SFF_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "AMD Ryzen 7 8700G · Ryzen 5 8600G / 8500G · Ryzen 3 8300G"],
              ["Chipset", "AMD Pro 600"],
              ["Cooling", "Fan cooler"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 5200MHz U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 SSD (auto-switch) · 1× 2.5" HDD/SSD · 1× 3.5" HDD'],
              ["Graphics", "Up to 16GB AMD Radeon RX"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · SD/microSD reader · Headphone-out · Mic-in · ODD (opt)"],
              ["Rear I/O", "HDMI 2.1 (4K@60) · DisplayPort 1.4 · VGA (opt) · 5× USB-A · 1G LAN · 3× audio · Kensington · Padlock"],
              ["Network", "Intel I219-V 1G LAN · Wi-Fi 6E AX211 / Wi-Fi 6 + BT 5.2 options"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "95 × 296 × 330 mm · 8 litres"],
              ["Weight", "4.74 kg"],
              ["Power", "TFX 300W / 500W 80+ options"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "sff-b860-pro-ai",
        name: "Latios Pro AI SFF — Intel B860",
        tag: "Core Ultra · NPU · 128GB",
        image: "/images/dp80-1.webp",
        gallery: SFF_GALLERY,
        heroImage: SFF_HERO,
        chips: ["Core Ultra 9 285", "128GB DDR5", "Thunderbolt 4"],
        stats: [
          ["8 L", "Chassis volume"],
          ["128GB", "Max DDR5 memory"],
          ["40G", "Thunderbolt 4"],
        ],
        intro:
          "The flagship SFF: Intel Core Ultra with AI Boost NPU, up to 128GB of DDR5, Thunderbolt 4 and dual 2.5G LAN — a workstation's I/O in eight litres.",
        highlights: [
          "Intel Core Ultra 9 285 with AI Boost NPU",
          "Intel B860 chipset",
          "4× DDR5, up to 128GB",
          "Thunderbolt 4 · dual 2.5G LAN",
        ],
        features: SFF_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Core Ultra 9 285 · Ultra 7 265 · Ultra 5 245 / 235 / 225"],
              ["Chipset", "Intel B860"],
              ["AI engine", "Intel AI Boost NPU"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "4× DDR5 U-DIMM, up to 128GB"],
              ["Storage", '1× M.2 NVMe Gen5x4 · 1× M.2 NVMe Gen4x4 · 1× 2.5" · 1× 3.5"'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · SD/microSD reader · Headphone-out · Mic-in"],
              ["Rear I/O", "Thunderbolt 4 · 2× HDMI 2.1 · DisplayPort 1.4 · 3× USB 10Gbps · 2× USB 2.0 · COM · 2× 2.5G LAN · Kensington · Padlock"],
              ["Network", "2× Intel I226-V 2.5G LAN · Wi-Fi 7 BE200 / Wi-Fi 6E AX211"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "95 × 296 × 330 mm · 8 litres"],
              ["Weight", "4.74 kg"],
              ["Power", "TFX 300W / 500W 80+ options"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "sff-h810-pro-ai",
        name: "Latios Pro AI SFF — Intel H810",
        tag: "Core Ultra · NPU · 64GB",
        image: "/images/dp80-2.webp",
        gallery: SFF_GALLERY,
        heroImage: SFF_HERO,
        chips: ["Core Ultra 9 285", "64GB DDR5", "Dual 2.5G LAN"],
        stats: [
          ["8 L", "Chassis volume"],
          ["64GB", "Max DDR5 memory"],
          ["2.5G", "Dual LAN"],
        ],
        intro:
          "Core Ultra AI performance at the fleet-friendly tier: NPU acceleration, Gen5 storage, dual 2.5G networking and Wi-Fi 7 in the same compact footprint.",
        highlights: [
          "Intel Core Ultra 9 285 with AI Boost NPU",
          "Intel H810 chipset",
          "2× DDR5, up to 64GB",
          "Gen5 NVMe · dual 2.5G LAN",
        ],
        features: SFF_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Core Ultra 9 285 · Ultra 7 265 · Ultra 5 245 / 235 / 225"],
              ["Chipset", "Intel H810"],
              ["AI engine", "Intel AI Boost NPU"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 U-DIMM, up to 64GB"],
              ["Storage", '1× M.2 NVMe Gen5x4 · 1× M.2 NVMe Gen4x4 · 1× 2.5" · 1× 3.5"'],
              ["Graphics", "Up to NVIDIA RTX A4000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "1× USB 10Gbps Type-C · 2× USB 5Gbps Type-A · Card reader · Headphone-out · Mic-in · ODD (opt)"],
              ["Rear I/O", "2× HDMI 2.1 · DisplayPort 1.4 · 3× USB 10Gbps · 2× USB 2.0 · COM · 2× 2.5G LAN · Kensington · Padlock"],
              ["Network", "2× Intel I226-V 2.5G LAN · Wi-Fi 7 BE200 / Wi-Fi 6E AX211"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Dimensions", "95 × 296 × 330 mm · 8 litres"],
              ["Weight", "4.74 kg"],
              ["Power", "TFX 300W / 500W 80+ options"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Home / Pro · DOS"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "mff-dp10",
        name: "Latios Pro MFF — DP10 A14MG",
        tag: "1.1L Mini PC · VESA",
        image: "/images/dp10-1.webp",
        gallery: MFF_GALLERY,
        heroImage: MFF_HERO,
        chips: ["Core i7-14700", "1.1 litres", "Triple display"],
        stats: [
          ["1.1 L", "Chassis volume"],
          ["3", "Displays supported"],
          ["64GB", "Max DDR5 SO-DIMM"],
        ],
        intro:
          "A full Windows 11 Pro PC the size of a paperback: 14th Gen Core i7, triple-display output and dual 2.5G LAN, VESA-mounted behind any monitor.",
        highlights: [
          "Up to Intel Core i7-14700",
          "1.1-litre, VESA-mountable design",
          "Triple display · dual 2.5G LAN",
          "8× USB Type-A + 1× USB Type-C",
        ],
        features: MFF_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 14th Gen Core, up to Core i7-14700"],
              ["Cooling", "Active fan cooler"],
              ["AI", "AI engine software optimization"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "2× DDR5 SO-DIMM dual-channel, up to 64GB"],
              ["Storage", "M.2 NVMe SSD"],
              ["Graphics", "Intel UHD integrated"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["USB", "8× USB Type-A · 1× USB Type-C"],
              ["Displays", "HDMI 2.1 (4K@60) · DisplayPort 1.4b · configurable port (HDMI/DP/VGA/COM + LAN)"],
              ["Network", "Dual 2.5G LAN · Wi-Fi 7"],
            ],
          },
          {
            group: "Build",
            items: [
              ["Volume", "1.1 litres · VESA-mountable"],
              ["Extras", "Cable organizer · external power switch header"],
              ["Power", "External adapter"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "dTPM 2.0 · Kensington lock"],
              ["Software", "Latios Center · Power Meter"],
              ["OS", "Windows 11 Home / Pro"],
              ["Certified", "Military-grade tested"],
            ],
          },
        ],
      },
    ],
  },
  {
    kicker: "PROMAX AI Workstations",
    title: "When the work gets heavy.",
    blurb:
      "Four towers for engineering, AI and content creation — scaling from Core Ultra with a built-in NPU to Xeon W with 2TB of ECC memory and redundant 2700W power.",
    models: [
      {
        slug: "promax-q870",
        name: "PROMAX AI — Intel Q870",
        tag: "Core Ultra · NPU · 128GB",
        image: "/images/dp180-2.webp",
        gallery: MT_GALLERY,
        heroImage: PROMAX_HERO,
        chips: ["Core Ultra 9 285", "128GB DDR5", "RTX A6000"],
        stats: [
          ["128GB", "Max DDR5"],
          ["NPU", "Intel AI Boost"],
          ["A6000", "Graphics ready"],
        ],
        intro:
          "The entry to serious work: Core Ultra with an AI Boost NPU, four DIMM slots for 128GB of DDR5, and room for RTX A6000-class graphics.",
        highlights: [
          "Intel Core Ultra 9 285 with AI Boost NPU",
          "Intel Q870 chipset",
          "4× DDR5, up to 128GB",
          "Up to NVIDIA RTX A6000",
        ],
        features: PROMAX_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Core Ultra 200S series, up to Core Ultra 9 285"],
              ["Chipset", "Intel Q870"],
              ["AI engine", "Intel AI Boost NPU"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "4× DDR5 U-DIMM, up to 128GB"],
              ["Storage", "M.2 NVMe Gen5/Gen4 · SATA bays"],
              ["Graphics", "Up to NVIDIA RTX A6000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Front I/O", "USB-C · USB-A · audio"],
              ["Rear I/O", "HDMI · DisplayPort · USB 10Gbps array · dual LAN"],
              ["Network", "Dual LAN · Wi-Fi options"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Pro"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "promax-t2-w880",
        name: "PROMAX T2 AI — Intel W880",
        tag: "Core Ultra K · ECC",
        image: "/images/dp180-3.webp",
        gallery: MT_GALLERY,
        heroImage: PROMAX_HERO,
        chips: ["Core Ultra 9 285K", "256GB ECC", "Dual 2.5G LAN"],
        stats: [
          ["256GB", "Max DDR5 ECC"],
          ["285K", "Unlocked CPU"],
          ["40G", "USB-C bandwidth"],
        ],
        intro:
          "Unlocked Core Ultra K-series compute with ECC memory support and 40G USB-C — the sweet spot for AI development and serious content creation.",
        highlights: [
          "Up to Core Ultra 9 285K, unlocked",
          "Intel W880 chipset",
          "4× DDR5 5600 ECC/non-ECC, up to 256GB",
          "Dual 2.5G LAN · 40G USB-C",
        ],
        features: PROMAX_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Core Ultra 200K series, up to Core Ultra 9 285K"],
              ["Chipset", "Intel W880"],
              ["AI engine", "Intel AI Boost NPU"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "4× DDR5 5600 ECC / non-ECC, up to 256GB"],
              ["Storage", "M.2 NVMe Gen5/Gen4 · SATA bays · RAID"],
              ["Graphics", "Up to NVIDIA RTX A6000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Rear I/O", "40G USB-C · USB 10Gbps array · HDMI · DisplayPort"],
              ["Network", "Dual Intel 2.5G LAN"],
              ["Expansion", "PCIe Gen5 x16 slot"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Pro"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "promax-t2-w680",
        name: "PROMAX T2 — Intel W680",
        tag: "14th Gen K · 256GB",
        image: "/images/dp180-4.webp",
        gallery: MT_GALLERY,
        heroImage: PROMAX_HERO,
        chips: ["Core i9-14900K", "256GB ECC", "RTX A6000"],
        stats: [
          ["256GB", "Max DDR5 ECC"],
          ["14900K", "24-core CPU"],
          ["A6000", "Graphics ready"],
        ],
        intro:
          "Proven 14th Gen K-series power on the W680 workstation platform — ECC memory, RAID storage and pro graphics for engineering teams.",
        highlights: [
          "Up to Intel Core i9-14900K",
          "Intel W680 chipset",
          "4× DDR5 5600 ECC/non-ECC, up to 256GB",
          "Up to NVIDIA RTX A6000",
        ],
        features: PROMAX_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel 12th–14th Gen K series, up to Core i9-14900K"],
              ["Chipset", "Intel W680"],
              ["Cooling", "High-airflow fan cooling"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "4× DDR5 5600 ECC / non-ECC, up to 256GB"],
              ["Storage", "M.2 NVMe Gen5/Gen4 · SATA bays · RAID"],
              ["Graphics", "Up to NVIDIA RTX A6000"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Rear I/O", "USB 10Gbps array · HDMI · DisplayPort"],
              ["Network", "Dual LAN"],
              ["Expansion", "PCIe Gen5 x16 slot"],
            ],
          },
          {
            group: "Security & Software",
            items: [
              ["Security", "Hardware TPM 2.0 · Kensington · Padlock"],
              ["Software", "Latios Center · Latios Cloud Center"],
              ["OS", "Windows 11 Pro"],
              ["Certified", "BEE · ROHS · EPR · Military-grade"],
            ],
          },
        ],
      },
      {
        slug: "promax-t4-plus",
        name: "PROMAX T4 Plus — Intel W780",
        tag: "Xeon W · 2TB ECC",
        image: "/images/dp180-1.webp",
        gallery: MT_GALLERY,
        heroImage: PROMAX_HERO,
        chips: ["Xeon W-3400", "2TB ECC", "2700W redundant"],
        stats: [
          ["2TB", "Max DDR5 ECC"],
          ["Xeon W", "Up to 3400 series"],
          ["2700W", "Redundant PSU"],
        ],
        intro:
          "The flagship: Xeon W compute with eight DIMM slots of ECC memory, Blackwell-ready graphics power and redundant 2700W supplies for work that cannot stop.",
        highlights: [
          "Intel Xeon W-2400 / 3400 series",
          "8× DIMM DDR5 ECC, up to 2TB",
          "NVIDIA Blackwell / RTX A6000 ready",
          "1600–2700W redundant PSU",
        ],
        features: PROMAX_FEATURES,
        specGroups: [
          {
            group: "Processor",
            items: [
              ["CPU options", "Intel Xeon W-2400 / W-3400 series"],
              ["Chipset", "Intel W780"],
              ["Cooling", "High-static-pressure workstation cooling"],
            ],
          },
          {
            group: "Memory, Storage & Graphics",
            items: [
              ["Memory", "8× DDR5 ECC RDIMM, up to 2TB"],
              ["Storage", "Multiple M.2 NVMe Gen5 · SATA/SAS bays · RAID"],
              ["Graphics", "NVIDIA Blackwell / RTX A6000 class, multi-GPU ready"],
            ],
          },
          {
            group: "Connectivity",
            items: [
              ["Rear I/O", "USB 10Gbps/20Gbps array · dual LAN"],
              ["Expansion", "Multiple PCIe Gen5 x16 slots"],
              ["Management", "Out-of-band manageability options"],
            ],
          },
          {
            group: "Build & Power",
            items: [
              ["Power", "1600W – 2700W redundant 80+ PSU"],
              ["Chassis", "Full tower, lockable"],
              ["OS", "Windows 11 Pro for Workstations"],
            ],
          },
        ],
      },
    ],
  },
];

export const getModel = (slug) =>
  TOWERS_FAMILIES.flatMap((f) => f.models).find((m) => m.slug === slug);
