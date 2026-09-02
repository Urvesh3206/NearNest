"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, showCount, maxLength, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(0);
    const id = React.useId();
    const isError = Boolean(error);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-surface px-4 py-2 text-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
            isError
              ? "border-coral-500 focus-visible:ring-coral-500"
              : "border-border-hairline focus-visible:ring-brand-500",
            className
          )}
          {...props}
        />
        <div className="mt-1.5 flex justify-between text-xs">
          {(error || helperText) ? (
            <p className={cn(error ? "text-coral-500" : "text-text-secondary")}>
              {error || helperText}
            </p>
          ) : <div />}
          {showCount && maxLength && (
            <p className="text-text-tertiary">
              {count}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
