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

/** density -> vertical rhythm of section padding. */
const DENSITY = {
  tight: { band: "py-14 md:py-20", gap: "gap-8 md:gap-12" },
  normal: { band: "py-20 md:py-28", gap: "gap-10 md:gap-16" },
  airy: { band: "py-24 md:py-36", gap: "gap-12 md:gap-20" },
};

const THEMES = {
  // --- MT micro-tower ------------------------------------------------------
  "mt-amd-am4": {
    accent: "#d98324", accentSoft: "#f0b46a",
    density: "tight", surface: "#0b0a09",
    kicker: "The everyday workhorse",
  },
  "mt-h610-ddr4": {
    accent: "#e2571f", accentSoft: "#f5926a",
    density: "tight", surface: "#0a0a0a",
    kicker: "Cores where the budget goes",
  },
  "mt-h610-ddr5": {
    accent: "#2f7bff", accentSoft: "#83aeff",
    density: "normal", surface: "#07090d",
    kicker: "Built around the bus",
  },
  "mt-pro-h610-ddr5": {
    accent: "#8fa3b8", accentSoft: "#c3d0dc",
    density: "airy", surface: "#0a0b0c",
    kicker: "The Pro build",
  },
  "mt-q670-ddr5": {
    accent: "#3d6ea8", accentSoft: "#8fb3d6",
    density: "normal", surface: "#080a0c",
    kicker: "Specified for managed fleets",
  },
  "mt-am5-pro-ai": {
    accent: "#8b5cf6", accentSoft: "#c4aefc",
    density: "normal", surface: "#0a080f",
    kicker: "Ryzen AI, on the die",
  },

  // --- SFF small-form-factor ----------------------------------------------
  "sff-h610-ddr5": {
    accent: "#18b6c4", accentSoft: "#7fdbe4",
    density: "airy", surface: "#06090a",
    kicker: "Eight litres",
  },
  "sff-am5-pro-ai": {
    accent: "#7c5cf0", accentSoft: "#b9a6f8",
    density: "airy", surface: "#08070d",
    kicker: "An NPU in eight litres",
  },
  "sff-b860-pro-ai": {
    accent: "#12a5b8", accentSoft: "#79d3de",
    density: "normal", surface: "#06090a",
    kicker: "Core Ultra, small footprint",
  },
  "sff-h810-pro-ai": {
    accent: "#2aa198", accentSoft: "#8bcfc9",
    density: "normal", surface: "#06090a",
    kicker: "Volume rollout",
  },

  // --- MFF mini PC ---------------------------------------------------------
  "mff-dp10": {
    accent: "#9aa0a6", accentSoft: "#cfd3d6",
    density: "tight", surface: "#0a0a0a",
    kicker: "1.1 litres",
  },

  // --- PROMAX workstations -------------------------------------------------
  "promax-q870": {
    accent: "#ff7a18", accentSoft: "#ffb373",
    density: "normal", surface: "#080706",
    kicker: "Workstation class",
  },
  "promax-t2-w880": {
    accent: "#ff5f3d", accentSoft: "#ffa189",
    density: "normal", surface: "#080605",
    kicker: "Unlocked, error-corrected",
  },
  "promax-t2-w680": {
    accent: "#ffa62b", accentSoft: "#ffcd84",
    density: "normal", surface: "#080706",
    kicker: "Twenty-four cores",
  },
  "promax-t4-plus": {
    accent: "#ff4d16", accentSoft: "#ff9670",
    density: "airy", surface: "#050403",
    kicker: "The top of the range",
  },
};

const FALLBACK = {
  accent: BRAND_BLUE, accentSoft: "#6f93f2",
  density: "normal", surface: "#050505",
  kicker: "Engineering the future",
};

export const getTheme = (slug) => {
  const t = THEMES[slug] ?? FALLBACK;
  return { ...t, ...DENSITY[t.density] };
};

/** CSS custom properties for the PDP root element. */
export const themeVars = (theme) => ({
  "--pdp-accent": theme.accent,
  "--pdp-accent-soft": theme.accentSoft,
  "--pdp-surface": theme.surface,
});

export const ALL_THEMES = THEMES;
