import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { getProcessor } from "@/data/processors";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];
const ICONS = { Cpu, Layers, ShieldCheck, Zap };

/**
 * Latios processor campaign landing page (Intel / AMD) — a bold, cinematic,
 * Dell-campaign-style page reached from the "Learn more" callouts and the
 * top-right chip on every PDP. Rendered dark in both themes (keep-dark) so it
 * is immune to the site's light-mode inversion and always reads clearly.
 * Vendor-specific content, accent and Latios product imagery come from
 * processors.js.
 */
export default function ProcessorPage() {
  const { vendor } = useParams();
  const p = getProcessor(vendor);
  usePageMeta(p ? `${p.name} desktops | Latios` : "Latios", p ? p.sub : "");
  if (!p) return <Navigate to="/towers" replace />;

  const [lead, tail] = p.headline.includes("|") ? p.headline.split("|") : [null, p.headline];
  const A = p.accent;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="keep-dark bg-[#050505] text-white"
      data-testid={`processor-page-${p.vendor}`}
    >
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[82vh] flex items-center border-b border-white/10">
        <img src={p.hero} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(80% 70% at 15% 120%, ${A}77 0%, transparent 55%), linear-gradient(to right, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.6) 55%, rgba(5,5,5,0.35) 100%)` }}
        />
        <div className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded px-3 py-1.5 font-bold tracking-tight text-lg"
              style={{ background: A, color: "#fff" }}
              data-testid="processor-wordmark"
            >
              {p.wordmark}
            </div>
            <p className="mt-8 text-[11px] uppercase tracking-[0.35em] text-zinc-300">{p.kicker}</p>
            <h1 className="mt-4 pdp-display text-[2.5rem] md:text-[4.2rem] font-extrabold tracking-tight leading-[1.0] max-w-3xl">
              {lead && <span className="text-zinc-400">{lead.trim()} </span>}
              <span className="text-white">{tail.trim()}</span>
            </h1>
            <p className="mt-6 pdp-lead text-base md:text-xl text-zinc-300 max-w-xl">{p.sub}</p>
            <Link
              to={p.ctaHref}
              data-testid="processor-hero-cta"
              className="mt-9 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.25em] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: A, color: "#fff" }}
            >
              {p.ctaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="pdp-glow" style={{ width: "70%", height: "70%", left: "15%", top: "12%", opacity: 0.5, background: `radial-gradient(circle, ${A} 0%, transparent 70%)` }} aria-hidden="true" />
            <img
              src={p.heroProduct}
              alt={`Latios desktop with ${p.name}`}
              className="relative z-10 max-h-[62vh] w-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <p className="pdp-display text-2xl md:text-4xl font-light tracking-tight text-white leading-snug max-w-4xl" data-testid="processor-intro">
          {p.intro}
        </p>
      </section>

      {/* LATIOS PRODUCT SHOWCASE */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 pb-8 md:pb-16" data-testid="processor-showcase">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-8">Built by Latios</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {p.gallery.map((g) => (
            <div key={g.cap} className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A]">
              <div className="absolute inset-0" style={{ background: `radial-gradient(90% 70% at 50% 120%, ${A}44 0%, transparent 60%)` }} aria-hidden="true" />
              <div className="relative aspect-[4/3] flex items-center justify-center p-8">
                <img src={g.img} alt={g.cap} loading="lazy" className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="relative px-6 pb-6">
                <div className="h-1 w-10 rounded-full mb-3" style={{ background: A }} />
                <h3 className="text-lg font-bold tracking-tight text-white">{g.cap}</h3>
                <p className="mt-1 text-sm text-zinc-400">{g.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.features.map((f) => {
            const Icon = ICONS[f.icon] ?? Cpu;
            return (
              <div key={f.title} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-7" data-testid="processor-feature">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: `${A}22`, border: `1px solid ${A}66` }}>
                  <Icon className="w-6 h-6" style={{ color: p.accentSoft }} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIERS */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Shop by processor</p>
        <h2 className="pdp-display text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          Pick the tier for the desk.
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.tiers.map((t) => (
            <Link
              key={t.name}
              to={p.ctaHref}
              data-testid="processor-tier"
              className="group bg-[#0A0A0A] border border-white/10 rounded-xl p-7 hover:border-white/30 transition-colors duration-300 flex flex-col"
            >
              <div className="h-1 w-10 rounded-full mb-5" style={{ background: A }} />
              <h3 className="text-xl font-bold tracking-tight text-white">{t.name}</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed flex-1">{t.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em]" style={{ color: p.accentSoft }}>
                View machines
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden" style={{ background: A }}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="pdp-display text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "#fff" }}>
              {p.ctaLabel}.
            </h2>
            <p className="mt-3 max-w-xl" style={{ color: "rgba(255,255,255,0.85)" }}>Designed, manufactured and supported in India.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={p.ctaHref} data-testid="processor-cta-shop" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-zinc-900 hover:bg-zinc-100 transition-colors duration-300">
              Browse desktops <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white hover:bg-white/10 transition-colors duration-300">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
