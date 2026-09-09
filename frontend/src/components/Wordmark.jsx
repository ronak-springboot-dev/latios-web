/**
 * The Latios wordmark, in whichever theme is showing.
 *
 * The supplied mark is blue on transparent, which reads on paper and on a light
 * page and disappears on this site's near-black one. That was worked around by
 * sitting it on a white chip -- a white rounded rectangle floating in a dark
 * header, which is a patch, not a lockup. So there is a reversed copy of the
 * mark alongside it: same file, same size, same alpha channel to the pixel,
 * only the ink recoloured, so the letterforms are the supplied ones and nothing
 * has been redrawn.
 *
 * The swap is two rules in index.css keyed on the same html.light class the
 * theme toggle sets. Not Tailwind variants: this project configures
 * darkMode:["class"], which gives a `dark:` variant keyed on .dark, and the
 * theme here is the inverse -- dark by default, .light when toggled.
 *
 * The swap is CSS, not state. Both images are in the DOM and the theme class on
 * <html> decides which one is displayed, so switching themes cannot flash the
 * wrong mark and the correct one is right on first paint -- a JS swap would
 * render the dark-theme logo for a frame on a light page.
 *
 * If Latios has an official reversed lockup, replace
 * public/images/latios-wordmark-reversed.png with it; nothing here changes.
 */
export const Wordmark = ({ className = "h-6 w-auto", testid }) => (
  <span className="inline-flex items-center" data-testid={testid}>
    <img
      src="/images/latios-wordmark.png"
      alt="Latios"
      className={`${className} wordmark-ink`}
      data-testid={testid ? `${testid}-light` : undefined}
    />
    <img
      src="/images/latios-wordmark-reversed.png"
      alt="Latios"
      aria-hidden="true"
      className={`${className} wordmark-reversed`}
      data-testid={testid ? `${testid}-reversed` : undefined}
    />
  </span>
);
