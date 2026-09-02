"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { Home, Store, Wrench, Building2, Check, ArrowLeft, Mail, ChevronRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { signupSchema } from '@/lib/validators';
import * as z from 'zod';

const roles = [
  { id: 'resident', title: 'Resident', icon: Home, desc: 'Join your neighborhood community' },
  { id: 'business', title: 'Business Owner', icon: Store, desc: 'Grow your local business' },
  { id: 'provider', title: 'Service Provider', icon: Wrench, desc: 'Offer your professional services' },
  { id: 'admin', title: 'Society Admin', icon: Building2, desc: 'Manage your housing society' },
];

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    if (pass.length > 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    if (pass.length >= 6) return 2;
    return 1;
  };
  const strength = getStrength(password);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password);
      setEmail(data.email);
      setStep(3); // Move to verification step
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push('/feed');
    } catch (error) {
      console.error(error);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="w-full max-w-md mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i ? 'w-8 bg-brand-500' : step > i ? 'w-4 bg-brand-200' : 'w-4 bg-surface-subtle'
              }`}
            />
          ))}
        </div>

        {step > 1 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        )}

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <m.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-text-primary mb-2">Join NeighbourHub</h2>
                  <p className="text-text-secondary">How would you like to use the platform?</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                          : 'border-border-hairline bg-surface hover:border-brand-300 hover:shadow-card-hover'
                      }`}
                    >
                      {selectedRole === role.id && (
                        <div className="absolute top-3 right-3 bg-brand-500 text-white rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <role.icon className={`h-8 w-8 mb-3 ${selectedRole === role.id ? 'text-brand-600' : 'text-text-secondary'}`} />
                      <h3 className="font-semibold text-text-primary mb-1">{role.title}</h3>
                      <p className="text-xs text-text-secondary leading-tight">{role.desc}</p>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white"
                  disabled={!selectedRole}
                  onClick={() => setStep(2)}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="mt-8 text-center text-sm text-text-secondary">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                    Sign in
                  </Link>
                </p>
              </m.div>
            )}

            {step === 2 && (
              <m.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-text-primary mb-2">Create Account</h2>
                  <p className="text-text-secondary">Fill in your details below</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-6 border-border-hairline flex items-center justify-center gap-3 hover:bg-surface-subtle"
                  onClick={handleGoogleSignUp}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-medium">Sign up with Google</span>
                </Button>

                <div className="relative flex items-center py-2 mb-6">
                  <div className="flex-grow border-t border-border-hairline"></div>
                  <span className="flex-shrink-0 mx-4 text-text-tertiary text-sm">or</span>
                  <div className="flex-grow border-t border-border-hairline"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input {...register('name')} placeholder="Full Name" error={errors.name?.message} />
                  </div>
                  <div>
                    <Input {...register('email')} type="email" placeholder="Email Address" error={errors.email?.message} />
                  </div>
                  <div>
                    <Input {...register('password')} type="password" placeholder="Password" error={errors.password?.message} />
                    <div className="flex gap-1 mt-2">
                      <div className={`h-1.5 flex-1 rounded-full ${strength >= 1 ? 'bg-coral-500' : 'bg-surface-subtle'}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${strength >= 2 ? 'bg-accent-500' : 'bg-surface-subtle'}`} />
                      <div className={`h-1.5 flex-1 rounded-full ${strength >= 3 ? 'bg-brand-500' : 'bg-surface-subtle'}`} />
                    </div>
                  </div>
                  <div>
                    <Input {...register('confirmPassword')} type="password" placeholder="Confirm Password" error={errors.confirmPassword?.message} />
                  </div>
                  
                  <div className="flex items-start gap-2 mt-2">
                    <input type="checkbox" className="mt-1 rounded border-border-hairline text-brand-500" required />
                    <span className="text-xs text-text-secondary">
                      I agree to the <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
                    </span>
                  </div>

                  <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white mt-4" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </m.div>
            )}

            {step === 3 && (
              <m.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute w-full text-center"
              >
                <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-10 w-10 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-3">Check your email</h2>
                <p className="text-text-secondary mb-6">
                  We sent a verification link to <br/>
                  <span className="font-medium text-text-primary">{email}</span>
                </p>
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white mb-4">
                  Open Email App
                </Button>
                <p className="text-sm text-text-secondary">
                  Didn't receive the email? <button className="text-brand-600 font-medium hover:underline">Resend</button>
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
