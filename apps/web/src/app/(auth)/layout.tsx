import React from 'react';
import { Building2, Shield, Users } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-canvas">
      {/* Left side panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-brand-900 to-brand-700 text-white p-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-12 right-12 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-16">
            <Building2 className="h-8 w-8 text-brand-100" />
            <span className="text-2xl font-bold tracking-tight">NeighbourHub</span>
          </div>

          <div className="max-w-md mt-auto mb-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Your Premium Community Platform
            </h1>
            <p className="text-brand-100 text-lg mb-10">
              Connect with neighbours, discover local businesses, and stay updated with your society.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-brand-600/50 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-brand-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connect Locally</h3>
                  <p className="text-brand-200 text-sm">Build meaningful relationships in your neighborhood.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-brand-600/50 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-brand-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-brand-200 text-sm">Verified members ensure a safe community environment.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Floating glass cards */}
          <div className="mt-auto pt-12 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex-1">
              <div className="text-3xl font-bold text-white mb-1">10k+</div>
              <div className="text-brand-200 text-sm">Active Communities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex-1">
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-brand-200 text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form area */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32 relative">
        {children}
      </div>
    </div>
  );
}
