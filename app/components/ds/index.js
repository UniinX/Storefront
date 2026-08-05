/**
 * @file Design System barrel — single import point for all DS components.
 * Features import from here, never from DS internals directly.
 */
export { Button }                                        from '@ds/components/core/Button.jsx';
export { NavLanguageSwitcher }                           from '@ds/components/core/NavLanguageSwitcher.jsx';
export { ProductCard }                                   from '../ProductCard.jsx';
export { ClothTypeSelector, GARMENTS, FABRICS }          from '@ds/components/commerce/ClothTypeSelector.jsx';
export { LanguageChipSelector, LANGUAGES, FontVar }      from '@ds/components/commerce/LanguageChipSelector.jsx';
export { MobileTabBar }                                  from '@ds/components/navigation/MobileTabBar.jsx';
export { BottomSheet }                                   from '@ds/components/navigation/BottomSheet.jsx';
