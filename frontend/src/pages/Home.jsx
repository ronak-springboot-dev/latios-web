import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Cpu, ShieldCheck, Wrench } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
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
  ["99.99%", "Fleet uptime SLA"],
  ["40+", "Countries served"],
  ["24/7", "Engineer support"],
  ["5 yr", "On-site warranty"],
];

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="home-page"
    >
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="grid-bg absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
        <Hero3D />
        <div className="ambient-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-white/[0.04] blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full pt-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-8"
            data-testid="hero-kicker"
          >
            Business & Productivity PCs — Est. 2026
          </motion.p>
          <KineticText
            testId="hero-title"
            lines={["PRECISION MACHINES", "FOR THE MODERN", "ENTERPRISE."]}
            className="font-display font-black tracking-tighter text-white leading-[0.95] text-[13vw] md:text-[7.5vw]"
            delay={0.35}
          />
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9, ease: EASE }}
            className="mt-10 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed"
            data-testid="hero-subtitle"
          >
            Laptops, towers, audio and video — four instrument-grade product lines,
            one obsession: hardware that never gets in the way of the work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
            className="mt-12 flex flex-wrap items-center gap-5"
          >
            <button
              onClick={() => go("lineup")}
              data-testid="hero-explore-button"
              className="group flex items-center gap-3 bg-white text-black rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-300 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              Explore the lineup
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={() => go("contact")}
              data-testid="hero-contact-button"
              className="flex items-center gap-3 border border-white/20 text-white rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-white/60 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
            >
              Talk to sales
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-zinc-600"
          data-testid="hero-scroll-indicator"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.span>
        </motion.div>
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
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Lineup</p>
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
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Manifesto</p>
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
