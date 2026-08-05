import * as React from 'react';

export interface NavLanguageSwitcherProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  wordmark?: string;
}
export declare const NavLanguageSwitcher: React.FC<NavLanguageSwitcherProps>;
export default NavLanguageSwitcher;
