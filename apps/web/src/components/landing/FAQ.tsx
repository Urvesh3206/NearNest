"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: "What is NeighbourHub?", answer: "NeighbourHub is a private social network and community management platform designed specifically for neighborhoods, apartment complexes, and local communities to connect, share, and manage daily life." },
  { question: "How does verification work?", answer: "We use a combination of address verification (via utility bills or lease agreements) and phone number validation to ensure that only real residents can join a specific neighborhood." },
  { question: "Is it free for residents?", answer: "Yes! The core resident features, including the community feed, messaging, and local discovery, are completely free forever." },
  { question: "How do businesses join?", answer: "Local businesses can claim or create a profile through our Business tier. This gives them tools to promote services, accept bookings, and engage with the local community securely." },
  { question: "Is my data secure?", answer: "We take privacy seriously. Your data is encrypted, and we never sell your personal information to third parties. Only verified neighbors can see your full profile." },
  { question: "Can I use it for my housing society?", answer: "Absolutely. Our 'Society Pro' tier is built exactly for this, offering tools for maintenance requests, visitor management, and committee announcements." },
  { question: "What about privacy?", answer: "You have granular control over what you share. You can choose to hide your exact unit number, phone number, and only share your general block or street." },
  { question: "How do I report issues?", answer: "Any concerning posts or behavior can be reported directly in the app. Our moderation team and local community leads review these reports to maintain a safe environment." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-text-secondary">Everything you need to know about the platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border-b border-border-hairline pb-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
              >
                <span className="text-lg font-semibold text-text-primary group-hover:text-brand-500 transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <ChevronDown className="w-5 h-5 text-text-tertiary" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-text-secondary pr-8 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
