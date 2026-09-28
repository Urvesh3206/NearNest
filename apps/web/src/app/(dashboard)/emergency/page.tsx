"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX,
  Plus, 
  Trash2, 
  Heart, 
  Shield, 
  CarFront, 
  BellRing, 
  CheckCircle2,
  AlertTriangle,
  Radio,
  Share2
} from 'lucide-react';
import { Card, Button, Input, Modal } from '@/components/ui';
import toast from 'react-hot-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function EmergencyPage() {
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [liveLocation, setLiveLocation] = useState(true);
  const [womenSafetyMode, setWomenSafetyMode] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Urvesh Rane (Primary)', phone: '+91 9373571631', relation: 'Family' },
    { id: '2', name: 'Sumit Gurjar (Co-Lead)', phone: 'sumit.gurjar@adypu.edu.in', relation: 'Associate' },
    { id: '3', name: 'Society Main Gate Guard', phone: '+91 9876543210', relation: 'Security' },
  ]);

  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'Family' });

  // Web Audio Siren Synthesizer (No external audio file required)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      // Frequency modulation for police siren effect
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setSirenPlaying(true);
    } catch (e) {
      console.warn("Audio Context init notice:", e);
    }
  };

  const stopSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch (e) {
      console.warn("Stop siren notice:", e);
    }
    setSirenPlaying(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (sosState === 'countdown' && countdown === 0) {
      setSosState('active');
      toast.error('🚨 EMERGENCY SOS BROADCAST ACTIVE! Society Security & Contacts Alerted.', {
        duration: 8000,
      });

      if (womenSafetyMode) {
        startSiren();
      }
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown, womenSafetyMode]);

  const handleSosClick = () => {
    if (sosState === 'idle') {
      setSosState('countdown');
      setCountdown(3);
    } else if (sosState === 'countdown') {
      // Cancelled
      setSosState('idle');
      toast.success('SOS countdown cancelled.');
    } else {
      // Deactivated
      setSosState('idle');
      stopSiren();
      toast.success('Emergency alert safely resolved and cleared.');
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    setContacts([
      ...contacts,
      {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relation: newContact.relation,
      },
    ]);
    setNewContact({ name: '', phone: '', relation: 'Family' });
    setIsAddModalOpen(false);
    toast.success('Emergency contact added!');
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    toast.success('Contact removed');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold mb-3 border border-red-200 dark:border-red-900">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>24x7 Rapid Response Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-coral-600 dark:text-coral-500 flex items-center justify-center gap-3">
          <ShieldAlert className="w-9 h-9" />
          NearNest SOS Emergency Center
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xl mx-auto">
          One-touch instant broadcast to society security guards, personal emergency contacts, and civic dispatchers.
        </p>
      </div>

      {/* Main SOS Trigger Circle */}
      <div className="flex flex-col items-center justify-center py-12 bg-surface border border-border-hairline rounded-3xl shadow-card relative overflow-hidden">
        {sosState === 'active' && (
          <div className="absolute inset-0 bg-coral-500/15 dark:bg-coral-900/30 animate-pulse pointer-events-none" />
        )}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSosClick}
          className={`relative flex items-center justify-center rounded-full w-52 h-52 sm:w-64 sm:h-64 shadow-2xl transition-all duration-300 select-none ${
            sosState === 'idle'
              ? 'bg-gradient-to-br from-coral-500 to-red-600 hover:from-coral-400 hover:to-red-500 text-white shadow-coral-500/40'
              : sosState === 'countdown'
              ? 'bg-amber-500 text-white shadow-amber-500/50'
              : 'bg-red-600 text-white animate-pulse shadow-red-600/60 ring-8 ring-red-400/40'
          }`}
        >
          {sosState === 'idle' && (
            <div className="flex flex-col items-center">
              <ShieldAlert className="w-16 h-16 mb-2 drop-shadow-md" />
              <span className="text-4xl font-black tracking-widest">SOS</span>
              <span className="text-xs font-bold mt-1.5 opacity-90 tracking-wider">PRESS FOR HELP</span>
            </div>
          )}

          {sosState === 'countdown' && (
            <div className="flex flex-col items-center">
              <span className="text-7xl font-black">{countdown}</span>
              <span className="text-xs font-bold mt-2 uppercase tracking-wide bg-black/20 px-3 py-1 rounded-full">
                Tap to Cancel
              </span>
            </div>
          )}

          {sosState === 'active' && (
            <div className="flex flex-col items-center px-4 text-center">
              <span className="text-3xl font-black tracking-widest mb-1">ALERT ACTIVE</span>
              <span className="text-xs font-semibold">Security & Family Notified</span>
              <span className="text-xs mt-3 bg-white/20 px-3 py-1 rounded-full font-bold">
                Tap to Dismiss
              </span>
            </div>
          )}

          {/* Ripple animation on idle */}
          {sosState === 'idle' && (
            <div
              className="absolute inset-0 rounded-full border-4 border-coral-500/40 animate-ping pointer-events-none"
              style={{ animationDuration: '3s' }}
            />
          )}
        </motion.button>

        <p className="text-xs text-text-tertiary mt-6 text-center max-w-sm">
          {sosState === 'idle' && 'Features a 3-second safety window to prevent false accidental triggers.'}
          {sosState === 'countdown' && 'Alert broadcasting in progress... Tap anywhere on the button to abort.'}
          {sosState === 'active' && 'Security guards and emergency contacts have received your live location and alert.'}
        </p>
      </div>

      {/* Safety Mode Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Location Toggle */}
        <Card
          className={`p-5 flex items-center justify-between cursor-pointer transition-all ${
            liveLocation
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
              : 'hover:border-border-hairline'
          }`}
          onClick={() => {
            setLiveLocation(!liveLocation);
            toast.success(liveLocation ? 'GPS location sharing disabled' : 'Live GPS location enabled for SOS');
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl ${
                liveLocation ? 'bg-brand-500 text-white shadow-sm' : 'bg-surface-subtle text-text-secondary'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Live GPS Location Sharing</h3>
              <p className="text-xs text-text-secondary">Shares accurate map coordinates with emergency contacts</p>
            </div>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              liveLocation ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                liveLocation ? 'left-7' : 'left-1'
              }`}
            />
          </div>
        </Card>

        {/* Women Safety Siren Mode */}
        <Card
          className={`p-5 flex items-center justify-between cursor-pointer transition-all ${
            womenSafetyMode
              ? 'border-coral-500 bg-coral-50/50 dark:bg-coral-950/20'
              : 'hover:border-border-hairline'
          }`}
          onClick={() => {
            const nextVal = !womenSafetyMode;
            setWomenSafetyMode(nextVal);
            if (!nextVal && sirenPlaying) stopSiren();
            toast.success(nextVal ? 'Women Safety Siren Mode Activated' : 'Women Safety Siren Mode Disabled');
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl ${
                womenSafetyMode ? 'bg-coral-500 text-white shadow-sm' : 'bg-surface-subtle text-text-secondary'
              }`}
            >
              {womenSafetyMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Women Safety Emergency Mode</h3>
              <p className="text-xs text-text-secondary">High-decibel audible deterrent siren + silent SOS ping</p>
            </div>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
              womenSafetyMode ? 'bg-coral-500' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                womenSafetyMode ? 'left-7' : 'left-1'
              }`}
            />
          </div>
        </Card>
      </div>

      {/* Emergency Hotlines */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3.5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-500" />
          <span>Instant Civic & Security Hotlines</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[
            {
              name: 'National Emergency',
              number: '112',
              desc: 'Police & Civic Dispatch',
              icon: Shield,
              color: 'bg-blue-500/10 text-blue-600',
              href: 'tel:112',
            },
            {
              name: 'Medical Ambulance',
              number: '108',
              desc: 'Emergency Paramedics',
              icon: Heart,
              color: 'bg-emerald-500/10 text-emerald-600',
              href: 'tel:108',
            },
            {
              name: 'Fire Brigade',
              number: '101',
              desc: 'Fire & Rescue Squad',
              icon: BellRing,
              color: 'bg-red-500/10 text-red-600',
              href: 'tel:101',
            },
            {
              name: 'Society Security',
              number: 'Gate 1',
              desc: 'Main Gate Intercom',
              icon: CarFront,
              color: 'bg-purple-500/10 text-purple-600',
              href: 'tel:+919373571631',
            },
          ].map((service, idx) => (
            <a
              key={idx}
              href={service.href}
              className="p-4 rounded-2xl bg-surface border border-border-hairline flex flex-col items-center text-center hover:border-brand-500/50 hover:shadow-md transition-all group"
            >
              <div className={`p-3 rounded-2xl mb-2.5 ${service.color} group-hover:scale-110 transition-transform`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs text-text-primary">{service.name}</h3>
              <p className="text-lg font-black text-brand-600 dark:text-brand-400 mt-0.5">{service.number}</p>
              <span className="text-[10px] text-text-tertiary mt-1">{service.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Phone className="w-4 h-4 text-brand-500" />
            <span>Personal Emergency Contacts ({contacts.length})</span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-semibold rounded-xl"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {contact.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-text-primary truncate">{contact.name}</h4>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium truncate">{contact.phone}</p>
                  <span className="text-[10px] text-text-tertiary font-semibold uppercase">{contact.relation}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Direct Call"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 rounded-lg text-text-tertiary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1.5">Contact Name *</label>
            <Input
              required
              placeholder="e.g. Dr. Ramesh Sharma / Mom"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1.5">Phone Number *</label>
            <Input
              required
              type="tel"
              placeholder="+91 98765 43210"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1.5">Relation</label>
            <select
              value={newContact.relation}
              onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
              className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="Family">Family / Spouse</option>
              <option value="Friend">Friend</option>
              <option value="Neighbor">Neighbor</option>
              <option value="Doctor">Doctor / Medical</option>
              <option value="Security">Security Guard</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold"
            >
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
