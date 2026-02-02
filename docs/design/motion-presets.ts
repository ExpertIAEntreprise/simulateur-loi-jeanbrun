/**
 * Motion Presets - Simulateur Loi Jeanbrun
 *
 * Presets Framer Motion pour animations coherentes
 *
 * @version 1.0
 * @date 01 fevrier 2026
 *
 * Usage:
 * import { fadeInUp, staggerContainer, buttonHover } from '@/lib/motion'
 * <motion.div variants={fadeInUp} initial="hidden" animate="visible">
 */

import type { Variants, Transition, Target } from "framer-motion"

// =============================================================================
// 1. TRANSITIONS DE BASE
// =============================================================================

export const transitions = {
  /** Transition rapide pour micro-interactions */
  fast: {
    duration: 0.1,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  /** Transition standard pour UI */
  normal: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  /** Transition lente pour elements importants */
  slow: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  } satisfies Transition,

  /** Transition tres lente pour modals */
  slower: {
    duration: 0.5,
    ease: [0, 0, 0.2, 1],
  } satisfies Transition,

  /** Spring snappy pour boutons */
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  } satisfies Transition,

  /** Spring smooth pour cards */
  springSmooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  } satisfies Transition,

  /** Spring bounce pour celebratory */
  springBounce: {
    type: "spring" as const,
    stiffness: 500,
    damping: 15,
  } satisfies Transition,
} as const

// =============================================================================
// 2. VARIANTS FADE
// =============================================================================

/** Fade simple */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
}

/** Fade avec translation vers le haut */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
}

/** Fade avec translation vers le bas */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
}

/** Fade avec translation depuis la gauche */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
}

/** Fade avec translation depuis la droite */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
}

// =============================================================================
// 3. VARIANTS SCALE
// =============================================================================

/** Scale depuis le centre */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springSmooth,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
}

/** Scale avec bounce (celebratory) */
export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.springBounce,
  },
}

// =============================================================================
// 4. CONTAINERS AVEC STAGGER
// =============================================================================

/**
 * Container avec stagger pour orchestrer les enfants
 * Usage: <motion.div variants={staggerContainer} initial="hidden" animate="visible">
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

/** Stagger plus lent pour sections importantes */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/** Stagger avec entree depuis le bas */
export const staggerContainerUp: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// =============================================================================
// 5. VARIANTS INTERACTIFS (BOUTONS, CARDS)
// =============================================================================

/** Hover/Tap pour boutons primaires */
export const buttonHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0px oklch(0.78 0.18 75 / 0)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 30px oklch(0.78 0.18 75 / 0.4)",
    transition: transitions.normal,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
}

/** Hover/Tap pour boutons secondaires */
export const buttonSecondaryHover: Variants = {
  rest: {
    scale: 1,
    borderColor: "oklch(0.22 0.005 285)",
  },
  hover: {
    scale: 1.01,
    borderColor: "oklch(0.78 0.18 75)",
    transition: transitions.normal,
  },
  tap: {
    scale: 0.99,
    transition: transitions.fast,
  },
}

/** Hover pour cards selectionnables */
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 0 0px oklch(0.78 0.18 75 / 0)",
  },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: "0 10px 30px oklch(0 0 0 / 0.3)",
    transition: transitions.springSmooth,
  },
  tap: {
    scale: 0.99,
    transition: transitions.fast,
  },
}

/** Card selectionnee (toggle) */
export const cardSelected: Variants = {
  unselected: {
    scale: 1,
    borderColor: "oklch(0.22 0.005 285)",
    backgroundColor: "oklch(0.14 0.005 285)",
  },
  selected: {
    scale: 1,
    borderColor: "oklch(0.78 0.18 75)",
    backgroundColor: "oklch(0.78 0.18 75 / 0.1)",
    transition: transitions.spring,
  },
}

// =============================================================================
// 6. VARIANTS POUR FORMULAIRES MULTI-ETAPES
// =============================================================================

/** Transition entre etapes (slide horizontal) */
export const stepSlide: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: transitions.slow,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    transition: transitions.fast,
  }),
}

/** Transition entre etapes (fade simple) */
export const stepFade: Variants = {
  enter: {
    opacity: 0,
    y: 10,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
}

/** Progress bar fill */
export const progressFill: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1],
    },
  }),
}

/** Step dot */
export const stepDot: Variants = {
  upcoming: {
    scale: 1,
    backgroundColor: "oklch(0.30 0.01 0)",
    borderColor: "oklch(0.30 0.01 0)",
  },
  current: {
    scale: 1.2,
    backgroundColor: "oklch(0.07 0 0)",
    borderColor: "oklch(0.78 0.18 75)",
    boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.5)",
    transition: transitions.spring,
  },
  completed: {
    scale: 1,
    backgroundColor: "oklch(0.72 0.20 145)",
    borderColor: "oklch(0.72 0.20 145)",
    transition: transitions.spring,
  },
}

// =============================================================================
// 7. VARIANTS POUR RESULTATS
// =============================================================================

/** Apparition des resultats (celebratory) */
export const resultReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.2,
    },
  },
}

/** Nombre qui compte (utiliser avec animate={{ ... }}) */
export const numberCount = (from: number, to: number, duration = 2) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
})

/** Glow pulsant pour montants importants */
export const glowPulse: Variants = {
  initial: {
    boxShadow: "0 0 15px oklch(0.78 0.18 75 / 0.3)",
  },
  animate: {
    boxShadow: [
      "0 0 15px oklch(0.78 0.18 75 / 0.3)",
      "0 0 30px oklch(0.78 0.18 75 / 0.5)",
      "0 0 15px oklch(0.78 0.18 75 / 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

/** Check mark animation (success) */
export const checkMark: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        delay: 0.2,
      },
      opacity: { duration: 0.1 },
    },
  },
}

// =============================================================================
// 8. VARIANTS POUR MODALS/OVERLAYS
// =============================================================================

/** Backdrop de modal */
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, delay: 0.1 },
  },
}

/** Contenu de modal */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.springSmooth,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 5,
    transition: transitions.fast,
  },
}

/** Drawer (slide depuis le bas) */
export const drawer: Variants = {
  hidden: {
    y: "100%",
    opacity: 0.5,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.springSmooth,
  },
  exit: {
    y: "100%",
    opacity: 0.5,
    transition: transitions.slow,
  },
}

// =============================================================================
// 9. VARIANTS POUR ACCORDEON/FAQ
// =============================================================================

/** Contenu accordeon */
export const accordionContent: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.15 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
}

/** Chevron accordeon */
export const accordionChevron: Variants = {
  collapsed: { rotate: 0 },
  expanded: {
    rotate: 180,
    transition: transitions.normal,
  },
}

// =============================================================================
// 10. VARIANTS POUR TOOLTIPS
// =============================================================================

export const tooltip: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// =============================================================================
// 11. HOOKS PERSONNALISES (a mettre dans un fichier separe)
// =============================================================================

/**
 * Exemple d'utilisation avec useInView pour scroll-triggered animations
 *
 * ```tsx
 * import { useInView } from "framer-motion"
 *
 * function AnimatedSection({ children }) {
 *   const ref = useRef(null)
 *   const isInView = useInView(ref, { once: true, margin: "-100px" })
 *
 *   return (
 *     <motion.section
 *       ref={ref}
 *       variants={staggerContainer}
 *       initial="hidden"
 *       animate={isInView ? "visible" : "hidden"}
 *     >
 *       {children}
 *     </motion.section>
 *   )
 * }
 * ```
 */

// =============================================================================
// 12. PRESETS POUR REDUCED MOTION
// =============================================================================

/** Presets sans animation pour prefers-reduced-motion */
export const reducedMotionPresets = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 0, transition: { duration: 0 } },
  },
  scale: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  },
  slide: {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 0, transition: { duration: 0 } },
  },
} as const

/**
 * Hook pour detecter reduced motion
 *
 * ```tsx
 * import { useReducedMotion } from "framer-motion"
 *
 * function Component() {
 *   const prefersReducedMotion = useReducedMotion()
 *   const variants = prefersReducedMotion ? reducedMotionPresets.fade : fadeInUp
 *   return <motion.div variants={variants}>...</motion.div>
 * }
 * ```
 */
