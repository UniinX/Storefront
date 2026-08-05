import * as React from 'react';

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}
export declare const BottomSheet: React.FC<BottomSheetProps>;
export default BottomSheet;
