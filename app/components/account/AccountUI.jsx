import {Reveal} from '~/components/motion/Reveal.jsx';

export function AccountPageHeader({eyebrow = 'Member account', title, description, action}) {
  return (
    <Reveal>
      <header className="flex flex-col gap-4 border-b border-black/10 pb-6 min-w-0 w-full overflow-hidden sm:flex-row sm:items-end sm:justify-between sm:pb-7">
        <div className="max-w-2xl min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-[clamp(26px,3.5vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] text-black sm:mt-3">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-xl text-xs leading-5 text-black/55 sm:mt-4 sm:text-sm sm:leading-6">
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
      className={`w-full max-w-full overflow-hidden rounded-[18px] border border-black/10 bg-black/[0.02] p-4 sm:rounded-[22px] sm:p-6 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

export function AccountPanelLabel({children}) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
      {children}
    </p>
  );
}

export function AccountEmptyState({title, description, action}) {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-[18px] border border-dashed border-black/15 bg-white px-4 py-8 text-center sm:rounded-[22px] sm:px-6 sm:py-12">
      <span aria-hidden="true" className="mx-auto grid size-10 place-items-center rounded-full bg-black text-base text-white sm:size-11 sm:text-lg">
        ↗
      </span>
      <h3 className="mt-4 text-lg font-medium tracking-[-0.025em] sm:mt-5 sm:text-xl">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-black/50 sm:text-sm sm:leading-6">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center sm:mt-6">{action}</div> : null}
    </div>
  );
}

export function AccountStatus({tone = 'neutral', children}) {
  const tones = {
    success: 'border-black/15 bg-black/5 text-black font-medium',
    warning: 'border-black/20 bg-black/[0.04] text-black font-medium',
    neutral: 'border-black/10 bg-black/[0.035] text-black/60',
  };

  return (
    <div
      role="status"
      className={`w-full rounded-[14px] border px-3.5 py-2.5 text-xs leading-5 sm:rounded-[16px] sm:px-4 sm:py-3 sm:text-sm ${tones[tone] ?? tones.neutral}`}
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
