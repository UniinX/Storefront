import {Form, useActionData, useNavigation, redirect} from 'react-router';
import {ADMIN_SESSION_TTL_MS} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Admin Gateway'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {session} = context;
  const isAuthenticated = session.get('admin_authenticated');
  const authenticatedAt = Number(session.get('admin_authenticated_at'));
  if (isAuthenticated && authenticatedAt && Date.now() - authenticatedAt <= ADMIN_SESSION_TTL_MS) {
    return redirect('/admin');
  }
  session.unset('admin_authenticated');
  session.unset('admin_authenticated_at');
  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {session, env} = context;
  const formData = await request.formData();

  const passcode = formData.get('passcode')?.toString();
  const lockedUntil = Number(session.get('admin_locked_until')) || 0;

  if (lockedUntil > Date.now()) {
    return {error: 'Too many attempts. Try again later.'};
  }

  if (!env.ADMIN_PASSCODE) {
    return {error: 'Admin access is not configured. Set ADMIN_PASSCODE.'};
  }

  if (passcode && await secretsMatch(passcode, env.ADMIN_PASSCODE)) {
    session.set('admin_authenticated', true);
    session.set('admin_authenticated_at', Date.now());
    session.unset('admin_failed_attempts');
    session.unset('admin_locked_until');
    return redirect('/admin');
  }

  const attempts = (Number(session.get('admin_failed_attempts')) || 0) + 1;
  session.set('admin_failed_attempts', attempts);
  if (attempts >= 5) {
    session.set('admin_locked_until', Date.now() + 15 * 60 * 1000);
  }

  return {error: 'Invalid access passcode.'};
}

async function secretsMatch(candidate, expected) {
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < left.length; index++) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export default function AdminLogin() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200 px-6 py-20">
      <div className="w-full max-w-md border border-black/5 dark:border-white/5 rounded-2xl p-8 bg-brand-surface-light dark:bg-brand-surface-dark shadow-sm flex flex-col gap-8 transition-colors duration-200">
        
        {/* Header */}
        <div className="text-center">
          <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">
            Uniinx Studio
          </span>
          <h2 className="font-marcellus text-3xl text-black dark:text-white uppercase">
            Admin Gateway
          </h2>
          <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
            Authenticate to access product publishing and design controls.
          </p>
        </div>

        <div className="w-full h-[1px] bg-black/5 dark:bg-white/5" />

        {/* Login Form */}
        <Form method="POST" className="flex flex-col gap-5">
          {/* Passcode */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="login-passcode" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Access Passcode
            </label>
            <input
              id="login-passcode"
              type="password"
              name="passcode"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>

          {/* Error Banner */}
          {actionData?.error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
              {actionData.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Enter Console'}
          </button>
        </Form>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/admin_.login').Route} Route */
