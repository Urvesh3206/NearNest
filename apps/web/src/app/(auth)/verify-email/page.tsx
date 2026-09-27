"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { m, LazyMotion, domAnimation } from 'framer-motion';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInstantVerify = () => {
    setIsVerified(true);
    if (!user) {
      login("resident@nearnest.local", "NearNest Resident", "RESIDENT");
    }
    setTimeout(() => {
      router.push('/feed');
    }, 400);
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="bg-brand-50 dark:bg-brand-950/60 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/20 shadow-sm">
          {isVerified ? (
            <CheckCircle className="h-12 w-12 text-brand-600" />
          ) : (
            <Mail className="h-12 w-12 text-brand-600" />
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-text-primary mb-3">
          {isVerified ? "Email verified!" : "Verify your email"}
        </h2>
        
        <p className="text-text-secondary mb-8">
          {isVerified 
            ? "Your email address has been successfully verified. You can now access all features of NearNest."
            : "We've sent a verification link to your address. Click the instant verify button below to enter directly."}
        </p>

        {isVerified ? (
          <Button 
            className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-md"
            onClick={() => router.push('/feed')}
          >
            Continue to Dashboard
          </Button>
        ) : (
          <div className="space-y-4">
            <Button 
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md"
              onClick={handleInstantVerify}
            >
              Verify & Enter Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-border-hairline"
              disabled={countdown > 0}
              onClick={() => setCountdown(60)}
            >
              {countdown > 0 ? `Resend email in ${countdown}s` : 'Resend verification email'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-brand-600 font-medium hover:underline"
              onClick={() => router.push('/feed')}
            >
              Skip to Community Feed →
            </Button>
          </div>
        )}
      </m.div>
    </LazyMotion>
  );
}
