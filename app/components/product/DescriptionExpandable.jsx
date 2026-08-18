/**
 * @file Product description block — clamps long descriptions to a short
 * teaser with a "show more" toggle, matching the Kaft PDP pattern. Renders
 * nothing when the product has no description.
 */
import {useState} from 'react';

const TEASER_THRESHOLD = 180;

export function DescriptionExpandable({description, descriptionHtml}) {
  const [expanded, setExpanded] = useState(false);

  if (!description && !descriptionHtml) return null;

  const needsToggle = (description?.length ?? 0) > TEASER_THRESHOLD;

  return (
    <div style={{marginTop: 12, fontFamily: 'var(--font-work-sans)', fontSize: 14, lineHeight: 1.55, color: 'var(--stone)'}}>
      {expanded && descriptionHtml ? (
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      ) : (
        <p
          style={
            needsToggle
              ? {margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}
              : {margin: 0}
          }
        >
          {description}
        </p>
      )}
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{marginTop: 6, minHeight: 32, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--ink)', textDecoration: 'underline'}}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
