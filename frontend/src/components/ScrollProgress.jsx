import { motion, useScroll } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      data-testid="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[3px] bg-white origin-left z-[70] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
