import {Link} from 'react-router';
import {motion, useReducedMotion} from 'framer-motion';
import {Reveal} from '~/components/motion/Reveal.jsx';
import {BrandStory} from '~/components/home/BrandStory.jsx';
import heroImage from '~/assets/home/hero-section.jpg';
import studioImage from '~/assets/home/antariksham-back.webp';

const PRINCIPLES = [
  [
    '01',
    'Language is structure',
    'We begin with the balance, cadence, and geometry of Indian scripts—not decoration added at the end.',
  ],
  [
    '02',
    'Clothing stays wearable',
    'The silhouette remains calm and contemporary so language can carry the identity without becoming costume.',
  ],
  [
    '03',
    'India is plural',
    'Every edition belongs to a wider family of states, sounds, and writing systems. No single script stands in for the whole.',
  ],
];

export function AboutPage({page, language = 'english'}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-[#f4f0e9] text-black">
      <section className="relative min-h-[760px] overflow-hidden bg-[#171717] pt-[92px] text-white lg:min-h-[860px]">
        <motion.img
          src={heroImage}
          alt="UniinX clothing shaped by Indian scripts"
          initial={reduceMotion ? {opacity: 1} : {opacity: 0, scale: 1.04}}
          animate={{opacity: 0.62, scale: 1}}
          transition={{duration: reduceMotion ? 0.1 : 1.1}}
          className="absolute inset-0 size-full object-cover object-center mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/85" />
        <div
          aria-hidden="true"
          className="absolute inset-5 border border-white/20 sm:inset-8 lg:inset-[60px]"
        />
        <div className="relative z-10 flex min-h-[668px] flex-col justify-between px-5 pb-12 pt-16 sm:px-8 lg:min-h-[768px] lg:px-[clamp(60px,6vw,112px)] lg:pb-20 lg:pt-24">
          <Reveal>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
              About UniinX · India
            </span>
          </Reveal>
          <div className="grid items-end gap-10 lg:grid-cols-[1.45fr_0.55fr]">
            <Reveal>
              <h1 className="max-w-6xl text-[clamp(52px,10.5vw,164px)] font-normal leading-[0.82] tracking-[-0.065em] sm:leading-[0.75] sm:tracking-[-0.075em]">
                Clothes in your language.
              </h1>
            </Reveal>
            <Reveal
              className="max-w-sm border-l border-white/30 pl-5"
              delay={120}
            >
              <p className="text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                A contemporary clothing label that treats India&apos;s scripts,
                sounds, and regional identities as design material.
              </p>
              <Link
                to="/collections/all"
                className="mt-7 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-xs font-semibold text-black"
              >
                Explore the collections →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <BrandStory language={language} showBenefits={false} />

      <section className="uniinx-home-gutter border-t border-black/10 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <Reveal>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Our principles
            </span>
            <h2 className="mt-5 text-[clamp(42px,5vw,72px)] font-normal leading-[0.9] tracking-[-0.06em]">
              One country. Many visual languages.
            </h2>
          </Reveal>
          <div className="border-t border-black/15">
            {PRINCIPLES.map(([number, title, body], index) => (
              <Reveal
                as="article"
                key={number}
                delay={index * 80}
                className="grid gap-5 border-b border-black/15 py-7 sm:grid-cols-[60px_0.7fr_1fr] sm:items-start"
              >
                <span className="text-xs text-black/40">{number}</span>
                <h3 className="text-xl font-medium tracking-[-0.025em]">
                  {title}
                </h3>
                <p className="max-w-lg text-sm leading-6 text-black/60">
                  {body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#1d2538] text-white lg:grid-cols-2">
        <Reveal className="flex min-h-[520px] flex-col justify-between p-7 sm:p-12 lg:min-h-[680px] lg:p-[clamp(60px,7vw,112px)]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            From the studio
          </span>
          <div>
            <h2 className="max-w-xl text-[clamp(48px,6vw,92px)] font-normal leading-[0.84] tracking-[-0.065em]">
              Built as editions, not trends.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/65">
              Each theme is a complete visual world—its own palette, scripts,
              references, and garments—designed to sit alongside the others as
              one changing portrait of India.
            </p>
          </div>
        </Reveal>
        <Reveal
          variant="scale"
          className="min-h-[420px] overflow-hidden lg:min-h-[680px]"
        >
          <img
            src={studioImage}
            alt="Detail from the UniinX Antariksham collection"
            className="size-full object-cover"
          />
        </Reveal>
      </section>

      {page.body ? (
        <section className="uniinx-home-gutter bg-white py-16 lg:py-24">
          <Reveal
            className="uniinx-rich-text mx-auto max-w-3xl text-sm leading-7 text-black/70"
            dangerouslySetInnerHTML={{__html: page.body}}
          />
        </section>
      ) : null}
    </div>
  );
}

export default AboutPage;
