"use client";

import React from 'react';
import { Shield, Bell, Lock, Download, Trash2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui';

// Mock Toggle Switch component (since not provided in prompt UI list)
const Toggle = ({ active }: { active?: boolean }) => (
  <div className={`w-11 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${active ? 'bg-brand-500' : 'bg-surface-subtle border border-border-hairline'}`}>
    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </div>
);

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <button className="w-full text-left px-4 py-2.5 rounded-lg bg-surface text-brand-600 font-medium text-sm flex items-center gap-3">
            <Shield className="h-4 w-4" /> Privacy
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-surface-subtle text-text-secondary font-medium text-sm flex items-center gap-3">
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-surface-subtle text-text-secondary font-medium text-sm flex items-center gap-3">
            <Lock className="h-4 w-4" /> Security
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-surface rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-hairline">
              <h2 className="text-lg font-semibold text-text-primary mb-1">Profile Visibility</h2>
              <p className="text-sm text-text-secondary">Control who can see your profile information.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-text-primary">Hide Phone Number</h4>
                  <p className="text-xs text-text-secondary">Other members won't see your phone number</p>
                </div>
                <Toggle active={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-text-primary">Hide Online Status</h4>
                  <p className="text-xs text-text-secondary">Don't show when you are active</p>
                </div>
                <Toggle active={false} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-text-primary">Allow Direct Messages</h4>
                  <p className="text-xs text-text-secondary">Receive messages from anyone in your society</p>
                </div>
                <Toggle active={true} />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-hairline">
              <h2 className="text-lg font-semibold text-text-primary mb-1">Account Data</h2>
            </div>
            <div className="p-6 space-y-4">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <Download className="h-4 w-4" /> Download My Data
              </Button>
              <div className="pt-4 border-t border-border-hairline mt-4">
                <h4 className="text-coral-600 font-medium text-sm mb-2">Danger Zone</h4>
                <p className="text-xs text-text-secondary mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button className="bg-coral-50 hover:bg-coral-100 text-coral-600 border-none shadow-none">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
