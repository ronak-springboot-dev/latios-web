/**
 * The facet engine, shared by the category listings and the machine finder.
 *
 * This was written inside ProductPage and closed over one category's models.
 * It is lifted here unchanged in behaviour so /machines can run the same
 * filtering across the whole catalogue: the category pages pass their own
 * models, the finder passes ALL_MODELS, and there is one implementation of
 * "what does this chip mean" rather than two that drift.
 *
 * Two properties are worth keeping deliberately, because both were decisions
 * rather than accidents:
 *
 *   - AND across groups, OR within one. Selecting Intel and AMD widens the
 *     result; selecting Intel and 64GB narrows it. That is what a reader
 *     expects from a filter rail and it is what the reference storefront does.
 *   - Counts are computed against the OTHER active facets, not against the
 *     whole set. The number on a chip is therefore what clicking it would
 *     actually yield, which is the only number worth printing.
 *
 * `category` exists here but is not offered on a category page -- there it
 * would always be a single value. getFacetGroups takes the list of dimensions
 * to show, so each page asks for what it can vary.
 */
import {
  VENDOR_LABELS,
  getProcessorFamily,
  getMemoryTier,
  MEMORY_TIERS,
} from "./models";
import { CATEGORIES } from "./products";
import { bucketsFor } from "./taxonomy";

export const FACET_IDS = ["category", "bucket", "cpu", "memory", "ai"];

/**
 * Query-string name per facet, so a link can carry a filtered listing:
 * /desktops?cpu=amd, /machines?cat=laptops&mem=64.
 *
 * Short names because these end up in links people copy and share. Values are
 * comma-separated, matching the OR-within-a-group the panel already does, so
 * ?cpu=amd,xeon is expressible. `b`, `cpu`, `mem` and `ai` are unchanged from
 * when this lived in ProductPage -- the mega menu emits them and existing
 * links must keep working.
 */
export const FACET_PARAM = {
  category: "cat",
  bucket: "b",
  cpu: "cpu",
  memory: "mem",
  ai: "ai",
};

export const DIMS = {
  category: (m) => [m.category],
  bucket: (m) => [m.bucket],
  cpu: (m) => [getProcessorFamily(m)],
  memory: (m) => [getMemoryTier(m)],
  ai: (m) => (m.aiReady ? ["yes"] : []),
};

export const emptyFacets = () =>
  Object.fromEntries(FACET_IDS.map((k) => [k, new Set()]));

/** Read the facet selection out of a URLSearchParams. */
export const facetsFromSearch = (search) => {
  const f = emptyFacets();
  FACET_IDS.forEach((id) => {
    const raw = search.get(FACET_PARAM[id]);
    if (raw) raw.split(",").filter(Boolean).forEach((v) => f[id].add(v));
  });
  return f;
};

export const isDeepLinked = (search) =>
  FACET_IDS.some((id) => search.get(FACET_PARAM[id]));

/** AND across groups, OR within a group. An inactive group passes everything. */
export const passes = (m, sel) =>
  FACET_IDS.every((id) => {
    const chosen = sel[id];
    if (!chosen || !chosen.size) return true;
    return DIMS[id](m).some((v) => v && chosen.has(v));
  });

export const applyFacets = (models, sel) => models.filter((m) => passes(m, sel));

export const toggleFacet = (prev, group, id) => {
  const next = { ...prev, [group]: new Set(prev[group]) };
  if (next[group].has(id)) next[group].delete(id);
  else next[group].add(id);
  return next;
};

/**
 * Build the groups for a rail.
 *
 * `show` names the dimensions this page can vary and their order. `bucketScope`
 * is the category slug whose form factors to offer, or null for every bucket in
 * the catalogue -- a finder spanning categories cannot ask taxonomy for "the
 * buckets of this page" because there is no this page.
 */
export const getFacetGroups = (models, active, { show, bucketScope = null }) => {
  // Counted against the OTHER active facets, so the number on a chip is what
  // clicking it would actually yield.
  const countFor = (gid, oid) =>
    models.filter((m) => passes(m, { ...active, [gid]: new Set([oid]) })).length;

  const buckets = bucketScope
    ? bucketsFor(bucketScope)
    : // Every bucket present in the models on offer, in taxonomy order per
      // category, de-duplicated by key.
      CATEGORIES.flatMap((c) => bucketsFor(c.slug)).filter(
        (b, i, all) => all.findIndex((x) => x.key === b.key) === i
      );

  const build = {
    category: () => ({
      id: "category",
      label: "Category",
      options: CATEGORIES.map((c) => ({
        id: c.slug,
        label: c.name,
        n: countFor("category", c.slug),
      })),
    }),
    bucket: () => ({
      id: "bucket",
      label: "Form factor",
      // `soon` buckets stay: a named range that does not ship yet is still
      // something a buyer looks for, and selecting it shows the coming-soon
      // panel rather than an empty grid.
      options: buckets.map((b) => ({
        id: b.key,
        label: b.name,
        soon: !!b.soon,
        n: b.soon ? 0 : countFor("bucket", b.key),
      })),
    }),
    cpu: () => ({
      id: "cpu",
      label: "Processor",
      options: ["amd", "epyc", "intel", "xeon"].map((v) => ({
        id: v,
        label: VENDOR_LABELS[v],
        n: countFor("cpu", v),
      })),
    }),
    memory: () => ({
      id: "memory",
      label: "Memory",
      options: MEMORY_TIERS.map((t) => ({
        id: t.id,
        label: t.label,
        n: countFor("memory", t.id),
      })),
    }),
    ai: () => ({
      id: "ai",
      label: "AI ready",
      options: [{ id: "yes", label: "AI ready", n: countFor("ai", "yes") }],
    }),
  };

  return show.map((id) => build[id]());
};
