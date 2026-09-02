"use client";

import React, { useState } from 'react';
import { Camera, MapPin, Building2, Calendar, Edit3, Settings } from 'lucide-react';
import { Avatar, Button, Badge } from '@/components/ui';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  
  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-brand-400 to-accent-300 rounded-b-3xl">
        <div className="absolute top-4 right-4">
          <Button variant="outline" className="bg-white/20 hover:bg-white/30 border-white/40 text-white backdrop-blur-md">
            <Camera className="h-4 w-4 mr-2" /> Edit Cover
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-8 -mt-16 sm:-mt-20 mb-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div className="relative inline-block">
            <Avatar src="https://i.pravatar.cc/250?u=a042581f4e29026024d" name="Sarah Johnson" className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-surface shadow-lg" />
            <button className="absolute bottom-2 right-2 bg-surface border border-border-hairline p-2 rounded-full shadow-sm hover:bg-surface-subtle text-text-secondary">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/profile/edit"><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full px-3">
              <Link href="/settings"><Settings className="h-5 w-5" /></Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">John Doe</h1>
            <Badge className="bg-brand-100 text-brand-700 border-none rounded-md px-2 py-0.5">Resident</Badge>
          </div>
          <p className="text-text-secondary mb-4 max-w-2xl text-sm sm:text-base">
            Software engineer, cycling enthusiast, and coffee lover. Always up for a weekend ride or helping out with community events.
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-text-tertiary mb-6">
            <span className="flex items-center"><Building2 className="h-4 w-4 mr-1.5" /> Greenwood Society, Unit 402</span>
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5" /> San Francisco, CA</span>
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> Joined Oct 2022</span>
          </div>

          <div className="flex gap-6 border-y border-border-hairline py-4">
            <div className="text-center">
              <span className="block font-bold text-lg text-text-primary">124</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-text-primary">89</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-text-primary">112</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-8">
        <div className="flex border-b border-border-hairline mb-6">
          {['Posts', 'Reviews', 'About'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-[1px] ${
                activeTab === tab.toLowerCase() 
                  ? 'border-brand-500 text-brand-600' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area (Mock) */}
        <div className="min-h-[300px]">
          {activeTab === 'posts' && (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border-hairline border-dashed">
              <p className="text-text-tertiary">Posts will appear here.</p>
            </div>
          )}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl border border-border-hairline p-6">
                <h3 className="font-semibold text-text-primary mb-4">Interests</h3>
                <div className="flex gap-2 flex-wrap">
                  {['Cycling', 'Coffee', 'Open Source', 'Community Gardening'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-subtle border border-border-hairline rounded-full text-sm text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
