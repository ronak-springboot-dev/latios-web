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
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "frontend";
const PDP = join(ROOT, "src/data/pdp");
const PUB = join(ROOT, "public");

let failures = 0;
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
      for (const m of readFileSync(p, "utf8").matchAll(/["'](\/(?:images|videos)\/[^"']+)["']/g)) refs.add(m[1]);
    }
  }
};
walk(join(ROOT, "src"));
let broken = 0;
for (const r of refs) if (!existsSync(join(PUB, r.slice(1)))) { broken += 1; fail(`missing asset ${r}`); }
console.log(`assets           ${refs.size - broken}/${refs.size} resolve`);

// 4. no two pages share both accent and section order
const theme = readFileSync(join(ROOT, "src/components/pdp/theme.js"), "utf8");
const accents = Object.fromEntries(
  [...theme.matchAll(/"([a-z0-9-]+)":\s*\{\s*\n\s*accent:\s*"(#[0-9a-fA-F]{6})"/g)].map((m) => [m[1], m[2]]));
const seen = new Map();
for (const f of pages) {
  const slug = basename(f, ".js");
  const src = readFileSync(join(PDP, f), "utf8");
  const order = [...src.matchAll(/["']?type["']?\s*:\s*["'](\w+)["']/g)].map((m) => m[1]).join(">");
  const key = (accents[slug] ?? "FALLBACK") + "|" + order;
  if (seen.has(key)) fail(`${slug} has the same accent and section order as ${seen.get(key)}`);
  else seen.set(key, slug);
  if (!accents[slug]) fail(`${slug} has no theme entry — would fall back to brand blue`);
}
console.log(`uniqueness       ${seen.size}/${pages.length} distinct accent+order`);

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
