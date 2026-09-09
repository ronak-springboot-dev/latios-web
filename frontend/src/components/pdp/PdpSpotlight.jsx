/**
 * One idea: a centred heading, then the picture underneath.
 *
 * This is the reference page's workhorse — it appears eight or more times on a
 * single Minisforum product page — and it was the one shape this codebase had
 * no way to express. The neighbours are all subtly different jobs: `bleed` is a
 * side-by-side split, `banner` puts the text ON the image, `stickySplit` pins
 * copy beside a scrolling media column. None of them is "say the thing, then
 * show it full width underneath", which is the rhythm a reader actually
 * remembers about that page.
 *
 * Everything below the media is optional, and that is what lets one component
 * cover most of the reference's feature sections:
 *
 *   stats    the big-number row ("40Gbps", "8K@60Hz", "100W PD")
 *   columns  the two-to-four benefit columns under a hero image
 *   caption  the disclaimer line the honest ones carry
 *
 * On `media` vs a nested object: section data is scanned by verify_pages.mjs
 * with a depth-blind regex for any key called `type`, and it builds each page's
 * section order from what it finds. A nested `media: { type: "video" }` would
 * be read as a section called "video" that does not exist, silently corrupting
 * the order string every uniqueness check depends on. So the media is two flat
 * sibling keys, `image` and `video`, and never a shape with a `type` in it.
 */
import { ParallaxImage } from "@/components/ParallaxImage";
import { ACCENT, Band, Reveal, SectionHead } from "./primitives";

export const PdpSpotlight = ({
  theme,
  model,
  kicker,
  heading,
  body,
  image,
  video,
  poster,
  alt,
  aspect = "aspect-[21/9]",
  align = "center",
  stats = [],
  columns = [],
  caption,
  index = 0,
}) => {
  if (!image && !video && !heading) return null;

  return (
    <Band theme={theme} data-testid={`pdp-spotlight-${index}`}>
      <SectionHead theme={theme} kicker={kicker} heading={heading} body={body} align={align} />

      {(image || video) && (
        <Reveal delay={0.1}>
          <div className={heading || body ? "mt-12 md:mt-16" : ""}>
            {video ? (
              <div className="overflow-hidden border border-white/10">
                <video
                  src={video}
                  poster={poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={alt ?? heading ?? model?.name}
                  className={`w-full ${aspect} object-cover`}
                />
              </div>
            ) : (
              <ParallaxImage src={image} alt={alt ?? heading ?? model?.name ?? ""} aspect={aspect} />
            )}
          </div>
        </Reveal>
      )}

      {!!stats.length && (
        <div
          className={`mt-12 grid gap-px bg-white/10 border border-white/10 grid-cols-1 sm:grid-cols-2 ${
            stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : ""
          }`}
          data-testid={`pdp-spotlight-${index}-stats`}
        >
          {stats.map(([value, label, note], n) => (
            <Reveal key={label} delay={n * 0.06}>
              <div className="pdp-card p-8 md:p-10 h-full">
                <div
                  className="font-display font-black tracking-tighter leading-[0.95] text-3xl md:text-5xl"
                  style={{ color: ACCENT }}
                >
                  {value}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-300">{label}</div>
                {note && <p className="mt-2.5 text-sm text-zinc-500 leading-relaxed">{note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {!!columns.length && (
        <div
          className={`mt-12 grid grid-cols-1 sm:grid-cols-2 ${
            columns.length >= 3 ? "lg:grid-cols-3" : ""
          } ${theme?.gap ?? "gap-10 md:gap-16"}`}
          data-testid={`pdp-spotlight-${index}-columns`}
        >
          {columns.map((c, n) => (
            <Reveal key={c.title} delay={n * 0.06}>
              <h3 className="font-display text-lg font-bold tracking-tight text-white">{c.title}</h3>
              <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      )}

      {caption && <p className="mt-6 text-[10px] text-zinc-600 leading-relaxed">{caption}</p>}
    </Band>
  );
};
