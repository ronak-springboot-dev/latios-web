import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { ParallaxImage } from "@/components/ParallaxImage";
import { ModelTurntable } from "@/components/ModelTurntable";
import { getModel, getCategoryModels } from "@/data/models";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

export default function ModelPage() {
  const { modelSlug } = useParams();
  const model = getModel(modelSlug);
  usePageMeta(
    model ? `${model.name} | Latios` : "Latios",
    model ? model.intro : ""
  );
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  if (!model) return <Navigate to="/" replace />;

  const others = getCategoryModels(model.category).filter((m) => m.slug !== model.slug);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid={`model-page-${model.slug}`}
    >
      {/* HERO */}
      <section ref={heroRef} className="keep-dark relative h-[92vh] overflow-hidden flex items-end">
        <motion.img
          src={model.heroImage}
          alt={model.name}
          style={{ y: imgY }}
          className="absolute inset-0 w-full h-[120%] object-cover"
          data-testid="model-hero-image"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        <motion.div
          style={{ opacity: fade }}
          className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full"
        >
          <Link
            to={`/${model.category}`}
            data-testid="back-to-towers"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {model.category[0].toUpperCase() + model.category.slice(1)}
          </Link>
          <KineticText
            testId="model-title"
            lines={model.name.split(" — ")}
            className="font-display font-black tracking-tighter text-white leading-[0.95] text-[11vw] md:text-[6.5vw]"
            delay={0.2}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
            data-testid="model-chips"
          >
            {model.chips.map((c) => (
              <span
                key={c}
                className="border border-white/25 rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-white"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* INTRO + STATS */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-14 items-end">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">{model.tag}</p>
          <p className="font-display text-2xl md:text-4xl font-light tracking-tight text-white leading-snug" data-testid="model-intro">
            {model.intro}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grid grid-cols-3 border-t border-l border-white/10" data-testid="model-stats">
            {model.stats.map(([v, l]) => (
              <div key={l} className="border-r border-b border-white/10 p-6 md:p-8">
                <div className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white">{v}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TURNTABLE */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 md:pb-36" data-testid="turntable-section">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">360° View</p>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-12">
            Take it for a spin.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <ModelTurntable frames={model.gallery} name={model.name} />
          </div>
        </Reveal>
      </section>

      {/* FEATURE CHAPTERS */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-24 md:space-y-36 pb-24 md:pb-36" data-testid="model-features">
        {model.features.map((f, i) => (
          <div
            key={f.heading}
            className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            data-testid={`model-feature-${i}`}
          >
            <Reveal className="md:w-3/5 w-full">
              <ParallaxImage src={f.image} alt={f.heading} aspect="aspect-[16/10]" />
            </Reveal>
            <Reveal delay={0.12} className="md:w-2/5 w-full">
              <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">{f.kicker}</p>
              <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
                {f.heading}
              </h2>
              <p className="mt-5 text-base text-zinc-400 leading-relaxed">{f.body}</p>
            </Reveal>
          </div>
        ))}
      </section>

      {/* SPECS */}
      <section className="relative border-t border-white/10" data-testid="model-specs">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Full Specifications</p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14">
              Every number that matters.
            </h2>
          </Reveal>
          <div className="space-y-14">
            {model.specGroups.map((g, gi) => (
              <Reveal key={g.group} delay={0.05}>
                <div data-testid={`spec-group-${gi}`}>
                  <h3 className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">
                    {String(gi + 1).padStart(2, "0")} — {g.group}
                  </h3>
                  <div className="border-t border-white/10">
                    {g.items.map(([k, v]) => (
                      <div
                        key={k}
                        className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8 py-4 border-b border-white/10"
                      >
                        <span className="text-sm text-zinc-500">{k}</span>
                        <span className="md:col-span-2 text-sm md:text-base text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER MODELS */}
      <section className="border-t border-white/10" data-testid="other-models">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-10">More from the range</p>
          </Reveal>
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            {others.map((m) => (
              <Link
                key={m.slug}
                to={`/${m.category}/${m.slug}`}
                data-testid={`other-model-${m.slug}`}
                className="group shrink-0 w-56 border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 p-5 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                <div className="rounded-md bg-[#f2f2f0] aspect-[4/3] flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="max-h-[80%] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">{m.tag}</span>
                <div className="mt-2 font-display text-sm font-bold tracking-tight text-white leading-snug">
                  {m.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10" data-testid="model-cta">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.02] max-w-2xl">
              Put the {model.name.split(" — ")[0]} on your shortlist.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="model-enquire-button"
                className="group flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
              >
                Enquire now
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <Link
                to={`/${model.category}`}
                data-testid="model-back-button"
                className="flex items-center gap-3 border border-white/20 text-white rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-white/60 transition-colors duration-300"
              >
                All {model.category}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}
