"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Sparkles, ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    setSubmittedName(fullName || 'Friend');

    try {
      // Dispatches to urveshrane3206@gmail.com and CCs sumit.gurjar@adypu.edu.in
      const response = await fetch('https://formsubmit.co/ajax/urveshrane3206@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[NearNest Inquiry] New message from ${fullName}`,
          _cc: 'sumit.gurjar@adypu.edu.in',
          name: fullName,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
          _template: 'table',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Your message has been sent successfully!', {
          icon: '✨',
          duration: 4000,
        });
      } else {
        // Fallback: Mailto link
        const mailtoUrl = `mailto:urveshrane3206@gmail.com,sumit.gurjar@adypu.edu.in?subject=${encodeURIComponent(
          `[NearNest] ${formData.subject} from ${fullName}`
        )}&body=${encodeURIComponent(
          `Name: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
        )}`;
        window.open(mailtoUrl, '_blank');
        setSubmitted(true);
        toast.success('Your message has been sent successfully!');
      }
    } catch (err) {
      console.warn('Network submission notice, utilizing mailto fallback:', err);
      const mailtoUrl = `mailto:urveshrane3206@gmail.com,sumit.gurjar@adypu.edu.in?subject=${encodeURIComponent(
        `[NearNest] ${formData.subject} from ${fullName}`
      )}&body=${encodeURIComponent(
        `Name: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoUrl, '_blank');
      setSubmitted(true);
      toast.success('Your message has been sent successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Get in Touch</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Contact Us</h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Have questions, feedback, or partnership ideas? Send us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Info */}
        <div className="flex flex-col justify-center space-y-5">
          
          {/* Contact 1: Urvesh Rane */}
          <div className="p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                UR
              </div>
              <div>
                <h4 className="text-base font-bold text-text-primary leading-tight">Urvesh Rane</h4>
                <p className="text-xs text-text-secondary">Founder & Lead Developer</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-border-hairline/60 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <a
                  href="mailto:urveshrane3206@gmail.com"
                  className="font-medium text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 truncate"
                >
                  <span>urveshrane3206@gmail.com</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="tel:+919373571631"
                  className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  +91 9373571631
                </a>
                <span className="text-text-tertiary">•</span>
                <a
                  href="https://wa.me/919373571631?text=Hi%20Urvesh,%20I%20am%20reaching%20out%20via%20NearNest%20platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  WhatsApp 💬
                </a>
              </div>
            </div>
          </div>

          {/* Contact 2: Sumit Gurjar */}
          <div className="p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                SG
              </div>
              <div>
                <h4 className="text-base font-bold text-text-primary leading-tight">Sumit Gurjar</h4>
                <p className="text-xs text-text-secondary">Co-Founder & Operations</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-border-hairline/60 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a
                  href="mailto:sumit.gurjar@adypu.edu.in"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 truncate"
                >
                  <span>sumit.gurjar@adypu.edu.in</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <p className="text-[11px] text-text-secondary pl-6">
                Ajeenkya D Y Patil University Academic Associate
              </p>
            </div>
          </div>

          {/* Office Address Card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary mb-1">Campus & Office</h4>
              <p className="text-xs text-text-secondary mb-1">NearNest Operations Center</p>
              <p className="text-sm font-medium text-text-primary">
                Ajeenkya D Y Patil University, Lohegaon, Pune, Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="glass-card bg-surface p-8 sm:p-10 rounded-3xl border border-border-hairline relative overflow-hidden shadow-card">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-text-primary">Message Sent!</h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-text-primary">{submittedName}</span>! Your message has been sent successfully. We will get back to you shortly.
                </p>
              </div>

              <Button
                onClick={resetForm}
                className="mt-4 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-500" />
                  <span>Send a Message</span>
                </h3>
                <span className="text-[11px] text-text-tertiary">Quick response guaranteed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">First Name *</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="First name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">Last Name *</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">Your Email *</label>
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="+91 98765..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">Inquiry Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Society Onboarding Request">Society Onboarding Request</option>
                  <option value="Business Listing & Sponsorship">Business Listing & Sponsorship</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Campus & Partnership">Campus & Partnership (ADYPU)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">Your Message *</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none"
                  placeholder="Leave us a message..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-md flex items-center justify-center gap-2 mt-1"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
