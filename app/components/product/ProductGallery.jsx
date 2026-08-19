/**
 * @file PDP hero gallery — a full-width, continuously auto-scrolling
 * filmstrip of every product image (KAFT-style), with the purchase card
 * floating over it. While playing, the image set is rendered twice
 * back-to-back (the second copy `aria-hidden`) so the loop is visually
 * seamless. Autoplay stops for good — no separate control, no resume.
 *
 * Two different stop feels, matched to how the user triggered it:
 *  - Touching/dragging the strip directly stops it immediately — that's
 *    the user taking manual control, so it should respond instantly.
 *  - Scrolling the page waits a beat (the user might just be nudging the
 *    page, not deliberately dismissing the animation) and then eases the
 *    speed down to zero rather than cutting it like an off switch.
 *
 * Either way, once stopped it renders just the original images with no
 * duplication, so manual browsing only ever encounters the real set.
 * Autoplay never starts at all when the user prefers reduced motion, and
 * always pauses while the tab is hidden.
 */
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useReducedMotion} from 'framer-motion';
import {Image} from '@shopify/hydrogen';

const PIXELS_PER_SECOND = 55;
const SCROLL_STOP_GRACE_MS = 1000;
const SCROLL_STOP_FADE_MS = 500;

export function ProductGallery({images = [], productTitle}) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef(null);
  const firstDuplicateRef = useRef(null);
  // The exact scroll position where the duplicate copy begins — measured
  // from the actual rendered layout (not assumed to be scrollWidth / 2,
  // which is wrong here because the scroller's edge padding only exists
  // once, at the outer ends, not between the two copies. Trusting that
  // assumption let a small, consistent per-loop error compound until the
  // browser clamped scrollLeft at its scroll bounds, which looked like the
  // animation "stopping" after a few loops).
  const wrapPointRef = useRef(0);
  const pendingScrollLeftRef = useRef(null);
  // Set to a performance.now() timestamp once a page-scroll fade-out has
  // begun; null while playing at full speed or already stopped.
  const fadeStartRef = useRef(null);
  const scrollGraceTimerRef = useRef(null);
  const [playing, setPlaying] = useState(!reduceMotion && images.length > 1);

  useEffect(() => {
    setPlaying(!reduceMotion && images.length > 1);
  }, [reduceMotion, images.length]);

  const finalizeStop = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller && wrapPointRef.current > 0) {
      pendingScrollLeftRef.current = scroller.scrollLeft % wrapPointRef.current;
    }
    setPlaying(false);
  }, []);

  // Direct interaction with the strip — stop instantly, no fade. The user
  // is taking over manually, so a lingering glide would just fight them.
  const stopImmediately = useCallback(() => {
    if (!playing) return;
    finalizeStop();
  }, [playing, finalizeStop]);

  // Page scroll — wait a beat, then ease out instead of cutting.
  const requestScrollStop = useCallback(() => {
    if (!playing || fadeStartRef.current !== null || scrollGraceTimerRef.current) {
      return;
    }
    scrollGraceTimerRef.current = setTimeout(() => {
      scrollGraceTimerRef.current = null;
      fadeStartRef.current = performance.now();
    }, SCROLL_STOP_GRACE_MS);
  }, [playing]);

  useEffect(() => {
    if (!playing) return undefined;
    window.addEventListener('scroll', requestScrollStop, {passive: true});
    return () => {
      window.removeEventListener('scroll', requestScrollStop);
      if (scrollGraceTimerRef.current) {
        clearTimeout(scrollGraceTimerRef.current);
        scrollGraceTimerRef.current = null;
      }
    };
  }, [playing, requestScrollStop]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const firstDuplicate = firstDuplicateRef.current;
    if (!scroller || !firstDuplicate || !playing) return undefined;

    const scrollerRect = scroller.getBoundingClientRect();
    const duplicateRect = firstDuplicate.getBoundingClientRect();
    wrapPointRef.current =
      duplicateRect.left - scrollerRect.left + scroller.scrollLeft;
    fadeStartRef.current = null;

    let frameId;
    let lastTime;

    function tick(time) {
      if (lastTime === undefined) lastTime = time;
      const deltaSeconds = (time - lastTime) / 1000;
      lastTime = time;

      if (!document.hidden) {
        let speed = PIXELS_PER_SECOND;
        if (fadeStartRef.current !== null) {
          const elapsed = time - fadeStartRef.current;
          const remaining = Math.max(0, 1 - elapsed / SCROLL_STOP_FADE_MS);
          speed *= remaining;
          if (remaining === 0) {
            finalizeStop();
            return;
          }
        }

        scroller.scrollLeft += speed * deltaSeconds;
        if (scroller.scrollLeft >= wrapPointRef.current) {
          scroller.scrollLeft -= wrapPointRef.current;
        }
      }
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [playing, finalizeStop]);

  // Once the duplicated copy is removed (autoplay stopped), restore the
  // equivalent position within the single real set so there's no visual
  // jump — the real portion's layout is identical whether or not a
  // duplicate copy follows it, so `scrollLeft % wrapPoint` maps directly.
  useLayoutEffect(() => {
    if (playing) return;
    const scroller = scrollerRef.current;
    if (scroller && pendingScrollLeftRef.current != null) {
      scroller.scrollLeft = pendingScrollLeftRef.current;
      pendingScrollLeftRef.current = null;
    }
  }, [playing]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-[#f4f2ee] lg:aspect-[21/9]">
        <span className="font-work text-xs opacity-40">
          Garment Preview Template
        </span>
      </div>
    );
  }

  const loopImages =
    playing && images.length > 1 ? [...images, ...images] : images;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onPointerDown={stopImmediately}
        onWheel={stopImmediately}
        onTouchStart={stopImmediately}
        className="flex gap-3 overflow-x-auto px-5 scrollbar-none sm:px-8 lg:gap-4 lg:px-0"
        role="group"
        aria-label={`${productTitle} — product images`}
      >
        {loopImages.map((img, idx) => {
          const isDuplicate = idx >= images.length;
          return (
            <div
              key={`${img.id || idx}-${isDuplicate ? 'dup' : 'orig'}`}
              ref={isDuplicate && idx === images.length ? firstDuplicateRef : undefined}
              aria-hidden={isDuplicate || undefined}
              className="relative aspect-[4/5] w-[80vw] max-w-[420px] shrink-0 overflow-hidden bg-[#f4f2ee] sm:w-[60vw] lg:w-[42vw] lg:max-w-[640px]"
            >
              <Image
                data={img}
                aspectRatio="4/5"
                alt={
                  isDuplicate
                    ? ''
                    : img.altText || `${productTitle} view ${idx + 1}`
                }
                sizes="(min-width: 1024px) 42vw, 80vw"
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
