"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, activeTab: controlledActiveTab, onChange, className }) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (id: string) => {
    setInternalActiveTab(id);
    onChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex w-full space-x-1 rounded-xl bg-surface-subtle p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative w-full rounded-lg py-2.5 text-sm font-medium outline-none transition-all",
              activeTab === tab.id
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 rounded-lg bg-surface shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
