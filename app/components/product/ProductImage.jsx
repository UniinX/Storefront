/**
 * @file Product preview panel — real Shopify variant image with the
 * language print overlay layered on top, plus a fabric-texture placeholder
 * fallback for products with no image.
 */
import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {CrossFade} from '~/components/motion/CrossFade.jsx';
import {fontVariable} from '~/lib/languages.js';
import {LanguagePrintOverlay} from './LanguagePrintOverlay.jsx';

export function ProductImage({image, language}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <div
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        className="relative overflow-hidden cursor-zoom-in"
        style={{
          aspectRatio: '7 / 9',
          maxWidth: 480,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--paper-warm)',
        }}
      >
        <CrossFade keyId={image?.id ?? 'placeholder'}>
          <div
            className={image ? undefined : 'uniinx-fabric'}
            data-tone={image ? undefined : 'maroon'}
            style={{
              width: '100%',
              aspectRatio: '7 / 9',
              display: image ? 'block' : 'flex',
              alignItems: 'flex-end',
              padding: image ? 0 : 24,
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {image ? (
              <Image
                data={image}
                alt={image.altText || 'Product photo'}
                aspectRatio="7/9"
                sizes="(min-width: 45em) 480px, 100vw"
                className="transition-transform duration-500 ease-out"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: zoomed ? 'scale(1.08)' : 'scale(1)',
                }}
              />
            ) : (
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  opacity: 0.85,
                  fontFamily: 'var(--font-work-sans)',
                  fontSize: 13,
                  color: 'var(--ink)',
                }}
              >
                Garment photography placeholder
              </span>
            )}
          </div>
        </CrossFade>
        <LanguagePrintOverlay language={language} />
      </div>
      <CrossFade keyId={language?.id}>
        <p
          dir={language?.rtl ? 'rtl' : 'ltr'}
          style={{
            marginTop: 16,
            fontFamily: fontVariable(language?.font ?? 'marcellus'),
            fontSize: 15,
            color: 'var(--accent-primary)',
          }}
        >
          Printed in {language?.label} · {language?.native}
        </p>
      </CrossFade>
    </div>
  );
}
