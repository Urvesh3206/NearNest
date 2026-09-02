"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-lg text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-border-hairline bg-surface text-text-primary focus-visible:ring-brand-500",
        filled: "border-transparent bg-surface-subtle text-text-primary focus-visible:ring-brand-500",
      },
      inputSize: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-4 text-base",
      },
      hasError: {
        true: "border-coral-500 focus-visible:ring-coral-500",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      hasError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, hasError, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const isError = Boolean(error) || hasError;

    return (
      <div className="w-full">
        {label && <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant, inputSize, hasError: isError }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("mt-1.5 text-xs", error ? "text-coral-500" : "text-text-secondary")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
