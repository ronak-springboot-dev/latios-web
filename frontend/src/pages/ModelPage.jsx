import { Fragment, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { ParallaxImage } from "@/components/ParallaxImage";
import { ModelTurntable } from "@/components/ModelTurntable";
import { ModelShowcase } from "@/components/ModelShowcase";
import { ProductVideo } from "@/components/ProductVideo";
import { getModel, getCategoryModels, DATASHEETS, ALL_MODELS, getVideo } from "@/data/models";
import { SHOWCASE } from "@/data/showcase";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

export default function ModelPage() {
  const { modelSlug } = useParams();
  const model = getModel(modelSlug);
  const [tab, setTab] = useState("overview");
  const [diffsOnly, setDiffsOnly] = useState(false);
  usePageMeta(
    model ? `${model.name} | Latios` : "Latios",
    model ? model.intro : ""
  );
  const heroRef = useRef(null);
  const stripRef = useRef(null);
  const scrollStrip = (dir) => stripRef.current?.scrollBy({ left: dir * 472, behavior: "smooth" });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  if (!model) return <Navigate to="/" replace />;

  const others = getCategoryModels(model.category).filter((m) => m.slug !== model.slug);
  const datasheet = DATASHEETS[model.slug];
  const showcase = SHOWCASE[model.slug];
  // Loop footage for this chassis, if it has been photographed. Showcase pages
  // render their own video, so this only applies to the standard overview.
  const video = getVideo(model);

  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  // Multi-configuration spec sheet: a "family" is the set of models that are the same
  // physical chassis in different configurations (e.g. the four Latios MT board options).
  // Keyed on category + name prefix + shared gallery: models built on one chassis reuse
  // the same product photography (MT_GALLERY, SFF_GALLERY, ...), so an identical first
  // gallery image is the reliable signal that two SKUs really are the same box.
  // Name prefix alone was not enough — the bare "Latios PRO" prefix was grouping a
  // soundbar, a web camera, a PTZ camera, a monitor and an interactive panel into one
  // bogus five-column comparison.
  const familyKey = (m) => `${m.category}|${m.name.split(" — ")[0]}|${m.gallery?.[0] ?? m.slug}`;
  const family = ALL_MODELS.filter((m) => familyKey(m) === familyKey(model));
  const specSheetGroups = (() => {
    const groupNames = [...new Set(family.flatMap((m) => m.specGroups.map((g) => g.group)))];
    return groupNames.map((gname) => {
      const keys = [];
      family.forEach((m) => {
        m.specGroups.find((g) => g.group === gname)?.items.forEach(([k]) => {
          if (!keys.includes(k)) keys.push(k);
        });
      });
      return {
        name: gname,
        rows: keys.map((k) => ({
          key: k,
          values: family.map((m) => {
            const item = m.specGroups.find((g) => g.group === gname)?.items.find(([ik]) => ik === k);
            return item ? item[1] : null;
          }),
        })),
      };
    });
  })();

  const tabBar = (
    <section className="border-b border-white/10" data-testid="model-tabs">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center gap-8 md:gap-12">
        {[
          ["overview", "Overview"],
          ["specification", "Specification"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              setTimeout(
                () => document.querySelector('[data-testid=model-tabs]')?.scrollIntoView({ behavior: "smooth" }),
                120
              );
            }}
            data-testid={`model-tab-${id}`}
            className={`py-5 text-xs uppercase tracking-[0.3em] border-b-2 transition-colors duration-300 focus:outline-none ${
              tab === id
                ? "text-white border-[#1a56e8]"
                : "text-zinc-500 border-transparent hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
        {datasheet && (
          <a
            href={datasheet}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="datasheet-download"
            className="ml-auto hidden sm:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] hover:text-white transition-colors duration-300"
          >
            <FileDown className="w-4 h-4" /> Datasheet (PDF)
          </a>
        )}
      </div>
    </section>
  );

  const specSheet = (
    <section className="relative" data-testid="model-specs">
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-3">
                Specification
              </p>
              <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white" data-testid="spec-sheet-title">
                {model.name}
              </h2>
            </div>
            {datasheet && (
              <a
                href={datasheet}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="spec-datasheet-button"
                className="group shrink-0 inline-flex items-center gap-3 btn-blue px-7 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300"
              >
                <FileDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Download datasheet
              </a>
            )}
          </div>
        </Reveal>

        {family.length > 1 && (
          <Reveal delay={0.04}>
            <label
              className="mb-6 flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 cursor-pointer select-none"
              data-testid="spec-diff-toggle-label"
            >
              <input
                type="checkbox"
                checked={diffsOnly}
                onChange={(e) => setDiffsOnly(e.target.checked)}
                data-testid="spec-diff-toggle"
                className="w-4 h-4 accent-[#1a56e8]"
              />
              Show the differences
            </label>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <div className="overflow-x-auto border border-white/10" data-testid="spec-sheet-table">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-5 md:px-7 py-4 w-52 align-bottom text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-normal">
                    {family.length > 1 ? `${family.length} configurations` : "Specification"}
                  </th>
                  {family.map((m) => {
                    const pdf = DATASHEETS[m.slug];
                    const active = m.slug === model.slug;
                    return (
                      <th
                        key={m.slug}
                        data-testid={`spec-col-${m.slug}`}
                        className={`px-5 md:px-7 py-4 align-bottom border-t-2 ${
                          active ? "border-[#1a56e8]" : "border-transparent"
                        }`}
                      >
                        <div className={`text-sm font-semibold leading-snug ${active ? "text-white" : "text-zinc-400"}`}>
                          {m.name.split(" — ")[1] || m.name}
                        </div>
                        <div className="mt-2.5 flex items-center gap-4">
                          {pdf && (
                            <a
                              href={pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download datasheet (PDF)"
                              data-testid={`spec-pdf-${m.slug}`}
                              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#6f93f2] hover:text-white transition-colors duration-300"
                            >
                              <FileDown className="w-4 h-4" /> PDF
                            </a>
                          )}
                          {!active && (
                            <Link
                              to={`/${m.category}/${m.slug}`}
                              data-testid={`spec-open-${m.slug}`}
                              className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors duration-300"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {specSheetGroups.map((g, gi) => {
                  const visibleRows = g.rows.filter(
                    (r) => !diffsOnly || new Set(r.values.map((v) => v ?? "")).size > 1
                  );
                  if (visibleRows.length === 0) return null;
                  return (
                    <Fragment key={g.name}>
                      <tr data-testid={`spec-group-${gi}`}>
                        <td
                          colSpan={family.length + 1}
                          className="px-5 md:px-7 py-3.5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 bg-white/5 border-b border-white/10"
                        >
                          {g.name}
                        </td>
                      </tr>
                      {visibleRows.map((r, ri) => {
                        const differs = new Set(r.values.map((v) => v ?? "")).size > 1;
                        return (
                          <tr
                            key={r.key}
                            data-testid={`spec-row-${gi}-${ri}`}
                            className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.03] transition-colors duration-200"
                          >
                            <td className="px-5 md:px-7 py-4 text-sm text-zinc-500 align-top">{r.key}</td>
                            {r.values.map((v, vi) => (
                              <td
                                key={family[vi].slug}
                                className={`px-5 md:px-7 py-4 text-sm leading-relaxed align-top ${
                                  differs ? "text-white" : "text-zinc-400"
                                }`}
                              >
                                {v ?? "—"}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-8 text-[10px] text-zinc-600 leading-relaxed max-w-2xl">
          Product specification, functions and appearance may vary by configuration. All
          specifications are subject to change without notice — check with our sales team for
          the exact offer and detailed specifications for your region.
        </p>
      </div>
    </section>
  );

  const standardOverview = (
    <>
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

      {video && (
        <ProductVideo src={video.src} poster={video.poster} modelName={model.name} />
      )}
    </>
  );

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid={`model-page-${model.slug}`}
    >
      {/* HERO — standard models only (showcase has its own PDP hero) */}
      {!showcase && (
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
      )}

      {showcase && tab === "overview" ? (
        <ModelShowcase
          model={model}
          data={showcase}
          datasheet={datasheet}
          tabs={tabBar}
          onViewSpecs={() => setTab("specification")}
          onEnquire={scrollToContact}
        />
      ) : (
        <>
          {showcase && (
            <div className="pt-24 md:pt-32">{tabBar}</div>
          )}
          {!showcase && tabBar}
          {tab === "overview" ? standardOverview : specSheet}
        </>
      )}

      {/* OTHER MODELS */}
      <section className="border-t border-white/10" data-testid="other-models">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-10">
              <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500">More from the range</p>
              {others.length > 3 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollStrip(-1)}
                    data-testid="range-strip-prev"
                    aria-label="Scroll models left"
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#1a56e8] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollStrip(1)}
                    data-testid="range-strip-next"
                    aria-label="Scroll models right"
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#1a56e8] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </Reveal>
          <div
            ref={stripRef}
            className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth"
            data-testid="range-strip"
          >
            {others.map((m) => (
              <Link
                key={m.slug}
                to={`/${m.category}/${m.slug}`}
                data-testid={`other-model-${m.slug}`}
                className="group shrink-0 w-56 snap-start border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 p-5 focus:ring-2 focus:ring-white/50 focus:outline-none"
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
                onClick={scrollToContact}
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
