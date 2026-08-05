import * as React from 'react';

export interface ClothTypeSelectorProps {
  garmentId?: string;
  onGarmentChange?: (id: string) => void;
  fabricId?: string;
  onFabricChange?: (id: string) => void;
}
export declare const GARMENTS: { id: string; label: string; price: string }[];
export declare const FABRICS: { id: string; label: string; swatch: string }[];
export declare const ClothTypeSelector: React.FC<ClothTypeSelectorProps>;
export default ClothTypeSelector;
