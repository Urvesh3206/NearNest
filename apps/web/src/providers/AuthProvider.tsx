"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, UserRole } from '@/types';
import toast from 'react-hot-toast';

export const DEMO_PROFILES: Record<UserRole, AuthUser> = {
  ADMIN: {
    uid: 'usr_admin_001',
    name: 'Urvesh Rane',
    email: 'urveshrane3206@gmail.com',
    phone: '+91 9373571631',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    coverURL: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
    role: 'ADMIN',
    bio: 'Founder & Super Administrator of NearNest. Master access to platform security, society operations, and verified business registries.',
    society: 'Ajeenkya Residency & Central Society',
    unit: 'Tower A 401',
    city: 'Pune, Maharashtra',
    street: 'ADYPU Campus Road, Lohegaon',
    zip: '411047',
    emergencyContact: 'Sumit Gurjar (Co-Lead)',
    emergencyPhone: 'sumit.gurjar@adypu.edu.in',
    interests: ['Platform Architecture', 'Community Security', 'Civic Tech', 'Smart Housing'],
    joinedDate: 'January 2024',
  },
  RESIDENT: {
    uid: 'usr_resident_102',
    name: 'Aarav Patel',
    email: 'aarav.patel@nearnest.com',
    phone: '+91 98765 43210',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    coverURL: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    role: 'RESIDENT',
    bio: 'Software engineer & society resident. Interested in weekend cycling drives and central garden landscaping.',
    society: 'Ajeenkya Residency',
    unit: 'Unit 402, Tower B',
    city: 'Pune, India',
    street: 'Palm Avenue, Wing 2',
    zip: '411047',
    emergencyContact: 'Neha Patel (Spouse)',
    emergencyPhone: '+91 98765 00000',
    interests: ['Cycling', 'Community Gardening', 'Badminton', 'Society Events'],
    joinedDate: 'March 2024',
  },
  BUSINESS: {
    uid: 'usr_business_203',
    name: 'Priya Sharma (Green Mart)',
    email: 'contact@greenmartorganic.com',
    phone: '+91 91234 56789',
    photoURL: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
    coverURL: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1600&auto=format&fit=crop',
    role: 'BUSINESS',
    bio: 'Owner & Operator at Green Mart Organics. Providing fresh farm vegetables, dairy, and groceries with 15-min society delivery.',
    society: 'Ajeenkya Commercial Complex',
    unit: 'Shop No. 12, Ground Floor',
    city: 'Pune, India',
    businessName: 'Green Mart Organic Groceries',
    businessCategory: 'Grocery & Daily Essentials',
    interests: ['Organic Produce', 'Doorstep Delivery', 'Retail Commerce'],
    joinedDate: 'June 2024',
  },
  SERVICE_PROVIDER: {
    uid: 'usr_service_304',
    name: 'Rajesh Kumar (Electrician)',
    email: 'rajesh.electrician@nearnest.com',
    phone: '+91 98989 12121',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    coverURL: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop',
    role: 'SERVICE_PROVIDER',
    bio: 'Government Licensed Master Electrician. 8+ years experience in MCB repair, appliance wiring, and inverter installations.',
    society: 'Sector 14 Service Hub',
    unit: 'Service Zone A',
    city: 'Pune, India',
    serviceCategory: 'Electrician & Home Appliances',
    hourlyRate: '₹299/visit',
    interests: ['Home Electricals', 'Emergency Wiring', 'Appliance Servicing'],
    joinedDate: 'August 2024',
  },
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, name?: string, role?: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (updatedData: Partial<AuthUser>) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isResident: boolean;
  isBusiness: boolean;
  isServiceProvider: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES.ADMIN,
  loading: false,
  login: () => {},
  loginWithGoogle: async () => {},
  updateProfile: () => {},
  switchRole: () => {},
  logout: () => {},
  isAdmin: true,
  isResident: false,
  isBusiness: false,
  isServiceProvider: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(DEMO_PROFILES.ADMIN);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const isLoggedOut = localStorage.getItem('nearnest_logged_out') === 'true';
      if (isLoggedOut) {
        setUser(null);
      } else {
        const stored = localStorage.getItem('nearnest_profile');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default first-time experience as ADMIN
          localStorage.setItem('nearnest_profile', JSON.stringify(DEMO_PROFILES.ADMIN));
          setUser(DEMO_PROFILES.ADMIN);
        }
      }
    } catch (e) {
      console.warn("localStorage profile parse error:", e);
      setUser(DEMO_PROFILES.ADMIN);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, name?: string, role: UserRole = 'RESIDENT') => {
    // If admin email is used, automatically grant super admin role
    const isAdminEmail = email.toLowerCase().includes('urvesh') || email.toLowerCase().includes('admin');
    const finalRole: UserRole = isAdminEmail ? 'ADMIN' : role;

    const profileTemplate = DEMO_PROFILES[finalRole] || DEMO_PROFILES.RESIDENT;

    const cleanName = name && name.trim().length > 0 
      ? name.trim() 
      : email.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()) || 'Resident';

    const newUser: AuthUser = {
      ...profileTemplate,
      uid: `usr_${Date.now()}`,
      email,
      name: cleanName,
      role: finalRole,
    };

    localStorage.removeItem('nearnest_logged_out');
    setUser(newUser);
    localStorage.setItem('nearnest_profile', JSON.stringify(newUser));
    toast.success(`Logged in as ${finalRole}: ${cleanName}`);
  };

  const loginWithGoogle = async () => {
    login('urveshrane3206@gmail.com', 'Urvesh Rane', 'ADMIN');
  };

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    if (profile) {
      localStorage.removeItem('nearnest_logged_out');
      setUser(profile);
      localStorage.setItem('nearnest_profile', JSON.stringify(profile));
      toast.success(`Active Persona switched to: ${newRole} (${profile.name})`, {
        icon: newRole === 'ADMIN' ? '👑' : newRole === 'BUSINESS' ? '🏪' : newRole === 'SERVICE_PROVIDER' ? '🔧' : '🏡',
      });
    }
  };

  const updateProfile = (updatedData: Partial<AuthUser>) => {
    setUser((prev) => {
      const updated = {
        ...(prev || DEMO_PROFILES.ADMIN),
        ...updatedData,
      };
      localStorage.removeItem('nearnest_logged_out');
      localStorage.setItem('nearnest_profile', JSON.stringify(updated));
      return updated;
    });
    toast.success('Profile updated successfully!');
  };

  const logout = () => {
    // Clear user session completely
    setUser(null);
    localStorage.removeItem('nearnest_profile');
    localStorage.setItem('nearnest_logged_out', 'true');
    toast.success('You have been logged out successfully.');
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const role = user?.role || 'RESIDENT';
  const isAdmin = role === 'ADMIN';
  const isResident = role === 'RESIDENT';
  const isBusiness = role === 'BUSINESS';
  const isServiceProvider = role === 'SERVICE_PROVIDER';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        updateProfile,
        switchRole,
        logout,
        isAdmin,
        isResident,
        isBusiness,
        isServiceProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
