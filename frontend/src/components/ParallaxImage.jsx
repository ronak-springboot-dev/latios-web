import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxImage = ({ src, alt, aspect = "aspect-[4/3]" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <div ref={ref} className="group overflow-hidden border border-white/10">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className={`spotlight-img w-full ${aspect} object-cover scale-[1.2] will-change-transform`}
      />
    </div>
  );
};
