/**
 * Verify every product page actually RENDERS, not just that it answers 200.
 *
 * Written after a regex broke thirteen PDP data files and every route still
 * returned 200: a CRA dev server serves the SPA shell regardless of whether the
 * bundle compiles, so status codes say nothing about whether a page works. The
 * only reliable signal from outside the browser is whether the bundle itself
 * builds, so this parses every page module and cross-checks it against the
 * assets it references.
 *
 *   node tools/verify_pages.mjs
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "frontend";
const PDP = join(ROOT, "src/data/pdp");
const PUB = join(ROOT, "public");

let failures = 0;
let CATEGORIES_SLUGS = [];   // filled by check 5, reused by check 6
const fail = (msg) => { console.log("  FAIL " + msg); failures += 1; };

// 1. every page module parses
const pages = readdirSync(PDP).filter((f) => f.endsWith(".js") && f !== "index.js");
for (const f of pages) {
  const src = readFileSync(join(PDP, f), "utf8");
  const r = spawnSync(process.execPath, ["--input-type=module", "--check"], { input: src });
  if (r.status !== 0) fail(`${f} does not parse: ${String(r.stderr).split("\n")[3] ?? ""}`);
}
console.log(`parse            ${pages.length - failures}/${pages.length} page modules`);

// 2. every reveal manifest matches the frames on disk
let manifests = 0, mismatched = 0;
for (const f of pages) {
  const src = readFileSync(join(PDP, f), "utf8");
  const re = /["']?frames["']?\s*:\s*(\d+)[\s\S]{0,180}?["']?pattern["']?\s*:\s*["'](\/reveal\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    manifests += 1;
    const want = Number(m[1]);
    const dir = join(PUB, "reveal", m[2].split("/")[2]);
    const have = existsSync(dir) ? readdirSync(dir).filter((x) => x.endsWith(".webp")).length : 0;
    if (have !== want) { mismatched += 1; fail(`${f}: manifest says ${want} frames, disk has ${have}`); }
  }
}
console.log(`reveal manifests ${manifests - mismatched}/${manifests} match disk`);

// 3. every referenced image and video exists
const refs = new Set();
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.jsx?$/.test(e.name)) {
      // `bands` included because those assets carry their headline in the
      // pixels — a missing one loses copy, not just a picture.
      for (const m of readFileSync(p, "utf8").matchAll(/["'](\/(?:images|videos|bands)\/[^"']+)["']/g)) refs.add(m[1]);
    }
  }
};
walk(join(ROOT, "src"));
let broken = 0;
for (const r of refs) if (!existsSync(join(PUB, r.slice(1)))) { broken += 1; fail(`missing asset ${r}`); }
console.log(`assets           ${refs.size - broken}/${refs.size} resolve`);

// 3b. bands carry their copy in the pixels, so they must never be cropped or
// stretched, and the dimensions the page declares must be the real ones.
//
// This exists because a `md:h-full` + `object-cover` on the portrait band
// stretched it vertically and therefore cropped it horizontally by ~35% — "64GB"
// rendered as "4GB". A comment promising the crop was harmless is what stood in
// for a check last time, so now there is a check.
const png = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

// A WEBP is one of three things and this reads all three, because reading only
// one of them made this whole check a no-op.
//
// It used to look for VP8X alone — the EXTENDED form, which a file only carries
// when it needs alpha, animation or metadata. Every band on disk is written by
// Pillow at quality 90 with no alpha, so every one of them is a plain lossy
// `VP8 `, VP8X was never present, dims() returned null, and the comparison below
// was skipped for all of them. The line printed "30/30 match the files on disk"
// while matching nothing. Verified by declaring a deliberately wrong height and
// watching it still pass.
const webp = (buf) => {
  const at = (tag) => buf.indexOf(tag, 12);
  let i = at("VP8X");
  if (i >= 0) {
    const r = (o) => buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16);
    return [r(i + 12) + 1, r(i + 16) + 1];   // canvas size, 24-bit LE, n-1
  }
  i = at("VP8L");
  if (i >= 0) {
    const b = buf.readUInt32LE(i + 9);        // after the 0x2f signature byte
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
  }
  i = at("VP8 ");
  if (i >= 0) {
    const d = i + 8;                          // 3-byte frame tag, then 9d 01 2a
    if (buf[d + 3] !== 0x9d || buf[d + 4] !== 0x01 || buf[d + 5] !== 0x2a) return null;
    return [buf.readUInt16LE(d + 6) & 0x3fff, buf.readUInt16LE(d + 8) & 0x3fff];
  }
  return null;
};
const dims = (file) => {
  const b = readFileSync(file);
  if (b.slice(1, 4).toString() === "PNG") return png(b);
  if (b.slice(0, 4).toString() === "RIFF") return webp(b);
  return null;
};

const bandSrc = readFileSync(join(ROOT, "src/components/pdp/PdpBand.jsx"), "utf8");
const figureBlock = bandSrc.slice(bandSrc.indexOf("const Figure"), bandSrc.indexOf("return ("));
for (const bad of ["object-cover", "h-full ", "md:h-full"]) {
  if (figureBlock.includes(bad) && bad !== "h-full ")
    fail(`PdpBand Figure uses \`${bad}\` — baked type must never be cropped`);
}

// /images/scenes/ as well as /bands/. This check only ever matched /bands/,
// which meant the six scene posters — the assets with the MOST type baked into
// them — were the ones it did not cover, and a declared dimension could drift
// from disk unnoticed. `srcSm` is checked the same way: it is a second baked
// asset and gets a second chance to be wrong.
// No `\{` anchor: `srcSm` sits after `alt`, not at the head of its object, so
// anchoring on the brace would match `src` and quietly skip the second asset.
// The backreference is what keeps the trio consistent — `src` must be followed
// by `w`/`h` and `srcSm` by `wSm`/`hSm`, never a mix.
const BAKED = /"src(Sm)?":\s*"(\/(?:bands|images\/scenes)\/[^"]+)",\s*"w\1":\s*(\d+),\s*"h\1":\s*(\d+)/g;
let bands = 0, wrong = 0;
for (const f of pages) {
  const src = readFileSync(join(PDP, f), "utf8");
  const re = new RegExp(BAKED.source, "g");
  let m;
  while ((m = re.exec(src))) {
    bands += 1;
    const file = join(PUB, m[2].slice(1));
    if (!existsSync(file)) continue;                 // already reported above
    const d = dims(file);
    if (d && (d[0] !== Number(m[3]) || d[1] !== Number(m[4]))) {
      wrong += 1;
      fail(`${f}: ${m[2]} is ${d[0]}x${d[1]} on disk, page declares ${m[3]}x${m[4]}`);
    }
  }
}
console.log(`band dimensions  ${bands - wrong}/${bands} match the files on disk`);

// 4. every page is composed differently, and every restyled page is composed well.
//
// What this replaces keyed on accent + section order. All 28 accents are
// distinct, so the composite was unique no matter what the orders did and the
// check could not fail: twelve pages across three groups shared identical
// section orders and it still reported "28/28 distinct". These are the tests it
// was supposed to be running.
//
// They gate RESTYLED pages -- the ones carrying a specTable -- rather than all
// 28, because the legacy thin pages are a known backlog, not a regression. A
// collision fails the moment one of the colliding pages has been restyled, so
// the rollout cannot re-introduce one; the rest print as the checklist that is
// left.
const theme = readFileSync(join(ROOT, "src/components/pdp/theme.js"), "utf8");
const accents = Object.fromEntries(
  [...theme.matchAll(/"([a-z0-9-]+)":\s*\{\s*\n\s*accent:\s*"(#[0-9a-fA-F]{6})"/g)].map((m) => [m[1], m[2]]));

// A page whose only sections are the ones every page has is not a designed
// page, so these do not count towards distinctiveness.
const SCAFFOLD = new Set(["hero", "statWall", "featureGrid", "specTable", "specTeaser"]);
const SIGNATURE = ["reveal", "walkthrough", "spotlight", "band", "bento", "featureSplit"];

const composed = pages.map((f) => {
  const slug = basename(f, ".js");
  const src = readFileSync(join(PDP, f), "utf8");
  const order = [...src.matchAll(/["']?type["']?\s*:\s*["'](\w+)["']/g)].map((m) => m[1]);
  return {
    slug,
    order,
    key: order.join(">"),
    // The middle is what a reader actually experiences as different: strip the
    // sections that sit in the same place on every page and compare the rest.
    middle: order.filter((t) => !SCAFFOLD.has(t)).join(">"),
    restyled: order.includes("specTable"),
  };
});

for (const p of composed)
  if (!accents[p.slug]) fail(`${p.slug} has no theme entry - would fall back to brand blue`);

const collisions = (get) => {
  const m = new Map();
  for (const p of composed) {
    const k = get(p);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(p);
  }
  return [...m.values()].filter((g) => g.length > 1);
};

const backlog = [];
for (const g of collisions((p) => p.key)) {
  const names = g.map((p) => p.slug).join(", ");
  if (g.some((p) => p.restyled)) fail(`identical section order: ${names}`);
  else backlog.push(names);
}
for (const g of collisions((p) => p.middle))
  if (g.some((p) => p.restyled))
    fail(`identical section mix once the scaffold is stripped: ${g.map((p) => p.slug).join(", ")}`);

const restyled = composed.filter((p) => p.restyled);
for (const p of restyled) {
  const kinds = new Set(p.order);
  const count = (t) => p.order.filter((x) => x === t).length;
  if (p.order.length < 6) fail(`${p.slug} has only ${p.order.length} sections`);
  if (kinds.size < 5) fail(`${p.slug} uses only ${kinds.size} distinct section types`);
  if (count("hero") !== 1) fail(`${p.slug} has ${count("hero")} hero sections, expected exactly 1`);
  if (count("specTable") !== 1) fail(`${p.slug} has ${count("specTable")} specTable sections, expected exactly 1`);
  if (!SIGNATURE.some((t) => kinds.has(t)))
    fail(`${p.slug} has no signature section (${SIGNATURE.join("/")}) - it is a spec sheet with a headline`);
}

console.log(`composition      ${restyled.length}/${pages.length} restyled, distinct and above the floor`);
if (backlog.length) {
  console.log(`  rollout backlog  ${backlog.length} group(s) of legacy pages still sharing a section order:`);
  for (const names of backlog) console.log(`    ${names}`);
}

// The accent fix stays fixed. These literals are legitimate only as the CSS
// variable's fallback and as BRAND_BLUE itself; anywhere else is a hardcoded
// accent that will not follow the product's own theme.
{
  let hardcoded = 0;
  for (const dir of [PDP, join(ROOT, "src/components/pdp")])
    for (const f of readdirSync(dir).filter((x) => /\.(js|jsx)$/.test(x)))
      readFileSync(join(dir, f), "utf8").split("\n").forEach((line, i) => {
        if (!/#1a56e8|#6f93f2/i.test(line)) return;
        if (/var\(--pdp-|BRAND_BLUE/.test(line)) return;
        hardcoded += 1;
        fail(`${f}:${i + 1} hardcodes the brand accent instead of var(--pdp-accent)`);
      });
  console.log(`accent scope     ${hardcoded ? `${hardcoded} hardcoded` : "no hardcoded brand accent in pdp files"}`);
}

// 5. the catalogue and the taxonomy agree on where every model lives.
//
// Two independent facts decide whether a product appears on a category page:
// the family array it is authored into (models.js) and the `category` TAXONOMY
// assigns it (taxonomy.js). ProductPage intersects them, so when they disagree
// the product silently disappears - which is exactly what happened when the web
// and PTZ cameras moved to AV but stayed authored in VIDEO_FAMILY: /av rendered
// four cards instead of six and nothing failed.
//
// The data modules are plain ESM with extensionless relative imports, which
// node will not resolve, so they are copied to a scratch dir with the
// extensions written in and imported from there.
{
  const tmp = join(tmpdir(), "latios-verify-data");
  mkdirSync(tmp, { recursive: true });
  writeFileSync(join(tmp, "package.json"), '{"type":"module"}');
  for (const f of ["taxonomy.js", "models.js", "products.js"]) {
    const src = readFileSync(join(ROOT, "src/data", f), "utf8")
      .replace(/(from\s+")(\.\/[^".]+)(")/g, "$1$2.js$3");
    writeFileSync(join(tmp, f), src);
  }
  const { CATEGORIES, TAXONOMY_SLUGS } = await import(pathToFileURL(join(tmp, "products.js")).href);
  CATEGORIES_SLUGS = CATEGORIES.map((c) => c.slug);
  const { ALL_MODELS } = await import(pathToFileURL(join(tmp, "models.js")).href);

  const home = new Map();          // slug -> the category whose families author it
  for (const c of CATEGORIES)
    for (const f of c.families)
      for (const m of f.models) {
        if (home.has(m.slug)) fail(`${m.slug} is authored into both ${home.get(m.slug)} and ${c.slug}`);
        home.set(m.slug, c.slug);
      }
  let agree = 0;
  for (const m of ALL_MODELS) {
    if (!m.category) fail(`${m.slug} has no category - TAXONOMY never placed it`);
    else if (home.get(m.slug) !== m.category)
      fail(`${m.slug}: TAXONOMY says "${m.category}" but it is authored into the ${home.get(m.slug)} families, so /${m.category} will not render it`);
    else agree += 1;
  }
  for (const slug of TAXONOMY_SLUGS)
    if (!ALL_MODELS.some((m) => m.slug === slug)) fail(`TAXONOMY lists "${slug}", which is not a real model`);
  console.log(`taxonomy         ${agree}/${ALL_MODELS.length} models render in the category TAXONOMY assigns`);

  // Every model must have an authored product page.
  //
  // ModelPage used to carry a whole second rendering path -- a parallax hero and
  // a generic overview -- for models without one. All 28 had one, so that path
  // was unreachable, and it has been deleted. This is what keeps it safe: a
  // model added without a data/pdp/ file fails here rather than shipping a page
  // that is nothing but a specification table.
  const authored = new Set(pages.map((f) => basename(f, ".js")));
  let withPage = 0;
  for (const m of ALL_MODELS) {
    if (authored.has(m.slug)) withPage += 1;
    else fail(`${m.slug} has no data/pdp/${m.slug}.js - its page would fall back to the spec sheet alone`);
  }
  for (const slug of authored)
    if (!ALL_MODELS.some((m) => m.slug === slug))
      fail(`data/pdp/${slug}.js has no matching model`);
  console.log(`product pages    ${withPage}/${ALL_MODELS.length} models have an authored page`);
}

// 5b. a renamed category still answers on its old path.
//
// This is the second category rename here. The first (audio -> av, video ->
// display) is why check 6 exists; nothing has ever checked that the OLD paths
// still resolve, and a rename without redirects silently 404s every inbound
// link and every indexed search result.
//
// Read backwards from the redirect file rather than from a list of retired
// slugs, so this keeps working for the next rename without being edited: every
// `/<old>/*` rule must target a slug that is a real category now, and any slug
// those rules retire needs a bare `/<old>` rule too.
{
  const rules = readFileSync(join(PUB, "_redirects"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const splat = new Map();   // old slug -> the line, for `/old/*` rules
  const bare = new Set();    // old slugs that also have a plain `/old` rule
  for (const line of rules) {
    const [from, to] = line.split(/\s+/);
    if (!to || to === "/index.html") continue;
    let m = /^\/([a-z0-9-]+)\/\*$/.exec(from);
    if (m) { splat.set(m[1], to); continue; }
    m = /^\/([a-z0-9-]+)$/.exec(from);
    if (m) bare.add(m[1]);
  }

  let checked = 0;
  for (const [old, target] of splat) {
    // A per-model rule can point anywhere; a category catch-all must land on a
    // category that exists, or the redirect is itself a 404.
    const dest = /^\/([a-z0-9-]+)\//.exec(target)?.[1];
    if (!dest) { fail(`_redirects: "/${old}/*" targets "${target}", which is not a category path`); continue; }
    if (!CATEGORIES_SLUGS.includes(dest))
      fail(`_redirects: "/${old}/*" points at "/${dest}", which is not a category any more`);
    if (CATEGORIES_SLUGS.includes(old))
      fail(`_redirects: "/${old}/*" redirects away from "${old}", which IS a live category`);
    if (!bare.has(old))
      fail(`_redirects: "/${old}/*" exists but the bare "/${old}" has no rule, so the old listing 404s`);
    checked += 1;
  }
  console.log(`redirects        ${checked} retired categor${checked === 1 ? "y" : "ies"} still resolve`);
}

// 6. every category has hero copy, and every hero key is a real category.
//
// Home.jsx looks up HERO_SLIDES by category slug and reads .headline off the
// result. When the taxonomy renamed "audio" to "av" and "video" to "display"
// the keys were not renamed with it, so the lookup returned undefined and the
// homepage threw as soon as the carousel reached the third slide -- which is
// why it survived a browser pass that only looked at the first.
{
  const home = readFileSync(join(ROOT, "src/pages/Home.jsx"), "utf8");
  const block = home.slice(home.indexOf("const HERO_SLIDES"), home.indexOf("const Carousel"));
  const keys = new Set([...block.matchAll(/^\s{2}([a-z-]+):\s*\{/gm)].map((m) => m[1]));
  const slugs = CATEGORIES_SLUGS;
  for (const slug of slugs)
    if (!keys.has(slug)) fail(`HERO_SLIDES has no entry for category "${slug}" - the hero will throw on that slide`);
  for (const k of keys)
    if (!slugs.includes(k)) fail(`HERO_SLIDES has "${k}", which is not a category any more`);
  console.log(`hero copy       ${slugs.filter((s) => keys.has(s)).length}/${slugs.length} categories have hero text`);
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
