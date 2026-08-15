import {Form, Link, useActionData, useNavigation} from 'react-router';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion.jsx';
import {Button} from '~/components/ui/button.jsx';

export const PUBLIC_PAGE_LINKS = [
  {label: 'About', to: '/pages/about', handle: 'about'},
  {label: 'Journal', to: '/blogs', handle: 'journal'},
  {label: 'FAQ', to: '/pages/faq', handle: 'faq'},
  {label: 'Size & Care', to: '/pages/size-care', handle: 'size-care'},
  {
    label: 'Shipping & Returns',
    to: '/pages/shipping-returns',
    handle: 'shipping-returns',
  },
  {label: 'Contact', to: '/pages/contact', handle: 'contact'},
];

const PAGE_META = {
  faq: {
    eyebrow: 'Questions, answered',
    title: 'Everything worth knowing.',
    description:
      'Clear answers about language editions, orders, sizing, care, delivery, and returns.',
  },
  'size-care': {
    eyebrow: 'Wear it well',
    title: 'Fit, wash, repeat.',
    description:
      'A practical guide to choosing your size and keeping every print, weave, and silhouette at its best.',
  },
  'shipping-returns': {
    eyebrow: 'From our studio to you',
    title: 'Delivery without guesswork.',
    description:
      'How orders are prepared, shipped, exchanged, and returned—from ready stock to custom language pieces.',
  },
  contact: {
    eyebrow: 'Studio support',
    title: 'Let’s talk.',
    description:
      'Questions about a product, collaboration, press request, or an order? Send the studio a note.',
  },
};

const FAQ_GROUPS = [
  {
    title: 'Products & language editions',
    items: [
      [
        'What is a language edition?',
        'A language edition interprets the same UniinX design system through a specific Indian script. Availability varies by garment, color, and collection.',
      ],
      [
        'Will the printed script match the product preview?',
        'Yes. Select the language and product options shown on the product page before adding the item to your cart. The selected variant is the version we prepare.',
      ],
      [
        'Are custom names or phrases returnable?',
        'Personalized pieces are made specifically for you and normally cannot be returned unless they arrive damaged or incorrect. Standard collection garments follow the published return policy.',
      ],
    ],
  },
  {
    title: 'Orders & delivery',
    items: [
      [
        'How long does an order take to prepare?',
        'Ready-stock orders are usually prepared within 2–3 business days. Made-to-order or personalized language pieces may require 7–10 business days before dispatch.',
      ],
      [
        'How can I track my order?',
        'Sign in to your account and open Order history. Tracking appears there as soon as the carrier accepts the parcel.',
      ],
      [
        'Do you ship internationally?',
        'International availability, pricing, duties, and delivery estimates are shown during checkout for eligible destinations.',
      ],
    ],
  },
  {
    title: 'Sizing, care & returns',
    items: [
      [
        'Where can I find measurements?',
        'Each product page includes a sizing guide built from that garment’s measurements. Compare it with a similar item you already own for the most reliable fit.',
      ],
      [
        'How should I wash printed garments?',
        'Turn the garment inside out, wash cold with similar colors on a gentle cycle, and air dry in shade. Avoid bleach and direct ironing over artwork.',
      ],
      [
        'How do I request a return or exchange?',
        'Open Shipping & Returns for eligibility, then contact the studio with your order number and the items you want us to review.',
      ],
    ],
  },
];

const SIZE_STEPS = [
  [
    '01',
    'Choose a familiar garment',
    'Pick a T-shirt, hoodie, or bottom that fits the way you like.',
  ],
  [
    '02',
    'Measure it flat',
    'Measure chest, length, shoulder, sleeve, or waist without stretching the fabric.',
  ],
  [
    '03',
    'Compare product measurements',
    'Use the guide on the product page—not only the size label—to select the closest fit.',
  ],
];

const CARE_ITEMS = [
  ['Wash cold', 'Use a gentle cycle and mild detergent with similar colors.'],
  ['Inside out', 'Protect surface artwork and reduce abrasion in the wash.'],
  [
    'Dry in shade',
    'Air dry when possible; avoid prolonged direct sunlight and high heat.',
  ],
  [
    'Iron around artwork',
    'Use low heat from the reverse side and never iron directly over a print.',
  ],
];

export function getPublicPageMeta(handle) {
  return PAGE_META[handle];
}

export function PublicContentPage({handle, page, policies = []}) {
  const meta = PAGE_META[handle];
  if (!meta) return <GenericShopifyPage page={page} />;

  return (
    <div className="bg-surface-subtle text-foreground">
      <PageHero {...meta} />
      {handle === 'faq' ? <FaqPage /> : null}
      {handle === 'size-care' ? <SizeCarePage /> : null}
      {handle === 'shipping-returns' ? (
        <ShippingReturnsPage policies={policies} />
      ) : null}
      {handle === 'contact' ? <ContactPage /> : null}
      {page?.body ? <ShopifyPageBody body={page.body} /> : null}
      <PageDirectory currentHandle={handle} />
    </div>
  );
}

function PageHero({eyebrow, title, description}) {
  return (
    <section className="uniinx-home-gutter border-b border-border pb-16 pt-20 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-36">
      <Reveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
          {eyebrow}
        </p>
        <div className="mt-7 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <h1 className="max-w-5xl text-[clamp(48px,9vw,136px)] font-normal leading-[0.84] tracking-[-0.065em] sm:leading-[0.78] sm:tracking-[-0.075em]">
            {title}
          </h1>
          <p className="max-w-md border-l border-black/20 pl-5 text-sm leading-7 text-black/60 sm:text-base">
            {description}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function FaqPage() {
  return (
    <section className="uniinx-home-gutter py-16 sm:py-20 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.45fr_1fr] lg:gap-24">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
            Help centre
          </p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,68px)] font-normal leading-[0.9] tracking-[-0.055em]">
            Start here.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-black/60">
            Still need a hand? The studio can help with product questions and
            order-specific requests.
          </p>
          <Button asChild className="mt-7">
            <Link to="/pages/contact">Contact the studio →</Link>
          </Button>
        </Reveal>
        <div className="space-y-12">
          {FAQ_GROUPS.map((group, groupIndex) => (
            <Reveal key={group.title} delay={groupIndex * 60}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#233c6b]">
                {group.title}
              </h2>
              <Accordion type="multiple" className="border-t border-border">
                {group.items.map(([question, answer]) => (
                  <AccordionItem key={question} value={question}>
                    <AccordionTrigger className="text-base sm:text-lg">
                      {question}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      <p>{answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SizeCarePage() {
  return (
    <>
      <section className="uniinx-home-gutter py-16 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr] lg:gap-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Finding your fit
            </p>
            <h2 className="mt-5 text-[clamp(42px,5vw,76px)] font-normal leading-[0.88] tracking-[-0.06em]">
              Measure the garment, not yourself.
            </h2>
          </Reveal>
          <div className="border-t border-black/15">
            {SIZE_STEPS.map(([number, title, body], index) => (
              <Reveal
                key={number}
                delay={index * 70}
                className="grid gap-4 border-b border-black/15 py-7 sm:grid-cols-[56px_0.65fr_1fr]"
              >
                <span className="text-xs text-black/40">{number}</span>
                <h3 className="text-lg font-medium tracking-[-0.025em]">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-black/60">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mt-14 rounded-[24px] bg-[#1d2538] p-7 text-white sm:p-10 lg:p-14">
          <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <h2 className="max-w-3xl text-[clamp(38px,5vw,72px)] font-normal leading-[0.9] tracking-[-0.055em]">
              Every product carries its own measurements.
            </h2>
            <div>
              <p className="text-sm leading-7 text-white/65">
                Fits vary by silhouette and fabric. Open “Sizing Guide” on the
                product page for the measurements tied to that exact garment.
              </p>
              <Link
                to="/collections/all"
                className="mt-6 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-xs font-semibold text-black"
              >
                Shop with measurements →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="uniinx-home-gutter bg-surface py-16 sm:py-20 lg:py-28">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
            Care routine
          </p>
          <h2 className="mt-5 text-[clamp(42px,5vw,72px)] font-normal leading-[0.9] tracking-[-0.055em]">
            Keep the language vivid.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[22px] bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {CARE_ITEMS.map(([title, body], index) => (
            <Reveal
              key={title}
              delay={index * 60}
              className="min-h-56 bg-[#faf9f6] p-7"
            >
              <span className="text-xs text-black/35">0{index + 1}</span>
              <h3 className="mt-12 text-xl font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/55">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function ShippingReturnsPage({policies}) {
  const policyMap = new Map(policies.map((policy) => [policy.handle, policy]));
  const shipping = policyMap.get('shipping-policy');
  const refund = policyMap.get('refund-policy');
  return (
    <section className="uniinx-home-gutter py-16 sm:py-20 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-3">
        {[
          [
            '01',
            'Order preparation',
            'Ready-stock pieces normally leave the studio within 2–3 business days. Personalized and made-to-order pieces may need 7–10 business days.',
          ],
          [
            '02',
            'Tracked delivery',
            'Available shipping methods, destination eligibility, charges, and estimates are calculated at checkout. Tracking is added to your account after dispatch.',
          ],
          [
            '03',
            'Returns review',
            'Standard unworn garments may be eligible under the published return policy. Personalized pieces are reviewed only when damaged or incorrect.',
          ],
        ].map(([number, title, body], index) => (
          <Reveal
            key={number}
            delay={index * 70}
            className="flex min-h-80 flex-col rounded-xl border border-border bg-surface p-7 sm:p-9"
          >
            <span className="text-xs text-black/35">{number}</span>
            <h2 className="mt-auto text-2xl font-medium tracking-[-0.035em]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-black/58">{body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 grid gap-8 border-y border-black/15 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-[clamp(34px,4vw,58px)] font-normal leading-[0.92] tracking-[-0.05em]">
            Need an order reviewed?
          </h2>
          <p className="mt-4 text-sm leading-6 text-black/60">
            Include your order number, affected items, and preferred resolution
            so the studio can respond efficiently.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/pages/contact"
            className="inline-flex min-h-12 items-center rounded-full bg-black px-6 text-xs font-semibold text-white"
          >
            Start a request →
          </Link>
          {shipping ? (
            <Link
              to={`/policies/${shipping.handle}`}
              className="inline-flex min-h-12 items-center rounded-full border border-black px-6 text-xs font-semibold"
            >
              Shipping policy
            </Link>
          ) : null}
          {refund ? (
            <Link
              to={`/policies/${refund.handle}`}
              className="inline-flex min-h-12 items-center rounded-full border border-black px-6 text-xs font-semibold"
            >
              Refund policy
            </Link>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}

function ContactPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  return (
    <section className="uniinx-home-gutter py-16 sm:py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-24">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
            Contact details
          </p>
          <h2 className="mt-5 text-[clamp(40px,5vw,72px)] font-normal leading-[0.9] tracking-[-0.055em]">
            The right note reaches the right desk.
          </h2>
          <div className="mt-8 space-y-5 border-t border-black/15 pt-6 text-sm text-black/60">
            <p>
              For an existing order, sign in first so your verified order
              details are available.
            </p>
            <Link
              to="/account/support"
              className="inline-flex font-semibold text-black underline underline-offset-4"
            >
              Open account support
            </Link>
            <p>Typical response time: within two business days.</p>
          </div>
        </Reveal>
        <Reveal>
          <Form
            method="post"
            className="rounded-xl border border-border bg-surface p-6 sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" required />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
                Topic
                <select
                  name="topic"
                  className="mt-2 min-h-12 w-full rounded-[12px] border border-black/12 bg-white px-4 text-sm font-normal normal-case tracking-normal text-black outline-none focus:border-black"
                >
                  <option>Product question</option>
                  <option>Order question</option>
                  <option>Press & partnerships</option>
                  <option>Wholesale</option>
                  <option>Other</option>
                </select>
              </label>
              <Field label="Order number (optional)" name="orderNumber" />
            </div>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
              Message
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={7}
                className="mt-2 w-full resize-y rounded-[12px] border border-black/12 bg-white p-4 text-sm font-normal normal-case leading-6 tracking-normal text-black outline-none focus:border-black"
              />
            </label>
            <label className="sr-only">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            {actionData?.error ? (
              <p
                role="alert"
                className="mt-5 rounded-[12px] bg-red-50 p-4 text-sm text-red-700"
              >
                {actionData.error}
              </p>
            ) : null}
            {actionData?.success ? (
              <p
                role="status"
                className="mt-5 rounded-[12px] bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                Thanks—your note has reached the UniinX studio.
              </p>
            ) : null}
            <Button type="submit" disabled={submitting} className="mt-6">
              {submitting ? 'Sending…' : 'Send message →'}
            </Button>
          </Form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({label, name, type = 'text', ...props}) {
  return (
    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
      {label}
      <input
        name={name}
        type={type}
        className="mt-2 min-h-12 w-full rounded-[12px] border border-black/12 bg-white px-4 text-sm font-normal normal-case tracking-normal text-black outline-none focus:border-black"
        {...props}
      />
    </label>
  );
}

function ShopifyPageBody({body}) {
  return (
    <section className="uniinx-home-gutter bg-surface py-16 lg:py-24">
      <Reveal
        className="uniinx-rich-text mx-auto max-w-3xl text-sm leading-7 text-black/70"
        dangerouslySetInnerHTML={{__html: body}}
      />
    </section>
  );
}

function GenericShopifyPage({page}) {
  return (
    <div className="bg-surface-subtle text-foreground">
      <PageHero
        eyebrow="UniinX"
        title={page.title}
        description={page.seo?.description || 'Notes from the UniinX studio.'}
      />
      <ShopifyPageBody body={page.body} />
      <PageDirectory />
    </div>
  );
}

function PageDirectory({currentHandle}) {
  return (
    <nav
      aria-label="Explore UniinX"
      className="uniinx-home-gutter border-t border-border bg-surface-subtle py-12 lg:py-16"
    >
      <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
        Explore UniinX
      </p>
      <div className="flex flex-wrap gap-2">
        {PUBLIC_PAGE_LINKS.filter((item) => item.handle !== currentHandle).map(
          (item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-5 text-xs font-semibold hover:border-border-strong"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
