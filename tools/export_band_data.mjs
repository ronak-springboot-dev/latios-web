/**
 * Dump the facts the band compositor needs into JSON for the Python side.
 *
 *   node tools/export_band_data.mjs
 *
 * The band typography is SET, never generated, so every string it prints has to
 * come from the same data the page renders — otherwise a band and its spec table
 * could drift apart and the picture would be quietly lying about the product.
 * Reading models.js directly is what keeps them in step.
 */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const models = await import(pathToFileURL("frontend/src/data/models.js").href);
const theme = await import(pathToFileURL("frontend/src/components/pdp/theme.js").href);

// models.js exports the catalogue under whichever name it uses; find the array
// of categories by shape rather than by guessing the export name.
const flat = [];
const visit = (node) => {
  if (Array.isArray(node)) return node.forEach(visit);
  if (!node || typeof node !== "object") return;
  if (node.slug && node.name && Array.isArray(node.stats)) flat.push(node);
  Object.values(node).forEach(visit);
};
visit(models);

const THEMES = theme.ALL_THEMES ?? {};
const out = {};
for (const m of flat) {
  const t = THEMES[m.slug];
  if (!t) continue;                       // non-tower or unthemed: no bands
  out[m.slug] = {
    name: m.name,
    tag: m.tag ?? "",
    kicker: t.kicker,
    accent: t.accent,
    accentSoft: t.accentSoft,
    surface: t.surface,
    stats: m.stats,                       // [[value, label], ...] - one per band
    chips: m.chips ?? [],
    highlights: m.highlights ?? [],
    // The richest copy pool on the record: each feature carries its own kicker,
    // a written heading and a paragraph. Bands headline off these rather than
    // off `highlights`, which are terse spec fragments that leave a band about
    // chassis volume with nothing better to say than the product's own name.
    features: (m.features ?? []).map((f) => ({
      kicker: f.kicker ?? "", heading: f.heading ?? "", body: f.body ?? "",
    })),
  };
}

writeFileSync("tools/image-processing/generated/band_data.json",
  JSON.stringify(out, null, 2), "utf8");
console.log(`wrote ${Object.keys(out).length} models`);
for (const [k, v] of Object.entries(out))
  console.log(`  ${k.padEnd(18)} ${v.accent}  ${v.stats.map((s) => s[0]).join(" / ")}`);
