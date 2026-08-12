import {Reveal} from '~/components/motion/Reveal.jsx';

export function AccountPageHeader({eyebrow = 'Member account', title, description, action}) {
  return (
    <Reveal>
      <header className="flex flex-col gap-5 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a13a2d]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[clamp(32px,4vw,48px)] font-medium leading-[0.98] tracking-[-0.045em] text-black">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/52">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
    </Reveal>
  );
}

export function AccountPanel({children, as: Tag = 'section', className = ''}) {
  return (
    <Tag
      className={`rounded-[22px] border border-black/10 bg-[#faf9f6] p-5 sm:p-6 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export function AccountPanelLabel({children}) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42">
      {children}
    </p>
  );
}

export function AccountEmptyState({title, description, action}) {
  return (
    <div className="rounded-[22px] border border-dashed border-black/15 bg-[#faf9f6] px-6 py-12 text-center">
      <span aria-hidden="true" className="mx-auto grid size-11 place-items-center rounded-full bg-black text-lg text-white">
        ↗
      </span>
      <h3 className="mt-5 text-xl font-medium tracking-[-0.025em]">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AccountStatus({tone = 'neutral', children}) {
  const tones = {
    success: 'border-[#2f6d4c]/20 bg-[#2f6d4c]/8 text-[#25583e]',
    warning: 'border-[#a13a2d]/20 bg-[#a13a2d]/8 text-[#7f2e24]',
    neutral: 'border-black/10 bg-black/[0.035] text-black/60',
  };

  return (
    <div
      role="status"
      className={`rounded-[16px] border px-4 py-3 text-sm leading-5 ${tones[tone] ?? tones.neutral}`}
    >
      {children}
    </div>
  );
}

export const accountPrimaryButton =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-45';

export const accountSecondaryButton =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black';

export const accountField =
  'min-h-12 w-full rounded-[13px] border border-black/12 bg-white px-4 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/28 focus:border-black focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]';

export const accountLabel =
  'mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/48';
