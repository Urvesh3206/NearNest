"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, Briefcase, Calendar, ShoppingBag, MessageCircle, Bell, Building2, Settings, HelpCircle, Menu, Search, X, Bot, ShieldAlert, Shield } from 'lucide-react';
import { Avatar, Input, Badge } from '@/components/ui';

const navItems = [
  { href: '/feed', icon: Home, label: 'Home Feed' },
  { href: '/businesses', icon: Store, label: 'Businesses' },
  { href: '/services', icon: Briefcase, label: 'Services' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/notices', icon: Bell, label: 'Notices' },
  { href: '/society', icon: Building2, label: 'Society' },
  { href: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { href: '/emergency', icon: ShieldAlert, label: 'Emergency' },
  { href: '/admin', icon: Shield, label: 'Admin' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-hairline transform transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">NeighbourHub</span>
          </div>
          <button className="md:hidden text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-400 font-medium' 
                    : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-hairline space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-surface-subtle transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
          <Link href="/help" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-surface-subtle transition-colors">
            <HelpCircle className="h-5 w-5" /> Help & Support
          </Link>
        </div>

        <div className="p-4 border-t border-border-hairline">
          <Link href="/profile" className="flex items-center gap-3 hover:bg-surface-subtle p-2 rounded-xl transition-colors">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="JD" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">John Doe</p>
              <p className="text-xs text-text-secondary truncate">Resident</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-surface-glass backdrop-blur-xl border-b border-border-hairline z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <Input placeholder="Search your community..." className="pl-9 rounded-full bg-surface-subtle border-transparent focus:bg-surface" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ai-assistant" className="hidden sm:flex relative p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors" title="AI Assistant">
              <Bot className="h-5 w-5" />
            </Link>
            <Link href="/emergency" className="hidden sm:flex relative p-2 text-coral-600 hover:text-coral-700 hover:bg-coral-50 rounded-full transition-colors" title="Emergency">
              <ShieldAlert className="h-5 w-5" />
            </Link>
            <Link href="/admin" className="hidden sm:flex relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-full transition-colors" title="Admin">
              <Shield className="h-5 w-5" />
            </Link>
            <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-coral-500"></span>
            </button>
            <Link href="/profile">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="User" className="h-9 w-9 border-2 border-surface cursor-pointer" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto pb-20 md:pb-0">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-hairline px-6 py-3 flex justify-between items-center z-40 pb-safe">
        {[
          { href: '/feed', icon: Home },
          { href: '/businesses', icon: Store },
          { href: '/create', icon: Building2 }, // Placeholder for generic center action
          { href: '/chat', icon: MessageCircle },
          { href: '/profile', icon: Settings },
        ].map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href} className={`flex flex-col items-center p-2 ${isActive ? 'text-brand-600' : 'text-text-tertiary'}`}>
              <item.icon className="h-6 w-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
