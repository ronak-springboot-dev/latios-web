import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, FileDown, Cpu, MemoryStick, HardDrive,
  MonitorCheck, Wifi, Usb, ShieldCheck, Wrench, RotateCw,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ParallaxImage } from "@/components/ParallaxImage";
import { ModelTurntable } from "@/components/ModelTurntable";

const EASE = [0.16, 1, 0.3, 1];

const ICONS = { Cpu, MemoryStick, HardDrive, MonitorCheck, Wifi, Usb, ShieldCheck, Wrench };

export const ModelShowcase = ({ model, data, datasheet, tabs, onViewSpecs, onEnquire }) => {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [audience, setAudience] = useState(0);
  const isTurntable = galleryIndex === model.gallery.length;
  const aud = data.audiences[audience];

  return (
    <div data-testid="model-showcase">
      {/* PDP HERO — Minisforum-style gallery + buy box */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 pt-28 md:pt-40 pb-16 md:pb-24" data-testid="showcase-hero">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-8" data-testid="showcase-breadcrumb">
          <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/${model.category}`} className="hover:text-white transition-colors duration-300">
            {model.category[0].toUpperCase() + model.category.slice(1)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{model.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* gallery */}
          <div>
            <motion.div
              key={galleryIndex}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-lg bg-[#f2f2f0] aspect-[4/3] flex items-center justify-center overflow-hidden"
              data-testid="showcase-stage"
            >
              {isTurntable ? (
                <div className="w-full p-6">
                  <ModelTurntable frames={model.gallery} name={model.name} />
                </div>
              ) : (
                <img
                  src={model.gallery[galleryIndex]}
                  alt={`${model.name} view ${galleryIndex + 1}`}
                  className="max-h-[85%] w-auto object-contain"
                />
              )}
            </motion.div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1" data-testid="showcase-thumbs">
              {model.gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setGalleryIndex(i)}
                  data-testid={`showcase-thumb-${i}`}
                  aria-label={`View ${i + 1}`}
                  className={`shrink-0 w-20 h-16 rounded-md bg-[#f2f2f0] flex items-center justify-center overflow-hidden border-2 transition-colors duration-300 focus:outline-none ${
                    galleryIndex === i ? "border-[#1a56e8]" : "border-transparent hover:border-white/30"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="max-h-[75%] w-auto object-contain" />
                </button>
              ))}
              <button
                onClick={() => setGalleryIndex(model.gallery.length)}
                data-testid="showcase-thumb-360"
                aria-label="360 degree view"
                className={`shrink-0 w-20 h-16 rounded-md bg-[#f2f2f0] flex flex-col items-center justify-center gap-1 border-2 transition-colors duration-300 focus:outline-none ${
                  isTurntable ? "border-[#1a56e8]" : "border-transparent hover:border-white/30"
                }`}
              >
                <RotateCw className="w-4 h-4 text-zinc-700" />
                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">360°</span>
              </button>
            </div>
          </div>

          {/* buy box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          >
            <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">{model.tag}</p>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.02]" data-testid="showcase-title">
              {model.name}
            </h1>
            <div className="mt-6 flex flex-wrap gap-2.5" data-testid="showcase-chips">
              {model.chips.map((c) => (
                <span key={c} className="border border-white/15 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-6 text-zinc-400 leading-relaxed max-w-xl" data-testid="showcase-intro">
              {model.intro}
            </p>

            <div className="mt-8 grid grid-cols-3 border-t border-l border-white/10" data-testid="showcase-stats">
              {model.stats.map(([v, l]) => (
                <div key={l} className="border-r border-b border-white/10 p-4 md:p-5">
                  <div className="font-display text-xl md:text-2xl font-black tracking-tighter text-white">{v}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">{l}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4" data-testid="showcase-ctas">
              <button
                onClick={onEnquire}
                data-testid="showcase-enquire"
                className="group inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
              >
                Enquire now
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              {datasheet && (
                <a
                  href={datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="showcase-datasheet"
                  className="inline-flex items-center gap-3 border border-white/20 text-white rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-white/60 transition-colors duration-300"
                >
                  <FileDown className="w-4 h-4" /> Datasheet
                </a>
              )}
              <button
                onClick={onViewSpecs}
                data-testid="showcase-view-specs"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] hover:text-white transition-colors duration-300"
              >
                Full specification <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-zinc-600" data-testid="showcase-assurance">
              Made in India · GeM Registered OEM · ISO 9001 / 14001 / 27001
            </p>
          </motion.div>
        </div>
      </section>

      {tabs}

      {/* FULL-BLEED BANNER */}
      <section className="relative" data-testid="showcase-banner">
        <ParallaxImage src={data.bannerImage || model.heroImage} alt={model.name} aspect="aspect-[21/9] md:aspect-[21/7]" />
        <div className="keep-dark absolute inset-0 bg-black/45 flex items-center justify-center text-center px-6">
          <Reveal>
            <p className="kicker-sq justify-center text-[10px] uppercase tracking-[0.35em] text-zinc-200 mb-5">
              Engineering the future
            </p>
            <h2 className="font-display text-3xl md:text-6xl font-black tracking-tighter text-white leading-[1.02] max-w-4xl" data-testid="showcase-banner-headline">
              {data.bannerHeadline}
            </h2>
            <p className="mt-5 text-sm md:text-base text-zinc-200 max-w-2xl mx-auto">
              {data.bannerSubline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FEATURE ICON GRID */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28" data-testid="showcase-features">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white text-center mb-16 leading-[1.05]">
            Everything your fleet needs.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {data.featureGrid.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <Reveal key={f.title} delay={i * 0.05}>
                <div
                  className="group bg-[#0A0A0A] p-8 h-full hover:bg-white/5 transition-colors duration-300"
                  data-testid={`showcase-feature-${i}`}
                >
                  <Icon className="w-7 h-7 text-[#6f93f2] transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-white">{f.title}</h3>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* AUDIENCE TABS — "One platform. Every team." */}
      <section className="border-t border-white/10" data-testid="showcase-audiences">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white text-center mb-12 leading-[1.05]">
              One platform. Every team.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap justify-center gap-2.5 mb-14" data-testid="showcase-audience-tabs">
              {data.audiences.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setAudience(i)}
                  data-testid={`audience-tab-${a.id}`}
                  className={`rounded-full px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 ${
                    i === audience
                      ? "btn-blue border-transparent"
                      : "border-white/15 text-zinc-400 hover:text-white hover:border-white/40"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={aud.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
              data-testid="audience-panel"
            >
              <div className="overflow-hidden border border-white/10 aspect-[16/10]">
                <img src={aud.image} alt={aud.label} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-4">{aud.label}</p>
                <h3 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
                  {aud.heading}
                </h3>
                <p className="mt-5 text-zinc-400 leading-relaxed">{aud.desc}</p>
                <ul className="mt-6 space-y-3" data-testid="audience-bullets">
                  {aud.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-zinc-300">
                      <span className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-[#1a56e8]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FULL-BLEED STORY SECTIONS */}
      {data.fullBleeds.map((b, i) => (
        <section key={b.heading} className="border-t border-white/10" data-testid={`showcase-bleed-${i}`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
            <div className="md:[direction:ltr]">
              <ParallaxImage src={b.image} alt={b.heading} aspect="aspect-[16/11] md:aspect-auto md:h-full" />
            </div>
            <div className="md:[direction:ltr] flex items-center p-8 md:p-16 lg:p-24">
              <Reveal>
                <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">{b.kicker}</p>
                <h3 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
                  {b.heading}
                </h3>
                <p className="mt-5 text-zinc-400 leading-relaxed max-w-md">{b.body}</p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* SPEC TEASER */}
      <section className="border-t border-white/10" data-testid="showcase-spec-teaser">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
              Every number that matters.
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Compare all configurations side by side in the full specification sheet.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <button
              onClick={onViewSpecs}
              data-testid="showcase-spec-button"
              className="group inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
            >
              View specification
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
