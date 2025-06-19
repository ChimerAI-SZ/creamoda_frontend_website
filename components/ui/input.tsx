import * as React from 'react';

import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input hover:border-primary focus:border-primary bg-transparent px-3 py-[10px] text-gray-60 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error hover:border-error focus:border-error text-error-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & VariantProps<typeof inputVariants>>(
  ({ className, size, variant, type, ...props }, ref) => {
    return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';

export { Input };
