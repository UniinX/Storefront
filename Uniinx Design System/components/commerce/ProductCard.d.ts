import * as React from 'react';

export interface ProductCardProps {
  image?: string;
  label?: string;
  price?: string;
  width?: number;
  height?: number;
  onBuy?: () => void;
}
export declare const ProductCard: React.FC<ProductCardProps>;
export default ProductCard;
