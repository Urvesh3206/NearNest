"use client";

import React, { useState } from 'react';
import { Camera, MapPin, Building2, Calendar, Edit3, Settings, Phone, Mail, ShieldCheck, Heart, User, LogOut } from 'lucide-react';
import { Avatar, Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Cover Photo */}
      <div 
        className="relative h-48 sm:h-64 bg-cover bg-center rounded-b-3xl shadow-sm border border-border-hairline"
        style={{
          backgroundImage: `url('${user?.coverURL || "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop"}')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-b-3xl pointer-events-none" />
        <div className="absolute top-4 right-4">
          <Button asChild variant="outline" className="bg-black/30 hover:bg-black/50 border-white/30 text-white backdrop-blur-md rounded-full text-xs sm:text-sm">
            <Link href="/profile/edit">
              <Camera className="h-4 w-4 mr-2" /> Change Cover
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-8 -mt-16 sm:-mt-20 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div className="relative inline-block">
            <img 
              src={user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"} 
              alt={user?.name || "User"}
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-surface shadow-xl bg-surface" 
            />
            <Link 
              href="/profile/edit"
              className="absolute bottom-2 right-2 bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-full shadow-md transition-transform hover:scale-105"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-5">
              <Link href="/profile/edit"><Edit3 className="h-4 w-4 mr-2" /> Edit Profile</Link>
            </Button>
            <Button onClick={logout} variant="outline" className="rounded-full text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-950/30 border-coral-200 dark:border-coral-800">
              <LogOut className="h-4 w-4 mr-2" /> Log Out
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">{user?.name || "John Doe"}</h1>
            <Badge className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border-none rounded-full px-3 py-1 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> {user?.role || "Verified Resident"}
            </Badge>
          </div>
          
          <p className="text-text-secondary mb-4 max-w-2xl text-sm sm:text-base leading-relaxed">
            {user?.bio || "Community member. Connecting with neighbors, hiring local service providers, and staying active in society events."}
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-text-tertiary mb-6">
            <span className="flex items-center text-text-secondary"><Building2 className="h-4 w-4 mr-1.5 text-brand-500" /> {user?.society || "Greenwood Society"}, {user?.unit || "Unit 402"}</span>
            <span className="flex items-center text-text-secondary"><MapPin className="h-4 w-4 mr-1.5 text-emerald-500" /> {user?.city || "Mumbai, India"}</span>
            <span className="flex items-center text-text-secondary"><Mail className="h-4 w-4 mr-1.5 text-blue-500" /> {user?.email || "john.doe@neighbourhub.com"}</span>
            <span className="flex items-center text-text-secondary"><Phone className="h-4 w-4 mr-1.5 text-amber-500" /> {user?.phone || "+91 98765 43210"}</span>
            <span className="flex items-center text-text-secondary"><Calendar className="h-4 w-4 mr-1.5 text-purple-500" /> Joined {user?.joinedDate || "October 2023"}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-border-hairline py-4 max-w-lg bg-surface-subtle/50 rounded-2xl px-4 text-center">
            <div>
              <span className="block font-extrabold text-xl text-text-primary">12</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Society Posts</span>
            </div>
            <div>
              <span className="block font-extrabold text-xl text-text-primary">89</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Neighbors</span>
            </div>
            <div>
              <span className="block font-extrabold text-xl text-text-primary">₹5,300</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Dues (Paid)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-8">
        <div className="flex border-b border-border-hairline mb-6 gap-2">
          {['About & Interests', 'Society Details', 'Emergency Info'].map((tab) => {
            const tabKey = tab.toLowerCase().split(' ')[0];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={`px-5 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tabKey 
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400' 
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[250px]">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-surface rounded-2xl border border-border-hairline p-6 shadow-sm">
                <h3 className="font-bold text-text-primary mb-3 text-base">Community Interests & Hobbies</h3>
                <div className="flex gap-2.5 flex-wrap">
                  {(user?.interests || ['Cycling', 'Coffee', 'Open Source', 'Community Gardening', 'Smart Homes']).map(tag => (
                    <span key={tag} className="px-3.5 py-1.5 bg-surface-subtle border border-border-hairline rounded-full text-xs sm:text-sm font-medium text-text-secondary">
                      🏷️ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'society' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-text-primary text-base">Housing Society Residence Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">Society Name</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.society || "Greenwood Society"}</p>
                </div>
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">Unit / Flat Number</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.unit || "Unit 402, Tower B"}</p>
                </div>
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">Street Address</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.street || "123 Palm Avenue"}</p>
                </div>
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">City & Postal Code</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.city || "Mumbai"}, {user?.zip || "400001"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="bg-surface rounded-2xl border border-border-hairline p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-text-primary text-base">Emergency Contacts & Medical Info</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">Primary Emergency Contact</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.emergencyContact || "Jane Doe (Spouse)"}</p>
                </div>
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-border-hairline">
                  <p className="text-xs text-text-tertiary">Emergency Phone</p>
                  <p className="font-semibold text-text-primary mt-0.5">{user?.emergencyPhone || "+91 98765 00000"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
