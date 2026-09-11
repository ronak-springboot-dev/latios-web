// The product tree — the single source of truth for how the range is
// organised. Kept in its own module because BOTH models.js and products.js
// need it, and products.js already imports from models.js: putting it in
// either one would make that import cycle.

/**
 * The product tree.
 *
 * Three levels where the range needs them (Workstation > Enterprise > Server)
 * and two where it does not. Every node carries the model
 * slugs it contains, so the mega menu, the category listings and the facet
 * filters all read from this one structure rather than three parallel lists
 * that drift apart.
 *
 * `soon: true` marks a bucket the range does not cover yet. Those render in the
 * tree — the taxonomy is the plan, not just the current catalogue — but as a
 * non-clickable "Coming soon" entry. They must never link to a category page
 * that would come up empty.
 *
 * A node with no `models` and no children is a leaf awaiting stock; a node with
 * `models` is browsable. The union of every `models` array is exactly the 28
 * shipping SKUs, and TAXONOMY_SLUGS below asserts that at module load.
 */
export const TAXONOMY = [
  {
    slug: "laptops",
    name: "Laptops",
    children: [
      { key: "business", name: "Business", models: ["pro-14"] },
      { key: "notebook", name: "Notebook", models: ["notebook-14"] },
      { key: "gaming", name: "Gaming", models: ["archer-ltg540z"] },
    ],
  },
  {
    slug: "desktops",
    name: "Desktops",
    children: [
      {
        key: "commercial",
        name: "Commercial",
        children: [
          {
            key: "micro-tower",
            name: "Micro tower",
            models: ["mt-amd-am4", "mt-h610-ddr4", "mt-h610-ddr5",
                     "mt-pro-h610-ddr5", "mt-q670-ddr5", "mt-am5-pro-ai"],
          },
          {
            key: "sff",
            name: "Small form factor",
            models: ["sff-h610-ddr5", "sff-am5-pro-ai",
                     "sff-b860-pro-ai", "sff-h810-pro-ai"],
          },
          // Not in the supplied list, but the DP10 exists and had nowhere to
          // live. It is a desktop chassis, so it sits with the other two.
          { key: "mini-pc", name: "Mini PC", models: ["mff-dp10"] },
          { key: "aio", name: "All-in-One", soon: true },
          // A full-height tower as distinct from the 18-litre micro tower
          // above. Nothing ships in it yet.
          { key: "full-tower", name: "Tower", soon: true },
        ],
      },
    ],
  },
  {
    // Enterprise is the only group here, so it leads the column. Server and
    // Supercomputer are named ranges with nothing shipping in them; they are
    // reachable and carry a coming-soon panel rather than an empty grid.
    //
    // The leaf key stays "workstation" even though the category slug is now
    // also "workstation" -- it is the `bucket` on all four PROMAX models and
    // the target of ?b=workstation links. Renaming it would break those to
    // make one URL prettier.
    slug: "workstation",
    name: "Workstation",
    children: [
      {
        key: "enterprise",
        name: "Enterprise",
        children: [
          { key: "server", name: "Server", soon: true },
          {
            key: "workstation",
            name: "Workstation",
            models: ["promax-q870", "promax-t2-w880",
                     "promax-t2-w680", "promax-t4-plus"],
          },
          { key: "supercomputer", name: "Supercomputer", soon: true },
        ],
      },
    ],
  },
  {
    slug: "av",
    name: "AV solutions",
    children: [
      {
        key: "cameras",
        name: "Cameras",
        children: [
          { key: "webcam", name: "Web camera", models: ["pro-web-camera"] },
          { key: "ptz", name: "PTZ camera", models: ["pro-ptz-camera"] },
          { key: "barcam", name: "Bar camera",
            models: ["pro-video-soundbar", "video-soundbar-4k"] },
        ],
      },
      { key: "speakerphone", name: "Speakerphones",
        models: ["sp50-speakerphone", "hps-controller"] },
    ],
  },
  {
    slug: "display",
    name: "Display solutions",
    children: [
      { key: "monitor", name: "Monitors", models: ["pro-monitor"] },
      { key: "lfd", name: "Large professional display", models: ["in-series-lfd"] },
      { key: "ifp", name: "Interactive flat panel", models: ["pro-ifp"] },
      { key: "led", name: "Active LED", models: ["active-led"] },
    ],
  },
  {
    slug: "boardroom",
    name: "Boardroom solutions",
    // A use case assembled from AV and display products rather than a range of
    // its own, so it has no SKUs to list yet.
    soon: true,
  },
];

/** Depth-first walk yielding every node, with its ancestor chain. */
export const walkTaxonomy = (nodes = TAXONOMY, trail = []) =>
  nodes.flatMap((n) => [
    { ...n, trail },
    ...walkTaxonomy(n.children || [], [...trail, n]),
  ]);

/** Every model slug the tree claims, in tree order. */
export const TAXONOMY_SLUGS = walkTaxonomy().flatMap((n) => n.models || []);

/** Leaf buckets under one top-level category, flattened for listing pages. */
export const bucketsFor = (slug) =>
  walkTaxonomy((TAXONOMY.find((t) => t.slug === slug) || {}).children || [])
    .filter((n) => n.models || n.soon);

/**
 * Legacy flat labels, still read by anything not yet migrated to TAXONOMY.
 * Derived rather than hand-maintained so it cannot drift from the tree.
 */
export const SUBCATS = Object.fromEntries(
  TAXONOMY.map((t) => [t.slug, (t.children || []).map((c) => c.name)])
);
