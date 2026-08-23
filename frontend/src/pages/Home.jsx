import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { NEWS } from "@/data/news";
import { APPLICATIONS } from "@/data/applications";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { CATEGORIES } from "@/data/products";

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
  ["2023", "Founded in India"],
  ["15+", "Product families"],
  ["12+", "Certifications"],
  ["GeM", "Registered OEM"],
];

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
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="home-page"
    >
      {/* HERO */}
      {/* HERO — category accordion */}
      <section className="relative pt-28 md:pt-36 pb-14 md:pb-20" data-testid="hero-section">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center"
          >
            <p className="kicker-sq justify-center text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-6" data-testid="hero-kicker">
              Proudly Indian · Boldly Innovative
            </p>
            <h1
              className="font-display font-medium tracking-tight text-white text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.15] max-w-4xl mx-auto"
              data-testid="hero-title"
            >
              Empowering modern enterprise with precision-engineered hardware
            </h1>
            <p className="mt-5 text-sm md:text-base text-zinc-400 max-w-2xl mx-auto" data-testid="hero-subtitle">
              Laptops, towers, audio and video — designed, manufactured and supported
              end-to-end in India.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
            className="mt-12 md:mt-16"
          >
            <div className="hidden md:flex gap-2 h-[60vh] min-h-[440px]" data-testid="hero-accordion">
              {CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  onMouseEnter={() => setActive(i)}
                  data-testid={`hero-panel-${cat.slug}`}
                  className="accordion-panel relative overflow-hidden border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
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
                  className="relative block overflow-hidden border border-white/10 aspect-[16/9]"
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
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {STATS.map(([value, label], i) => (
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
                <div className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-500">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LINEUP BENTO */}
      <section id="lineup" className="max-w-[1600px] mx-auto px-6 md:px-12 py-28 md:py-40" data-testid="lineup-section">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Lineup</p>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white max-w-3xl leading-[1.02]">
            Four instruments. One standard.
          </h2>
        </Reveal>
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {CATEGORIES.map((cat, i) => (
            <Reveal
              key={cat.slug}
              delay={i * 0.08}
              className={i % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}
            >
              <Link
                to={`/${cat.slug}`}
                data-testid={`lineup-tile-${cat.slug}`}
                className="group relative block overflow-hidden border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={cat.hero}
                    alt={cat.name}
                    loading="lazy"
                    className="spotlight-img absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/5 transition-colors duration-700" />
                </div>
                <div className="flex items-end justify-between p-8 md:p-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                      {cat.index} — {cat.model}
                    </span>
                    <h3 className="mt-3 font-display text-3xl md:text-4xl font-black tracking-tighter text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 max-w-sm">{cat.tagline}</p>
                  </div>
                  <span className="shrink-0 ml-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors duration-500">
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
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
          </Reveal>
        </div>
      </section>

      {/* APPLICATIONS CAROUSEL */}
      <section className="border-t border-white/10" data-testid="applications-section">
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
                className="group shrink-0 w-[300px] md:w-[400px] relative block overflow-hidden border border-white/10 aspect-[4/3] hover:border-[#1a56e8]/60 transition-colors duration-500 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
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
