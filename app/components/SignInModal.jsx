import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {LocalizedLogo} from './LocalizedLogo.jsx';

export function buildCustomerLoginPath({email = '', returnTo = '/account'} = {}) {
  const search = new URLSearchParams();
  if (email) search.set('login_hint', email);
  if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    search.set('return_to', returnTo);
  }
  const query = search.toString();
  return `/account/login${query ? `?${query}` : ''}`;
}

export function SignInModal({isOpen, onClose, returnTo = '/account', language = 'english'}) {
  const [email, setEmail] = useState('');
  const modalRef = useRef(null);
  const emailRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      requestAnimationFrame(() => emailRef.current?.focus());
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'Tab' && isOpen && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])')]
          .filter((element) => !element.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signin-dialog-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[12px] transition-all duration-300"
        >
          <button
            type="button"
            aria-label="Close sign-in dialog"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
          />
          <motion.div
            ref={modalRef}
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 20}}
            transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            className="relative z-10 w-full max-w-[440px] rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(20,16,14,0.3)] bg-brand-surface-light border border-black/5 transition-colors duration-200"
          >
            {/* Header / Dismiss Button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full flex items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-colors cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-2 flex flex-col items-center">
              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <LocalizedLogo
                  language={language}
                  style={{
                    height: 26,
                    width: 'auto',
                  }}
                  className="transition-all duration-200"
                />
              </div>

              {/* Title & Description */}
              <h2 id="signin-dialog-title" className="font-marcellus text-2xl md:text-3xl text-black text-center uppercase tracking-wide mb-3">
                Sign in or join UniinX
              </h2>
              <p className="font-work text-xs leading-relaxed text-black/50 text-center max-w-[280px] mb-8 font-light">
                Enter your email to sign in, or create a Shopify customer account if you are new. Track orders, manage your profile, and checkout faster.
              </p>

              {/* Form Inputs (Simulation & Shopify Login Trigger) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Redirect to standard login route
                  window.location.assign(buildCustomerLoginPath({email, returnTo}));
                }}
                className="w-full flex flex-col gap-4"
              >
                {/* Email Input */}
                <div className="flex flex-col gap-1 w-full">
                  <label
                    htmlFor="signin-email"
                    className="font-work text-[9px] tracking-wider text-black/45 uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    id="signin-email"
                    ref={emailRef}
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black text-sm font-work font-light focus:outline-none focus:border-brand-accent transition-all"
                  />
                </div>

                {/* Submit / Login CTA */}
                <button
                  type="submit"
                  className="w-full py-4 mt-4 rounded-full bg-brand-accent text-brand-bg-light font-work text-xs tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md"
                >
                  Continue with Shopify
                </button>
              </form>

              {/* Footer Guest Option */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  onClick={onClose}
                  className="font-work text-[10px] tracking-wider text-black/45 hover:text-black uppercase transition-colors cursor-pointer border-b border-black/15 pb-0.5"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SignInModal;
