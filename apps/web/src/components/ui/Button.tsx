"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-brand-600 text-white hover:bg-brand-700 shadow-subtle",
        secondary: "bg-surface text-text-primary border border-border-hairline hover:bg-surface-subtle shadow-subtle",
        outline: "border-2 border-border-hairline text-text-primary hover:border-brand-500 hover:text-brand-600 bg-transparent",
        ghost: "hover:bg-surface-subtle text-text-secondary hover:text-text-primary",
        danger: "bg-coral-600 text-white hover:bg-coral-700 shadow-subtle",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, asChild, ...props }, ref) => {
    const compClassName = cn(buttonVariants({ variant, size, fullWidth, className }));
    
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(compClassName, children.props.className),
        ref: ref as any,
        ...props,
      } as any);
    }

    return (
      <button
        className={compClassName}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
