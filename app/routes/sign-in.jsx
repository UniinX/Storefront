import {redirect} from 'react-router';

export async function loader({request, context}) {
  if (await context.customerAccount.isLoggedIn()) {
    return redirect('/account');
  }

  const url = new URL(request.url);
  const requestedReturnTo = url.searchParams.get('return_to') || '/account';
  const returnTo =
    requestedReturnTo.startsWith('/') && !requestedReturnTo.startsWith('//')
      ? requestedReturnTo
      : '/account';

  return redirect(
    `/account/login?return_to=${encodeURIComponent(returnTo)}`,
  );
}

export default function SignInRoute() {
  return null;
}

/** @typedef {import('./+types/sign-in').Route} Route */
