import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const KineticText = ({ lines, className = "", delay = 0, testId }) => (
  <h1 className={className} data-testid={testId}>
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
        <motion.span
          className="block will-change-transform"
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: delay + i * 0.13, ease: EASE }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </h1>
);
