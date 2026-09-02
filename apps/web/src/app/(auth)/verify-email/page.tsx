"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { m, LazyMotion, domAnimation } from 'framer-motion';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth(); // Assume it gives currentUser
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Logic to reload user and check if email is verified
      // await user?.reload();
      // if (user?.emailVerified) {
      //   setIsVerified(true);
      //   clearInterval(interval);
      // }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="bg-brand-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
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
            ? "Your email address has been successfully verified. You can now access all features of NeighbourHub."
            : "We've sent a verification email to your address. Please check your inbox and click the link to verify your account."}
        </p>

        {isVerified ? (
          <Button 
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => router.push('/feed')}
          >
            Continue to Dashboard
          </Button>
        ) : (
          <div className="space-y-4">
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
              className="w-full text-brand-600"
              onClick={() => router.push('/feed')}
            >
              Skip for now
            </Button>
          </div>
        )}
      </m.div>
    </LazyMotion>
  );
}
