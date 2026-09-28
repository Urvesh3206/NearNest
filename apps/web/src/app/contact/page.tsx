import React from 'react';
import { Navbar, Contact, Footer } from '@/components/landing';

export const metadata = {
  title: 'Contact Us | NearNest',
  description: 'Get in touch with the NearNest team or Urvesh Rane directly for inquiries, support, and partnerships.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-canvas text-text-primary flex flex-col justify-between">
      <Navbar />
      <div className="pt-24 pb-12 flex-1">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
