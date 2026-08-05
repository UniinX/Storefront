import * as React from 'react';

export interface LanguageChipSelectorProps {
  value?: string;
  onChange?: (id: string) => void;
  languages?: { id: string; label: string; native: string; font: string; rtl?: boolean }[];
  size?: "sm" | "md";
}
export declare const LANGUAGES: { id: string; label: string; native: string; wordmark: string; font: string; rtl?: boolean }[];
export declare function FontVar(fontKey: string): string;
export declare const LanguageChipSelector: React.FC<LanguageChipSelectorProps>;
export default LanguageChipSelector;
