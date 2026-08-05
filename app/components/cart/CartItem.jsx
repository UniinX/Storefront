/**
 * @file CartItem — single real cart line: image, title, selected options, price, quantity, remove.
 */
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useVariantUrl} from '~/lib/variants';

export function CartItem({line, isLeaving}) {
  const {id, merchandise, quantity, isOptimistic} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div
      className={`uniinx-cart-item${isLeaving ? ' is-leaving' : ''}`}
      style={{display: 'flex', gap: 20, alignItems: 'center', padding: 20, borderRadius: 'var(--radius-sm)', background: 'var(--paper-warm)'}}
    >
      {image ? (
        <Image
          data={image}
          alt={title}
          aspectRatio="7/9"
          width={88}
          height={110}
          style={{width: 88, height: 110, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0}}
        />
      ) : (
        <div className="uniinx-fabric" data-tone="maroon" style={{width: 88, height: 110, borderRadius: 'var(--radius-sm)', flexShrink: 0}} />
      )}
      <div style={{flex: 1, minWidth: 0}}>
        <Link to={lineItemUrl} style={{fontFamily: 'var(--font-marcellus)', fontSize: 20, color: 'var(--ink)'}}>
          {product.title}
        </Link>
        <div style={{fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--stone)', marginTop: 4}}>
          {selectedOptions.map((o) => `${o.name}: ${o.value}`).join(' · ')}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10}}>
          <CartLineUpdateButton lines={[{id, quantity: prevQuantity}]} disabled={quantity <= 1 || !!isOptimistic} label="−" />
          <span style={{fontFamily: 'var(--font-work-sans)', fontSize: 13, color: 'var(--ink)', minWidth: 16, textAlign: 'center'}}>{quantity}</span>
          <CartLineUpdateButton lines={[{id, quantity: nextQuantity}]} disabled={!!isOptimistic} label="+" />
        </div>
      </div>
      <div style={{fontFamily: 'var(--font-marcellus)', fontSize: 16, letterSpacing: 'var(--uniinx-tracking-wide)', color: 'var(--accent-cta)'}}>
        <Money data={line.cost.totalAmount} />
      </div>
      <CartLineRemoveButton lineIds={[id]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineUpdateButton({lines, disabled, label}) {
  const lineIds = lines.map((l) => l.id);
  return (
    <CartForm fetcherKey={['update', ...lineIds].join('-')} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines}}>
      <button
        type="submit"
        disabled={disabled}
        aria-label={label === '+' ? 'Increase quantity' : 'Decrease quantity'}
        style={{background: 'none', border: '1px solid var(--mist)', borderRadius: 'var(--radius-sm)', cursor: disabled ? 'default' : 'pointer', color: 'var(--ink)', width: 24, height: 24, lineHeight: 1, opacity: disabled ? 0.4 : 1}}
      >
        {label}
      </button>
    </CartForm>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm fetcherKey={['remove', ...lineIds].join('-')} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds}}>
      <button
        type="submit"
        disabled={disabled}
        aria-label="Remove"
        style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', fontSize: 20, minHeight: 44, minWidth: 44}}
      >
        ×
      </button>
    </CartForm>
  );
}
