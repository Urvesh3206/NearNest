"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Store, 
  Briefcase, 
  Calendar, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  Building2, 
  Settings, 
  Menu, 
  Search, 
  X, 
  Bot, 
  ShieldAlert, 
  Shield, 
  LogOut,
  Sparkles,
  Lock
} from 'lucide-react';
import { Avatar, Input, Badge, NotificationDropdown } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { RoleSwitcher } from '@/components/auth/RoleSwitcher';
import { UserRole } from '@/types';

interface NavItemConfig {
  href: string;
  icon: any;
  label: string;
  allowedRoles?: UserRole[];
  badge?: string;
  dynamicLabel?: (role: UserRole) => string;
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  { href: '/feed', icon: Home, label: 'Home Feed' },
  { 
    href: '/businesses', 
    icon: Store, 
    label: 'Businesses',
    dynamicLabel: (role) => (role === 'BUSINESS' ? '🏪 Business Console' : 'Businesses'),
  },
  { 
    href: '/services', 
    icon: Briefcase, 
    label: 'Services',
    dynamicLabel: (role) => (role === 'SERVICE_PROVIDER' ? '🔧 Service Pro Hub' : 'Services'),
  },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/notices', icon: Bell, label: 'Notices' },
  { href: '/society', icon: Building2, label: 'Society' },
  { href: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { href: '/emergency', icon: ShieldAlert, label: 'Emergency' },
  { 
    href: '/admin', 
    icon: Shield, 
    label: 'Admin Panel',
    allowedRoles: ['ADMIN'],
    badge: 'Admin Only'
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const currentRole = user?.role || 'RESIDENT';

  // Filter navigation items based on current role permissions
  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(currentRole);
  });

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
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between md:justify-start gap-3 border-b border-border-hairline/40">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" title="Go to Main Home Page">
            <div className="bg-brand-500 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-brand-600 transition-colors">NearNest</span>
              <span className="block text-[10px] text-brand-600 font-semibold group-hover:underline">← Landing Home</span>
            </div>
          </Link>
          <button className="md:hidden text-text-secondary" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Role Specification Status Banner */}
        <div className="px-4 py-2.5 bg-surface-subtle/50 border-b border-border-hairline/40">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-tertiary font-semibold uppercase tracking-wider">Access Level:</span>
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              currentRole === 'ADMIN'
                ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                : currentRole === 'BUSINESS'
                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                : currentRole === 'SERVICE_PROVIDER'
                ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
            }`}>
              {currentRole === 'ADMIN' ? '👑 Master Admin' : currentRole === 'BUSINESS' ? '🏪 Business' : currentRole === 'SERVICE_PROVIDER' ? '🔧 Service Pro' : '🏡 Resident'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-3">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            const displayLabel = item.dynamicLabel ? item.dynamicLabel(currentRole) : item.label;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                  isActive 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-text-secondary'}`} />
                  <span>{displayLabel}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility Actions */}
        <div className="p-4 border-t border-border-hairline space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors font-semibold">
            <Home className="h-4 w-4" /> Landing Home
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-text-secondary hover:bg-surface-subtle transition-colors">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-950/30 transition-colors text-left font-semibold"
          >
            <LogOut className="h-4 w-4" /> Log Out / Switch
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-border-hairline bg-surface-subtle/30">
          <Link href="/profile" className="flex items-center gap-3 hover:bg-surface-subtle p-2 rounded-xl transition-colors">
            <Avatar 
              src={user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"} 
              name={user?.name || "User"} 
              className="h-9 w-9 rounded-xl border border-brand-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text-primary truncate">{user?.name || "Urvesh Rane"}</p>
              <p className="text-[10px] text-text-tertiary truncate">{user?.email || "urveshrane3206@gmail.com"}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">

        {/* Topbar Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-surface-glass backdrop-blur-xl border-b border-border-hairline z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-text-secondary hover:text-text-primary" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex relative w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <Input placeholder="Search community..." className="pl-9 rounded-full bg-surface-subtle border-transparent focus:bg-surface text-xs" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Interactive Role Switcher */}
            <RoleSwitcher />

            {/* Direct Back to Home Page button */}
            <Link 
              href="/" 
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-500 hover:text-white transition-all shadow-sm"
              title="Return to Main Home Page"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <Link href="/ai-assistant" className="hidden sm:flex relative p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-full transition-colors" title="AI Assistant">
              <Bot className="h-5 w-5" />
            </Link>

            {/* Admin shortcut if user is admin */}
            {isAdmin && (
              <Link href="/admin" className="hidden sm:flex relative p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full transition-colors" title="Admin Panel">
                <Shield className="h-5 w-5" />
              </Link>
            )}

            {/* Notification Center */}
            <NotificationDropdown />

            <Link href="/profile" className="flex items-center gap-2">
              <Avatar 
                src={user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"} 
                name={user?.name || "User"} 
                className="h-8 w-8 rounded-xl border-2 border-brand-500/30 cursor-pointer hover:border-brand-500 transition-colors" 
              />
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <div className={`flex-1 ${pathname === '/chat' ? 'h-[calc(100vh-4rem)] p-2 sm:p-4 overflow-hidden' : 'overflow-y-auto p-4 sm:p-6 lg:p-8'}`}>
          <div className={`${pathname === '/chat' ? 'h-full w-full' : 'max-w-5xl mx-auto pb-20 md:pb-0'}`}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-hairline px-6 py-2.5 flex justify-between items-center z-40 pb-safe">
        {[
          { href: '/feed', icon: Home, label: 'Feed' },
          { href: '/businesses', icon: Store, label: 'Shops' },
          { href: '/chat', icon: MessageCircle, label: 'Chat' },
          { href: '/society', icon: Building2, label: 'Society' },
          { href: '/profile', icon: Settings, label: 'Profile' },
        ].map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <Link key={idx} href={item.href} className={`flex flex-col items-center p-1.5 ${isActive ? 'text-brand-600' : 'text-text-tertiary'}`}>
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
