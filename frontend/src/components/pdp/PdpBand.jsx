/**
 * Composed marketing bands — artwork with the typography already in the pixels.
 *
 * Modelled on the image-plus-typography bands on minisforum.com, which ship as
 * 1200px-wide near-square and portrait assets with the headline, hero number and
 * supporting copy composited in. Ours are built by tools/image-processing/
 * make_bands.py: the model renders artwork only, and every character is set
 * afterwards from the vendored Outfit and Manrope faces, because a diffusion
 * model cannot spell — this project has the "Lohxs" and "DDR2V" renders to
 * prove it.
 *
 * THE RULE HERE: a band with type baked into it is NEVER cropped or stretched.
 *
 * That is not a stylistic preference. An earlier version gave the portrait band
 * `md:h-full` with `object-cover` so it would match the height of the two
 * stacked squares beside it. Stretching it vertically made `object-cover` crop
 * it horizontally — about 35% of its width — so "64GB" rendered as "4GB" and the
 * headline was sliced at both ends. Baked type cannot reflow out of trouble the
 * way real text can, so the layout has to guarantee the whole asset is shown.
 * tools/verify_pages.mjs asserts the rendered aspect matches the natural one.
 *
 * `alt` carries each band's real heading, so the copy that is locked in the
 * image is still available to screen readers and to search.
 */
import { Band, BandHeading, Kicker, Reveal } from "./primitives";

export const PdpBand = ({ theme, heading, kicker, body, items = [] }) => {
  if (!items.length) return null;

  // The portrait asset is the tall one; it leads the row on desktop and the
  // squares stack beside it. Ordering is by shape rather than by index so the
  // layout does not depend on make_bands.py's emission order.
  const portrait = items.find((i) => i.h > i.w) ?? items[1] ?? items[0];
  const rest = items.filter((i) => i !== portrait);

  // `aspect-ratio` from the asset's own dimensions, so the figure reserves the
  // right space before the lazy image decodes and never letterboxes after.
  const Figure = ({ item, className = "" }) => (
    <figure
      className={`overflow-hidden rounded-2xl bg-[#0a0a0c] ${className}`}
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
    >
      <img
        src={item.src}
        alt={item.alt}
        width={item.w}
        height={item.h}
        loading="lazy"
        decoding="async"
        // `contain`, not `cover`: the figure already matches the asset's aspect,
        // so this only ever protects against a rounding difference — and if one
        // occurs it letterboxes rather than eating a character.
        className="w-full h-full object-contain"
      />
    </figure>
  );

  return (
    <Band theme={theme} data-testid="showcase-bands">
      {(kicker || heading) && (
        <Reveal>
          {kicker && <Kicker>{kicker}</Kicker>}
          {heading && <BandHeading className="max-w-3xl">{heading}</BandHeading>}
          {body && (
            <p className="mt-5 text-sm md:text-base text-zinc-400 max-w-2xl">{body}</p>
          )}
        </Reveal>
      )}

      <Reveal>
        {/* Portrait on the left at its true height, squares stacked on the
            right at theirs. `items-start` so neither column stretches the
            other — the columns end at different heights and that is fine. */}
        <div
          className={`grid gap-4 md:gap-6 md:grid-cols-2 items-start ${heading ? "mt-12" : ""}`}
        >
          <Figure item={portrait} />
          <div className="grid gap-4 md:gap-6 content-start">
            {rest.map((item) => (
              <Figure key={item.src} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </Band>
  );
};
