/**
 * @file CrossFade — soft cross-dissolve when `keyId` changes.
 * Used on the PDP garment photo and language caption.
 */
import {useState, useEffect} from 'react';

export function CrossFade({keyId, children, style}) {
  const [state, setState] = useState({key: keyId, node: children});
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (keyId === state.key) { setState({key: keyId, node: children}); return; }
    setVisible(false);
    const t = setTimeout(() => { setState({key: keyId, node: children}); setVisible(true); }, 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyId]);

  return (
    <div
      style={{
        transition: 'opacity 0.18s ease, transform 0.22s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.985)',
        ...style,
      }}
    >
      {state.node}
    </div>
  );
}
