import { TOWERS_FAMILIES } from "./models";

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export const CATEGORIES = [
  {
    slug: "laptops",
    index: "01",
    name: "Laptops",
    model: "Latios Book 16",
    title: ["WORK,", "UNPLUGGED."],
    tagline: "Flagship compute that disappears into a carry-on.",
    hero: U("photo-1517336714731-489689fd1ca8"),
    intro:
      "A 16-inch mobile workstation milled from a single billet of aluminium. Desktop-class silicon, all-day silence, and a display that tells the truth.",
    chapters: [
      {
        n: "01",
        kicker: "Chassis",
        heading: "CNC-milled, not assembled",
        body: "Every Book 16 begins as a solid block of 6000-series aluminium. Two hours of machining leave a unibody with zero flex, invisible seams, and a finish that shrugs off a decade of travel.",
        image: U("photo-1611078489935-0cb964de46d6"),
      },
      {
        n: "02",
        kicker: "Thermals",
        heading: "Silence under full load",
        body: "A full-width vapor chamber and dual counter-rotating fans move heat without moving air you can hear. Sustained 55W CPU load at under 24 decibels — quieter than the room you're sitting in.",
        image: U("photo-1496181133206-80ce9b88a853"),
      },
      {
        n: "03",
        kicker: "Display",
        heading: "A screen that tells the truth",
        body: "4K OLED at 120Hz, factory-calibrated to ΔE < 1 across 100% of DCI-P3. What you grade in the field is what ships. No surprises in the edit suite.",
        image: U("photo-1531297484001-80022131f5a1"),
      },
    ],
    specs: [
      ["Processor", "Core Ultra 9 / Ryzen AI 9"],
      ["Graphics", "RTX 5070 Laptop, 12GB"],
      ["Display", '16" 4K 120Hz OLED, ΔE<1'],
      ["Battery", "99.9Wh — up to 18 hours"],
      ["Memory", "Up to 64GB LPDDR5X"],
      ["Weight", "1.6 kg, 14.9 mm thin"],
      ["Security", "TPM 2.0 + IR presence lock"],
      ["Wireless", "Wi-Fi 7 + BT 5.4"],
    ],
  },
  {
    slug: "towers",
    index: "02",
    name: "Towers",
    model: "Latios MT Series",
    title: ["BUSINESS,", "UNSTOPPABLE."],
    tagline: "Be your window to the world.",
    hero: P("7858769"),
    intro:
      "The Latios desktop range: six business MT and SFF configurations from Ryzen 3 to Core i9, and four PROMAX AI workstations scaling up to Xeon W with 2TB of ECC memory — every one tool-friendly, TPM-secured and built to be opened, not replaced.",
    chapters: [
      {
        n: "01",
        kicker: "Compute",
        heading: "From Ryzen 3 to Core i9",
        body: "Choose AMD AM4 with Ryzen 5000G graphics onboard, Intel H610 or Q670 with up to 14th Gen Core i9, or the Pro AI edition on AM5 with Ryzen 8000G neural processing. One chassis, five ways to work.",
        image: "/images/office.png",
      },
      {
        n: "02",
        kicker: "Connectivity",
        heading: "Every port you'll ever need",
        body: "Two front USB-C Gen 2, USB-A and mic-in up front. HDMI 2.1 with 4K@60, DisplayPort 1.4, optional VGA, gigabit LAN, PS/2 and triple audio jacks at the back — plus Wi-Fi 6E for cable-free fleets.",
        image: "/images/ops.jpg",
      },
      {
        n: "03",
        kicker: "Security & Software",
        heading: "TPM 2.0 meets Latios Center",
        body: "Firmware TPM 2.0 encryption, Kensington and padlock points, military-grade certified durability. Latios Center monitors hardware, frees memory and recovers the system; Latios Cloud Center syncs and shares files across your team.",
        image: "/images/home-setup.png",
      },
    ],
    specs: [
      ["Desktops", "MT + SFF · Ryzen 3 → Core i9"],
      ["Workstations", "PROMAX · Core Ultra → Xeon W"],
      ["Memory", "Up to 2TB DDR5 ECC (T4 Plus)"],
      ["Graphics", "Up to RTX A6000 / Blackwell"],
      ["Storage", "Gen5 NVMe + RAID options"],
      ["Network", "Wi-Fi 6E · Dual 2.5G LAN"],
      ["Power", "300W → 2700W redundant"],
      ["Security", "HW TPM 2.0 · Kensington"],
    ],
    families: TOWERS_FAMILIES,
  },

  {
    slug: "audio",
    index: "03",
    name: "Audio",
    model: "Latios Pulse",
    title: ["HEAR", "EVERYTHING."],
    tagline: "Reference sound for people who listen for a living.",
    hero: P("9154411"),
    intro:
      "Beryllium drivers tuned by hand in an anechoic chamber. Silence engineered to -48dB. From the boardroom to the broadcast booth, nothing gets past you.",
    chapters: [
      {
        n: "01",
        kicker: "Drivers",
        heading: "Tuned by hand, not algorithm",
        body: "Each 50mm beryllium driver is measured, matched to its pair within 0.5dB, and signed off by an engineer — not a curve on a spreadsheet.",
        image: U("photo-1505740420928-5e560c06d30e"),
      },
      {
        n: "02",
        kicker: "Isolation",
        heading: "Silence, engineered",
        body: "Eight microphones sample the room 48,000 times a second. Jet cabins, open offices, server halls — all of it drops to a library hush at the flip of a switch.",
        image: U("photo-1608043152269-423dbba4e7e1"),
      },
      {
        n: "03",
        kicker: "Versatility",
        heading: "Boardroom to broadcast",
        body: "A beamforming mic array tuned for speech intelligibility, lossless wireless for the mix, and a 60-hour battery that outlasts the longest production week.",
        image: U("photo-1590658268037-6bf12165a8df"),
      },
    ],
    specs: [
      ["Driver", "50mm beryllium, hand-matched"],
      ["ANC", "Adaptive, up to -48 dB"],
      ["Battery", "60 hours, 10-min = 5h"],
      ["Codecs", "LDAC + aptX Lossless"],
      ["Microphones", "8-mic beamforming array"],
      ["Weight", "254 g, memory-foam"],
      ["Connection", "BT 5.4, USB-C, 3.5mm"],
      ["Warranty", "3-year, advance swap"],
    ],
  },
  {
    slug: "video",
    index: "04",
    name: "Video",
    model: "Latios Vision",
    title: ["SEE", "THE DETAIL."],
    tagline: "Displays and cameras that never miss a frame.",
    hero: U("photo-1593640408182-31c70c8268f5"),
    intro:
      'A 32-inch 6K reference display calibrated at the factory and a 4K AI camera that tracks the room — one cable carries power, pixels and data.',
    chapters: [
      {
        n: "01",
        kicker: "Panel",
        heading: "Color you can grade on",
        body: "6K IPS Black with 99% DCI-P3 coverage, hardware LUT calibration and ΔE < 1 out of the box. Client-approved color, straight from the shipping carton.",
        image: U("photo-1527443224154-c4a3942d3acf"),
      },
      {
        n: "02",
        kicker: "Optics",
        heading: "Glass, not plastic",
        body: "An 8-element all-glass lens in front of a 1-inch sensor. 4K60 with optical-grade clarity that makes the boardroom feel like a studio.",
        image: U("photo-1516035069371-29a1b244cc32"),
      },
      {
        n: "03",
        kicker: "Connectivity",
        heading: "One cable. Everything.",
        body: "Thunderbolt 4 carries 6K video, 96W of power, gigabit ethernet and your entire desk of peripherals through a single connector.",
        image: U("photo-1502920917128-1aa500764cbd"),
      },
    ],
    specs: [
      ["Panel", '32" 6K IPS Black, 120Hz'],
      ["Color", "99% DCI-P3, ΔE < 1"],
      ["HDR", "DisplayHDR 1000"],
      ["Camera", "4K60 AI auto-framing PTZ"],
      ["Calibration", "Hardware 3D LUT"],
      ["Hub", "TB4, 96W PD, 2.5GbE"],
      ["Stand", "Height, tilt, pivot"],
      ["Warranty", "3-year zero-dead-pixel"],
    ],
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);

export const nextCategory = (slug) => {
  const i = CATEGORIES.findIndex((c) => c.slug === slug);
  return CATEGORIES[(i + 1) % CATEGORIES.length];
};
