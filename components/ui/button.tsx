import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'rounded-[100px] bg-gradient-to-r from-[#D0C4FF] to-[#5F44F7] text-primary-foreground shadow hover:bg-[linear-gradient(0deg,_rgba(10,21,50,0.20)_0%,_rgba(10,21,50,0.20)_100%),_linear-gradient(90deg,_#D0C4FF_0%,_#5F44F7_70%)] disabled:bg-[rgba(10,21,50,0.20)] disabled:bg-none',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-primary bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-[#888]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-[#8C5CF6] to-[#5E96FF] text-white shadow-md hover:opacity-90',
        gradientDestructive:
          'bg-warning hover:bg-warning-hover text-white shadow-md hover:opacity-90 rounded-full text-white'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-6 px-2 py-1 w-fit text-center text-center text-[12px] font-medium leading-[16px] text-white',
        md: 'h-8 px-[11px] py-[6px] w-fit text-center text-center text-[14px] font-bold leading-[20px] text-white',
        lg: 'h-[48px] rounded-full px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
