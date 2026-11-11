import type { Variants, Transition } from 'framer-motion';

/**
 * Architectural motion presets:
 * Understated, precise, and editorial with no excessive bouncy motion.
 */
export const ARCHITECTURAL_TRANSITION: Transition = {
  duration: 0.65,
  ease: [0.16, 1, 0.3, 1], // Custom architectural cubic-bezier
};

export const FAST_TRANSITION: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: ARCHITECTURAL_TRANSITION,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: ARCHITECTURAL_TRANSITION,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
