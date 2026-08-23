import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { NEWS } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { APPLICATIONS } from "@/data/applications";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { CATEGORIES, SUBCATS } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

const MANIFESTO = [
  {
    n: "01",
    icon: Cpu,
    heading: "Obsessed with the invisible",
    body: "Thermal curves, hinge torque, key travel, acoustic signature. We engineer the things you never notice — until you use anything else.",
  },
  {
    n: "02",
    icon: Wrench,
    heading: "Built to be repaired",
    body: "Every device opens with standard tools. Parts ship for a decade. Sustainability isn't a badge here; it's a bill of materials.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    heading: "Enterprise to the metal",
    body: "Hardware root-of-trust, secured firmware, fleet-ready management. Certified for the environments where failure isn't an option.",
  },
];

const STATS = [
  ["2023", "Founded in India", "Designed, manufactured and supported end-to-end at our Ahmedabad facility."],
  ["15+", "Product families", "Laptops, desktops, workstations, audio-visual systems and displays."],
  ["12+", "Certifications", "ISO 9001, 14001, 45001, 27001, BIS, RoHS, CE and more."],
  ["GeM", "Registered OEM", "Listed for direct government and public-sector procurement."],
];

const BANNER_POOL = [
  "/images/banner/banner-amd-1.jpg",
  "/images/banner/banner-amd-2.jpg",
  "/images/banner/banner-amd-3.jpg",
  "/images/banner/banner-intel-1.jpg",
  "/images/banner/banner-nvidia-1.jpg",
  "/images/banner/banner-nvidia-2.jpg",
  "/images/banner/banner-nvidia-3.jpg",
  "/images/banner/banner-board-1.jpg",
  "/images/banner/banner-board-2.jpg",
];

const HERO_SLIDES = {
  laptops: {
    headline: "Power That Travels.",
    subline: "Explore AI-ready and rugged laptops — designed, manufactured and supported in India.",
  },
  towers: {
    headline: "Efficiency, Reliability, and Quality.",
    subline: "Explore business desktops and PROMAX workstations engineered for every workload.",
  },
  audio: {
    headline: "Every Voice, Heard Clearly.",
    subline: "Explore professional conferencing audio for the modern meeting room.",
  },
  video: {
    headline: "Clarity at Any Scale.",
    subline: "Explore monitors, interactive panels and active LED displays.",
  },
};

const Carousel = ({ testId, children }) => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  const btn =
    "w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:border-[#1a56e8] hover:text-[#1a56e8] transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none";
  return (
    <div>
      <div className="flex justify-end gap-2 mb-8">
        <button onClick={() => scroll(-1)} data-testid={`${testId}-prev`} aria-label="Previous" className={btn}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={() => scroll(1)} data-testid={`${testId}-next`} aria-label="Next" className={btn}>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div ref={ref} className="scroll-row flex gap-5 overflow-x-auto pb-2" data-testid={`${testId}-row`}>
        {children}
      </div>
    </div>
  );
};

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  // random rich banner image per slide, shuffled once per page load (no repeats)
  const [slideImages] = useState(() => {
    const pool = [...BANNER_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, CATEGORIES.length);
  });
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % CATEGORIES.length), 6000);
    return () => clearInterval(t);
  }, []);
  usePageMeta(
    "Latios — Enterprise Hardware, Made in India",
    "Laptops, towers, workstations, audio and video hardware designed and manufactured in India. Proudly Indian. Boldly Innovative."
  );
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="home-page"
    >
      {/* HERO — JWIPC-style banner carousel */}
      <section className="keep-dark relative h-[92vh] min-h-[560px] overflow-hidden" data-testid="hero-section">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <img
              src={slideImages[slide]}
              alt={CATEGORIES[slide].name}
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="hero-slide-image"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-2xl"
            >
              <p
                className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-300 mb-6"
                data-testid="hero-kicker"
              >
                {CATEGORIES[slide].index} — {CATEGORIES[slide].name}
              </p>
              <h1
                className="font-display font-black tracking-tighter text-white leading-[1.02] text-4xl md:text-6xl lg:text-7xl"
                data-testid="hero-title"
              >
                {HERO_SLIDES[CATEGORIES[slide].slug].headline}
              </h1>
              <p className="mt-5 text-sm md:text-base text-zinc-200 max-w-xl" data-testid="hero-subtitle">
                {HERO_SLIDES[CATEGORIES[slide].slug].subline}
              </p>
              <Link
                to={`/${CATEGORIES[slide].slug}`}
                data-testid="hero-learn-more"
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 left-6 md:left-12 z-10 flex items-center gap-3" data-testid="hero-indicators">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => setSlide(i)}
              data-testid={`hero-dot-${i}`}
              aria-label={`Show ${c.name} slide`}
              className={`h-0.5 transition-all duration-500 focus:outline-none ${
                i === slide ? "w-12 bg-[#1a56e8]" : "w-8 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* PRODUCTS — category accordion */}
      <section className="relative pt-20 md:pt-28 pb-14 md:pb-20" data-testid="products-accordion">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Our Products</p>
            <h2
              className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-12 max-w-2xl leading-[1.05]"
              data-testid="products-title"
            >
              One partner. Every instrument.
            </h2>
          </Reveal>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
          >
            <div className="hidden md:flex gap-2 h-[60vh] min-h-[440px]" data-testid="hero-accordion">
              {CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  onMouseEnter={() => setActive(i)}
                  data-testid={`hero-panel-${cat.slug}`}
                  className="keep-dark accordion-panel relative overflow-hidden border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{ flexGrow: i === active ? 3.4 : 1, flexBasis: 0 }}
                >
                  <img
                    src={cat.hero}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-700 ${
                      i === active ? "bg-black/30" : "bg-black/55"
                    }`}
                  />
                  {i === active ? (
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="kicker-sq text-[10px] uppercase tracking-[0.3em] text-zinc-200">
                        {cat.index} — {cat.model}
                      </span>
                      <h3 className="mt-3 font-display text-4xl font-black tracking-tighter text-white">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-300 max-w-sm">{cat.tagline}</p>
                      <span className="mt-4 flex flex-wrap gap-2">
                        {(SUBCATS[cat.slug] || []).map((s, si) => (
                          <span
                            key={s}
                            data-testid={`subcat-pill-${cat.slug}-${si}`}
                            className="text-[10px] uppercase tracking-[0.15em] border border-white/30 rounded-full px-3 py-1.5 text-white/90 bg-black/25"
                          >
                            {s}
                          </span>
                        ))}
                      </span>
                      <span className="mt-5 inline-flex items-center gap-2 btn-blue px-5 py-2.5 text-[10px] uppercase tracking-[0.25em]">
                        Explore
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-end justify-center pb-8">
                      <span className="vertical-title font-display text-xl font-bold tracking-tight text-white/90">
                        {cat.name}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="md:hidden grid gap-3" data-testid="hero-accordion-mobile">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  data-testid={`hero-panel-mobile-${cat.slug}`}
                  className="keep-dark relative block overflow-hidden border border-white/10 aspect-[16/9]"
                >
                  <img src={cat.hero} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="kicker-sq text-[9px] uppercase tracking-[0.3em] text-zinc-200">{cat.model}</span>
                    <h3 className="mt-1 font-display text-2xl font-black tracking-tighter text-white">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-white/10" data-testid="stats-strip">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-20 md:pt-24">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">
              What makes Latios unique
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14 max-w-2xl leading-[1.05]">
              Your trusted partner in enterprise hardware.
            </h2>
          </Reveal>
        </div>
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 pb-16 md:pb-20">
          {STATS.map(([value, label, desc], i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div
                className={`p-10 md:p-14 ${i < 3 ? "md:border-r" : ""} border-white/10 ${
                  i % 2 === 0 ? "border-r md:border-r" : ""
                }`}
                data-testid={`stat-${i}`}
              >
                <div className="font-display text-4xl md:text-5xl font-black tracking-tighter text-white">
                  {value}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[#6f93f2]">{label}</div>
                <p className="mt-3 text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <EditorialMarquee items={["LAPTOPS", "TOWERS", "AUDIO", "VIDEO"]} />

      {/* MANIFESTO CHAPTERS */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-28 md:py-40" data-testid="manifesto-section">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Manifesto</p>
        </Reveal>
        <div className="space-y-24 md:space-y-36 mt-16">
          {MANIFESTO.map((ch, i) => (
            <Reveal key={ch.n} delay={0.05}>
              <div
                className={`relative flex flex-col md:flex-row md:items-center gap-10 md:gap-20 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
                data-testid={`manifesto-chapter-${ch.n}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-10 md:-top-16 font-display font-black tracking-tighter text-[8rem] md:text-[14rem] leading-none text-white/[0.04] select-none pointer-events-none"
                >
                  {ch.n}
                </span>
                <div className="relative md:w-1/2">
                  <ch.icon className="w-8 h-8 text-zinc-500 mb-6" strokeWidth={1.25} />
                  <h3 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.05]">
                    {ch.heading}
                  </h3>
                </div>
                <p className="relative md:w-1/2 text-base md:text-lg text-zinc-400 leading-relaxed md:border-l md:border-white/10 md:pl-12">
                  {ch.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT / COMPANY */}
      <section className="border-t border-white/10" data-testid="about-section">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-28 md:py-40 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="group overflow-hidden border border-white/10">
              <img
                src="/images/factory.jpg"
                alt="Latios SMT manufacturing facility"
                loading="lazy"
                className="spotlight-img w-full aspect-[4/3] object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Company</p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.03]">
              Proudly Indian. Boldly Innovative.
            </h2>
            <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed">
              Founded in 2023, Latios designs and manufactures electronics entirely in
              India — from initial design and PCB assembly to end-of-life management.
              Every product ships under one promise: Make in India, without shortcuts.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5" data-testid="cert-chips">
              {["ISO 9001", "ISO 14001", "ISO 45001", "ISO 27001", "BIS", "RoHS", "CE", "GeM Registered"].map((c) => (
                <span
                  key={c}
                  className="border border-white/15 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <span className="inline-block bg-white rounded-md px-5 py-3" data-testid="home-partners-strip">
                <img
                  src="/images/Group-29.png"
                  alt="Powered by Intel, AMD, Windows — Make in India"
                  loading="lazy"
                  className="h-6 md:h-7 w-auto"
                />
              </span>
              <Link
                to="/about"
                data-testid="home-about-link"
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors duration-300"
              >
                More about Latios
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <p className="mt-4 text-[9px] text-zinc-600 max-w-sm leading-relaxed">
              All third-party trademarks, logos, and brand names displayed are the property of their respective owners.
            </p>
          </Reveal>
        </div>
      </section>

      {/* APPLICATIONS CAROUSEL */}
      <section className="border-t border-white/10" id="applications-section" data-testid="applications-section">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Applications</p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">
              Built for every sector.
            </h2>
            <p className="text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              From digital classrooms to government fleets — Latios hardware is deployed
              where reliability is non-negotiable.
            </p>
          </Reveal>
          <Carousel testId="apps-carousel">
            {APPLICATIONS.map((a, i) => (
              <Link
                key={a.slug}
                to={`/applications/${a.slug}`}
                data-testid={`app-card-${i}`}
                className="keep-dark group shrink-0 w-[300px] md:w-[400px] relative block overflow-hidden border border-white/10 aspect-[4/3] hover:border-[#1a56e8]/60 transition-colors duration-500 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
              >
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="spotlight-img absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl font-black tracking-tighter text-white">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-300">{a.blurb}</p>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* NEWS CAROUSEL */}
      <section className="border-t border-white/10" data-testid="news-section">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">News & Updates</p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-12">
              The latest from Latios.
            </h2>
          </Reveal>
          <Carousel testId="news-carousel">
            {NEWS.map((n, i) => (
              <Link
                key={n.slug}
                to={`/news/${n.slug}`}
                data-testid={`news-card-${i}`}
                className="group shrink-0 w-[320px] md:w-[380px] border border-white/10 bg-[#0A0A0A] hover:border-[#1a56e8]/60 transition-colors duration-500 overflow-hidden focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
              >
                <div className="h-40 overflow-hidden">
                  <img src={n.image} alt={n.title} loading="lazy" className="spotlight-img w-full h-full object-cover" />
                </div>
                <div className="p-7 flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#6f93f2]">{n.tag}</span>
                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white leading-snug flex-1">
                    {n.title}
                  </h3>
                  <span className="mt-6 text-xs text-zinc-500">{n.date}</span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-white/10" data-testid="cta-band">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-36 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.02] max-w-2xl">
              Ready to equip your team?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <button
              onClick={() => go("contact")}
              data-testid="cta-enquire-button"
              className="group flex items-center gap-3 bg-white text-black rounded-full px-10 py-5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-300 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              Start an enquiry
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}
