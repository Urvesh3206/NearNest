"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { resetPassword } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Link>

        {!isSuccess ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text-primary mb-2">Reset password</h2>
              <p className="text-text-secondary">Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 w-full"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Check your email</h3>
            <p className="text-text-secondary mb-8">
              We've sent a password reset link to <br/>
              <span className="font-medium text-text-primary">{email}</span>
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/login">Return to Login</Link>
            </Button>
          </m.div>
        )}
      </m.div>
    </LazyMotion>
  );
}
