/**
 * Every machine, in one filterable grid.
 *
 * The reference for this is a storefront deals listing: a filter rail down the
 * left with live counts, a card grid on the right, a sort control above it. One
 * substitution decides everything else. That page filters on price, discount
 * and stock; this catalogue has none of those fields, and the backend routes a
 * pricing question to a lead form rather than a checkout. So the rail filters
 * on what this catalogue actually knows -- category, form factor, processor,
 * memory, AI -- and the card ends in "Explore model" rather than "Add to cart".
 *
 * It exists because there was no way to see the whole range at once. The
 * category pages each show their own models behind four screens of editorial,
 * and the only cross-category surface was /compare, which is three dropdowns.
 * Someone who knows they want 64GB and a Ryzen, and does not yet know whether
 * that is a tower or a slim desktop, had nowhere to stand.
 *
 * Everything here is borrowed rather than rewritten: the facet engine is
 * data/facets.js (shared with the category listings, and covered by a parity
 * test), the rail and the mobile sheet are components/FacetRail, and the tile
 * is components/ProductCard. The only thing this page adds is the CATEGORY
 * facet, which a category listing cannot offer because there it is always a
 * single value.
 */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { usePageMeta } from "@/hooks/usePageMeta";
import { ALL_MODELS } from "@/data/models";
import {
  FACET_PARAM,
  emptyFacets,
  facetsFromSearch,
  applyFacets,
  getFacetGroups,
  toggleFacet as toggleFacetIn,
} from "@/data/facets";
import { SORTS, liveGroups, FilterRail, MobileFilterBar } from "@/components/FacetRail";
import { ProductCard } from "@/components/ProductCard";
import { PartnerStrip } from "@/components/PartnerStrip";

const EASE = [0.16, 1, 0.3, 1];
const SHOW = ["category", "bucket", "cpu", "memory", "ai"];

export default function MachinesPage() {
  const [search, setSearch] = useSearchParams();
  const [active, setActive] = useState(() => facetsFromSearch(search));
  const [sort, setSort] = useState("featured");

  usePageMeta(
    "All machines | Latios",
    "Filter the full Latios range by category, form factor, processor and memory."
  );

  /**
   * Keep the URL in step with the rail.
   *
   * The category pages read facets from the URL but never write them back,
   * because there the facets are a landing state the mega menu sets. Here they
   * are the whole interaction, so a reader who has narrowed to two machines
   * should be able to send that link to a colleague.
   */
  const commit = (next) => {
    setActive(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([id, set]) => {
      if (set.size) params.set(FACET_PARAM[id], [...set].join(","));
    });
    setSearch(params, { replace: true });
  };

  const toggleFacet = (group, id) => commit(toggleFacetIn(active, group, id));
  const clearFacets = () => commit(emptyFacets());

  const facetGroups = getFacetGroups(ALL_MODELS, active, { show: SHOW });
  const matched = applyFacets(ALL_MODELS, active);
  const cmp = SORTS.find((o) => o.id === sort)?.cmp;
  const shown = cmp ? [...matched].sort(cmp) : matched;

  const railProps = {
    groups: liveGroups(facetGroups),
    active,
    onToggle: toggleFacet,
    onClear: clearFacets,
    total: ALL_MODELS.length,
    shown: shown.length,
    sort,
    onSort: setSort,
  };

  return (
    <main className="bg-[#050505] min-h-screen" data-testid="machines-page">
      <section className="border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              The range
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white max-w-4xl">
              Every machine Latios makes,
              <span className="text-[#6f93f2]"> in one place.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-zinc-400 leading-relaxed">
              {ALL_MODELS.length} machines across desktops, workstations, laptops,
              audio-visual and display. Filter by what the specification has to do,
              not by what shelf it sits on.
            </p>
            <div className="mt-8">
              <PartnerStrip testid="machines-partners-strip" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 md:py-16">
        <MobileFilterBar {...railProps} idPrefix="machines-mobile" />

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          <FilterRail {...railProps} idPrefix="machines" />

          <div>
            {shown.length === 0 ? (
              <div
                className="border border-white/10 bg-[#0A0A0A] p-12 text-center"
                data-testid="machines-empty"
              >
                <p className="font-display text-2xl font-black tracking-tight text-white">
                  Nothing matches all of that.
                </p>
                <p className="mt-3 text-sm text-zinc-400">
                  Try clearing one filter — the counts beside each option show what
                  is still reachable.
                </p>
                <button
                  onClick={clearFacets}
                  className="mt-7 btn-blue px-6 py-3 text-[10px] uppercase tracking-[0.25em]"
                  data-testid="machines-empty-clear"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {shown.map((m, i) => (
                  <ProductCard
                    key={m.slug}
                    m={m}
                    category={m.category}
                    testid={`machines-card-${i}`}
                  />
                ))}
              </div>
            )}

            {/* Technology partners.

                Posters rather than logos on a strip. Every readable character
                is set type and every mark is a real composited asset --
                make_posters.py records why neither may be generated. The
                heading is the wording AboutPage already uses: "Technology
                Partners", not official or authorised, because nothing in this
                codebase claims that. */}
            <div className="mt-16 border-t border-white/10 pt-12" data-testid="machines-partners">
              <h2 className="font-display text-2xl md:text-3xl font-black tracking-tighter text-white">
                Technology partners.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                The silicon inside every Latios machine, and the platforms the
                range is specified across.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  ["poster-intel", "Intel® Core™ processors"],
                  ["poster-amd", "AMD Ryzen™ processors"],
                  ["poster-nvidia", "NVIDIA® RTX™ professional graphics"],
                ].map(([file, alt]) => (
                  <img
                    key={file}
                    src={`/images/posters/${file}.webp`}
                    alt={alt}
                    loading="lazy"
                    className="w-full rounded-lg border border-white/10"
                    data-testid={`partner-${file}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-10 flex flex-wrap items-center justify-between gap-6">
              <p className="text-sm text-zinc-400 max-w-md">
                Not sure which one? Put two side by side, or tell us what the desk
                has to do and we will specify it.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-white transition-colors duration-300"
                  data-testid="machines-compare-link"
                >
                  Compare machines
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 btn-blue px-6 py-3 text-[10px] uppercase tracking-[0.25em]"
                  data-testid="machines-enquire"
                >
                  Start an enquiry
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
