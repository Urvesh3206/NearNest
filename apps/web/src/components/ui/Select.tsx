"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, children, ...props }, ref) => {
    const isError = Boolean(error);
    const id = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border bg-surface px-4 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              isError
                ? "border-coral-500 focus-visible:ring-coral-500"
                : "border-border-hairline focus-visible:ring-brand-500",
              className
            )}
            {...props}
          >
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary">
            <ChevronDown className="h-4 w-4" />
          </div>
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
Select.displayName = "Select";
