"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = "right", className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-2 w-56 origin-top-right rounded-xl bg-surface p-1 shadow-card ring-1 ring-border-hairline",
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {item.divider && idx !== 0 && (
                  <div className="my-1 h-px bg-border-hairline mx-2" />
                )}
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    item.danger
                      ? "text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-950/30"
                      : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
