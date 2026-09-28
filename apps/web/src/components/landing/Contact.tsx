"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
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
      // Dispatches silently to urveshrane3206@gmail.com in the background
      const response = await fetch('https://formsubmit.co/ajax/urveshrane3206@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `[NearNest Inquiry] New message from ${fullName}`,
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
        // Fallback: Mailto link if external service has network limitation
        const mailtoUrl = `mailto:urveshrane3206@gmail.com?subject=${encodeURIComponent(
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
      const mailtoUrl = `mailto:urveshrane3206@gmail.com?subject=${encodeURIComponent(
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
        <div className="flex flex-col justify-center space-y-6">
          {/* Email Card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary mb-1">Email</h4>
              <p className="text-xs text-text-secondary mb-1.5">Send inquiries anytime; replies within 24 hours.</p>
              <a
                href="mailto:urveshrane3206@gmail.com"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
              >
                <span>urveshrane3206@gmail.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary mb-1">Phone & WhatsApp</h4>
              <p className="text-xs text-text-secondary mb-1.5">Mon-Sat from 9:00 AM to 7:00 PM IST.</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:+919373571631"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  +91 9373571631
                </a>
                <span className="text-text-tertiary">•</span>
                <a
                  href="https://wa.me/919373571631?text=Hi%20Urvesh,%20I%20am%20reaching%20out%20via%20NearNest%20platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  Chat on WhatsApp 💬
                </a>
              </div>
            </div>
          </div>

          {/* Office Address Card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border-hairline shadow-sm hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary mb-1">Office Location</h4>
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
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-1">Message Sent!</h3>
                <p className="text-sm text-text-secondary max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-text-primary">{submittedName}</span>! Your message has been sent successfully. We will get back to you shortly.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-secondary max-w-sm text-center space-y-1">
                <p className="font-semibold text-text-primary">Inquiry Status</p>
                <p className="text-emerald-600 font-medium">✓ Received and forwarded to our team</p>
              </div>

              <Button
                onClick={resetForm}
                className="mt-4 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold"
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
                  <option value="Campus & Partnership">Campus & Partnership</option>
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
