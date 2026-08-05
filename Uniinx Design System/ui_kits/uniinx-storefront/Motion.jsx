/**
 * Shared motion helpers for the storefront kit. Kept in one file so
 * every screen (home, PLP, PDP, cart) uses the same easing/timing
 * vocabulary instead of one-off transitions per component.
 *
 * - <Reveal> fades + rises an element into place the first time it
 *   scrolls into view (IntersectionObserver, fires once, respects
 *   prefers-reduced-motion via the .reveal CSS rule in index.html).
 * - <CrossFade> swaps its `keyId`-addressed child with a soft
 *   cross-dissolve instead of a hard cut (used for the PDP garment
 *   photo + "printed in ___" caption).
 * - pressable(el) is a tiny onMouseDown/Up/Leave helper for a
 *   consistent "press" micro-interaction on tappable cards.
 */

function Reveal({ children, delay = 0, as = "div", style, className = "", ...rest }) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function CrossFade({ keyId, children, style }) {
  const [display, setDisplay] = React.useState({ key: keyId, node: children });
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (keyId === display.key) {
      setDisplay({ key: keyId, node: children });
      return;
    }
    setVisible(false);
    const t = setTimeout(() => {
      setDisplay({ key: keyId, node: children });
      setVisible(true);
    }, 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyId]);

  return (
    <div
      style={{
        transition: "opacity 0.18s ease, transform 0.22s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.985)",
        ...style,
      }}
    >
      {display.node}
    </div>
  );
}

function pressable(scaleDown = 0.97) {
  return {
    onMouseDown: (e) => (e.currentTarget.style.transform = `scale(${scaleDown})`),
    onMouseUp: (e) => (e.currentTarget.style.transform = ""),
    onMouseLeave: (e) => (e.currentTarget.style.transform = ""),
  };
}

window.Reveal = Reveal;
window.CrossFade = CrossFade;
window.pressable = pressable;
