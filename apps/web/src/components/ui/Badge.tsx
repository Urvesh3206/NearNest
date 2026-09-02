"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-800",
        secondary: "bg-surface-subtle text-text-secondary",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-coral-100 text-coral-800",
        info: "bg-blue-100 text-blue-800",
      },
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  dot,
  onRemove,
  children,
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            variant === "default" && "bg-brand-600",
            variant === "secondary" && "bg-text-tertiary",
            variant === "success" && "bg-green-600",
            variant === "warning" && "bg-amber-600",
            variant === "danger" && "bg-coral-600",
            variant === "info" && "bg-blue-600"
          )}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-current hover:bg-black/10 focus:bg-black/10 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
