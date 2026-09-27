"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Building2, Phone, Heart, ShieldAlert, Camera, Upload, Check, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Input, Button, Textarea } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
];

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [photoURL, setPhotoURL] = useState(user?.photoURL || AVATAR_PRESETS[0]);
  const [coverURL, setCoverURL] = useState(user?.coverURL || COVER_PRESETS[0]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@neighbourhub.com',
      phone: user?.phone || '+91 98765 43210',
      bio: user?.bio || 'Software engineer, cycling enthusiast...',
      society: user?.society || 'Greenwood Society',
      unit: user?.unit || 'Unit 402, Tower B',
      street: user?.street || '123 Palm Avenue',
      city: user?.city || 'Mumbai, India',
      zip: user?.zip || '400001',
      emergencyContact: user?.emergencyContact || 'Jane Doe (Spouse)',
      emergencyPhone: user?.emergencyPhone || '+91 98765 00000',
      interests: (user?.interests || ['Cycling', 'Coffee', 'Open Source', 'Community Gardening']).join(', '),
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isCover) {
          setCoverURL(base64String);
        } else {
          setPhotoURL(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (formData: any) => {
    const interestsArray = formData.interests
      ? formData.interests.split(',').map((s: string) => s.trim()).filter(Boolean)
      : user?.interests;

    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      society: formData.society,
      unit: formData.unit,
      street: formData.street,
      city: formData.city,
      zip: formData.zip,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      interests: interestsArray,
      photoURL,
      coverURL,
    });

    router.push('/profile');
  };

  const tabs = [
    { id: 'personal', label: 'Photo & Personal', icon: User },
    { id: 'society', label: 'Society & Home', icon: Building2 },
    { id: 'address', label: 'Address & City', icon: MapPin },
    { id: 'emergency', label: 'Emergency Contact', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/profile"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Profile</Link>
          </Button>
          <h1 className="text-2xl font-bold text-text-primary">Edit Your Profile</h1>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-hairline shadow-card overflow-hidden md:flex">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-surface-subtle p-4 border-b md:border-b-0 md:border-r border-border-hairline">
          <div className="flex overflow-x-auto md:flex-col gap-1 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === tab.id 
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 shadow-sm' 
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-brand-600 dark:text-brand-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Profile Photo & Cover</h3>
                  <p className="text-sm text-text-secondary">Upload a new photo or pick from presets.</p>
                </div>

                {/* Avatar Uploader */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-surface-subtle rounded-2xl border border-border-hairline">
                  <div className="relative">
                    <img 
                      src={photoURL} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-md"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold text-text-primary uppercase tracking-wider">Change Avatar</p>
                    <div className="flex flex-wrap gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e, false)} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <Button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl text-xs"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload File
                      </Button>
                    </div>
                    {/* Presets */}
                    <div className="flex gap-2 pt-1">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoURL(preset)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${photoURL === preset ? 'border-brand-500 scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Full Name</label>
                    <Input {...register('name')} placeholder="e.g. John Doe" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Email Address</label>
                    <Input {...register('email')} type="email" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Phone Number</label>
                    <Input {...register('phone')} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Interests (Comma Separated)</label>
                    <Input {...register('interests')} placeholder="Cycling, Coffee, Gardening..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Bio / About You</label>
                    <Textarea {...register('bio')} rows={3} placeholder="Tell neighbors about yourself..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'society' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Housing Society Residence</h3>
                  <p className="text-sm text-text-secondary mb-4">Your apartment and society identification.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Society Name</label>
                    <Input {...register('society')} placeholder="Greenwood Society" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Unit / Flat Number</label>
                    <Input {...register('unit')} placeholder="Unit 402, Tower B" required />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Address Details</h3>
                  <p className="text-sm text-text-secondary mb-4">Location information for neighborhood services.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Street Address</label>
                    <Input {...register('street')} placeholder="123 Palm Avenue" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">City / State</label>
                    <Input {...register('city')} placeholder="Mumbai, Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Postal / PIN Code</label>
                    <Input {...register('zip')} placeholder="400001" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Emergency Contacts</h3>
                  <p className="text-sm text-text-secondary mb-4">Contacts used during Emergency SOS alerts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Contact Name & Relation</label>
                    <Input {...register('emergencyContact')} placeholder="Jane Doe (Spouse)" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Emergency Phone</label>
                    <Input {...register('emergencyPhone')} placeholder="+91 98765 00000" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-border-hairline flex items-center justify-between">
              <Button asChild type="button" variant="outline" className="rounded-xl">
                <Link href="/profile">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 rounded-xl shadow-sm">
                Save & Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
