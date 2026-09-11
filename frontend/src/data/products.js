import {
  DESKTOP_FAMILIES, WORKSTATION_FAMILIES,
  LAPTOPS_FAMILY, AUDIO_FAMILY, VIDEO_FAMILY,
} from "./models";
import {
  TAXONOMY, walkTaxonomy, TAXONOMY_SLUGS, bucketsFor, SUBCATS,
} from "./taxonomy";

export { TAXONOMY, walkTaxonomy, TAXONOMY_SLUGS, bucketsFor, SUBCATS };

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export const CATEGORIES = [
  {
    slug: "laptops",
    index: "01",
    name: "Laptops",
    model: "Latios Mobile Series",
    title: ["WORK,", "UNPLUGGED."],
    tagline: "Business and gaming — engineered in India.",
    hero: "/images/laptops-hero.jpg",
    intro:
      "Two ways to go mobile: the PRO 14 for business — Intel or AMD Ryzen AI in 1.5 kg of aluminium — and the Archer LTG540Z when 300Hz is the minimum acceptable. A notebook joins them soon.",
    chapters: [
      {
        n: "01",
        kicker: "Business",
        heading: "PRO 14: aluminium, and a choice of silicon",
        body: "A 14-inch 2880×1800 120Hz display, a 180° hinge and 1.5 kg, with Intel Core or AMD Ryzen inside — up to Ryzen AI 300 with 50+ TOPS for Copilot+.",
        image: "/images/laptops/pro14/hero.webp",
      },
      {
        n: "02",
        kicker: "Gaming",
        heading: "Archer: 300Hz of overkill",
        body: "The LTG540Z pairs Core Ultra 9 200HX with up to RTX 5080 graphics and a 2.5K Mini LED panel — 270W of OverBoost Ultra power, unleashed.",
        image: "/images/laptop-archer.jpg",
      },
    ],
    specs: [
      ["Range", 'PRO 14" · Archer 16"'],
      ["Processors", "AMD Ryzen AI 300 · Ryzen 8040 · Intel Core · Core Ultra 9 (Archer)"],
      ["Graphics", "Radeon 860M / 780M · Iris Xe · RTX 5050 → 5080 (Archer)"],
      ["Display", '14" 2.8K 120Hz → 16" 2.5K Mini LED 300Hz'],
      ["Memory", "DDR5 (PRO 14: up to 32GB)"],
      ["Wireless", "Wi-Fi 6E (PRO 14)"],
      ["Build", "PRO 14: 1.5 kg, aluminium, 180° hinge"],
    ],
    families: [LAPTOPS_FAMILY],
  },
  {
    slug: "desktops",
    index: "02",
    name: "Desktops",
    model: "Latios MT · SFF · MFF",
    title: ["BUSINESS,", "UNSTOPPABLE."],
    tagline: "Be your window to the world.",
    hero: "/images/latios-mt.jpg",
    intro:
      "Eleven commercial configurations across three chassis — the 18-litre micro tower, the eight-litre small form factor and the DP10 mini PC — from Ryzen 3 to Core i9. Every one tool-friendly, TPM-secured and built to be opened, not replaced.",
    chapters: [
      {
        n: "01",
        kicker: "Compute",
        heading: "From Ryzen 3 to Core i9",
        body: "Choose AMD AM4 with Ryzen 5000G graphics onboard, Intel H610 or Q670 with up to 14th Gen Core i9, or the Pro AI edition on AM5 with Ryzen 8000G neural processing. Three chassis, eleven ways to work.",
        image: "/images/office.webp",
      },
      {
        n: "02",
        kicker: "Connectivity",
        heading: "Every port you'll ever need",
        body: "Front USB-C Gen 2, USB-A and mic-in up front. HDMI 2.1 with 4K@60, DisplayPort 1.4, optional VGA, gigabit LAN and triple audio jacks at the back — plus Wi-Fi 6E for cable-free fleets.",
        image: "/images/ops.webp",
      },
      {
        n: "03",
        kicker: "Security & Software",
        heading: "TPM 2.0 meets Latios Center",
        body: "Firmware TPM 2.0 encryption, Kensington and padlock points, military-grade certified durability. Latios Center monitors hardware, frees memory and recovers the system; Latios Cloud Center syncs and shares files across your team.",
        image: "/images/home-setup.webp",
      },
    ],
    specs: [
      ["Range", "Micro tower · SFF · Mini PC"],
      ["Processors", "Ryzen 3 → Core i9"],
      ["Memory", "Up to 128GB DDR5"],
      ["Graphics", "Integrated → RTX A4000"],
      ["Storage", "Gen5 NVMe + 2.5\" / 3.5\" bays"],
      ["Network", "Wi-Fi 6E · up to dual 2.5G LAN"],
      ["Chassis", "8 L · 18 L · 1 L mini PC"],
      ["Security", "HW TPM 2.0 · Kensington"],
    ],
    families: DESKTOP_FAMILIES,
  },

  {
    slug: "workstation",
    index: "03",
    name: "Workstation",
    model: "Latios PROMAX Series",
    title: ["WHEN THE WORK", "GETS HEAVY."],
    tagline: "Engineering, AI and everything that will not wait.",
    hero: "/images/components/gpu-pro.webp",
    intro:
      "Four PROMAX builds for engineering, AI and content creation — scaling from Core Ultra with a built-in NPU to Xeon W with 2TB of ECC memory and redundant 2700W power. Server and supercomputer ranges are in development.",
    chapters: [
      {
        n: "01",
        kicker: "Compute",
        heading: "Core Ultra to Xeon W",
        body: "The Q870 brings a Core Ultra NPU to the desk. The T2 pair moves to W680 and W880 workstation chipsets. The T4 Plus runs Xeon W, where core count and memory channels stop being a compromise.",
        image: "/images/perf.webp",
      },
      {
        n: "02",
        kicker: "Memory & Graphics",
        heading: "2TB of ECC, and lanes to feed it",
        body: "Error-correcting memory across the full Xeon W channel count, with full-height double-width graphics slots and the PCIe lanes to drive them — for datasets that used to be a server-room problem.",
        image: "/images/components/gpu-pro-2.webp",
      },
      {
        n: "03",
        kicker: "Power & Serviceability",
        heading: "Redundant supply, standard parts",
        body: "Up to 2700W with redundancy, so a failed supply is a swap rather than an outage. Standard sockets, standard mounts and a panel that comes off by hand — the same service promise as the rest of the range.",
        image: "/images/chassis.webp",
      },
    ],
    specs: [
      ["Range", "PROMAX Q870 · T2 · T4 Plus"],
      ["Processors", "Core Ultra → Xeon W"],
      ["Memory", "Up to 2TB DDR5 ECC"],
      ["Graphics", "Up to RTX A6000 / Blackwell"],
      ["Storage", "Gen5 NVMe + RAID options"],
      ["Network", "Dual 2.5G LAN · 10G options"],
      ["Power", "Up to 2700W redundant"],
      ["Security", "HW TPM 2.0 · Kensington"],
    ],
    families: WORKSTATION_FAMILIES,
  },

  {
    slug: "av",
    index: "04",
    name: "AV solutions",
    model: "Latios Smart AV",
    title: ["HEAR", "EVERYONE."],
    tagline: "Cameras and audio that make remote feel local.",
    hero: "/images/audio-hero.jpg",
    intro:
      "Webcams, PTZ cameras, speakerphones, video soundbars and full discussion systems — engineered so every seat at the table is seen and heard, from huddle room to boardroom.",
    chapters: [
      {
        n: "01",
        kicker: "Voice",
        heading: "Hear everyone. Clearly.",
        body: "Full-duplex HD voice with echo and noise cancellation and 360° microphone arrays — every voice lands clean on the other side.",
        image: "/images/av-sp50.jpg",
      },
      {
        n: "02",
        kicker: "All-in-one",
        heading: "Camera, mics and speaker in one bar",
        body: "Video soundbars with 4K optics, 5X zoom, AI framing and beamforming mic arrays — one cable turns any screen into a conference room.",
        image: "/images/av-soundbar.jpg",
      },
      {
        n: "03",
        kicker: "Scale",
        heading: "From huddle room to boardroom",
        body: "The HPS host-participant system scales to 200 units with capacitive touch controls and 5-band EQ — structured discussion, zero chaos.",
        image: "/images/av-hps.jpg",
      },
    ],
    specs: [
      ["Range", "Webcam · PTZ · Speakerphone · Soundbars · HPS"],
      ["Voice", "Full-duplex HD · echo cancellation"],
      ["Microphones", "360° arrays · 4-mic beamforming"],
      ["Camera", "Up to 4K UHD · 120° FOV · 5X zoom"],
      ["Intelligence", "Speaker tracking · AI auto framing"],
      ["Battery", "5400mAh (SP-50)"],
      ["Connectivity", "USB · Bluetooth · HDMI · SDI · LAN"],
      ["Scale", "Up to 200 HPS units"],
    ],
    families: [AUDIO_FAMILY],
  },
  {
    slug: "display",
    index: "05",
    name: "Display solutions",
    model: "Latios Smart Display",
    title: ["SEE", "THE DETAIL."],
    tagline: "Panels that never miss a frame.",
    hero: "/images/video-hero.jpg",
    intro:
      "From the 19.5-inch desk monitor to a 110-inch interactive wall — anti-glare, colour-honest panels for every room in the building.",
    chapters: [
      {
        n: "01",
        kicker: "Clarity",
        heading: "4K as the baseline",
        body: "From 19.5-inch desk monitors to 110-inch large-format walls, every Latios panel is anti-glare, wide-viewing and colour-honest.",
        image: "/images/av-monitor.jpg",
      },
      {
        n: "02",
        kicker: "Scale",
        heading: "One panel family, every room",
        body: "Desk monitors, large-format displays for signage and 110-inch walls for the auditorium — the same colour treatment and the same mounting logic across all of them.",
        image: "/images/av-monitor.jpg",
      },
      {
        n: "03",
        kicker: "Interaction",
        heading: "Touch. Share. Create.",
        body: "Interactive flat panels with wireless screen sharing, toughened anti-glare glass and Windows / Android / OPS flexibility.",
        image: "/images/av-ifp.jpg",
      },
    ],
    specs: [
      ["Range", "Monitors · LFD · IFP · Active LED"],
      ["Resolution", "1080p60 → 4K UHD"],
      ["Sizes", '19.5" → 110"'],
      ["Panels", "IPS / VA · anti-glare toughened"],
      ["Interactive", "Touch IFP · Windows/Android/OPS"],
      ["Mounting", "VESA · wall · floor stand · signage"],
      ["Connectivity", "HDMI · DP · USB · OPS slot"],
      ["Deployment", "Desks → auditoriums & signage"],
    ],
    families: [VIDEO_FAMILY],
  },

];

/**
 * Top-level nav order, including the levels that have nothing shipping yet.
 *
 * CATEGORIES holds only categories with a real page behind them, so a
 * taxonomy-only level (Boardroom solutions) would never reach the mega menu if
 * it mapped CATEGORIES. Derived from TAXONOMY so the nav cannot drift from the
 * tree: a top-level node with no category page renders as a "Soon" column.
 */
export const MEGA_CATEGORIES = TAXONOMY.map((t) => {
  const cat = CATEGORIES.find((c) => c.slug === t.slug);
  return cat || { slug: t.slug, name: t.name, soon: true };
});

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);

export const nextCategory = (slug) => {
  const i = CATEGORIES.findIndex((c) => c.slug === slug);
  return CATEGORIES[(i + 1) % CATEGORIES.length];
};
