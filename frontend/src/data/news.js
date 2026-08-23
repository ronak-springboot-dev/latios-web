export const NEWS = [
  {
    slug: "strengthening-digital-india-through-innovation",
    tag: "Events",
    date: "IT TechExpo 2026",
    title: "Strengthening Digital India Through Innovation",
    image: "/images/news-techexpo-1.jpg",
    body: [
      "Participation in IT TechExpo 2026 reflects Latios Infosystem's commitment to strengthening India's digital ecosystem by delivering secure, reliable, and cost-effective computing solutions. The company continues to invest in R&D, local manufacturing, and quality-driven processes to meet both national and global standards.",
      "The exhibition provides an excellent opportunity for Latios to engage with government departments and PSUs, channel partners and system integrators, enterprises and institutional buyers, and technology enthusiasts and industry experts.",
      "Visit the Latios stall to experience our indigenously designed laptops, desktops, servers and AV solutions first-hand — and to discuss how Made-in-India hardware can power your organisation's next chapter.",
    ],
  },
  {
    slug: "showcasing-indias-indigenous-it-manufacturing-capabilities",
    tag: "Events",
    date: "IT TechExpo 2026",
    title: "Showcasing India's Indigenous IT Manufacturing Capabilities",
    image: "/images/news-techexpo-2.jpg",
    body: [
      "At IT TechExpo 2026, Latios Infosystem Pvt. Ltd. will showcase its indigenously designed and manufactured IT hardware solutions, aligned with the vision of \"Made in India\" and Atmanirbhar Bharat.",
      "Visitors to the Latios stall will get an opportunity to explore laptops and desktops designed for enterprise, education, and government use; servers and storage solutions built for performance, scalability, and reliability; and customized IT hardware solutions tailored to institutional and enterprise requirements.",
      "Our end-to-end capabilities cover design, development, manufacturing, and lifecycle support — every stage delivered from our Ahmedabad facility by a team that believes Indian engineering can stand shoulder to shoulder with global giants.",
    ],
  },
  {
    slug: "archer-ltg540z-launch",
    tag: "Laptops",
    date: "July 2026",
    title: "Latios Archer LTG540Z debuts with RTX 5080 and a 300Hz Mini LED panel",
    image: "/images/laptop-archer.jpg",
    body: [
      "The Archer LTG540Z is our most powerful laptop yet. It pairs Intel's Core Ultra 9 200HX processor with NVIDIA GeForce RTX graphics up to the 5080, and drives everything through a 16-inch 2.5K Mini LED panel running at 300Hz with 500 nits of brightness.",
      "With OverBoost Ultra technology delivering up to 270W of combined CPU and GPU power, the Archer is built for creators and gamers who refuse to compromise. Advanced cooling keeps sustained performance high without the noise levels gaming laptops are known for.",
      "Like every Latios product, the Archer is designed and manufactured in India. It is available for enterprise and retail enquiries now — contact our sales team for configurations and volume pricing.",
    ],
  },
  {
    slug: "gem-portfolio-expansion",
    tag: "Company",
    date: "July 2026",
    title: "Latios expands GeM-registered portfolio for public sector procurement",
    image: "/images/latios-pair.jpg",
    body: [
      "Latios has expanded its presence on the Government e-Marketplace (GeM), making it easier for public sector organisations to procure Made-in-India computing hardware directly from a registered OEM.",
      "The expanded listing covers our business desktop families — MT, SFF and MFF — alongside laptops, monitors and interactive panels, all backed by on-site warranty and our Ahmedabad manufacturing facility.",
      "Government departments and PSUs can now source Latios hardware through GeM with full certification documentation: ISO 9001, ISO 14001, ISO 27001, BIS and RoHS among them.",
    ],
  },
  {
    slug: "promax-t4-plus-2tb",
    tag: "Workstations",
    date: "June 2026",
    title: "PROMAX T4 Plus workstations now shipping with up to 2TB ECC memory",
    image: "/images/dp180-2.webp",
    body: [
      "The flagship PROMAX T4 Plus is now shipping in configurations with up to 2TB of DDR5 ECC memory across eight DIMM slots, powered by Intel Xeon W-2400 and W-3400 series processors.",
      "Designed for engineering simulation, AI training and 8K content pipelines, the T4 Plus supports NVIDIA Blackwell and RTX A6000-class graphics with redundant 1600–2700W power supplies for work that cannot stop.",
      "Every PROMAX workstation is built to order at our Ahmedabad facility. Contact sales for configuration guidance and ISV certification details.",
    ],
  },
  {
    slug: "smart-av-range-launch",
    tag: "Audio & Visual",
    date: "June 2026",
    title: "Smart Audio & Visual range launched for modern boardrooms",
    image: "/images/audio-hero.jpg",
    body: [
      "Meet the complete Latios Smart Audio & Visual range: the SP-50 speakerphone with 360° voice pickup, 4K video soundbars with AI framing, PTZ cameras with intelligent tracking, and the HPS host-participant discussion system that scales to 200 units.",
      "The range is built around a simple promise — one cable to a full conference room. USB plug-and-play setup, beamforming microphone arrays and full-duplex HD voice come standard.",
      "Pair them with our interactive flat panels from 55 to 110 inches for a complete boardroom, classroom or auditorium solution from a single Indian OEM.",
    ],
  },
  {
    slug: "new-smt-line-ahmedabad",
    tag: "Manufacturing",
    date: "May 2026",
    title: "New SMT line commissioned at the Ahmedabad facility",
    image: "/images/factory.jpg",
    body: [
      "Latios has commissioned an additional surface-mount technology (SMT) line at its Ahmedabad manufacturing facility, expanding capacity for PCB assembly across all product families.",
      "The new line strengthens our end-to-end capability — product design, prototyping, PCB assembly, wire and cable, box-builds, paint, sheet metal and molding — all under one roof, all in India.",
      "Added capacity means shorter lead times for enterprise and OEM orders, and greater flexibility for custom configurations at volume.",
    ],
  },
];

export const getNews = (slug) => NEWS.find((n) => n.slug === slug);
