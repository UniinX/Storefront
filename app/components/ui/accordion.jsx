import {forwardRef} from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {cn} from '~/lib/utils.js';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef(function AccordionItem(
  {className, ...props},
  ref,
) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-border', className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef(function AccordionTrigger(
  {className, children, ...props},
  ref,
) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'group flex min-h-14 flex-1 items-center justify-between gap-6 py-4 text-left font-medium outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className="text-xl font-normal transition-transform duration-200 group-data-[state=open]:rotate-45 motion-reduce:transition-none"
        >
          +
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef(function AccordionContent(
  {className, children, ...props},
  ref,
) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="radix-accordion-content overflow-hidden"
      {...props}
    >
      <div className={cn('pb-5 pt-1', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
