/**
 * @file Reveal — scroll-triggered fade+rise animation.
 * Fires once via IntersectionObserver; respects prefers-reduced-motion.
 */
import {useRef, useState, useEffect} from 'react';

export function Reveal({children, delay = 0, as: Tag = 'div', style, className = '', ...rest}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      {threshold: 0.15, rootMargin: '0px 0px -40px 0px'},
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{transitionDelay: `${delay}ms`, ...style}}
      {...rest}
    >
      {children}
    </Tag>
  );
}
