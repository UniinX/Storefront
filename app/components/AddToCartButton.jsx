import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {CartForm} from '@shopify/hydrogen';

const ADDED_CONFIRMATION_MS = 1800;

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   className?: string;
 *   style?: React.CSSProperties;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   onAdded?: (cart: unknown) => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  className,
  style,
  disabled,
  lines,
  onClick,
  onAdded,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <AddToCartFeedback
          fetcher={fetcher}
          analytics={analytics}
          className={className}
          style={style}
          disabled={disabled}
          onClick={onClick}
          onAdded={onAdded}
        >
          {children}
        </AddToCartFeedback>
      )}
    </CartForm>
  );
}

function AddToCartFeedback({
  analytics,
  children,
  className,
  disabled,
  fetcher,
  onAdded,
  onClick,
  style,
}) {
  const reduceMotion = useReducedMotion();
  const [feedback, setFeedback] = useState('idle');
  const submittedRef = useRef(false);
  const resetTimerRef = useRef(null);
  const onAddedRef = useRef(onAdded);
  const pending = fetcher.state !== 'idle';

  useEffect(() => {
    onAddedRef.current = onAdded;
  }, [onAdded]);

  useEffect(() => {
    if (pending) {
      submittedRef.current = true;
      clearTimeout(resetTimerRef.current);
      setFeedback('adding');
      return undefined;
    }

    if (!submittedRef.current) return undefined;
    submittedRef.current = false;

    const errors = fetcher.data?.errors ?? [];
    if (errors.length > 0 || !fetcher.data?.cart) {
      setFeedback('error');
      resetTimerRef.current = setTimeout(
        () => setFeedback('idle'),
        ADDED_CONFIRMATION_MS,
      );
      return () => clearTimeout(resetTimerRef.current);
    }

    setFeedback('added');
    onAddedRef.current?.(fetcher.data.cart);
    resetTimerRef.current = setTimeout(
      () => setFeedback('idle'),
      ADDED_CONFIRMATION_MS,
    );
    return () => clearTimeout(resetTimerRef.current);
  }, [fetcher.data, pending]);

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const label =
    feedback === 'adding'
      ? 'Adding…'
      : feedback === 'added'
        ? 'Added ✓'
        : feedback === 'error'
          ? 'Couldn’t add — try again'
          : children;
  const locked = pending || feedback === 'added';

  return (
    <>
      <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
      <button
        type="submit"
        className={className}
        style={{
          ...style,
          cursor: locked ? 'wait' : disabled ? 'not-allowed' : style?.cursor,
        }}
        onClick={onClick}
        disabled={Boolean(disabled) || locked}
        aria-busy={pending}
        data-add-to-cart-state={feedback}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={feedback}
            initial={reduceMotion ? false : {opacity: 0, y: 4}}
            animate={{opacity: 1, y: 0}}
            exit={reduceMotion ? undefined : {opacity: 0, y: -4}}
            transition={{duration: reduceMotion ? 0 : 0.16}}
            className="inline-flex items-center justify-center"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {feedback === 'adding'
          ? 'Adding item to cart'
          : feedback === 'added'
            ? 'Item added to cart'
            : feedback === 'error'
              ? 'Item could not be added to cart'
              : ''}
      </span>
    </>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
