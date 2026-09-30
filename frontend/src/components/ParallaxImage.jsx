/**
 * ParallaxImage — now a static framed image.
 *
 * Previously the image drifted on scroll (a framer-motion `useScroll` /
 * `useTransform` y-offset, with the picture pre-scaled to 1.2 to hide the
 * edges as it moved). Scroll animation has been removed from the product
 * pages, so the picture now sits still at its natural scale. The `.spotlight-img`
 * hover treatment (grayscale → colour, subtle zoom) is kept — that is a hover
 * effect, not a scroll one.
 */
export const ParallaxImage = ({ src, alt, aspect = "aspect-[4/3]" }) => (
  <div className="group overflow-hidden border border-white/10">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`spotlight-img w-full ${aspect} object-cover`}
    />
  </div>
);
