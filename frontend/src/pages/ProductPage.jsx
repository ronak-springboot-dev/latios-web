import { useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { SpecGrid } from "@/components/SpecGrid";
import { getCategory, nextCategory } from "@/data/products";

const EASE = [0.16, 1, 0.3, 1];

export default function ProductPage() {
  const { category } = useParams();
  const data = getCategory(category);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  if (!data) return <Navigate to="/" replace />;
  const next = nextCategory(data.slug);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid={`product-page-${data.slug}`}
    >
      {/* HERO with parallax */}
      <section ref={heroRef} className="keep-dark relative h-[92vh] overflow-hidden flex items-end">
        <motion.img
          src={data.hero}
          alt={data.name}
          style={{ y: imgY }}
          className="absolute inset-0 w-full h-[120%] object-cover"
          data-testid="product-hero-image"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        <motion.div
          style={{ opacity: fade }}
          className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400 mb-6" data-testid="product-kicker">
            {data.index} / {data.model}
          </p>
          <KineticText
            testId="product-title"
            lines={data.title}
            className="font-display font-black tracking-tighter text-white leading-[0.92] text-[16vw] md:text-[9vw]"
            delay={0.2}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
            className="mt-8 max-w-xl text-base md:text-lg text-zinc-300"
            data-testid="product-tagline"
          >
            {data.tagline}
          </motion.p>
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-36">
        <Reveal>
          <p
            className="font-display text-2xl md:text-4xl font-light tracking-tight text-white leading-snug max-w-4xl"
            data-testid="product-intro"
          >
            {data.intro}
          </p>
        </Reveal>
      </section>

      {/* NUMBERED CHAPTERS */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-28 md:space-y-44 pb-28 md:pb-40" data-testid="chapters-section">
        {data.chapters.map((ch, i) => (
          <div
            key={ch.n}
            className={`relative flex flex-col md:flex-row items-center gap-10 md:gap-20 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            data-testid={`chapter-${data.slug}-${ch.n}`}
          >
            <span
              aria-hidden="true"
              className={`absolute -top-12 md:-top-20 font-display font-black tracking-tighter text-[8rem] md:text-[13rem] leading-none text-white/[0.04] select-none pointer-events-none ${
                i % 2 === 1 ? "right-0" : "left-0"
              }`}
            >
              {ch.n}
            </span>
            <Reveal className="relative md:w-3/5 w-full">
              <div className="group overflow-hidden border border-white/10">
                <img
                  src={ch.image}
                  alt={ch.heading}
                  loading="lazy"
                  className="spotlight-img w-full aspect-[4/3] object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.12} className="relative md:w-2/5 w-full">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">
                Chapter {ch.n} — {ch.kicker}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.03]">
                {ch.heading}
              </h2>
              <p className="mt-6 text-base text-zinc-400 leading-relaxed">{ch.body}</p>
            </Reveal>
          </div>
        ))}
      </section>

      <EditorialMarquee items={[data.name.toUpperCase(), data.model.toUpperCase()]} />

      {/* SPECS */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-36" data-testid="specs-section">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Specifications</p>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14">
            The numbers, in full.
          </h2>
        </Reveal>
        <SpecGrid specs={data.specs} />
      </section>

      {/* MODEL FAMILIES (when a category has real SKUs) */}
      {data.families && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 md:pb-36" data-testid="models-section">
          {data.families.map((fam, fi) => (
            <div key={fam.title} className={fi > 0 ? "mt-24 md:mt-32" : ""}>
              <Reveal>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">{fam.kicker}</p>
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">
                  {fam.title}
                </h2>
                <p className="text-zinc-400 max-w-2xl mb-14 leading-relaxed">{fam.blurb}</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {fam.models.map((m, i) => (
                  <Reveal key={m.name} delay={i * 0.06}>
                    <Link
                      to={`/towers/${m.slug}`}
                      className="group border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 p-8 md:p-10 flex flex-col h-full focus:ring-2 focus:ring-white/50 focus:outline-none"
                      data-testid={`model-card-${fi}-${i}`}
                    >
                      {m.image && (
                        <div className="mb-7 rounded-lg bg-[#f2f2f0] px-8 py-6 flex items-center justify-center aspect-[16/9] overflow-hidden">
                          <img
                            src={m.image}
                            alt={m.name}
                            loading="lazy"
                            className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">{m.tag}</span>
                      <h3 className="mt-4 font-display text-2xl md:text-3xl font-black tracking-tighter text-white">
                        {m.name}
                      </h3>
                      <ul className="mt-6 space-y-2.5 flex-1">
                        {m.highlights.map((h) => (
                          <li key={h} className="text-sm text-zinc-400 flex gap-3">
                            <span className="text-zinc-600">—</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                      <span
                        data-testid={`model-explore-${fi}-${i}`}
                        className="mt-8 inline-flex items-center gap-2 self-start border border-white/20 rounded-full px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-white group-hover:bg-white group-hover:text-black transition-colors duration-300"
                      >
                        Explore model
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* NEXT CATEGORY */}
      <section className="border-t border-white/10" data-testid="next-category">
        <Link
          to={`/${next.slug}`}
          data-testid={`next-category-${next.slug}`}
          className="group block max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-32 focus:ring-2 focus:ring-white/50 focus:outline-none"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">
            Next — {next.index} / {next.model}
          </p>
          <div className="flex items-center justify-between gap-8">
            <h2 className="font-display font-black tracking-tighter text-white leading-[0.95] text-[12vw] md:text-[7vw] group-hover:text-zinc-300 transition-colors duration-500">
              {next.name}
            </h2>
            <span className="shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <ArrowRight className="w-6 h-6 md:w-9 md:h-9 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>
    </motion.main>
  );
}
