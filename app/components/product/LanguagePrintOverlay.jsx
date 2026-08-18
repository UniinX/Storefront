/**
 * @file LanguagePrintOverlay — the customization "design change" for the PDP
 * configurator. Since no product actually carries per-language artwork, the
 * selected language's native script/wordmark is stamped onto the garment's
 * print area (upper-chest) directly on the real product photo, styled to
 * read as an inked print (multiply blend + soft shadow) rather than a UI
 * label. Cross-fades between languages via CrossFade.
 */
import {CrossFade} from '~/components/motion/CrossFade.jsx';
import {fontVariable} from '~/lib/languages.js';

export function LanguagePrintOverlay({language}) {
  if (!language) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: '22%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '58%',
        maxWidth: 220,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
      }}
    >
      <CrossFade keyId={language.id}>
        {/* Fixed dark ink tone (not theme-driven `--ink`): a garment print
            doesn't recolor with the site's light/dark toggle, and white
            text under `multiply` would vanish entirely. */}
        <span
          dir={language.rtl ? 'rtl' : 'ltr'}
          style={{
            fontFamily: fontVariable(language.font),
            fontSize: 'clamp(22px, 4vw, 34px)',
            lineHeight: 1.1,
            color: 'rgba(24, 18, 14, 0.88)',
            textAlign: 'center',
            display: 'block',
          }}
        >
          {language.wordmark}
        </span>
      </CrossFade>
    </div>
  );
}
