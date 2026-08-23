export const APPLICATIONS = [
  {
    slug: "education",
    title: "Education",
    blurb: "Interactive panels and AI PCs for digital classrooms",
    image: "/images/av-ifp.jpg",
    intro:
      "Digital classrooms need hardware that teachers can trust and IT teams can manage. Latios pairs interactive flat panels with AI-ready PCs — all manufactured in India with on-site support.",
    points: [
      "Interactive panels from 55 to 110 inches with wireless screen sharing",
      "Toughened anti-glare glass built for daily classroom use",
      "Windows, Android or OPS flexibility per room",
      "Business laptops and desktops for computer labs and staff",
    ],
    products: ["pro-ifp", "pro-ai-laptop-14", "in-series-lfd"],
  },
  {
    slug: "government",
    title: "Government",
    blurb: "GeM-registered OEM for public sector fleets",
    image: "/images/laptop-rugged.jpg",
    intro:
      "As a GeM-registered Indian OEM, Latios supplies certified, secure computing to departments and PSUs — with full documentation, TPM 2.0 security and local manufacturing accountability.",
    points: [
      "GeM-registered with ISO 9001 / 14001 / 27001, BIS and RoHS documentation",
      "Hardware TPM 2.0 and chassis security across the desktop range",
      "Rugged MIL-STD-810H and IP65 laptops for field operations",
      "Volume deployment with imaging and on-site warranty",
    ],
    products: ["rugged-laptop-14", "mt-h610-ddr5", "mff-dp10"],
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    blurb: "Secure MT / SFF desktops with TPM 2.0 at scale",
    image: "/images/ops.jpg",
    intro:
      "From ten seats to ten thousand: Latios business desktops and monitors give IT teams consistent imaging, tool-friendly servicing and security baked into the metal.",
    points: [
      "MT, SFF and MFF form factors for every desk policy",
      "TPM 2.0, Kensington and padlock points standard",
      "Latios Center for fleet hardware monitoring and recovery",
      "Wi-Fi 6E / 7 and dual-LAN options for modern networks",
    ],
    products: ["mt-q670-ddr5", "sff-h610-ddr5", "pro-monitor"],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    blurb: "Dependable terminals and displays for critical care",
    image: "/images/av-monitor.jpg",
    intro:
      "Reception desks, nurse stations, tele-medicine rooms — healthcare runs on hardware that simply cannot go down. Latios delivers reliable terminals, cameras and displays with next-business-day support.",
    points: [
      "Compact SFF and mini PCs for space-constrained stations",
      "Webcams and PTZ cameras for tele-consultation",
      "Anti-glare displays readable under clinical lighting",
      "Military-grade certified durability for 24/7 environments",
    ],
    products: ["pro-monitor", "pro-web-camera", "sff-h810-pro-ai"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    blurb: "Rugged computing for the shop floor, made in-house",
    image: "/images/factory.jpg",
    intro:
      "We build electronics on our own SMT lines, so we know what shop floors demand: sealed, rugged, serviceable machines that survive dust, heat and vibration.",
    points: [
      "Rugged laptops and tablets rated MIL-STD-810H and IP65",
      "Fanless-adjacent small-form-factor options for dusty lines",
      "Large-format displays and Active LED for production dashboards",
      "Custom OEM/ODM builds for machine builders",
    ],
    products: ["rugged-laptop-14", "mt-amd-am4", "active-led"],
  },
  {
    slug: "boardrooms",
    title: "Boardrooms",
    blurb: "Audio-visual systems that make remote feel local",
    image: "/images/audio-hero.jpg",
    intro:
      "One cable to a full conference room: Latios video soundbars, PTZ cameras, speakerphones and discussion systems turn any space into a professional meeting room.",
    points: [
      "4K video soundbars with AI framing and speaker tracking",
      "Full-duplex HD speakerphones with 360° pickup",
      "HPS discussion systems scaling to 200 participants",
      "Interactive panels from 55 to 110 inches to complete the room",
    ],
    products: ["pro-video-soundbar", "pro-ptz-camera", "sp50-speakerphone", "pro-ifp"],
  },
];

export const getApplication = (slug) => APPLICATIONS.find((a) => a.slug === slug);
