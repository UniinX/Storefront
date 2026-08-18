/**
 * @file PDP breadcrumb — Home / productType / title, built from real
 * Shopify product data. The productType segment is omitted when the
 * product has none set.
 */
import {Link} from 'react-router';

export function Breadcrumb({productType, title}) {
  const crumbStyle = {color: 'var(--stone)', textDecoration: 'none'};
  const sepStyle = {color: 'var(--mist)'};

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        fontFamily: 'var(--font-work-sans)', fontSize: 13, marginBottom: 20,
      }}
    >
      <Link to="/" style={crumbStyle}>Home</Link>
      {productType && (
        <>
          <span style={sepStyle}>/</span>
          <span style={crumbStyle}>{productType}</span>
        </>
      )}
      <span style={sepStyle}>/</span>
      <span style={{color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60vw'}}>{title}</span>
    </nav>
  );
}
