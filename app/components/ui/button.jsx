import {forwardRef} from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva} from 'class-variance-authority';
import {cn} from '~/lib/utils.js';

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:opacity-85',
        outline:
          'border border-border-strong bg-surface text-foreground hover:bg-surface-subtle',
        ghost: 'text-foreground hover:bg-surface-subtle',
      },
      size: {
        default: 'px-6',
        sm: 'min-h-10 px-4 text-xs',
        icon: 'size-11 shrink-0 p-0',
      },
    },
    defaultVariants: {variant: 'default', size: 'default'},
  },
);

export const Button = forwardRef(function Button(
  {className, variant, size, asChild = false, ...props},
  ref,
) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      ref={ref}
      className={cn(buttonVariants({variant, size}), className)}
      {...props}
    />
  );
});
