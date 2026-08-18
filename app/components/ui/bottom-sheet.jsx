import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '~/components/ui/sheet.jsx';

export function BottomSheet({open, onClose, title, children}) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose?.()}>
      <SheetContent className="inset-x-0 bottom-0 max-h-[82dvh] rounded-t-2xl border-x-0 border-b-0 p-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:left-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:px-8">
        <div
          className="mx-auto mb-4 h-1 w-9 rounded-full bg-muted"
          aria-hidden="true"
        />
        <div className="mb-5 flex items-center justify-between gap-4">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            {title || 'Options'}
          </SheetTitle>
          <SheetClose
            type="button"
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-xl leading-none transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            ×
          </SheetClose>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
}
