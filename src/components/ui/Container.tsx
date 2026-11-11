import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
  bleed?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
  bleed = false,
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-8xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto',
        sizeClasses[size],
        !bleed && 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
