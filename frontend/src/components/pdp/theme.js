/**
 * Per-product design language.
 *
 * Part 4 gave each tower its own imagery and copy, but every page still rendered
 * through one layout, so they read as the same template in different paint. A
 * page's identity comes from three things together: which sections it uses and
 * in what order (see the model's `sections` list), how dense its bands are, and
 * its accent.
 *
 * These tokens are applied as CSS custom properties on the PDP root, so no
 * component needs per-model branching — a section reads `var(--pdp-accent)` and
 * is correct on every page. Outside a PDP the brand blue remains the default.
 *
 * The language is derived from what each product actually IS, not assigned for
 * variety's sake: the value workhorse is warm and dense, the Xeon flagship is
 * near-black and cinematic, the AI models lead with their NPU.
 */

export const BRAND_BLUE = "#1a56e8";

/**
 * density -> vertical rhythm, grid gap and body measure.
 *
 * `measure` is the width the body copy is held to under a centred heading. It
 * is a token rather than a per-section class because the reference's whole
 * feel comes from a consistent measure under wide imagery, and it had drifted
 * to four different values across the sections.
 *
 * `gap` was declared here from the start and never read by anything; the grids
 * all hardcoded their own. SectionHead and the grids consume both now.
 */
const DENSITY = {
  tight: { band: "py-14 md:py-20", gap: "gap-8 md:gap-12", measure: "max-w-[560px]" },
  normal: { band: "py-20 md:py-28", gap: "gap-10 md:gap-16", measure: "max-w-[600px]" },
  airy: { band: "py-24 md:py-36", gap: "gap-12 md:gap-20", measure: "max-w-[660px]" },
};

/**
 * Shape and type, as two named sets rather than per-page values.
 *
 * `soft` is what every page has had: a 600-weight display face pulled tight,
 * pill buttons in uppercase at wide tracking, and generously rounded cards.
 *
 * `sharp` is adapted from the reference storefront, measured off it rather than
 * guessed -- headings at weight 520 with NORMAL tracking, 8px corners on
 * everything including buttons, sentence-case labels, 14px body. Those are its
 * values; these are a shade softer, because the Latios display face is Outfit
 * rather than MiSans and body copy here is read in English at a longer measure.
 *
 * The font stays Latios's own. A typeface is a brand, not a layout token.
 */
const SHAPE = {
  soft: {
    radius: "28px", card: "20px", pill: "9999px",
    headWeight: "600", track: "-0.025em",
    headSize: "clamp(1.875rem, 2.2vw + 1rem, 3rem)", bodySize: "1rem",
    label: "uppercase", labelTrack: "0.25em", kickerTrack: "0.35em",
  },
  sharp: {
    radius: "10px", card: "10px", pill: "8px",
    headWeight: "500", track: "normal",
    headSize: "clamp(1.75rem, 1.6vw + 1rem, 2.5rem)", bodySize: "0.9375rem",
    label: "none", labelTrack: "0.02em", kickerTrack: "0.18em",
  },
};

const THEMES = {
  // --- MT micro-tower ------------------------------------------------------
  "mt-amd-am4": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "normal", surface: "#0b0a09",
    kicker: "The everyday workhorse",
    shape: "sharp",
  },
  "mt-h610-ddr4": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "tight", surface: "#0a0a0a",
    kicker: "Cores where the budget goes",
    shape: "sharp",
  },
  "mt-h610-ddr5": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "normal", surface: "#07090d",
    kicker: "Built around the bus",
    shape: "sharp",
  },
  "mt-pro-h610-ddr5": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "airy", surface: "#0a0b0c",
    kicker: "The Pro build",
    shape: "sharp",
  },
  "mt-q670-ddr5": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "normal", surface: "#080a0c",
    kicker: "Specified for managed fleets",
    shape: "sharp",
  },
  "mt-am5-pro-ai": {
    accent: "#2f6bff", accentSoft: "#8fb4ff",
    density: "normal", surface: "#0a080f",
    kicker: "Ryzen AI, on the die",
    shape: "sharp",
  },

  // --- SFF small-form-factor ----------------------------------------------
  "sff-h610-ddr5": {
    accent: "#18b6c4", accentSoft: "#7fdbe4",
    density: "airy", surface: "#06090a",
    kicker: "Eight litres",
    shape: "sharp",
  },
  "sff-am5-pro-ai": {
    accent: "#7c5cf0", accentSoft: "#b9a6f8",
    density: "airy", surface: "#08070d",
    kicker: "An NPU in eight litres",
    shape: "sharp",
  },
  "sff-b860-pro-ai": {
    accent: "#12a5b8", accentSoft: "#79d3de",
    density: "normal", surface: "#06090a",
    kicker: "Core Ultra, small footprint",
    shape: "sharp",
  },
  "sff-h810-pro-ai": {
    accent: "#2aa198", accentSoft: "#8bcfc9",
    density: "normal", surface: "#06090a",
    kicker: "Volume rollout",
    shape: "sharp",
  },

  // --- MFF mini PC ---------------------------------------------------------
  "mff-dp10": {
    accent: "#9aa0a6", accentSoft: "#cfd3d6",
    density: "tight", surface: "#0a0a0a",
    kicker: "1.1 litres",
    shape: "sharp",
  },

  // --- PROMAX workstations -------------------------------------------------
  "promax-q870": {
    accent: "#ff7a18", accentSoft: "#ffb373",
    density: "normal", surface: "#080706",
    kicker: "Workstation class",
    shape: "sharp",
  },
  "promax-t2-w880": {
    accent: "#ff5f3d", accentSoft: "#ffa189",
    density: "normal", surface: "#080605",
    kicker: "Unlocked, error-corrected",
    shape: "sharp",
  },
  "promax-t2-w680": {
    accent: "#ffa62b", accentSoft: "#ffcd84",
    density: "normal", surface: "#080706",
    kicker: "Twenty-four cores",
    shape: "sharp",
  },
  "promax-t4-plus": {
    accent: "#ff4d16", accentSoft: "#ff9670",
    density: "airy", surface: "#050403",
    kicker: "The top of the range",
    shape: "sharp",
  },
  // --- laptops, audio and video --------------------------------------------
  "pro-14": {
    accent: "#4f9cf9", accentSoft: "#a5cbfd",
    density: "normal", surface: "#070a0e",
    kicker: "Business, in aluminium",
    shape: "sharp",
  },
  "notebook-14": {
    accent: "#2dd4bf", accentSoft: "#99ece0",
    density: "normal", surface: "#050c0b",
    kicker: "The everyday notebook",
    shape: "sharp",
  },
  "archer-ltg540z": {
    accent: "#e0245e", accentSoft: "#f087a6",
    density: "normal", surface: "#0d0509",
    kicker: "300Hz of overkill",
    shape: "sharp",
  },
  "sp50-speakerphone": {
    accent: "#26c6a6", accentSoft: "#89e2d1",
    density: "airy", surface: "#050b0a",
    kicker: "Every voice, heard",
    shape: "sharp",
  },
  "pro-video-soundbar": {
    accent: "#3fbf7f", accentSoft: "#95dfba",
    density: "normal", surface: "#050b08",
    kicker: "One bar, one cable",
    shape: "sharp",
  },
  "video-soundbar-4k": {
    accent: "#2fa36b", accentSoft: "#8ad3ae",
    density: "normal", surface: "#050a07",
    kicker: "Framed automatically",
    shape: "sharp",
  },
  "hps-controller": {
    accent: "#8bb33d", accentSoft: "#c3d98c",
    density: "normal", surface: "#080a05",
    kicker: "Structured discussion",
    shape: "sharp",
  },
  "pro-web-camera": {
    accent: "#d06be0", accentSoft: "#e9b3f1",
    density: "tight", surface: "#0b060c",
    kicker: "Plug and play",
    shape: "sharp",
  },
  "pro-ptz-camera": {
    accent: "#a45de8", accentSoft: "#d0aef4",
    density: "normal", surface: "#09060d",
    kicker: "It follows the room",
    shape: "sharp",
  },
  "pro-monitor": {
    accent: "#5b8def", accentSoft: "#aec5f7",
    density: "normal", surface: "#06080d",
    kicker: "Colour you can trust",
    shape: "sharp",
  },
  "in-series-lfd": {
    accent: "#4067c9", accentSoft: "#9db3e6",
    density: "airy", surface: "#05070c",
    kicker: "Seen from the back row",
    shape: "sharp",
  },
  "pro-ifp": {
    accent: "#e07a3f", accentSoft: "#f0bb9c",
    density: "normal", surface: "#0c0806",
    kicker: "Touch. Share. Create.",
    shape: "sharp",
  },
  "active-led": {
    accent: "#ff3d6e", accentSoft: "#ff9eb6",
    density: "airy", surface: "#0c0407",
    kicker: "No bezels at all",
    shape: "sharp",
  },

  // --- Server barebones ----------------------------------------------------
  // Two accents rather than nine: these are one range in one rack, and a
  // per-SKU colour would read as nine unrelated products. Steel for the
  // Xeon platforms, a warmer graphite-red for the EPYC ones.
  "g4201-he": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "4U rack barebones",
    shape: "sharp",
  },
  "cx270-s5062": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "2U rack barebones",
    shape: "sharp",
  },
  "cx271-s3066": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "2U rack barebones",
    shape: "sharp",
  },
  "cx271-s4056": {
    accent: "#c2603f", accentSoft: "#e3a086",
    density: "normal", surface: "#09090a",
    kicker: "2U rack barebones",
    shape: "sharp",
  },
  "cs280-s3065": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "2U rack barebones",
    shape: "sharp",
  },
  "g4101": {
    accent: "#c2603f", accentSoft: "#e3a086",
    density: "normal", surface: "#09090a",
    kicker: "4U rack barebones",
    shape: "sharp",
  },
  "cx171-s4056": {
    accent: "#c2603f", accentSoft: "#e3a086",
    density: "normal", surface: "#09090a",
    kicker: "1U rack barebones",
    shape: "sharp",
  },
  "cx171-s3066": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "1U rack barebones",
    shape: "sharp",
  },
  "cx170-s5062": {
    accent: "#4d7cc7", accentSoft: "#8fb2e6",
    density: "normal", surface: "#09090a",
    kicker: "1U rack barebones",
    shape: "sharp",
  },
};

const FALLBACK = {
  accent: BRAND_BLUE, accentSoft: "#6f93f2",
  density: "normal", surface: "#050505",
  kicker: "Engineering the future",
};

export const getTheme = (slug) => {
  const t = THEMES[slug] ?? FALLBACK;
  return { ...t, ...DENSITY[t.density], ...SHAPE[t.shape ?? "soft"] };
};

/**
 * CSS custom properties for the PDP root element.
 *
 * `--pdp-surface` is the page ground each model's band artwork is already
 * composited on by make_bands.py, so the art has carried the model's surface
 * for a while and the page behind it has not. Sections opt into it through the
 * `.pdp-page` / `.pdp-card` classes in index.css rather than by reading the
 * variable directly: the light theme is implemented as overrides keyed on the
 * literal Tailwind class names, so a section that swaps `bg-[#0A0A0A]` for a
 * bare `var()` loses its light-mode rule and turns black on a white page.
 */
/**
 * The same accent, re-mixed for a light ground.
 *
 * Every accent in this file was chosen against a near-black surface, and on
 * #f4f4f2 they wash out: measured on mt-amd-am4, the accent lands at 2.64:1 and
 * accentSoft at 1.67:1. Large display type needs 3:1 and the 11px pills that
 * use accentSoft need 4.5:1, so in light mode the PDP was failing both.
 *
 * Rather than hand-pick 56 second colours, the light pair is DERIVED: convert
 * to linear light, scale until the contrast against the page hits the target,
 * convert back. That keeps each product's hue exactly — an amber page stays
 * amber — and only moves it as far down as legibility requires.
 *
 * accent goes darker than accentSoft, which is the reverse of their
 * relationship on black and the reason the gradient still runs the same
 * direction: on a dark ground the ramp goes from the saturated accent up into
 * its tint, and on a light one it goes from the deepest mix up toward the page.
 */
const PAGE_LIGHT_L = 0.894; // relative luminance of #f4f4f2

const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toSrgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

const onLight = (hex, ratio) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return hex;
  const rgb = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const lin = rgb.map(toLinear);
  const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const want = (PAGE_LIGHT_L + 0.05) / ratio - 0.05;
  if (!(L > 0) || want >= L) return hex;           // already dark enough
  const k = want / L;
  return (
    "#" +
    lin
      .map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c * k))) * 255)
        .toString(16).padStart(2, "0"))
      .join("")
  );
};

export const themeVars = (theme) => ({
  // The ground-specific pair goes in; index.css picks which one becomes
  // --pdp-accent. It must NOT set --pdp-accent itself: that would be an inline
  // custom property, and no light stylesheet can override one of those.
  "--pdp-accent-dk": theme.accent,
  "--pdp-accent-soft-dk": theme.accentSoft,
  "--pdp-accent-lt": onLight(theme.accent, 6.0),
  "--pdp-accent-soft-lt": onLight(theme.accentSoft, 4.6),
  "--pdp-surface": theme.surface,
  "--pdp-radius": theme.radius,
  "--pdp-card-radius": theme.card,
  "--pdp-pill": theme.pill,
  "--pdp-head-size": theme.headSize,
  "--pdp-body-size": theme.bodySize,
  "--pdp-head-weight": theme.headWeight,
  "--pdp-track": theme.track,
  "--pdp-label-case": theme.label,
  "--pdp-label-track": theme.labelTrack,
  "--pdp-kicker-track": theme.kickerTrack,
});

export const ALL_THEMES = THEMES;
