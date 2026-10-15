"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardRootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const role = user?.role || 'RESIDENT';
    switch (role) {
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      case 'BUSINESS':
        router.replace('/dashboard/business');
        break;
      case 'SERVICE_PROVIDER':
        router.replace('/dashboard/service');
        break;
      case 'RESIDENT':
      default:
        router.replace('/dashboard/resident');
        break;
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-text-secondary font-mono">
        Routing to your authorized dashboard specification...
      </p>
    </div>
  );
}
