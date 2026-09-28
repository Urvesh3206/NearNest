"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '@/types';
import toast from 'react-hot-toast';

const DEFAULT_USER: AuthUser = {
  uid: 'usr_default_101',
  name: 'John Doe',
  email: 'john.doe@nearnest.com',
  phone: '+91 98765 43210',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  coverURL: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
  role: 'RESIDENT',
  bio: 'Software engineer, cycling enthusiast, and coffee lover. Always up for a weekend ride or helping out with community events.',
  society: 'Greenwood Society',
  unit: 'Unit 402, Tower B',
  city: 'Mumbai, India',
  street: '123 Palm Avenue',
  zip: '400001',
  emergencyContact: 'Jane Doe (Spouse)',
  emergencyPhone: '+91 98765 00000',
  interests: ['Cycling', 'Coffee', 'Open Source', 'Community Gardening', 'Smart Homes'],
  joinedDate: 'October 2023',
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, name?: string, role?: AuthUser['role']) => void;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (updatedData: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  loading: false,
  login: () => {},
  loginWithGoogle: async () => {},
  updateProfile: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nearnest_profile');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        localStorage.setItem('nearnest_profile', JSON.stringify(DEFAULT_USER));
        setUser(DEFAULT_USER);
      }
    } catch (e) {
      console.warn("localStorage profile parse error:", e);
      setUser(DEFAULT_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, name?: string, role: AuthUser['role'] = 'RESIDENT') => {
    const cleanName = name && name.trim().length > 0 
      ? name.trim() 
      : email.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()) || 'Resident';

    const newUser: AuthUser = {
      ...DEFAULT_USER,
      uid: `usr_${Date.now()}`,
      email,
      name: cleanName,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=059669`,
      role,
    };
    setUser(newUser);
    localStorage.setItem('nearnest_profile', JSON.stringify(newUser));
    toast.success(`Welcome to NearNest, ${cleanName}!`);
  };

  const loginWithGoogle = async () => {
    login('user.google@gmail.com', 'Resident Member', 'RESIDENT');
  };

  const updateProfile = (updatedData: Partial<AuthUser>) => {
    setUser((prev) => {
      const updated = {
        ...(prev || DEFAULT_USER),
        ...updatedData,
      };
      localStorage.setItem('nearnest_profile', JSON.stringify(updated));
      return updated;
    });
    toast.success('Profile updated successfully!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nearnest_profile');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
