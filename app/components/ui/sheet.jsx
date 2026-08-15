import {forwardRef} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {cn} from '~/lib/utils.js';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

export const SheetOverlay = forwardRef(function SheetOverlay(
  {className, ...props},
  ref,
) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'radix-sheet-overlay fixed inset-0 z-[75] bg-black/60 backdrop-blur-[2px]',
        className,
      )}
      {...props}
    />
  );
});

export const SheetContent = forwardRef(function SheetContent(
  {className, children, ...props},
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'radix-sheet-content fixed z-[80] overflow-y-auto overscroll-contain border border-border bg-surface text-foreground shadow-2xl outline-none',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
