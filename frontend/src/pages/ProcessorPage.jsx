import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { getProcessor } from "@/data/processors";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];
const ICONS = { Cpu, Layers, ShieldCheck, Zap };

/**
 * Latios processor campaign landing page (Intel / AMD) — a light, Dell-campaign
 * style page reached from the "Learn more about Intel / AMD" callouts on the
 * desktop listing. Vendor-specific content and accent come from processors.js.
 */
export default function ProcessorPage() {
  const { vendor } = useParams();
  const p = getProcessor(vendor);
  usePageMeta(
    p ? `${p.name} desktops | Latios` : "Latios",
    p ? p.sub : ""
  );
  if (!p) return <Navigate to="/towers" replace />;

  const [lead, tail] = p.headline.includes("|") ? p.headline.split("|") : [null, p.headline];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="bg-white text-zinc-900"
      data-testid={`processor-page-${p.vendor}`}
      style={{ "--pa": p.accent }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#0a0d12" }}>
        <img src={p.hero} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(90% 70% at 20% 110%, ${p.accent}66 0%, transparent 60%), linear-gradient(to right, rgba(10,13,18,0.92), rgba(10,13,18,0.55))` }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-36">
          <div
            className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-white font-bold tracking-tight text-lg"
            style={{ background: p.accent }}
            data-testid="processor-wordmark"
          >
            {p.wordmark}
          </div>
          <p className="mt-8 text-[11px] uppercase tracking-[0.35em] text-zinc-300">{p.kicker}</p>
          <h1 className="mt-4 pdp-display text-[2.6rem] md:text-[4.4rem] font-extrabold tracking-tight leading-[1.0] max-w-4xl">
            {lead && <span className="text-zinc-400">{lead.trim()} </span>}
            <span className="text-white">{tail.trim()}</span>
          </h1>
          <p className="mt-6 pdp-lead text-base md:text-xl text-zinc-300 max-w-2xl">{p.sub}</p>
          <Link
            to={p.ctaHref}
            data-testid="processor-hero-cta"
            className="mt-9 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] uppercase tracking-[0.25em] text-white transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: p.accent }}
          >
            {p.ctaLabel}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <p className="text-2xl md:text-4xl font-light tracking-tight text-zinc-900 leading-snug max-w-4xl" data-testid="processor-intro">
          {p.intro}
        </p>
      </section>

      {/* FEATURES */}
      <section className="bg-[#f6f6f4] border-y border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.features.map((f) => {
              const Icon = ICONS[f.icon] ?? Cpu;
              return (
                <div key={f.title} className="bg-white border border-black/10 rounded-lg p-7" data-testid="processor-feature">
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}55` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: p.accent }} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Shop by processor</p>
        <h2 className="pdp-display text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
          Pick the tier for the desk.
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.tiers.map((t) => (
            <Link
              key={t.name}
              to={p.ctaHref}
              data-testid="processor-tier"
              className="group bg-white border border-black/10 rounded-lg p-7 hover:border-black/25 transition-colors duration-300 flex flex-col"
            >
              <div className="h-1 w-10 rounded-full mb-5" style={{ background: p.accent }} />
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">{t.name}</h3>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed flex-1">{t.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em]" style={{ color: p.accent }}>
                View machines
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden" style={{ background: p.accent }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="pdp-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {p.ctaLabel}.
            </h2>
            <p className="mt-3 text-white/85 max-w-xl">Designed, manufactured and supported in India.</p>
          </div>
          <div className="flex gap-3">
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
