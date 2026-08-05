import {Link} from 'react-router';
import {Reveal} from '~/components/motion/Reveal.jsx';

const DEPTS = [
  {key: 'men', title: 'MEN', sub: 'Explore the edit', to: '/collections/men'},
  {key: 'women', title: 'WOMEN', sub: 'Explore the edit', to: '/collections/women'},
  {key: 'acc', title: 'ACCESSORIES', sub: 'Complete the look', to: '/collections/accessories'},
];

export function DepartmentBand() {
  return (
    <section className="px-6 md:px-14 py-16 bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      <Reveal style={{fontFamily: 'var(--font-work-sans)', fontSize: 11, letterSpacing: 'var(--uniinx-tracking-wide)', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 24}}>
        Shop by Collection
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[380px]">
        {DEPTS.map((dept, i) => (
          <Reveal
            key={dept.key}
            delay={i * 80}
            as={Link}
            to={dept.to}
            className="relative flex flex-col justify-end p-8 cursor-pointer overflow-hidden rounded-lg bg-brand-surface-light dark:bg-brand-surface-dark group transition-colors duration-200 border border-black/5 dark:border-white/5"
            style={{minHeight: '340px'}}
          >
            {/* Subtle background zoom effect on hover */}
            <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] group-hover:bg-brand-accent/[0.04] dark:group-hover:bg-brand-accent-light/[0.04] transition-all duration-300 pointer-events-none" />

            <div className="relative z-10">
              <span className="font-marcellus text-3xl md:text-4xl letter-spacing-wide text-black dark:text-white block group-hover:translate-x-1 transition-transform duration-300">
                {dept.title}
              </span>
              <span className="font-work text-[10px] tracking-wide text-black/50 dark:text-white/40 uppercase block mt-2">
                {dept.sub} →
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default DepartmentBand;
