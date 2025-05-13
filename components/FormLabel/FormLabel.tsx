import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  children: React.ReactNode;
}

export function FormLabel({ children, ...props }: FormLabelProps) {
  return (
    <Label className={cn('text-[#262626] text-sm font-medium leading-5 font-inter')} {...props}>
      {children}
    </Label>
  );
}
