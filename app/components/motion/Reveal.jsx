/**
 * Shared viewport reveal powered by Framer Motion.
 * Motion is intentionally subtle, runs once, and softens for reduced motion.
 */
import {motion, useReducedMotion} from 'framer-motion';

const EASE_OUT = [0.16, 0.84, 0.32, 1];

const HIDDEN_STATES = {
  default: {opacity: 0, y: 24, filter: 'blur(5px)'},
  card: {opacity: 0, y: 30, scale: 0.985, filter: 'blur(4px)'},
  scale: {opacity: 0, scale: 0.96, filter: 'blur(4px)'},
};

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
  const MotionTag = motion[Tag] ?? motion.div;
  const hidden = reduceMotion
    ? {opacity: 0}
    : (HIDDEN_STATES[variant] ?? HIDDEN_STATES.default);

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, amount: 0.14, margin: '0px 0px -40px 0px'}}
      variants={{
        hidden,
        visible: {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)'},
      }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.68,
        delay: delay / 1000,
        ease: EASE_OUT,
      }}
      className={`reveal ${className}`.trim()}
      style={{transitionDelay: `${delay}ms`, ...style}}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export const MOTION_EASE = EASE_OUT;
