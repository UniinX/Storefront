import {Link} from 'react-router';

export function BentoFeaturedGrid() {
  const bentoItems = [
    {
      title: 'Space Collection',
      tagline: 'Linguistic stardust narratives.',
      to: '/collections/all?theme=space',
      gradient: 'from-zinc-950 via-slate-900 to-indigo-950 text-white',
      span: 'md:col-span-3',
    },
    {
      title: 'Growth Theme',
      tagline: 'Organic floral scripts.',
      to: '/collections/all?theme=growth',
      gradient: 'from-[#efe6d3] via-[#e2d8c3] to-[#d6cbb5] text-black',
      span: 'md:col-span-3',
    },
    {
      title: 'Telugu Heritage',
      tagline: 'Traditional rounded lettering.',
      to: '/collections/all?theme=telugu',
      gradient: 'from-[#3f5a8a] to-[#1f2d4a] text-white',
      span: 'md:col-span-2',
    },
    {
      title: 'Minimal Scripts',
      tagline: 'Clean, understated wordmarks.',
      to: '/collections/all?theme=minimal',
      gradient: 'from-[#efe6d3] via-[#f7f4ed] to-[#efe6d3] text-black',
      span: 'md:col-span-2',
    },
    {
      title: 'Streetwear Edits',
      tagline: 'Bold, expressive typographies.',
      to: '/collections/all?theme=streetwear',
      gradient: 'from-[#1a1a1a] to-[#2e2e2a] text-white',
      span: 'md:col-span-2',
    },
    {
      title: 'All Products',
      tagline: 'Explore the full catalog of print overlays and garments.',
      to: '/collections/all',
      gradient: 'from-brand-accent to-brand-accent/85 text-white dark:from-brand-accent-light dark:to-brand-accent-light/85 dark:text-black',
      span: 'md:col-span-6',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-h-[380px] mb-12 font-work w-full">
      {bentoItems.map((item) => (
        <Link
          key={item.title}
          to={item.to}
          className={`flex flex-col justify-between p-8 border border-black/5 dark:border-white/5 relative overflow-hidden group shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 ${item.span} bg-gradient-to-br ${item.gradient}`}
        >
          {/* Drifting watermarks or design texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute inset-0 uniinx-fabric opacity-10 mix-blend-overlay group-hover:scale-[1.03] transition-transform duration-500" />

          <div className="z-10 flex flex-col gap-1 max-w-[85%]">
            <h4 className="font-marcellus text-xl md:text-2xl uppercase tracking-wider font-medium">
              {item.title}
            </h4>
            <p className="text-xs opacity-75 font-light leading-relaxed">
              {item.tagline}
            </p>
          </div>

          <div className="z-10 mt-12 flex items-center justify-between w-full">
            <span className="text-[10px] tracking-widest uppercase font-semibold border-b border-current pb-0.5 group-hover:translate-x-1 transition-transform">
              Explore Theme →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
