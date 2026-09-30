import {
  FACET_IDS,
  FACET_PARAM,
  emptyFacets,
  facetsFromSearch,
  isDeepLinked,
  passes,
  getFacetGroups,
  toggleFacet as toggleFacetIn,
} from "@/data/facets";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowRight, ArrowUpRight, Check, SlidersHorizontal, X } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { ParallaxImage } from "@/components/ParallaxImage";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { SpecGrid } from "@/components/SpecGrid";
import { getCategory, nextCategory, bucketsFor } from "@/data/products";
import { ACCENT_SOFT } from "@/components/pdp/primitives";
import {
  VENDOR_LABELS, getProcessorFamily, getMaxMemoryGB, getMemoryTier, MEMORY_TIERS,
} from "@/data/models";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

/**
 * The rail, the sheet and the sort orders now live in components/FacetRail so
 * /machines can run the same controls. Behaviour is unchanged.
 */
import {
  SORTS,
  liveGroups,
  FilterRail,
  MobileFilterBar,
  EmptyResults,
} from "@/components/FacetRail";

/**
 * One product tile. Shared by the family sections and the sorted grid.
 *
 * The markup moved to components/ProductCard so that the six independent
 * copies of this card across the site become one. This wrapper keeps the
 * call sites here unchanged.
 */
const ModelCard = ({ m, category, testid }) => (
  <ProductCard m={m} category={category} testid={testid} />
);

const FamilyAccordion = ({ families }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="hidden md:flex gap-2 h-[52vh] min-h-[380px] mb-20" data-testid="family-accordion">
      {families.map((fam, i) => (
        <button
          key={fam.kicker}
          onMouseEnter={() => setActive(i)}
          onClick={() => document.getElementById(`family-${i}`)?.scrollIntoView({ behavior: "smooth" })}
          data-testid={`family-panel-${i}`}
          className="accordion-panel relative overflow-hidden border border-white/10 text-left focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
          style={{ flexGrow: i === active ? 3.2 : 1, flexBasis: 0 }}
        >
          <img src={fam.image} alt={fam.kicker} className="absolute inset-0 w-full h-full object-cover" />
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              i === active ? "bg-black/35" : "bg-black/60"
            }`}
          />
          {i === active ? (
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="kicker-sq text-[10px] uppercase tracking-[0.3em] text-zinc-200">
                {fam.kicker}
              </span>
              <h3 className="mt-3 font-display text-3xl font-black tracking-tighter text-white">
                {fam.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-300 max-w-md">{fam.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-2 btn-blue px-5 py-2.5 text-[10px] uppercase tracking-[0.25em]">
                View models
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <span className="vertical-title font-display text-lg font-bold tracking-tight text-white/90">
                {fam.kicker}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

/**
 * The facet engine now lives in data/facets.js, so this page and the /machines
 * finder run one implementation rather than two that drift. Behaviour here is
 * unchanged: the same four dimensions, the same query-string names the mega
 * menu already emits (?b=, ?cpu=, ?mem=, ?ai=), and counts still measured
 * against the other active facets.
 *
 * `category` is the one dimension this page does not offer. On a category
 * listing it would always be a single value.
 */
const SHOW = ["bucket", "cpu", "memory", "ai"];

/**
 * "Shop by processor": two links out to the Latios Intel and AMD campaign
 * pages, in the reference listing's own idiom.
 *
 * The vendor chips are SET TYPE on the vendor's colour, not their logos. The
 * rule is the one the partner strip and the platform bands already follow --
 * this project composites real artwork or sets the name, and never draws a
 * mark it does not hold.
 *
 * Desktops only. The campaign pages are about Intel Core and AMD Ryzen
 * desktops, so offering them from the AV or display listings would promise a
 * page that does not talk about those products.
 */
const ProcessorCallout = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12" data-testid="processor-callout">
    {[
      { to: "/processors/intel", testid: "learn-more-intel", name: "Intel® Core™ Processors", cta: "Learn more about Intel", chip: "intel", color: "#0068b5" },
      { to: "/processors/amd", testid: "learn-more-amd", name: "AMD® Processors", cta: "Learn more about AMD", chip: "AMD", color: "#ed1c24" },
    ].map((v) => (
      <Link
        key={v.to}
        to={v.to}
        data-testid={v.testid}
        className="group flex items-center justify-between gap-4 pdp-card border border-white/10 rounded-xl px-6 py-5 transition-colors duration-300"
        style={{ borderColor: undefined }}
      >
        <span>
          <span className="block text-sm font-semibold text-white">{v.name}</span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-[13px]" style={{ color: v.color }}>
            {v.cta}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
        <span
          className="shrink-0 rounded px-3 py-1.5 font-bold tracking-tight text-white"
          style={{ background: v.color }}
        >
          {v.chip}
        </span>
      </Link>
    ))}
  </div>
);

export default function ProductPage() {
  const { category } = useParams();
  const data = getCategory(category);
  const [search] = useSearchParams();

  // The mega menu links to a filtered listing rather than to routes of its own:
  // a sub-category, a processor family, or the AI-ready machines.
  const [active, setActive] = useState(() => facetsFromSearch(search));

  const toggleFacet = (group, id) => setActive((prev) => toggleFacetIn(prev, group, id));
  const clearFacets = () => setActive(emptyFacets());
  const [sort, setSort] = useState("featured");
  const listingRef = useRef(null);
  const lenis = useLenis();

  /**
   * Land on the products when the link asked for products.
   *
   * The listing starts about 5.9 screens down: hero, intro, three illustrated
   * chapters and the spec grid come first, and that editorial run is the point
   * of the page for someone arriving cold. It is emphatically not the point for
   * someone who clicked "Micro tower" in the mega menu -- that link carries a
   * facet, which is an explicit request to see a filtered set of machines, and
   * making them scroll past four screens of preamble to reach it is the whole
   * complaint.
   *
   * So the scroll is conditional on intent: a facet in the URL scrolls, a bare
   * /towers does not. Smooth rather than instant so the reader can see there is
   * material above them rather than being teleported into the middle of a page.
   */
  const deepLinked = isDeepLinked(search);

  /**
   * Scroll to the listing.
   *
   * Through Lenis when it is there, because Lenis owns the scroll position on
   * this site: a bare scrollIntoView({behavior:"smooth"}) is simply swallowed
   * -- measured on the deployed page, an instant scroll moved and a smooth one
   * did not budge. Same reasoning App.js already records for ScrollReset.
   */
  const jumpToModels = () => {
    const el = listingRef.current;
    if (!el) return;
    const start = window.scrollY;
    const target = el.getBoundingClientRect().top + start - 96;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      window.scrollTo(0, target);
      return;
    }

    if (lenis) lenis.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Guarantee arrival. Both smooth paths animate on requestAnimationFrame,
    // and if that loop is not ticking -- a stalled Lenis instance, a
    // background tab, the page hidden -- the call is a silent no-op and the
    // reader is left exactly where the scrolling was supposed to save them
    // from. Only fires if nothing moved at all, so a reader who scrolls during
    // the animation is never yanked.
    window.setTimeout(() => {
      if (window.scrollY === start && Math.abs(target - start) > 200) {
        window.scrollTo(0, target);
      }
    }, 900);
  };

  useEffect(() => {
    if (!deepLinked) return undefined;
    // ScrollReset sends every PUSH navigation to the top, and the sections
    // above are still mounting, so this waits rather than racing both.
    const t = setTimeout(jumpToModels, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinked, category, lenis]);
  usePageMeta(
    data ? `${data.name} — ${data.model} | Latios` : "Latios",
    data ? `${data.tagline} Explore the ${data.name} range from Latios.` : ""
  );
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  if (!data) return <Navigate to="/" replace />;
  const next = nextCategory(data.slug);

  // ---- facets -------------------------------------------------------------
  // Two sources have to agree on which category a model belongs to: the family
  // array it is authored into (which decides what renders below) and the
  // model's own `category`, assigned by TAXONOMY (which decides what the facet
  // counts say). The `.filter` here is the intersection, so a model authored
  // into the wrong family silently vanishes rather than showing a wrong count —
  // exactly what happened when the cameras moved to AV but stayed in
  // VIDEO_FAMILY. verify_pages.mjs now asserts the two agree for all 28.
  const catModels = (data.families || [])
    .flatMap((f) => f.models)
    .filter((m) => m.category === data.slug);

  const facetGroups = getFacetGroups(catModels, active, {
    show: SHOW,
    bucketScope: data.slug,
  });

  // The one selected bucket that has nothing in it yet, if any. Only a single
  // bucket selection counts: with two selected the result is a normal (empty)
  // filter combination, not a range announcement.
  const soonBucket = (() => {
    const picked = [...(active.bucket ?? [])];
    if (picked.length !== 1) return null;
    return bucketsFor(data.slug).find((b) => b.key === picked[0] && b.soon) ?? null;
  })();

  const matched = catModels.filter((m) => passes(m, active));
  const visible = new Set(matched.map((m) => m.slug));

  // null while "Featured" is chosen, which is what keeps the family sections.
  const cmp = SORTS.find((o) => o.id === sort)?.cmp;
  const sorted = cmp ? [...matched].sort(cmp) : null;

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

          {/* Skip the editorial run. Counted, because "15 machines" is a reason
              to click and "View models" is not. */}
          {catModels.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.9, ease: EASE }}
              onClick={jumpToModels}
              data-testid="hero-jump-to-models"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {catModels.length} {catModels.length === 1 ? "machine" : "machines"}
              <ArrowRight className="w-3.5 h-3.5 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
          )}
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
              <ParallaxImage src={ch.image} alt={ch.heading} aspect="aspect-[4/3]" />
            </Reveal>
            <Reveal delay={0.12} className="relative md:w-2/5 w-full">
              <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">
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
      <section className="relative max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-36" data-testid="specs-section">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Specifications</p>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14">
            The numbers, in full.
          </h2>
        </Reveal>
        <SpecGrid specs={data.specs} />
      </section>

      {/* MODEL FAMILIES (when a category has real SKUs) */}
      {data.families && (
        <section
          ref={listingRef}
          className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 md:pb-36 scroll-mt-24"
          data-testid="models-section"
        >
          {/* The family picker is a way to choose between MT/SFF and PROMAX. It
              is redundant for someone who arrived on a facet link, having
              already chosen -- and at 468px plus its margin it was the reason
              the first card still sat 14px below the fold after scrolling.
              Keyed on the URL rather than on live facet state so that toggling
              a filter never makes the page jump under the reader. */}
          {data.families.length > 1 && !deepLinked && (
            <FamilyAccordion families={data.families} />
          )}
          {data.slug === "desktops" && <ProcessorCallout />}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-x-12 xl:gap-x-16">
            <FilterRail
              groups={facetGroups}
              active={active}
              onToggle={toggleFacet}
              onClear={clearFacets}
              total={catModels.length}
              shown={matched.length}
              sort={sort}
              onSort={setSort}
            />

            <div className="min-w-0">
              {sorted ? (
                // A sort is active, so the editorial family sections give way to
                // one ordered grid -- otherwise "memory, high to low" would only
                // hold inside each section and the first card would not be the
                // largest machine on the page.
                <div data-testid="sorted-listing">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-8">
                    {matched.length} {matched.length === 1 ? "result" : "results"}
                  </p>
                  {soonBucket ? (
                    <ComingSoon
                      bucket={soonBucket.key}
                      label={soonBucket.name}
                      onClear={clearFacets}
                    />
                  ) : matched.length === 0 ? (
                    <EmptyResults onClear={clearFacets} />
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                      {sorted.map((m, i) => (
                        <Reveal key={m.slug} delay={Math.min(i, 5) * 0.06}>
                          <ModelCard m={m} category={data.slug} testid={`model-card-sorted-${i}`} />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              ) : soonBucket ? (
                <ComingSoon
                  bucket={soonBucket.key}
                  label={soonBucket.name}
                  onClear={clearFacets}
                />
              ) : matched.length === 0 ? (
                <EmptyResults onClear={clearFacets} />
              ) : (
                data.families.map((fam, fi) => {
                  const models = fam.models.filter(
                    (m) => m.category === data.slug && visible.has(m.slug));
                  if (!models.length) return null; // hide a family with nothing in the active range
                  return (
                    <div
                      key={fam.title}
                      id={`family-${fi}`}
                      className={`scroll-mt-28 ${fi > 0 ? "mt-24 md:mt-32" : ""}`}
                    >
                      <Reveal>
                        <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">
                          {fam.kicker}
                        </p>
                        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-5">
                          {fam.title}
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mb-14 leading-relaxed">{fam.blurb}</p>
                      </Reveal>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                        {models.map((m, i) => (
                          <Reveal key={m.name} delay={i * 0.06}>
                            <ModelCard m={m} category={data.slug} testid={`model-card-${fi}-${i}`} />
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <MobileFilterBar
              groups={facetGroups}
              active={active}
              onToggle={toggleFacet}
              onClear={clearFacets}
              total={catModels.length}
              shown={matched.length}
              sort={sort}
              onSort={setSort}
            />
          </div>
        </section>
      )}

      {/* NEXT CATEGORY */}
      <section className="border-t border-white/10" data-testid="next-category">
        <Link
          to={`/${next.slug}`}
          data-testid={`next-category-${next.slug}`}
          className="group block max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-32 focus:ring-2 focus:ring-white/50 focus:outline-none"
        >
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">
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
