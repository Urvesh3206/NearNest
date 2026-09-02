"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { signInWithGoogle, signInWithEmail } from '@/lib/firebase';
import { loginSchema } from '@/lib/validators';
import * as z from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      router.push('/feed');
    } catch (error) {
      console.error(error);
      // Toast error handling would go here
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/feed');
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h2>
          <p className="text-text-secondary">Sign in to your account to continue</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-6 py-6 border-border-hairline flex items-center justify-center gap-3 hover:bg-surface-subtle"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="font-medium">Continue with Google</span>
        </Button>

        <div className="relative flex items-center py-4 mb-6">
          <div className="flex-grow border-t border-border-hairline"></div>
          <span className="flex-shrink-0 mx-4 text-text-tertiary text-sm">or continue with email</span>
          <div className="flex-grow border-t border-border-hairline"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <Input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="pl-10 w-full"
                error={errors.email?.message}
              />
            </div>
            {errors.email && <p className="text-coral-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 w-full"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-coral-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border-hairline text-brand-500 focus:ring-brand-500" />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white mt-6"
            disabled={isLoading || googleLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </m.div>
    </LazyMotion>
  );
}
