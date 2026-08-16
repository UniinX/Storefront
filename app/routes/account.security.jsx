import {Form, Link, useOutletContext} from 'react-router';
import {
  AccountPageHeader,
  AccountPanel,
  AccountPanelLabel,
  accountPrimaryButton,
  accountSecondaryButton,
} from '~/components/account/AccountUI.jsx';
import {Reveal} from '~/components/motion/Reveal.jsx';

export const meta = () => [{title: 'Sign-in & security | UniinX'}];

export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export default function AccountSecurity() {
  const {customer} = useOutletContext();
  const email = customer?.emailAddress?.emailAddress ?? 'Connected customer';
  const returnTo = encodeURIComponent('/account/security');

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <AccountPageHeader
        eyebrow="Security & Privacy"
        title="Sign-in & Account Protection"
        description="Manage your account access methods, data privacy choices, active sessions, and verification settings."
      />

      <div className="grid gap-6 lg:grid-cols-2 min-w-0 w-full">
        <Reveal variant="card">
          <AccountPanel className="h-full">
            <AccountPanelLabel>Primary Sign-in Method</AccountPanelLabel>
            <div className="mt-5 space-y-4">
              <div className="flex flex-col gap-3 rounded-[16px] border border-black/10 bg-white p-4 min-w-0 overflow-hidden sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                    One-Time Verification Code
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-black sm:text-sm">{email}</p>
                </div>
                <span className="self-start rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:self-center">
                  Active
                </span>
              </div>
              <p className="text-xs text-black/50 leading-5">
                You log in securely using instant one-time security passcodes delivered directly to your verified email address.
              </p>
            </div>
          </AccountPanel>
        </Reveal>

        <Reveal variant="card" delay={80}>
          <AccountPanel className="h-full">
            <AccountPanelLabel>Data & Privacy Rights</AccountPanelLabel>
            <div className="mt-5 space-y-3.5 text-xs text-black/65 min-w-0">
              <div className="rounded-[16px] border border-black/10 bg-white p-4 min-w-0">
                <p className="font-semibold text-black">Private Account Storage</p>
                <p className="mt-1 text-black/50 leading-5">
                  Your personal data, saved addresses, and order records are stored with encryption and never shared with third parties.
                </p>
              </div>
              <div className="rounded-[16px] border border-black/10 bg-white p-4 min-w-0">
                <p className="font-semibold text-black">Data Removal Request</p>
                <p className="mt-1 text-black/50 leading-5">
                  Need to export or delete your account records? Contact our Privacy Officer through Studio Support.
                </p>
              </div>
            </div>
          </AccountPanel>
        </Reveal>
      </div>

      <Reveal>
        <AccountPanel className="bg-black text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Active Session Management
              </p>
              <h3 className="mt-2 text-lg font-medium tracking-tight sm:text-xl">
                Secure Session & Sign Out
              </h3>
              <p className="mt-1 max-w-lg text-xs leading-5 text-white/55">
                End your active storefront session on this browser or request a re-verification code.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to={`/account/login?return_to=${returnTo}`}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-black sm:min-h-11 sm:px-5"
              >
                Re-verify Session
              </Link>
              <Form method="POST" action="/account/logout">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/30 bg-white px-4 text-xs font-semibold text-black transition-colors hover:bg-white/80 sm:min-h-11 sm:px-5"
                >
                  Sign Out
                </button>
              </Form>
            </div>
          </div>
        </AccountPanel>
      </Reveal>
    </div>
  );
}

/** @typedef {import('./+types/account.security').Route} Route */
