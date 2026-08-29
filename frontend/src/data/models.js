const MT_GALLERY = [
  "/images/dp180-1.webp",
  "/images/dp180-2.webp",
  "/images/dp180-3.webp",
];
const SFF_GALLERY = [
  "/images/dp80-1.webp",
  "/images/dp80-2.webp",
  "/images/dp80-3.webp",
  "/images/dp80-4.webp",
];
const MFF_GALLERY = ["/images/dp10-1.webp", "/images/dp10-2.webp"];

const MT_FEATURES = [
  {
    kicker: "Performance",
    heading: "Performance that keeps up with you",
    body: "Latest-generation processors, dual-channel memory and NVMe storage keep heavy multitasking instant — from sprawling spreadsheets to overnight render queues.",
    image: "/images/perf.webp",
  },
  {
    kicker: "Connectivity",
    heading: "A complete array of I/O",
    body: "Front USB-C and USB-A within easy reach; HDMI 2.1, DisplayPort, legacy VGA and PS/2 at the back. New docks and decade-old projectors both plug straight in.",
    image: "/images/io-right.webp",
  },
  {
    kicker: "Serviceability",
    heading: "Easy to upgrade design",
    body: "Quick access to memory, M.2, 2.5-inch and 3.5-inch bays means upgrades and servicing take minutes — keeping fleets current for years, not cycles.",
    image: "/images/easy.webp",
  },
  {
    kicker: "Security",
    heading: "Secure inside and out",
    body: "Hardware TPM 2.0 encryption, Kensington and padlock points, and Latios Center keeping hardware health visible to IT at all times.",
    image: "/images/chassis.webp",
  },
];

const SFF_FEATURES = [
  {
    kicker: "Design",
    heading: "Compact. Sleek. Powerful.",
    body: "Eight litres that disappear into any workspace — under the desk, behind the monitor, or standing slim beside it.",
    image: "/images/office.webp",
  },
  {
    kicker: "Placement",
    heading: "Versatile placement",
    body: "Position it vertically or horizontally; the chassis is designed to look deliberate either way, with thermals that cope with both.",
    image: "/images/versatile.webp",
  },
  {
    kicker: "Everyday",
    heading: "Speaker and card reader, built in",
    body: "Clear audio for calls and notifications, plus SD and microSD support up front — no dongles, no desk clutter.",
    image: "/images/speaker.webp",
  },
  {
    kicker: "Security",
    heading: "Secure inside and out",
    body: "Hardware TPM 2.0, chassis lock points and Latios Center diagnostics — small footprint, enterprise posture.",
    image: "/images/chassis.webp",
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
    image: "/images/triple.webp",
  },
  {
    kicker: "Detail",
    heading: "Cable organizer design",
    body: "The included cable organizer keeps connections locked and tidy, even in tight or vibration-prone installations.",
    image: "/images/cable.webp",
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
    image: "/images/ddr5.webp",
  },
  {
    kicker: "Workflow",
    heading: "Drive every display",
    body: "Multiple 4K outputs for design walls, review suites and control rooms — one machine, every screen.",
    image: "/images/display.webp",
  },
];

const MT_HERO = "/images/banner/banner-board-1.jpg";
const SFF_HERO = "/images/dp80kv.webp";
const MFF_HERO = "/images/dp10kv.jpg";
const PROMAX_HERO = "/images/rtx.jpg";

export const TOWERS_FAMILIES = [
  {
    kicker: "Business Desktops",
    image: "/images/ops.webp",
    title: "The MT · SFF · MFF family.",
    blurb:
      "Eleven configurations spanning micro-tower, small-form-factor and a 1.1-litre mini PC — from Ryzen 3 to Core Ultra 9, with Wi-Fi 6E/7, TPM 2.0 and tool-friendly upgrade paths.",
    models: [
      {
        slug: "mt-amd-am4",
        name: "Latios MT — AMD AM4",
        tag: "Ryzen 5000 · DDR4",
        image: "/images/dp180-1.webp",
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
        image: "/images/dp180-2.webp",
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
        image: "/images/dp180-2.webp",
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
    image: "/images/rtx.jpg",
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
        image: "/images/dp180-1.webp",
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
        image: "/images/dp180-2.webp",
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

const LAPTOP_FEATURES = [
  {
    kicker: "AI Performance",
    heading: "Core Ultra, with an NPU inside",
    body: "Every Latios laptop runs Intel Core Ultra with a dedicated AI engine — acceleration for the apps you already use, without draining the battery.",
    image: "/images/laptop-real-1.jpg",
  },
  {
    kicker: "Endurance",
    heading: "Rugged when it needs to be",
    body: "The Rugged series carries MIL-STD-810H and IP65 certification with sunlight-readable touchscreens — rail-ready, field-ready, monsoon-ready.",
    image: "/images/laptop-rugged.jpg",
  },
  {
    kicker: "Gaming",
    heading: "Archer: 300Hz of overkill",
    body: "The LTG540Z pairs Core Ultra 9 200HX with up to RTX 5080 graphics and a 2.5K Mini LED panel — 270W of OverBoost Ultra power, unleashed.",
    image: "/images/laptop-archer.jpg",
  },
];

const AUDIO_FEATURES = [
  {
    kicker: "Voice",
    heading: "Hear everyone. Clearly.",
    body: "Full-duplex HD voice with echo and noise cancellation and 360° microphone arrays — every seat at the table is heard.",
    image: "/images/av-sp50.jpg",
  },
  {
    kicker: "All-in-one",
    heading: "Camera, mics and speaker in one bar",
    body: "Video soundbars with 4K optics, 5X zoom, AI framing and beamforming mic arrays — one cable turns any screen into a conference room.",
    image: "/images/av-soundbar.jpg",
  },
  {
    kicker: "Scale",
    heading: "From huddle room to boardroom",
    body: "The HPS host-participant system scales to 200 units with capacitive touch controls and 5-band EQ — structured discussion, zero chaos.",
    image: "/images/av-hps.jpg",
  },
];

const VIDEO_FEATURES = [
  {
    kicker: "Clarity",
    heading: "4K as the baseline",
    body: "From 19.5-inch desk monitors to 110-inch large-format walls, every Latios panel is anti-glare, wide-viewing and colour-honest.",
    image: "/images/av-monitor.jpg",
  },
  {
    kicker: "Intelligence",
    heading: "Cameras that follow the room",
    body: "PTZ cameras with AI tracking and auto-framing keep the speaker centred — HDMI, SDI, USB and LAN outputs drop into any rig.",
    image: "/images/av-ptz.jpg",
  },
  {
    kicker: "Interaction",
    heading: "Touch. Share. Create.",
    body: "Interactive flat panels with wireless screen sharing, toughened anti-glare glass and Windows / Android / OPS flexibility.",
    image: "/images/av-ifp.jpg",
  },
];

export const LAPTOPS_FAMILY = {
  kicker: "Mobile Computing",
  title: "Laptops that earn their keep.",
  blurb:
    "Three machines for three kinds of days — the PRO AI for business, the Rugged for the field, and the Archer for everything that needs 300 frames per second.",
  models: [
    {
      slug: "pro-ai-laptop-14",
      name: "Latios PRO AI Laptop — 14\u2033",
      tag: "LTB244X · Core Ultra AI",
      image: "/images/laptop-pro14.jpg",
      gallery: ["/images/laptop-pro14.jpg", "/images/laptops-hero.jpg"],
      heroImage: "/images/laptops-hero.jpg",
      chips: ["Core Ultra AI", "64GB DDR5", "Thunderbolt"],
      stats: [
        ["14\u2033", "Business display"],
        ["64GB", "Max DDR5 memory"],
        ["150W", "USB-C PD charging"],
      ],
      intro:
        "The everyday flagship: lightweight design, heavy performance — Core Ultra AI processing, up to 64GB of DDR5 and dual SSDs in a 14-inch frame.",
      highlights: [
        "Intel Core Ultra AI power",
        "Windows 11 ready",
        "Up to 64GB DDR5 memory",
        "Dual SSD — up to 2TB storage",
      ],
      features: LAPTOP_FEATURES,
      specGroups: [
        {
          group: "Performance",
          items: [
            ["Processor", "Intel Core Ultra with AI NPU"],
            ["Memory", "Up to 64GB DDR5"],
            ["Storage", "Dual SSD, up to 2TB"],
          ],
        },
        {
          group: "Connectivity & Power",
          items: [
            ["Charging", "USB-C PD up to 150W"],
            ["Ports", "Thunderbolt · USB-C · USB-A"],
            ["OS", "Windows 11 ready"],
          ],
        },
      ],
    },
    {
      slug: "rugged-laptop-14",
      name: "Latios Rugged Laptop — 14\u2033",
      tag: "MIL-STD-810H · IP65",
      image: "/images/laptop-rugged.jpg",
      gallery: ["/images/laptop-rugged.jpg", "/images/laptops-hero.jpg"],
      heroImage: "/images/laptops-hero.jpg",
      chips: ["Core Ultra", "IP65", "Touchscreen"],
      stats: [
        ["810H", "MIL-STD certified"],
        ["IP65", "Dust & water proof"],
        ["14\u2033", "FHD touchscreen"],
      ],
      intro:
        "AI power, rail-ready tough: a Windows AI laptop certified to MIL-STD-810H and IP65, built for sites, plants and fields — not just desks.",
      highlights: [
        "Intel Core Ultra AI processor",
        "Windows 11 Pro",
        "MIL-STD-810H | IP65 certified",
        "14\u2033 / 15.6\u2033 FHD touchscreen",
      ],
      features: LAPTOP_FEATURES,
      specGroups: [
        {
          group: "Performance",
          items: [
            ["Processor", "Intel Core Ultra AI"],
            ["Graphics", "Intel Arc / Xe"],
            ["OS", "Windows 11 Pro"],
          ],
        },
        {
          group: "Durability",
          items: [
            ["Certification", "MIL-STD-810H · IP65"],
            ["Display", '14" / 15.6" FHD touchscreen'],
            ["Use case", "Rail, field and industrial sites"],
          ],
        },
      ],
    },
    {
      slug: "archer-ltg540z",
      name: "Latios Archer — LTG540Z",
      tag: "16\u2033 2.5K 300Hz · up to RTX 5080",
      image: "/images/laptop-archer-1.webp",
      gallery: [
        "/images/laptop-archer-1.webp",
        "/images/laptop-archer-2.webp",
        "/images/laptop-archer-3.webp",
        "/images/laptop-archer-4.webp",
      ],
      heroImage: "/images/laptop-archer.jpg",
      chips: ["Ultra 9 200HX", "RTX 5080", "300Hz Mini LED"],
      stats: [
        ["300Hz", "2.5K Mini LED"],
        ["270W", "OverBoost Ultra"],
        ["5080", "Max RTX graphics"],
      ],
      intro:
        "Unleash absolute power: Intel Core Ultra 9 200HX, up to NVIDIA RTX 5080 and a 16-inch 2.5K Mini LED at 300Hz — 270W of combined OverBoost Ultra muscle.",
      highlights: [
        "Intel Core Ultra 9 200HX series",
        "NVIDIA RTX 5050 → 5080 options",
        '16" 2.5K Mini LED · 300Hz · 500 nits',
        "Max 270W CPU+GPU OverBoost Ultra",
      ],
      features: LAPTOP_FEATURES,
      specGroups: [
        {
          group: "Performance",
          items: [
            ["Processor", "Intel Core Ultra 9 200HX series"],
            ["Graphics", "NVIDIA RTX 5050 / 5060 / 5070 / 5070 Ti / 5080"],
            ["Power", "Max 270W CPU + GPU (OverBoost Ultra)"],
          ],
        },
        {
          group: "Display & OS",
          items: [
            ["Panel", '16" 2.5K Mini LED, 300Hz, 500 nits'],
            ["OS", "Windows 11 (Pro recommended)"],
          ],
        },
      ],
    },
  ],
};

export const AUDIO_FAMILY = {
  kicker: "Smart Audio & Collaboration",
  title: "Every voice, crystal clear.",
  blurb:
    "Speakerphones, video soundbars and full discussion systems — conference audio that makes remote feel local.",
  models: [
    {
      slug: "sp50-speakerphone",
      name: "Latios PRO SP-50 — Speakerphone",
      tag: "360° mic · 5400mAh",
      image: "/images/av-sp50.jpg",
      gallery: ["/images/av-sp50.jpg", "/images/audio-hero.jpg"],
      heroImage: "/images/audio-hero.jpg",
      chips: ["Full-duplex HD", "360° mic array", "Bluetooth"],
      stats: [
        ["360°", "Microphone array"],
        ["5400", "mAh battery"],
        ["HD", "Full-duplex voice"],
      ],
      intro:
        "Hear everyone, clearly: a full-duplex HD speakerphone with echo and noise cancellation, a 360° mic array and a battery that outlasts the longest offsite.",
      highlights: [
        "Full-duplex HD voice",
        "Echo & noise cancellation",
        "5400mAh battery",
        "USB · Bluetooth · LINE IN/OUT",
      ],
      features: AUDIO_FEATURES,
      specGroups: [
        {
          group: "Audio",
          items: [
            ["Voice", "Full-duplex HD"],
            ["Processing", "Echo & noise cancellation"],
            ["Microphones", "360° mic array"],
          ],
        },
        {
          group: "Connectivity & Power",
          items: [
            ["Interfaces", "USB · Bluetooth · LINE IN/OUT"],
            ["Battery", "5400mAh"],
          ],
        },
      ],
    },
    {
      slug: "pro-video-soundbar",
      name: "Latios PRO — Video Soundbar",
      tag: "4K · Speaker tracking",
      image: "/images/av-soundbar.jpg",
      gallery: ["/images/av-soundbar.jpg", "/images/audio-hero.jpg"],
      heroImage: "/images/audio-hero.jpg",
      chips: ["4K UHD", "120° FOV", "5X zoom"],
      stats: [
        ["4K", "Ultra HD camera"],
        ["120°", "Field of view"],
        ["4", "Mic array"],
      ],
      intro:
        "See it, hear it, feel it: a 4K conference bar with speaker tracking, a 4-mic beamforming array and a room-filling speaker in one elegant bar.",
      highlights: [
        "4K Ultra HD camera",
        "120° FOV · 5X zoom",
        "Speaker tracking",
        "Built-in 4-mic array & speaker",
      ],
      features: AUDIO_FEATURES,
      specGroups: [
        {
          group: "Video",
          items: [
            ["Camera", "4K Ultra HD"],
            ["Optics", "120° FOV · 5X zoom"],
            ["Intelligence", "Speaker tracking"],
          ],
        },
        {
          group: "Audio",
          items: [
            ["Microphones", "Built-in 4-mic array"],
            ["Speaker", "Integrated, room-filling"],
          ],
        },
      ],
    },
    {
      slug: "video-soundbar-4k",
      name: "Latios 4K — Video Soundbar",
      tag: "4K · AI auto framing",
      image: "/images/av-soundbar4k.jpg",
      gallery: ["/images/av-soundbar4k.jpg", "/images/audio-hero.jpg"],
      heroImage: "/images/audio-hero.jpg",
      chips: ["4K UHD", "AI framing", "120° FOV"],
      stats: [
        ["4K", "Ultra HD camera"],
        ["AI", "Auto framing"],
        ["5X", "Zoom"],
      ],
      intro:
        "4K vision, immersive sound: AI auto framing keeps everyone in the shot while the 4-mic array keeps everyone in the conversation.",
      highlights: [
        "4K Ultra HD camera",
        "5X zoom · AI auto framing",
        "Built-in 4-mic array & speaker",
        "120° field of view",
      ],
      features: AUDIO_FEATURES,
      specGroups: [
        {
          group: "Video",
          items: [
            ["Camera", "4K Ultra HD"],
            ["Optics", "5X zoom · 120° FOV"],
            ["Intelligence", "AI auto framing"],
          ],
        },
        {
          group: "Audio",
          items: [
            ["Microphones", "Built-in 4-mic array"],
            ["Speaker", "Integrated"],
          ],
        },
      ],
    },
    {
      slug: "hps-controller",
      name: "Latios HPS — Conference System",
      tag: "Host-participant · 200 units",
      image: "/images/av-hps.jpg",
      gallery: ["/images/av-hps.jpg", "/images/audio-hero.jpg"],
      heroImage: "/images/audio-hero.jpg",
      chips: ["200 units", "5-band EQ", "Touch control"],
      stats: [
        ["200", "Max units"],
        ["5", "Band EQ"],
        ["Touch", "Capacitive controls"],
      ],
      intro:
        "The boardroom conductor: a host-participant discussion system with a built-in loudspeaker, 5-band EQ and capacitive touch — scaling to 200 units.",
      highlights: [
        "Up to 60 units supported",
        "Up to 200 with ext. processor",
        "5-band EQ adjustment",
        "Built-in loudspeaker · touch buttons",
      ],
      features: AUDIO_FEATURES,
      specGroups: [
        {
          group: "System",
          items: [
            ["Capacity", "60 units · 200 with ext. processor"],
            ["Controls", "Capacitive touch buttons"],
          ],
        },
        {
          group: "Audio",
          items: [
            ["EQ", "5-band adjustment"],
            ["Speaker", "Built-in loudspeaker"],
          ],
        },
      ],
    },
  ],
};

export const VIDEO_FAMILY = {
  kicker: "Smart Display & Visual",
  title: "Pixels with purpose.",
  blurb:
    "Desk monitors, boardroom panels, 110-inch walls and the cameras that tie the room together.",
  models: [
    {
      slug: "pro-web-camera",
      name: "Latios PRO — Web Camera",
      tag: "1080p · Plug & play",
      image: "/images/av-webcam.jpg",
      gallery: ["/images/av-webcam.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ["1080p30", "85° wide", "USB plug & play"],
      stats: [
        ["1080p", "30fps video"],
        ["85°", "Wide-angle lens"],
        ["USB", "Plug & play"],
      ],
      intro:
        "Clear video, simple setup: Full HD optics, a high-quality CMOS sensor and a built-in stereo mic — plug in one USB cable and look professional.",
      highlights: [
        "Full HD 1080p @ 30fps",
        "High-quality CMOS sensor",
        "Built-in stereo mic",
        "85° wide-angle · USB 2.0 plug & play",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Video",
          items: [
            ["Resolution", "Full HD 1080p @ 30fps"],
            ["Sensor", "High-quality CMOS"],
            ["Lens", "85° wide-angle with zoom"],
          ],
        },
        {
          group: "Audio & Connectivity",
          items: [
            ["Microphone", "Built-in stereo"],
            ["Interface", "USB 2.0 plug & play"],
          ],
        },
      ],
    },
    {
      slug: "pro-ptz-camera",
      name: "Latios PRO — PTZ Camera",
      tag: "AI tracking · 1080p60",
      image: "/images/av-ptz.jpg",
      gallery: ["/images/av-ptz.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ["1080p60", "AI tracking", "HDMI · SDI · LAN"],
      stats: [
        ["60fps", "Full HD video"],
        ["AI", "Tracking & framing"],
        ["4", "Output interfaces"],
      ],
      intro:
        "Intelligent tracking, broadcast precision: a 1/2.8-inch CMOS PTZ with AI framing that follows the speaker — HDMI, SDI, USB and LAN onboard.",
      highlights: [
        "Full HD 1080p @ 60fps",
        '1/2.8" CMOS image sensor',
        "AI tracking & framing",
        "HDMI · SDI · USB · LAN",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Video",
          items: [
            ["Resolution", "Full HD 1080p @ 60fps"],
            ["Sensor", '1/2.8" CMOS'],
            ["Intelligence", "AI tracking & framing"],
          ],
        },
        {
          group: "Connectivity",
          items: [
            ["Outputs", "HDMI · SDI · USB · LAN"],
            ["Audio", "External audio input"],
          ],
        },
      ],
    },
    {
      slug: "pro-monitor",
      name: "Latios PRO — Monitor",
      tag: '19.5\u2033 – 32\u2033 · up to 4K',
      image: "/images/av-monitor.jpg",
      gallery: ["/images/av-monitor.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ["Up to 4K", "IPS / VA", "High refresh"],
      stats: [
        ["4K", "Max resolution"],
        ['32\u2033', "Max size"],
        ["IPS", "Panel options"],
      ],
      intro:
        "Designed for everyday performance: from 19.5 to 32 inches, FHD to 4K, IPS or VA — a Latios PRO monitor for every desk in the building.",
      highlights: [
        "19.5 / 21.5 / 23.8 / 27 / 32 inch",
        "Full HD / QHD / 4K resolution",
        "IPS / VA panel options",
        "HDMI · DP · USB connectivity",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Panel",
          items: [
            ["Sizes", '19.5" · 21.5" · 23.8" · 27" · 32"'],
            ["Resolution", "FHD / QHD / 4K"],
            ["Technology", "IPS / VA · high refresh rate"],
          ],
        },
        {
          group: "Connectivity",
          items: [["Inputs", "HDMI · DisplayPort · USB"]],
        },
      ],
    },
    {
      slug: "in-series-lfd",
      name: "Latios IN-Series — Large Format",
      tag: '43\u2033 – 110\u2033 · 4K UHD',
      image: "/images/av-lfd.jpg",
      gallery: ["/images/av-lfd.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ['110\u2033 max', "4K UHD", "Anti-glare"],
      stats: [
        ['110\u2033', "Max panel size"],
        ["4K", "Ultra HD"],
        ["24/7", "Signage ready"],
      ],
      intro:
        "Big screens, bigger impact: ultra-large 4K UHD panels with anti-glare wide viewing in a slim industrial design — built for digital signage and venues.",
      highlights: [
        "43 / 55 / 65 / 75 / 86 / 98 / 110 inch",
        "Ultra-large 4K UHD panel",
        "Anti-glare wide viewing",
        "Ideal for digital signage",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Panel",
          items: [
            ["Sizes", '43" → 110"'],
            ["Resolution", "4K UHD"],
            ["Surface", "Anti-glare · wide viewing angle"],
          ],
        },
        {
          group: "Deployment",
          items: [
            ["Design", "Slim industrial"],
            ["Use case", "Digital signage · venues"],
          ],
        },
      ],
    },
    {
      slug: "pro-ifp",
      name: "Latios PRO — Interactive Panel",
      tag: '55\u2033 – 110\u2033 · Touch',
      image: "/images/av-ifp.jpg",
      gallery: ["/images/av-ifp.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ["Touch UHD", "Wireless share", "Win / Android / OPS"],
      stats: [
        ["Touch", "UHD interactive"],
        ["20", "Point multi-touch"],
        ["OPS", "Slot ready"],
      ],
      intro:
        "Touch, collaborate, create: an Ultra HD interactive panel with wireless screen sharing and toughened anti-glare glass — Windows, Android or OPS.",
      highlights: [
        "55 / 65 / 75 / 86 / 98 / 110 inch",
        "Ultra HD interactive display",
        "Wireless screen sharing",
        "Windows / Android / OPS ready",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Panel",
          items: [
            ["Sizes", '55" → 110"'],
            ["Resolution", "Ultra HD interactive"],
            ["Glass", "Anti-glare toughened"],
          ],
        },
        {
          group: "Collaboration",
          items: [
            ["Sharing", "Wireless screen sharing"],
            ["Platform", "Windows / Android / OPS"],
          ],
        },
      ],
    },
    {
      slug: "active-led",
      name: "Latios Active LED — Display",
      tag: "Seamless · Modular",
      image: "/images/av-led.jpg",
      gallery: ["/images/av-led.jpg", "/images/video-hero.jpg"],
      heroImage: "/images/video-hero.jpg",
      chips: ["Seamless", "High refresh", "Modular"],
      stats: [
        ["0", "Visible bezels"],
        ["HDR", "Deep contrast"],
        ["Modular", "Any size"],
      ],
      intro:
        "Brilliance without borders: seamless large-scale LED with high refresh visuals and vivid contrast — modular panels for auditoriums and venues.",
      highlights: [
        "Seamless large-scale display",
        "High refresh rate visuals",
        "Vivid colors & deep contrast",
        "Modular, flexible design",
      ],
      features: VIDEO_FEATURES,
      specGroups: [
        {
          group: "Panel",
          items: [
            ["Design", "Seamless · modular · flexible"],
            ["Visuals", "High refresh · vivid colors · deep contrast"],
          ],
        },
        {
          group: "Deployment",
          items: [["Use case", "Auditoriums · venues · large venues"]],
        },
      ],
    },
  ],
};

const ALL_FAMILIES = [...TOWERS_FAMILIES, LAPTOPS_FAMILY, AUDIO_FAMILY, VIDEO_FAMILY];
[
  [TOWERS_FAMILIES, "towers"],
  [[LAPTOPS_FAMILY], "laptops"],
  [[AUDIO_FAMILY], "audio"],
  [[VIDEO_FAMILY], "video"],
].forEach(([fams, cat]) => fams.forEach((f) => f.models.forEach((m) => (m.category = cat))));

export const getModel = (slug) =>
  ALL_FAMILIES.flatMap((f) => f.models).find((m) => m.slug === slug);

export const getCategoryModels = (cat) =>
  ALL_FAMILIES.flatMap((f) => f.models).filter((m) => m.category === cat);

export const ALL_MODELS = ALL_FAMILIES.flatMap((f) => f.models);

/**
 * CPU platform a model is built on — used to browse the Ryzen and Intel ranges
 * separately on the category pages. Derived from the model's own name/tag/chips
 * rather than a hand-maintained field, so a newly added SKU is classified without
 * a second edit. Returns "amd" | "intel" | null (null = not a CPU product, e.g.
 * the audio and video lines).
 */
export const getVendor = (m) => {
  const hay = `${m.name} ${m.tag} ${(m.chips || []).join(" ")}`.toLowerCase();
  if (/\b(ryzen|amd|am4|am5)\b/.test(hay)) return "amd";
  if (/\b(intel|core|xeon|h610|h810|b860|q670|q870|w680|w780|w880)\b/.test(hay)) return "intel";
  return null;
};

export const VENDOR_LABELS = { amd: "AMD Ryzen", intel: "Intel Core" };
export const DATASHEETS = {
  "mt-amd-am4": "/datasheets/mt-amd-am4.pdf",
  "mt-h610-ddr4": "/datasheets/mt-h610-ddr4.pdf",
  "mt-h610-ddr5": "/datasheets/mt-h610-ddr5.pdf",
  "mt-pro-h610-ddr5": "/datasheets/mt-pro-h610-ddr5.pdf",
  "mt-q670-ddr5": "/datasheets/mt-q670-ddr5.pdf",
  "sff-h610-ddr5": "/datasheets/sff-h610-ddr5.pdf",
  "mt-am5-pro-ai": "/datasheets/mt-am5-pro-ai.pdf",
  "sff-am5-pro-ai": "/datasheets/sff-am5-pro-ai.pdf",
  "sff-b860-pro-ai": "/datasheets/sff-b860-pro-ai.pdf",
  "sff-h810-pro-ai": "/datasheets/sff-h810-pro-ai.pdf",
  "promax-q870": "/datasheets/promax-q870.pdf",
  "promax-t2-w880": "/datasheets/promax-t2-w880.pdf",
  "promax-t2-w680": "/datasheets/promax-t2-w680.pdf",
  "promax-t4-plus": "/datasheets/promax-t4-plus.pdf",
};
