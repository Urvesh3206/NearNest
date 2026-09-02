"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-hairline bg-surface p-12 text-center",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-subtle text-text-tertiary">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-text-secondary">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";
