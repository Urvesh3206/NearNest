"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-surface shadow-card border border-border-hairline",
        glass: "glass-card",
        outline: "bg-transparent border-2 border-border-hairline",
        elevated: "bg-surface shadow-float border border-border-hairline",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
