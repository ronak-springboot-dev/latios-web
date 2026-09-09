/**
 * The PDP section vocabulary.
 *
 * Every section is a pure function of `{ model, theme, ...data }` and renders
 * nothing when its data is absent. That matters: a partial entry used to crash
 * the old ModelShowcase outright (a `{ videoSrc }`-only entry dereferenced
 * `audiences[0]`), so absence is handled at the top of each component rather
 * than assumed away.
 *
 * Pages differ by composing a DIFFERENT SUBSET of these in a DIFFERENT ORDER —
 * see each model's `sections` list — rather than by every page rendering the
 * same seven blocks with different copy.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, FileDown, Cpu, MemoryStick, HardDrive,
  MonitorCheck, Wifi, Usb, ShieldCheck, Wrench, RotateCw, Check,
} from "lucide-react";
import { ParallaxImage } from "@/components/ParallaxImage";
import { ModelTurntable } from "@/components/ModelTurntable";
import { ProductVideo } from "@/components/ProductVideo";
import { ALL_MODELS, familyKey } from "@/data/models";
import { setEnquiryDraft, formatConfiguration } from "@/lib/enquiryDraft";
import { ACCENT, ACCENT_SOFT, AccentButton, GhostButton, Kicker, BandHeading, SectionHead, Band, Reveal } from "./primitives";

const EASE = [0.16, 1, 0.3, 1];
const ICONS = { Cpu, MemoryStick, HardDrive, MonitorCheck, Wifi, Usb, ShieldCheck, Wrench };

/* ------------------------------------------------------------------ hero -- */

/**
 * Options for the configurator, read out of the model's OWN spec sheet.
 *
 * Deliberately derived rather than hand-listed per model: specGroups already
 * carries the authoritative "CPU options / Memory / Storage" rows, and a second
 * hand-maintained copy would drift from it the first time a spec changed.
 */
const deriveOptions = (model) => {
  const rows = (model.specGroups ?? []).flatMap((g) => g.items ?? []);
  const find = (re) => rows.find(([label]) => re.test(label))?.[1] ?? "";
  const split = (s) =>
    s.split("·").map((v) => v.trim()).filter(Boolean).slice(0, 4);

  const out = [];
  const cpu = split(find(/^cpu|processor option/i));
  if (cpu.length > 1) out.push({ key: "Processor", values: cpu });
  const mem = split(find(/^memory/i));
  if (mem.length) out.push({ key: "Memory", values: mem });
  const sto = split(find(/^storage/i));
  if (sto.length) out.push({ key: "Storage", values: sto });
  return out;
};

export const PdpConfigurator = ({ model, onEnquire, compact = false }) => {
  const options = useMemo(() => deriveOptions(model), [model]);
  const [choice, setChoice] = useState({});
  if (!options.length) return null;

  const pick = (key, value) => {
    const next = { ...choice, [key]: value };
    setChoice(next);
    setEnquiryDraft(formatConfiguration(model.name, next));
  };

  return (
    <div className={compact ? "" : "mt-8"} data-testid="pdp-configurator">
      <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4">
        Configure this system
      </p>
      <div className="space-y-5">
        {options.map((opt) => (
          <div key={opt.key}>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-2">{opt.key}</p>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((v) => {
                const on = choice[opt.key] === v;
                return (
                  <button
                    key={v}
                    onClick={() => pick(opt.key, v)}
                    data-testid={`config-${opt.key.toLowerCase()}`}
                    aria-pressed={on}
                    style={on ? { borderColor: ACCENT, color: "#fff" } : undefined}
                    className={`text-left border rounded-md px-3.5 py-2 text-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                      on ? "bg-white/[0.06]" : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {on && <Check className="inline w-3 h-3 mr-1.5 -mt-0.5" style={{ color: ACCENT }} />}
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <AccentButton onClick={onEnquire} className="mt-7" data-testid="config-enquire">
        Enquire about this build
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </AccentButton>
      <p className="mt-3 text-[10px] text-zinc-600">
        Your selections are carried into the enquiry form below.
      </p>
    </div>
  );
};

export const PdpHero = ({ model, theme, datasheet, onViewSpecs, onEnquire, configurator = true }) => {
  const [i, setI] = useState(0);
  const isTurntable = i === model.gallery.length;

  return (
    <section
      className="max-w-[1600px] mx-auto px-6 md:px-12 pt-28 md:pt-40 pb-16 md:pb-24"
      data-testid="showcase-hero"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-8" data-testid="showcase-breadcrumb">
        <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/${model.category}`} className="hover:text-white transition-colors duration-300">
          {model.category[0].toUpperCase() + model.category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">{model.name}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-lg bg-[#f2f2f0] aspect-[4/3] flex items-center justify-center overflow-hidden"
            data-testid="showcase-stage"
          >
            {isTurntable ? (
              <div className="w-full p-6">
                <ModelTurntable frames={model.gallery} name={model.name} />
              </div>
            ) : (
              <img
                src={model.gallery[i]}
                alt={`${model.name} view ${i + 1}`}
                className="max-h-[85%] w-auto object-contain"
              />
            )}
          </motion.div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1" data-testid="showcase-thumbs">
            {model.gallery.map((src, n) => (
              <button
                key={src}
                onClick={() => setI(n)}
                data-testid={`showcase-thumb-${n}`}
                aria-label={`View ${n + 1}`}
                style={i === n ? { borderColor: ACCENT } : undefined}
                className={`shrink-0 w-20 h-16 rounded-md bg-[#f2f2f0] flex items-center justify-center overflow-hidden border-2 transition-colors duration-300 focus:outline-none ${
                  i === n ? "" : "border-transparent hover:border-white/30"
                }`}
              >
                <img src={src} alt="" loading="lazy" className="max-h-[75%] w-auto object-contain" />
              </button>
            ))}
            <button
              onClick={() => setI(model.gallery.length)}
              data-testid="showcase-thumb-360"
              aria-label="360 degree view"
              style={isTurntable ? { borderColor: ACCENT } : undefined}
              className={`shrink-0 w-20 h-16 rounded-md bg-[#f2f2f0] flex flex-col items-center justify-center gap-1 border-2 transition-colors duration-300 focus:outline-none ${
                isTurntable ? "" : "border-transparent hover:border-white/30"
              }`}
            >
              <RotateCw className="w-4 h-4 text-zinc-700" />
              <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">360°</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
        >
          <Kicker>{model.tag}</Kicker>
          <h1
            className="font-display text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.02]"
            data-testid="showcase-title"
          >
            {model.name}
          </h1>
          <div className="mt-6 flex flex-wrap gap-2.5" data-testid="showcase-chips">
            {model.chips.map((c) => (
              <span key={c} className="border border-white/15 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-6 text-zinc-400 leading-relaxed max-w-xl" data-testid="showcase-intro">
            {model.intro}
          </p>

          <div className="mt-8 grid grid-cols-3 border-t border-l border-white/10" data-testid="showcase-stats">
            {model.stats.map(([v, l]) => (
              <div key={l} className="border-r border-b border-white/10 p-4 md:p-5">
                <div className="font-display text-xl md:text-2xl font-black tracking-tighter text-white">{v}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">{l}</div>
              </div>
            ))}
          </div>

          {configurator && <PdpConfigurator model={model} onEnquire={onEnquire} />}

          <div className="mt-8 flex flex-wrap gap-4 items-center" data-testid="showcase-ctas">
            {!configurator && (
              <AccentButton onClick={onEnquire} data-testid="showcase-enquire">
                Enquire now
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </AccentButton>
            )}
            {datasheet && (
              <GhostButton as="a" href={datasheet} target="_blank" rel="noopener noreferrer" data-testid="showcase-datasheet">
                <FileDown className="w-4 h-4" /> Datasheet
              </GhostButton>
            )}
            <button
              onClick={onViewSpecs}
              data-testid="showcase-view-specs"
              style={{ color: ACCENT_SOFT }}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] hover:text-white transition-colors duration-300"
            >
              Full specification <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-zinc-600" data-testid="showcase-assurance">
            Made in India · GeM Registered OEM · ISO 9001 / 14001 / 27001
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* --------------------------------------------------------------- banners -- */

export const PdpBanner = ({ model, theme, image, headline, subline, kicker }) => (
  // contain={false} flush: text sits ON the image, so the section paints its own
  // spacing. It takes the shared top rule rather than drawing its own.
  <Band theme={theme} contain={false} flush className="relative" data-testid="showcase-banner">
    <ParallaxImage src={image || model.heroImage} alt={model.name} aspect="aspect-[21/9] md:aspect-[21/7]" />
    <div className="keep-dark absolute inset-0 bg-black/45 flex items-center justify-center text-center px-6">
      <Reveal>
        <p className="kicker-sq justify-center text-[10px] uppercase tracking-[0.35em] text-zinc-200 mb-5">
          {kicker ?? theme?.kicker ?? "Engineering the future"}
        </p>
        <h2
          className="font-display text-3xl md:text-6xl font-black tracking-tighter text-white leading-[1.02] max-w-4xl"
          data-testid="showcase-banner-headline"
        >
          {headline ?? model.name}
        </h2>
        <p className="mt-5 text-sm md:text-base text-zinc-200 max-w-2xl mx-auto">
          {subline ?? model.intro}
        </p>
      </Reveal>
    </div>
  </Band>
);

/* ---------------------------------------------------- the big-number band -- */

/**
 * The reference page's signature device: one hardware idea reduced to two to
 * four enormous numbers. Costs no photography, which is exactly why Minisforum
 * leans on it so heavily — the page reads rich on typography alone.
 */
export const PdpStatWall = ({ theme, heading, body, stats = [], align = "center" }) => {
  if (!stats.length) return null;
  const centered = align === "center";
  return (
    <Band theme={theme} data-testid="pdp-statwall">
      <SectionHead
        theme={theme}
        heading={heading}
        body={body}
        align={centered ? "center" : "left"}
      />
      <div className={`mt-14 grid gap-px bg-white/10 border border-white/10 grid-cols-1 sm:grid-cols-2 ${
        stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : ""
      }`}>
        {stats.map(([value, label, note], n) => (
          <Reveal key={label} delay={n * 0.06}>
            <div className="bg-[#0A0A0A] p-8 md:p-10 h-full">
              <div
                className="font-display font-black tracking-tighter leading-[0.95] text-4xl md:text-6xl"
                style={{ color: ACCENT }}
              >
                {value}
              </div>
              <div className="mt-4 text-sm text-white font-semibold">{label}</div>
              {note && <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{note}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Band>
  );
};

export const PdpMarquee = ({ items = [], speed = 38 }) => {
  if (!items.length) return null;
  // Duplicated once so the translation can wrap with no visible seam.
  const row = [...items, ...items];
  return (
    <section className="border-t border-white/10 overflow-hidden py-6" data-testid="pdp-marquee">
      <div
        className="flex gap-12 whitespace-nowrap w-max animate-[pdp-marquee_linear_infinite]"
        style={{ animationDuration: `${speed}s` }}
      >
        {row.map((t, n) => (
          <span key={n} className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-12">
            {t}
            <span className="w-1 h-1 rounded-full" style={{ background: ACCENT }} />
          </span>
        ))}
      </div>
    </section>
  );
};

/* ----------------------------------------------------------- feature grid -- */

export const PdpFeatureGrid = ({ theme, heading, body, items = [], cols = 4 }) => {
  if (!items.length) return null;
  // Six cards in a four-wide grid leave a ragged row of two. `cols` lets a page
  // pick the width its own card count divides into, which is why the reference
  // page's grids always land square.
  const wide = cols === 3 ? "lg:grid-cols-3" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4";
  return (
    <Band theme={theme} border={false} data-testid="showcase-features">
      <SectionHead
        theme={theme}
        heading={heading ?? "Everything your fleet needs."}
        body={body}
        align="center"
      />
      <div className={`mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 ${wide} gap-px bg-white/10 border border-white/10`}>
        {items.map((f, n) => {
          const Icon = ICONS[f.icon] ?? Cpu; // an unknown name would render undefined and crash
          return (
            <Reveal key={f.title} delay={n * 0.05}>
              {/* pdp-card rather than a bg-[#0A0A0A] literal: that literal is painted
                  by a gradient in the dark sheet, and the `background` shorthand
                  wipes the colour, so the light override left the card with no
                  background at all. pdp-card carries both themes and the
                  model's own surface tint. */}
              <div className="group pdp-card p-8 h-full hover:brightness-125 transition-[filter] duration-300" data-testid={`showcase-feature-${n}`}>
                <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" style={{ color: ACCENT_SOFT }} />
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-white">{f.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Band>
  );
};

/* --------------------------------------------------------- audience tabs -- */

export const PdpAudiences = ({ theme, heading, items = [] }) => {
  const [n, setN] = useState(0);
  const aud = items[n];
  if (!aud) return null;
  return (
    <Band theme={theme} data-testid="showcase-audiences">
      <Reveal>
        <BandHeading className="text-center mb-12">{heading ?? "One platform. Every team."}</BandHeading>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="flex flex-wrap justify-center gap-2.5 mb-14" data-testid="showcase-audience-tabs">
          {items.map((a, k) => (
            <button
              key={a.id}
              onClick={() => setN(k)}
              data-testid={`audience-tab-${a.id}`}
              style={k === n ? { background: ACCENT, borderColor: "transparent", color: "#fff" } : undefined}
              className={`rounded-full px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                k === n ? "" : "border-white/15 text-zinc-400 hover:text-white hover:border-white/40"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div
          key={aud.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          data-testid="audience-panel"
        >
          <div className="overflow-hidden border border-white/10 aspect-[16/10]">
            <img src={aud.image} alt={aud.label} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <Kicker className="mb-4">{aud.label}</Kicker>
            <h3 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
              {aud.heading}
            </h3>
            <p className="mt-5 text-zinc-400 leading-relaxed">{aud.desc}</p>
            <ul className="mt-6 space-y-3" data-testid="audience-bullets">
              {(aud.bullets ?? []).map((b) => (
                <li key={b} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-1.5 w-1.5 h-1.5 shrink-0" style={{ background: ACCENT }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </Band>
  );
};

/* ------------------------------------------------------------- story bands -- */

export const PdpBleed = ({ theme, kicker, heading, body, image, flip = false, index = 0 }) => (
  // Edge to edge, but the copy column takes its vertical rhythm from the page's
  // density instead of the fixed p-8/16/24 it used to hardcode.
  <Band theme={theme} contain={false} flush data-testid={`showcase-bleed-${index}`}>
    <div className={`grid grid-cols-1 md:grid-cols-2 ${flip ? "md:[direction:rtl]" : ""}`}>
      <div className="md:[direction:ltr]">
        <ParallaxImage src={image} alt={heading} aspect="aspect-[16/11] md:aspect-auto md:h-full" />
      </div>
      <div className={`md:[direction:ltr] flex items-center px-8 md:px-16 lg:px-24 ${theme?.band ?? "py-20 md:py-28"}`}>
        <SectionHead theme={theme} kicker={kicker} heading={heading} body={body} align="left" />
      </div>
    </div>
  </Band>
);

/** Copy pinned while a column of media scrolls past it. */
export const PdpStickySplit = ({ theme, kicker, heading, body, points = [], media = [] }) => {
  if (!media.length) return null;
  return (
    <Band theme={theme} data-testid="pdp-sticky-split">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <Kicker>{kicker}</Kicker>
          <BandHeading>{heading}</BandHeading>
          {body && <p className="mt-5 text-zinc-400 leading-relaxed max-w-md">{body}</p>}
          {!!points.length && (
            <ul className="mt-7 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-1.5 w-1.5 h-1.5 shrink-0" style={{ background: ACCENT }} />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          {media.map((m, n) => (
            <Reveal key={m.src ?? n} delay={n * 0.06}>
              <figure className="border border-white/10 overflow-hidden">
                <img src={m.src} alt={m.caption ?? ""} loading="lazy" className="w-full object-cover" />
                {m.caption && (
                  <figcaption className="px-5 py-4 text-xs text-zinc-500 border-t border-white/10">
                    {m.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  );
};

/* ------------------------------------------------------------- comparison -- */

/**
 * This configuration against its siblings.
 *
 * Uses the shared familyKey from models.js rather than a second definition, so
 * "sibling" means the same thing here as it does in the spec sheet.
 */
export const PdpCompare = ({ model, theme, heading, subline, rows = [], against }) => {
  const family = useMemo(() => {
    // `against` is for ranges that familyKey deliberately keeps apart. Each
    // PROMAX is its own family — different chassis prefix — but a buyer choosing
    // between Q870, W880, W680 and T4 Plus genuinely wants them side by side.
    if (against?.length) {
      const want = [model.slug, ...against];
      return want.map((s) => ALL_MODELS.find((m) => m.slug === s)).filter(Boolean);
    }
    return ALL_MODELS.filter((m) => familyKey(m) === familyKey(model));
  }, [model, against]);
  if (family.length < 2 || !rows.length) return null;

  const valueFor = (m, label) => {
    const hit = (m.specGroups ?? []).flatMap((g) => g.items ?? []).find(([l]) => l === label);
    return hit ? hit[1] : "—";
  };

  return (
    <Band theme={theme} data-testid="pdp-compare">
      <Reveal>
        <BandHeading className="mb-3">{heading ?? "How this one differs."}</BandHeading>
        <p className="text-sm text-zinc-500 mb-10">
          {subline ?? "Same chassis, different platform. Only the rows that actually change are shown."}
        </p>
      </Reveal>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left p-4 border-b border-white/15 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-normal" />
              {family.map((m) => (
                <th
                  key={m.slug}
                  className="text-left p-4 border-b border-white/15 font-display font-bold tracking-tight text-white"
                  style={m.slug === model.slug ? { color: ACCENT } : undefined}
                >
                  {m.name.split(" — ")[1] ?? m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((label) => (
              <tr key={label}>
                <td className="p-4 border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-zinc-500 align-top">
                  {label}
                </td>
                {family.map((m) => (
                  <td
                    key={m.slug}
                    className={`p-4 border-b border-white/10 align-top ${
                      m.slug === model.slug ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {valueFor(m, label)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Band>
  );
};

/* ----------------------------------------------------------------- I/O map -- */

/**
 * A port label, stacked over or under its dot rather than beside it.
 *
 * `whitespace-nowrap` is what makes the collision maths in the data files
 * predictable, because a label's width is then a function of its text alone.
 */
const PinLabel = ({ side, align, children }) => (
  <span
    className={[
      // Below `sm` the figure is too narrow for six of these side by side, so
      // the labels drop out and the numbered legend under the figure carries
      // the same information instead.
      "hidden sm:block absolute whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-sm",
      side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
      // A centred label on a pin near the frame edge hangs off it, so the ones
      // at the edges grow inwards instead. Derived from the pin's own x rather
      // than authored, so a re-crop cannot leave a stale override behind.
      align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
    ].join(" ")}
  >
    {children}
  </span>
);

/**
 * Ports listed beside the photograph of the actual panel they sit on.
 * The rows come from the model's own I/O spec entries, so the list cannot drift
 * from the spec sheet.
 */
export const PdpIoMap = ({
  model, theme, image, heading, body, caption,
  faces = [], aspect = "aspect-[16/9]",
}) => {
  const io = useMemo(
    () =>
      (model.specGroups ?? [])
        .flatMap((g) => g.items ?? [])
        .filter(([l]) => /i\/o|network|front|rear/i.test(l)),
    [model]
  );
  const [face, setFace] = useState(0);
  const shown = faces[face] ?? null;
  const src = shown?.image ?? image;
  if (!src || !io.length) return null;

  return (
    <Band theme={theme} data-testid="pdp-io-map">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          {faces.length > 1 && (
            <div className="mb-5 flex flex-wrap gap-2" data-testid="pdp-io-faces">
              {faces.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setFace(i)}
                  data-testid={`pdp-io-face-${i}`}
                  aria-pressed={i === face}
                  className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={
                    i === face
                      ? { background: ACCENT, borderColor: "transparent", color: "#fff" }
                      : { borderColor: "rgba(255,255,255,0.15)", color: "#a1a1aa" }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          <Reveal>
            <figure className={`relative border border-white/10 overflow-hidden ${aspect}`}>
              <img
                src={src}
                alt={shown ? `${model.name} — ${shown.label}` : `${model.name} I/O`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* Pins are placed in fractions of the frame, the same convention
                  PdpWalkthrough uses, so a face can be re-cropped without any
                  pin needing to be re-measured in pixels. */}
              {(shown?.pins ?? []).map((pin, p) => (
                // The dot is the anchor and sits exactly on (x, y); the label
                // hangs off it. Centring a label-plus-dot stack on the pin
                // instead would push the dot off the port it is naming.
                <span
                  key={`${pin.port}-${pin.x}-${pin.y}`}
                  className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-black/50"
                  style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%`, background: ACCENT }}
                >
                  <span className="sm:hidden absolute inset-0 flex items-center justify-center text-[7px] font-bold leading-none text-white">
                    {p + 1}
                  </span>
                  <PinLabel
                    side={pin.side}
                    align={pin.x < 0.22 ? "start" : pin.x > 0.78 ? "end" : "center"}
                  >
                    {pin.port}
                  </PinLabel>
                </span>
              ))}
            </figure>
          </Reveal>
          {!!(shown?.pins ?? []).length && (
            <ol className="sm:hidden mt-4 grid grid-cols-2 gap-x-4 gap-y-2" data-testid="pdp-io-legend">
              {shown.pins.map((pin, p) => (
                <li key={pin.port} className="flex items-start gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                  <span
                    className="mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px] font-bold leading-none text-white"
                    style={{ background: ACCENT }}
                  >
                    {p + 1}
                  </span>
                  {pin.port}
                </li>
              ))}
            </ol>
          )}
        </div>
        <Reveal delay={0.08}>
          <SectionHead
            theme={theme}
            kicker="Connectivity"
            heading={heading ?? "Every port you'll actually use."}
            body={body}
            align="left"
          />
          {/* The port list is derived from the model's own specGroups rather
              than authored here, so a diagram and the specification table below
              it cannot drift apart. */}
          <dl className="mt-8 divide-y divide-white/10 border-t border-white/10">
            {io.map(([label, value]) => (
              <div key={label} className="py-4">
                <dt className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ACCENT_SOFT }}>{label}</dt>
                <dd className="mt-1.5 text-sm text-zinc-300 leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
          {caption && <p className="mt-6 text-[10px] text-zinc-600 leading-relaxed">{caption}</p>}
        </Reveal>
      </div>
    </Band>
  );
};

/* ----------------------------------------------------------- component set -- */

/**
 * Component breakdown.
 *
 * These depict STANDARD PARTS the system contains — a DDR5 module, an M.2
 * drive, the cooler — not a diagram of a specific Latios interior. There is one
 * photograph of real Latios internals and it covers a single viewpoint, so an
 * exploded chassis diagram would have to invent board position, port counts and
 * bay layout. The captions say "component", never "inside your machine".
 */
export const PdpExploded = ({ theme, heading, body, parts = [], video, poster }) => {
  if (!parts.length && !video) return null;
  return (
    <Band theme={theme} data-testid="pdp-exploded">
      <SectionHead
        theme={theme}
        kicker="Inside the specification"
        heading={heading}
        body={body}
        align="left"
      />

      {video && (
        <Reveal delay={0.08}>
          <div className="mt-12 border border-white/10 overflow-hidden">
            <video
              src={video}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full aspect-video object-cover"
              data-testid="pdp-exploded-video"
            />
          </div>
        </Reveal>
      )}

      {!!parts.length && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {parts.map((p, n) => (
            <Reveal key={p.name} delay={n * 0.05}>
              <figure className="bg-[#0A0A0A] h-full">
                <img src={p.image} alt={p.name} loading="lazy" className="w-full aspect-square object-contain p-5" />
                <figcaption className="px-5 pb-5">
                  <span className="text-[10px] tabular-nums" style={{ color: ACCENT }}>
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-1 text-sm text-white font-semibold">{p.name}</div>
                  {p.note && <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{p.note}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
      <p className="mt-6 text-[10px] text-zinc-600">
        Component illustrations. Fitted parts vary by configuration.
      </p>
    </Band>
  );
};

export const PdpSpecTeaser = ({ theme, onViewSpecs, heading, body }) => (
  <Band theme={theme} data-testid="showcase-spec-teaser">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <Reveal>
        <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">
          {heading ?? "Every number that matters."}
        </h2>
        <p className="mt-3 text-sm text-zinc-500">
          {body ?? "Compare all configurations side by side in the full specification sheet."}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <AccentButton onClick={onViewSpecs} data-testid="showcase-spec-button">
          View specification
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </AccentButton>
      </Reveal>
    </div>
  </Band>
);
