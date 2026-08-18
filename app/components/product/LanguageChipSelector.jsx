import {Button} from '~/components/ui/button.jsx';
import {cn} from '~/lib/utils.js';
import {fontVariable, LANGUAGES} from '~/lib/languages.js';

export function LanguageChipSelector({
  value,
  onChange,
  languages = LANGUAGES,
  size = 'default',
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Design language"
      className="flex flex-wrap gap-2"
    >
      {languages.map((language) => {
        const selected = language.id === value;
        return (
          <Button
            key={language.id}
            type="button"
            role="radio"
            aria-checked={selected}
            variant={selected ? 'default' : 'outline'}
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={() => onChange?.(language.id)}
            className={cn(
              'h-auto min-w-20 flex-col items-start gap-0.5 rounded-lg py-2 leading-tight',
              selected && 'shadow-sm',
            )}
          >
            <span className="text-xs">{language.label}</span>
            <span
              className={cn(size === 'sm' ? 'text-[13px]' : 'text-[15px]')}
              style={{fontFamily: fontVariable(language.font)}}
              dir={language.rtl ? 'rtl' : 'ltr'}
            >
              {language.native}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
