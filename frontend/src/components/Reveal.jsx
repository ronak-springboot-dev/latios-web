/**
 * Reveal — static passthrough.
 *
 * This used to fade + translate its children in as they scrolled into view
 * (framer-motion `whileInView`). Per the design direction the product pages no
 * longer animate on scroll, so Reveal now renders its children immediately.
 * The `delay` / `y` props are accepted and ignored so the many call-sites need
 * no change.
 */
export const Reveal = ({ children, delay, y, className = "" }) => (
  <div className={className}>{children}</div>
);
