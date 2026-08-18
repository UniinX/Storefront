/**
 * @file Expand/collapse primitive used for the below-the-fold PDP sections
 * (Details, Materials, Care, Sustainability). An item with no content
 * renders nothing, so sections backed by an empty/missing metafield simply
 * don't appear instead of showing an empty accordion row.
 */
import {useState} from 'react';

export function Accordion({children}) {
  return <div style={{borderTop: '1px solid var(--mist)'}}>{children}</div>;
}

export function AccordionItem({title, children}) {
  const [open, setOpen] = useState(false);
  const hasContent = children !== null && children !== undefined && children !== false;

  if (!hasContent) return null;

  return (
    <div style={{borderBottom: '1px solid var(--mist)'}}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', minHeight: 44, padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-work-sans)', fontSize: 15, color: 'var(--ink)',
        }}
      >
        {title}
        <span aria-hidden="true" style={{fontSize: 18, color: 'var(--stone)'}}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{paddingBottom: 20, fontFamily: 'var(--font-work-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--stone)'}}>
          {children}
        </div>
      )}
    </div>
  );
}
