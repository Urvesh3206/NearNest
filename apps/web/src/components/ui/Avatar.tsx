"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getInitials } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full font-semibold uppercase items-center justify-center bg-brand-100 text-brand-700",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  name?: string;
  fallback?: string;
  alt?: string;
  isOnline?: boolean;
  isVerified?: boolean;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, name, fallback, alt, isOnline, isVerified, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <div ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
          {src ? (
            <img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" />
          ) : (
            <span>{fallback || getInitials(name || "")}</span>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-surface bg-green-500 ring-2 ring-surface" />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
