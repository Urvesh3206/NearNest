"use client";

import React, { useState } from 'react';
import { m } from 'framer-motion';

const filters = [
  'All', 'Announcements', 'Events', 'Questions', 'Polls', 'Lost & Found', 'Marketplace'
];

export function FeedFilters() {
  const [active, setActive] = useState('All');

  return (
    <div className="relative flex items-center overflow-x-auto hide-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-max">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === filter 
                ? 'text-brand-700 dark:text-brand-300' 
                : 'text-text-secondary hover:bg-surface-subtle bg-surface border border-border-hairline'
            }`}
          >
            {active === filter && (
              <m.div
                layoutId="active-filter"
                className="absolute inset-0 bg-brand-100 dark:bg-brand-900/40 border border-brand-300 dark:border-brand-700 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
