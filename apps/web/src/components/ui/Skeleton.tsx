"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "animate-pulse bg-surface-subtle",
  {
    variants: {
      variant: {
        text: "h-4 rounded-md",
        circle: "rounded-full",
        rectangle: "rounded-lg",
        card: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
