'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

interface CopyableTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  copyable?: boolean;
}

export function CopyableText({
  children,
  className,
  variant = 'p',
  copyable = false,
}: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (isCopied) return;
    
    try {
      await navigator.clipboard.writeText(children?.toString() || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const Component = variant;

  return (
    <div className="flex items-center gap-2">
      <Component className={cn(className)}>{children}</Component>
      {copyable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 relative"
          disabled={isCopied}
        >
          <div className="relative w-4 h-4">
            <Copy
              className={cn(
                "h-4 w-4 absolute transition-all duration-300",
                isCopied ? "opacity-0 scale-0" : "opacity-100 scale-100"
              )}
            />
            <Check
              className={cn(
                "h-4 w-4 absolute text-green-500 transition-all duration-300",
                isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )}
            />
          </div>
        </Button>
      )}
    </div>
  );
} 