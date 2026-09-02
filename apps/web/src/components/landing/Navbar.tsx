"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ui';
import { APP_CONFIG } from '@/config/app';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Businesses', href: '#businesses' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-4 inset-x-0 z-50 mx-auto max-w-5xl transition-all duration-300 px-4 sm:px-6 lg:px-8 rounded-full',
        isScrolled
          ? 'glass shadow-float bg-white/80 dark:bg-surface/80 border-border-hairline py-3'
          : 'bg-transparent py-4'
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500/10 p-2 rounded-xl group-hover:bg-brand-500/20 transition-colors">
            <Sparkles className="w-5 h-5 text-brand-500" />
          </div>
          <span className="font-bold text-xl tracking-tight gradient-text">
            {APP_CONFIG?.name || 'NeighbourHub'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-brand-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-text-secondary hover:text-text-primary">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-text-secondary hover:text-text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 p-4 glass-card bg-white/95 dark:bg-surface/95 flex flex-col gap-4 md:hidden rounded-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-brand-500 p-2 rounded-lg hover:bg-surface transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-border-hairline my-2" />
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-brand-500 hover:bg-brand-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
