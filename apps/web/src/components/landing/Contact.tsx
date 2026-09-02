"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Get in touch</h2>
        <p className="text-lg text-text-secondary">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-1">Email us</h4>
              <p className="text-text-secondary mb-1">Our friendly team is here to help.</p>
              <a href="mailto:hello@neighbourhub.com" className="text-brand-500 font-medium hover:underline">hello@neighbourhub.com</a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-1">Office</h4>
              <p className="text-text-secondary mb-1">Come say hello at our HQ.</p>
              <p className="text-brand-500 font-medium">100 Market St, San Francisco, CA</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-1">Phone</h4>
              <p className="text-text-secondary mb-1">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+15550000000" className="text-brand-500 font-medium hover:underline">+1 (555) 000-0000</a>
            </div>
          </div>

          <div className="pt-8 flex gap-4 border-t border-border-hairline">
            <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-brand-500 hover:border-brand-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-brand-500 hover:border-brand-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-brand-500 hover:border-brand-500 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Form */}
        <div className="glass-card bg-surface p-8 rounded-3xl border border-border-hairline relative overflow-hidden">
          {submitted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface z-10 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-500">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Message Sent!</h3>
              <p className="text-text-secondary">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">First name</label>
                  <input required type="text" className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-3 text-text-primary outline-none focus:border-brand-500 transition-colors" placeholder="First name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary">Last name</label>
                  <input required type="text" className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-3 text-text-primary outline-none focus:border-brand-500 transition-colors" placeholder="Last name" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Email</label>
                <input required type="email" className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-3 text-text-primary outline-none focus:border-brand-500 transition-colors" placeholder="you@company.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Subject</label>
                <select className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-3 text-text-primary outline-none focus:border-brand-500 transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Sales</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-primary">Message</label>
                <textarea required rows={4} className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-3 text-text-primary outline-none focus:border-brand-500 transition-colors resize-none" placeholder="Leave us a message..." />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full py-6 rounded-xl font-semibold bg-brand-500 hover:bg-brand-600 text-white mt-2">
                {isSubmitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
