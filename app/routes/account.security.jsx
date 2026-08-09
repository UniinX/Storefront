import {useOutletContext, Form} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Login & Security'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export default function AccountSecurity() {
  const {customer} = useOutletContext();
  const email = customer?.emailAddress?.emailAddress ?? 'Connected Customer';
  const phone = customer?.phoneNumber?.phoneNumber ?? 'No phone number attached';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="font-marcellus text-2xl text-black dark:text-white uppercase mb-2">
          Login & Security
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40">
          Manage your login preferences, security credentials, and active studio sessions.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/[0.005] dark:bg-white/[0.005]">
          <span className="font-work text-[9px] tracking-wider text-black/40 dark:text-white/30 uppercase block mb-1">
            Connected Account Email
          </span>
          <span className="font-work text-sm text-black dark:text-white block font-medium">
            {email}
          </span>
        </div>

        <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/[0.005] dark:bg-white/[0.005]">
          <span className="font-work text-[9px] tracking-wider text-black/40 dark:text-white/30 uppercase block mb-1">
            Connected Account Phone
          </span>
          <span className="font-work text-sm text-black dark:text-white block font-medium">
            {phone}
          </span>
        </div>
      </div>

      {/* Passwordless Security Explanation */}
      <div className="flex flex-col gap-4">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/70 dark:text-white/70">
          Passwordless Verification
        </h4>
        <div className="border border-black/5 dark:border-white/5 rounded-xl p-6 bg-black/[0.005] dark:bg-white/[0.005] font-work text-xs leading-relaxed text-black/70 dark:text-white/70 font-light flex flex-col gap-3">
          <p>
            UniinX utilizes <strong>Shopify Customer Accounts</strong> for all user authentication. This modern security model is entirely passwordless.
          </p>
          <p>
            Instead of managing passwords that can be compromised, authentication is completed securely using disposable verification codes sent to your registered email address on each login.
          </p>
          <p>
            This ensures your account remains highly secure and aligned with Shopify's latest OIDC (OpenID Connect) authentication guidelines.
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Reauthenticate & Sign Out */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-work text-xs text-black dark:text-white font-medium">
            Terminate Session
          </span>
          <span className="font-work text-[10px] text-black/40 dark:text-white/40">
            Sign out of your account on this browser.
          </span>
        </div>
        <Form method="POST" action="/account/logout">
          <button
            type="submit"
            className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 text-black/75 dark:text-white/75 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-work text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </Form>
      </div>
    </div>
  );
}
