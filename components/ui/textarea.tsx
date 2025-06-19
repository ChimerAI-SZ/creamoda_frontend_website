import * as React from 'react';

import { cn } from '@/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative p-[1px] bg-gradient-to-r from-[#704DFF] via-[#599EFF] to-[#6EFABB] rounded-md">
        <textarea
          className={cn(
            'flex min-h-[60px] mt-unset bg-card w-full rounded-md border-none px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
