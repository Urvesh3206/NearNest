"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Building2, Phone, Heart, ShieldAlert } from 'lucide-react';
import { Input, Button, Textarea } from '@/components/ui';

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Success toast
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'society', label: 'Society', icon: Building2 },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-border-hairline shadow-card overflow-hidden md:flex">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-surface-subtle p-4 border-b md:border-b-0 md:border-r border-border-hairline">
        <h2 className="font-bold text-lg text-text-primary mb-4 px-2 hidden md:block">Edit Profile</h2>
        <div className="flex overflow-x-auto md:flex-col gap-1 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30' 
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-brand-600' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'personal' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Personal Information</h3>
                <p className="text-sm text-text-secondary mb-4">Update your photo and personal details.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <Input {...register('fullName')} defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                  <Input {...register('phone')} defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                  <Textarea {...register('bio')} rows={4} defaultValue="Software engineer, cycling enthusiast..." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Address</h3>
                <p className="text-sm text-text-secondary mb-4">Your current living address.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Street Address</label>
                  <Input {...register('street')} defaultValue="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                  <Input {...register('city')} defaultValue="San Francisco" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Zip Code</label>
                  <Input {...register('zip')} defaultValue="94105" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-border-hairline flex justify-end gap-3">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
