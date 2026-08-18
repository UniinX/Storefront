/**
 * Shared viewport reveal powered by Framer Motion.
 * Motion is intentionally subtle, runs once, and softens for reduced motion.
 */
import {motion, useReducedMotion} from 'framer-motion';

export const MOTION_EASE = [0.21, 0.47, 0.32, 0.98];

const SINGLE_VARIANTS = {
  default: {
    hidden: {opacity: 0, y: 16},
    visible: {opacity: 1, y: 0},
  },
  card: {
    hidden: {opacity: 0, y: 20, scale: 0.985},
    visible: {opacity: 1, y: 0, scale: 1},
  },
  scale: {
    hidden: {opacity: 0, scale: 0.97},
    visible: {opacity: 1, scale: 1},
  },
};

function getMotionComponent(Tag) {
  if (typeof Tag === 'string') {
    return motion[Tag] ?? motion.div;
  }
  return motion.create(Tag);
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  variant = 'default',
  style,
  className = '',
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = getMotionComponent(Tag);
  const variants = SINGLE_VARIANTS[variant] ?? SINGLE_VARIANTS.default;

  return (
    <MotionTag
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{once: true, amount: 0.01, margin: '100px 0px 100px 0px'}}
      variants={
        reduceMotion
          ? {hidden: {opacity: 1}, visible: {opacity: 1}}
          : variants
      }
      transition={{
        duration: 0.42,
        delay: delay / 1000,
        ease: MOTION_EASE,
      }}
      className={`reveal ${className}`.trim()}
      style={{...(delay ? {transitionDelay: `${delay}ms`} : {}), ...style}}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerContainer({
  children,
  as: Tag = 'div',
  stagger = 0.06,
  delay = 0,
  className = '',
  style,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = getMotionComponent(Tag);

  return (
    <MotionTag
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{once: true, amount: 0.01, margin: '100px 0px 100px 0px'}}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : stagger,
            delayChildren: delay / 1000,
          },
        },
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  as: Tag = 'div',
  variant = 'default',
  className = '',
  style,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const MotionTag = getMotionComponent(Tag);
  const variants = SINGLE_VARIANTS[variant] ?? SINGLE_VARIANTS.default;

  return (
    <MotionTag
      variants={
        reduceMotion
          ? {hidden: {opacity: 1}, visible: {opacity: 1}}
          : variants
      }
      transition={{
        duration: 0.42,
        ease: MOTION_EASE,
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
