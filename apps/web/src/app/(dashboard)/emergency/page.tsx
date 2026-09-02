"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Phone, MapPin, Volume2, Plus, Edit2, Trash2, Heart, Shield, CarFront, BellRing, X } from 'lucide-react';
import { Card, Button, Input, Modal } from '@/components/ui';

export default function EmergencyPage() {
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [liveLocation, setLiveLocation] = useState(false);
  const [womenSafetyMode, setWomenSafetyMode] = useState(false);
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe (Husband)', phone: '+1 234-567-8900', relation: 'Family' },
    { id: '2', name: 'Jane Smith (Sister)', phone: '+1 987-654-3210', relation: 'Family' }
  ]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (sosState === 'countdown' && countdown === 0) {
      setSosState('active');
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown]);

  useEffect(() => {
    if (womenSafetyMode && sosState === 'active') {
      // Simulate siren sound (would use actual audio file in real app)
      console.log("PLAYING LOUD SIREN");
    }
  }, [womenSafetyMode, sosState]);

  const handleSosClick = () => {
    if (sosState === 'idle') {
      setSosState('countdown');
      setCountdown(3);
    } else if (sosState === 'countdown') {
      // Cancel
      setSosState('idle');
    } else {
      // Deactivate
      setSosState('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-coral-600 dark:text-coral-500 flex items-center justify-center gap-3">
          <ShieldAlert className="w-8 h-8" />
          SOS Emergency Center
        </h1>
        <p className="text-text-secondary mt-2">Immediate assistance is just a tap away.</p>
      </div>

      {/* Main SOS Button Area */}
      <div className="flex flex-col items-center justify-center py-10 bg-surface border border-border-hairline rounded-3xl shadow-sm relative overflow-hidden">
        {sosState === 'active' && (
          <div className="absolute inset-0 bg-coral-500/10 dark:bg-coral-900/20 animate-pulse pointer-events-none" />
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSosClick}
          className={`relative flex items-center justify-center rounded-full w-48 h-48 sm:w-56 sm:h-56 shadow-xl transition-colors duration-300 ${
            sosState === 'idle' ? 'bg-gradient-to-br from-coral-500 to-red-600 hover:from-coral-400 hover:to-red-500 text-white' :
            sosState === 'countdown' ? 'bg-yellow-500 text-white' :
            'bg-red-600 text-white animate-pulse'
          }`}
        >
          {sosState === 'idle' && (
            <div className="flex flex-col items-center">
              <ShieldAlert className="w-16 h-16 mb-2" />
              <span className="text-3xl font-black tracking-widest">SOS</span>
              <span className="text-sm font-medium mt-1 opacity-90">TAP FOR HELP</span>
            </div>
          )}
          {sosState === 'countdown' && (
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black">{countdown}</span>
              <span className="text-sm font-bold mt-2 uppercase">Tap to Cancel</span>
            </div>
          )}
          {sosState === 'active' && (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black tracking-widest mb-2">ACTIVE</span>
              <span className="text-sm font-bold text-center px-4">Authorities & Contacts Alerted</span>
              <span className="text-xs mt-2 underline">Tap to Stop</span>
            </div>
          )}
          
          {/* Ripple effects */}
          {sosState === 'idle' && (
             <div className="absolute inset-0 rounded-full border-4 border-coral-500/30 animate-ping" style={{ animationDuration: '3s' }} />
          )}
        </motion.button>
      </div>

      {/* Safety Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${liveLocation ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : ''}`} onClick={() => setLiveLocation(!liveLocation)}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${liveLocation ? 'bg-brand-500 text-white' : 'bg-surface-subtle text-text-secondary'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Live Location Sharing</h3>
              <p className="text-xs text-text-secondary">Share GPS with emergency contacts</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${liveLocation ? 'bg-brand-500' : 'bg-border-strong'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${liveLocation ? 'left-7' : 'left-1'}`} />
          </div>
        </Card>

        <Card className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${womenSafetyMode ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/20' : ''}`} onClick={() => setWomenSafetyMode(!womenSafetyMode)}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${womenSafetyMode ? 'bg-coral-500 text-white' : 'bg-surface-subtle text-text-secondary'}`}>
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Women Safety Mode</h3>
              <p className="text-xs text-text-secondary">Loud siren + silent SOS ping</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${womenSafetyMode ? 'bg-coral-500' : 'bg-border-strong'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${womenSafetyMode ? 'left-7' : 'left-1'}`} />
          </div>
        </Card>
      </div>

      {/* Quick Dials */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">Emergency Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Police', number: '911', icon: Shield, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' },
            { name: 'Ambulance', number: '108', icon: Heart, color: 'bg-green-100 text-green-600 dark:bg-green-900/30' },
            { name: 'Fire Brigade', number: '101', icon: BellRing, color: 'bg-red-100 text-red-600 dark:bg-red-900/30' },
            { name: 'Security', number: 'Gate 1', icon: CarFront, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' },
          ].map((service, idx) => (
            <Card key={idx} className="p-4 flex flex-col items-center justify-center text-center hover:bg-surface-subtle transition-colors cursor-pointer group">
              <div className={`p-3 rounded-full mb-3 ${service.color} group-hover:scale-110 transition-transform`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-text-primary">{service.name}</h3>
              <p className="text-lg font-bold text-text-secondary">{service.number}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Personal Emergency Contacts</h2>
          <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1"/> Add New</Button>
        </div>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-text-secondary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{contact.name}</h4>
                  <p className="text-sm text-text-secondary">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full text-text-tertiary hover:text-brand-600"><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full text-text-tertiary hover:text-coral-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
