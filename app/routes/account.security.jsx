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
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Sign-in & security"
        title="Passwordless by design"
        description="Your UniinX account uses Shopify Customer Accounts. You verify your identity with a one-time code instead of maintaining another password."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal variant="card">
          <AccountPanel className="h-full">
            <div className="flex items-start justify-between gap-5">
              <div>
                <AccountPanelLabel>Verified identity</AccountPanelLabel>
                <p className="mt-5 break-words text-xl font-medium tracking-[-0.025em]">{email}</p>
                <p className="mt-3 text-sm leading-6 text-black/50">
                  Verification codes and account notices are sent to this address.
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#2f6d4c] text-sm text-white" aria-label="Verified">
                ✓
              </span>
            </div>
          </AccountPanel>
        </Reveal>

        <Reveal variant="card" delay={80}>
          <AccountPanel className="h-full">
            <AccountPanelLabel>Authentication method</AccountPanelLabel>
            <p className="mt-5 text-xl font-medium tracking-[-0.025em]">One-time verification code</p>
            <p className="mt-3 text-sm leading-6 text-black/50">
              Shop recognition and social sign-in may also appear when enabled in Shopify.
            </p>
          </AccountPanel>
        </Reveal>
      </div>

      <Reveal>
        <AccountPanel className="bg-[#151515] text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Session controls</p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.035em]">Need to verify again?</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
                Start a fresh verification flow or securely sign out of this browser. We never display invented device or IP-session data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/account/login?return_to=${returnTo}`}
                className={`${accountSecondaryButton} border-white/20 bg-white text-black hover:border-white hover:bg-transparent hover:text-white`}
              >
                Verify again
              </Link>
              <Form method="POST" action="/account/logout">
                <button type="submit" className={`${accountPrimaryButton} bg-[#a13a2d]`}>
                  Sign out
                </button>
              </Form>
            </div>
          </div>
        </AccountPanel>
      </Reveal>

      <Reveal>
        <section className="grid gap-4 border-t border-black/10 pt-7 sm:grid-cols-3">
          <SecurityNote number="01" title="No password database" text="UniinX does not collect or store customer passwords." />
          <SecurityNote number="02" title="Private account data" text="Customer responses are explicitly marked private and never storefront-cached." />
          <SecurityNote number="03" title="Secure checkout handoff" text="Your authenticated customer context follows you securely into Shopify checkout." />
        </section>
      </Reveal>
    </div>
  );
}

function SecurityNote({number, title, text}) {
  return (
    <div className="rounded-[18px] bg-[#f3f0ea] p-5">
      <span className="text-[9px] tracking-[0.18em] text-black/30">{number}</span>
      <h3 className="mt-5 text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-black/48">{text}</p>
    </div>
  );
}

/** @typedef {import('./+types/account.security').Route} Route */
