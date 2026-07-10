import { Transition, Variants } from 'framer-motion';

/**
 * Enforced timing ceilings (< 350ms) for high-performance transitions
 */
export const MOTION_TIMINGS = {
  durationFast: 0.15,
  durationDefault: 0.25,
  durationSlow: 0.35,
};

/**
 * Standardized Easing physics presets
 */
export const MOTION_EASINGS = {
  easeOut: [0.16, 1, 0.3, 1] as const, // Custom fast decelerate
  anticipate: [0.76, 0, 0.24, 1] as const, // Expressive snap-back
};

/**
 * Reusable Spring Physics Transitions
 */
export const MOTION_TRANSITIONS = {
  // Snappy spring for buttons and tags
  springSnappy: {
    type: 'spring',
    stiffness: 400,
    damping: 18,
  } as Transition,

  // Smooth bouncy spring for modals, drawers, and orbs
  springBouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
  } as Transition,

  // Ultra-smooth spring for sidebar layout swaps
  springSmooth: {
    type: 'spring',
    stiffness: 220,
    damping: 24,
  } as Transition,
};

/**
 * Unified Layout Transition Presets
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: MOTION_TIMINGS.durationDefault, ease: MOTION_EASINGS.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: MOTION_TIMINGS.durationFast, ease: 'easeIn' }
  }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: MOTION_TIMINGS.durationDefault, ease: MOTION_EASINGS.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: MOTION_TIMINGS.durationFast, ease: 'easeIn' }
  }
};

export const modalScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { ...MOTION_TRANSITIONS.springSnappy }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: MOTION_TIMINGS.durationFast, ease: 'easeIn' }
  }
};

export const drawerSlideVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { duration: MOTION_TIMINGS.durationSlow, ease: MOTION_EASINGS.easeOut }
  },
  exit: { 
    x: '100%',
    transition: { duration: MOTION_TIMINGS.durationDefault, ease: 'easeIn' }
  }
};
