import * as React from 'react';

export interface MobileTabBarProps {
  active?: "home" | "plp" | "cart";
  onNavigate?: (id: string) => void;
  cartCount?: number;
}
export declare const MobileTabBar: React.FC<MobileTabBarProps>;
export default MobileTabBar;
