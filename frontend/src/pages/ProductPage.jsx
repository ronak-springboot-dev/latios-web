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
import {
  VENDOR_LABELS, getProcessorFamily, getMaxMemoryGB, getMemoryTier, MEMORY_TIERS,
} from "@/data/models";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Sort orders offered in the rail.
 *
 * "Featured" is the authored order and keeps the editorial family sections;
 * every other order flattens them into one grid, because a sort that only
 * applies inside each section is not a sort of the results. Models with no
 * memory figure (a monitor, a speakerphone) sort last rather than as zero.
 */
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "name", label: "Name A-Z", cmp: (a, b) => a.name.localeCompare(b.name) },
  { id: "memory", label: "Memory: high to low",
    cmp: (a, b) => (getMaxMemoryGB(b) ?? -1) - (getMaxMemoryGB(a) ?? -1) },
  { id: "ai", label: "AI ready first",
    cmp: (a, b) => Number(!!b.aiReady) - Number(!!a.aiReady) },
];

/**
 * Filter and sort rail.
 *
 * Lives in a sticky left column rather than a band above the grid, because the
 * band could only be reached by scrolling back to the top of the listing --
 * with fifteen towers on screen that is a long way back. The rail follows the
 * page, so the filters are reachable wherever the reader has got to.
 *
 * Four dimensions, combining as AND across groups and OR within one -- pick
 * "Micro tower" and "Small form factor" and you get both; add "AMD Ryzen" and
 * you get the AMD machines among those. Counts are computed against the other
 * active facets, so a number is always what you would actually get by clicking.
 *
 * Options with a zero count are hidden rather than shown disabled: a category
 * with no CPU in it (displays, AV) simply renders no processor group, instead of
 * a filter offering a single meaningless choice.
 *
 * On phones the rail collapses behind a "Filter & sort" button -- a 260px
 * column beside a single-column grid would leave no room for either.
 */
/** Groups worth showing: a facet whose every option matches nothing is noise. */
const liveGroups = (groups) => groups.filter((g) => g.options.some((o) => o.n > 0));

/** The filter and sort controls themselves, shared by the rail and the sheet. */
const FacetControls = ({ groups, active, onToggle, onClear, total, shown, sort, onSort, idPrefix }) => {
  const activeCount = Object.values(active).reduce((n, set) => n + set.size, 0);
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Showing <span className="text-white">{shown}</span> of {total}
        </p>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            data-testid="facet-clear"
            className="text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mb-7 pb-7 border-b border-white/10">
        <label
          htmlFor={`${idPrefix}-sort`}
          className="block text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-2.5"
        >
          Sort by
        </label>
        <select
          id={`${idPrefix}-sort`}
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          data-testid={`${idPrefix}-sort-select`}
          className="w-full bg-[#0A0A0A] border border-white/15 text-sm text-white px-3 py-2.5 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 transition-colors duration-300"
        >
          {SORTS.map((o) => (
            <option key={o.id} value={o.id} className="bg-[#0A0A0A]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-7">
        {liveGroups(groups).map((g) => (
          <div key={g.id} data-testid={`facet-group-${g.id}`}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-3">{g.label}</p>
            <div className="flex flex-col gap-1">
              {g.options
                .filter((o) => o.n > 0 || active[g.id]?.has(o.id))
                .map((o) => {
                  const on = active[g.id]?.has(o.id);
                  return (
                    <button
                      key={o.id}
                      onClick={() => onToggle(g.id, o.id)}
                      data-testid={`facet-${g.id}-${o.id}`}
                      aria-pressed={!!on}
                      className={`group flex items-center gap-3 py-1.5 text-left text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded ${
                        on ? "text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-300 ${
                          on
                            ? "bg-[#1a56e8] border-[#1a56e8]"
                            : "border-white/25 group-hover:border-white/50"
                        }`}
                      >
                        {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">{o.label}</span>
                      <span className="text-xs text-zinc-600 tabular-nums">{o.n}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/**
 * Desktop: a rail that follows the page.
 *
 * It sits in a sticky left column rather than a band above the grid, because
 * the band could only be reached by scrolling back to the top of the listing --
 * with fifteen towers on screen that is a long way back.
 *
 * Four dimensions, combining as AND across groups and OR within one: pick
 * "Micro tower" and "Small form factor" and you get both; add "AMD Ryzen" and
 * you get the AMD machines among those. Counts are computed against the other
 * active facets, so a number is always what clicking it would actually yield,
 * and a zero-count option is hidden rather than shown disabled -- a category
 * with no CPU in it (displays, AV) renders no processor group at all.
 */
const FilterRail = (props) => {
  if (!liveGroups(props.groups).length) return null;
  return (
    <aside
      className="hidden lg:block lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2"
      data-testid="facet-panel"
      aria-label="Filter and sort products"
    >
      <FacetControls {...props} idPrefix="rail" />
    </aside>
  );
};

/**
 * Phone: a pinned trigger and a sheet.
 *
 * A 240px rail beside a single-column grid would leave room for neither, and a
 * panel at the top of the listing is the thing that made filtering mean
 * scrolling back up in the first place.
 *
 * The trigger is `sticky bottom-6`, not `fixed`. Two reasons: framer-motion
 * leaves a transform on the page's <main> even after the entry animation
 * settles, and a transformed ancestor makes `position: fixed` resolve against
 * that ancestor rather than the viewport -- the button lands thousands of
 * pixels down the document. Sticky is unaffected by that, and it also gives the
 * behaviour for free: pinned above the fold for as long as the listing is on
 * screen, gone once it has been scrolled past, with no observer or scroll
 * listener. Which matters here, because Lenis drives scrolling and window
 * scroll events are not a reliable signal.
 *
 * The sheet itself does need a portal, for the same transform reason: a
 * full-screen overlay has to be measured against the viewport.
 */
const MobileFilterBar = (props) => {
  const [open, setOpen] = useState(false);
  const { active, shown } = props;

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";        // the sheet is the only scroller
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeCount = Object.values(active).reduce((n, set) => n + set.size, 0);
  if (!liveGroups(props.groups).length) return null;

  return (
    <>
      <div className="lg:hidden sticky bottom-6 z-40 mt-12 flex justify-center pointer-events-none">
        <button
          onClick={() => setOpen(true)}
          data-testid="facet-toggle"
          aria-expanded={open}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-[#111] px-6 py-3.5 text-[10px] uppercase tracking-[0.25em] text-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          Filter &amp; sort
          {activeCount > 0 && (
            <span className="btn-blue rounded-full px-2 py-0.5 text-[9px]">{activeCount}</span>
          )}
        </button>
      </div>

      {open &&
        createPortal(
          <div
            className="lg:hidden fixed inset-0 z-[60]"
            data-testid="facet-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort products"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col border-t border-white/15 bg-[#050505]">
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white">Filter &amp; sort</span>
                <button
                  onClick={() => setOpen(false)}
                  data-testid="facet-sheet-close"
                  aria-label="Close filters"
                  className="text-zinc-400 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FacetControls {...props} idPrefix="sheet" />
              </div>
              <div className="px-6 py-4 border-t border-white/10">
                <button
                  onClick={() => setOpen(false)}
                  data-testid="facet-sheet-apply"
                  className="w-full btn-blue py-3.5 text-[10px] uppercase tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                >
                  Show {shown} {shown === 1 ? "result" : "results"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

/** One product tile. Shared by the family sections and the sorted grid. */
const ModelCard = ({ m, category, testid }) => (
  <Link
    to={`/${category}/${m.slug}`}
    className="group border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 p-8 md:p-10 flex flex-col h-full focus:ring-2 focus:ring-white/50 focus:outline-none"
    data-testid={testid}
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
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">{m.tag}</span>
      {m.aiReady && (
        <span
          data-testid={`ai-badge-${m.slug}`}
          title="Dedicated neural processing unit"
          className="text-[9px] uppercase tracking-[0.2em] text-[#6f93f2] border border-[#6f93f2]/40 rounded-full px-2 py-0.5"
        >
          AI ready
        </span>
      )}
    </div>
    <h3 className="mt-4 font-display text-2xl md:text-3xl font-black tracking-tighter text-white">
      {m.name}
    </h3>
    <ul className="mt-6 space-y-2.5 flex-1">
      {m.highlights.map((h) => (
        <li key={h} className="text-sm text-zinc-400 flex gap-3">
          <span className="text-zinc-600">&mdash;</span>
          {h}
        </li>
      ))}
    </ul>
    <span
      data-testid={`model-explore-${m.slug}`}
      className="mt-8 inline-flex items-center gap-2 self-start btn-blue px-6 py-3 text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
    >
      Explore model
      <ArrowUpRight className="w-3.5 h-3.5" />
    </span>
  </Link>
);

/** Every facet combination can be narrowed to nothing, so say so and offer the way out. */
const EmptyResults = ({ onClear }) => (
  <div className="border border-white/10 bg-[#0A0A0A] p-12 text-center" data-testid="facet-empty">
    <p className="font-display text-2xl font-black tracking-tighter text-white">
      Nothing matches those filters.
    </p>
    <p className="mt-3 text-sm text-zinc-400">
      Try removing one, or clear them and start again.
    </p>
    <button
      onClick={onClear}
      data-testid="facet-empty-clear"
      className="mt-7 btn-blue px-6 py-3 text-[10px] uppercase tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
    >
      Clear all filters
    </button>
  </div>
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

const FACET_IDS = ["bucket", "cpu", "memory", "ai"];
const emptyFacets = () => Object.fromEntries(FACET_IDS.map((k) => [k, new Set()]));

/**
 * Query-string name for each facet, so the mega menu can link straight to a
 * filtered listing: /towers?cpu=amd, /towers?ai=yes, /towers?b=sff.
 *
 * Short names because these end up in links people copy and share. Values are
 * comma-separated, matching the OR-within-a-group the panel already does, so
 * ?cpu=amd,xeon is expressible.
 */
const FACET_PARAM = { bucket: "b", cpu: "cpu", memory: "mem", ai: "ai" };

export default function ProductPage() {
  const { category } = useParams();
  const data = getCategory(category);
  const [search] = useSearchParams();

  // The mega menu links to a filtered listing rather than to routes of its own:
  // a sub-category, a processor family, or the AI-ready machines.
  const [active, setActive] = useState(() => {
    const f = emptyFacets();
    FACET_IDS.forEach((id) => {
      const raw = search.get(FACET_PARAM[id]);
      if (raw) raw.split(",").filter(Boolean).forEach((v) => f[id].add(v));
    });
    return f;
  });

  const toggleFacet = (group, id) =>
    setActive((prev) => {
      const next = { ...prev, [group]: new Set(prev[group]) };
      next[group].has(id) ? next[group].delete(id) : next[group].add(id);
      return next;
    });
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
  const deepLinked = FACET_IDS.some((id) => search.get(FACET_PARAM[id]));

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

  const DIMS = {
    bucket: (m) => [m.bucket],
    cpu: (m) => [getProcessorFamily(m)],
    memory: (m) => [getMemoryTier(m)],
    ai: (m) => (m.aiReady ? ["yes"] : []),
  };
  const passes = (m, sel) =>
    FACET_IDS.every((id) => {
      const chosen = sel[id];
      if (!chosen || !chosen.size) return true;      // group inactive
      return DIMS[id](m).some((v) => v && chosen.has(v));  // OR within a group
    });

  // Counted against the OTHER active facets, so the number on a chip is what
  // clicking it would actually yield.
  const countFor = (gid, oid) =>
    catModels.filter((m) => passes(m, { ...active, [gid]: new Set([oid]) })).length;

  const facetGroups = [
    { id: "bucket", label: "Form factor",
      options: bucketsFor(data.slug).filter((b) => !b.soon)
        .map((b) => ({ id: b.key, label: b.name, n: countFor("bucket", b.key) })) },
    { id: "cpu", label: "Processor",
      options: ["amd", "intel", "xeon"]
        .map((v) => ({ id: v, label: VENDOR_LABELS[v], n: countFor("cpu", v) })) },
    { id: "memory", label: "Memory",
      options: MEMORY_TIERS.map((t) => ({ id: t.id, label: t.label, n: countFor("memory", t.id) })) },
    { id: "ai", label: "AI ready",
      options: [{ id: "yes", label: "AI ready", n: countFor("ai", "yes") }] },
  ];

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
          {data.families.length > 1 && <FamilyAccordion families={data.families} />}
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
                  {matched.length === 0 ? (
                    <EmptyResults onClear={clearFacets} />
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                      {sorted.map((m, i) => (
                        <Reveal key={m.slug} delay={Math.min(i, 5) * 0.06}>
                          <ModelCard m={m} category={data.slug} testid={`model-card-sorted-${i}`} />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
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
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
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
