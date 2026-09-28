"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Heart, 
  Shield, 
  BellRing, 
  Radio, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function GlobalSosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [liveLocation, setLiveLocation] = useState(true);
  const [womenSafetyMode, setWomenSafetyMode] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Web Audio Siren Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1250, ctx.currentTime + 0.35);
      osc.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      setSirenPlaying(true);
    } catch (e) {
      console.warn("Audio siren init notice:", e);
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
      console.warn("Stop siren error:", e);
    }
    setSirenPlaying(false);
  };

  // Get current GPS location when modal is opened
  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation notice:", err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosState === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (sosState === 'countdown' && countdown === 0) {
      setSosState('active');

      // Dispatch emergency broadcast payload
      fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords?.lat,
          longitude: coords?.lng,
          womenSafetyMode,
          emergencyType: 'RAPID_DISTRESS_SOS',
        }),
      }).catch((err) => console.warn('SOS dispatch notice:', err));

      toast.error('🚨 SOS ALERT BROADCASTED! Security & Contacts Alerted.', {
        duration: 8000,
      });

      if (womenSafetyMode) {
        startSiren();
      }
    }
    return () => clearTimeout(timer);
  }, [sosState, countdown, coords, womenSafetyMode]);

  const handleSosTrigger = () => {
    if (sosState === 'idle') {
      setSosState('countdown');
      setCountdown(3);
    } else if (sosState === 'countdown') {
      // Abort
      setSosState('idle');
      toast.success('SOS cancelled.');
    } else {
      // Deactivate
      setSosState('idle');
      stopSiren();
      toast.success('Emergency alert safely cleared.');
    }
  };

  const handleCloseModal = () => {
    if (sosState === 'active') {
      stopSiren();
      setSosState('idle');
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Persistent Floating SOS Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold shadow-2xl shadow-red-600/50 border border-white/20 transition-all group"
          title="NearNest Emergency SOS"
          aria-label="Emergency SOS"
        >
          {/* Animated pulsing outer ring */}
          <span className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping pointer-events-none" />

          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>

          <span className="tracking-wider text-sm font-black drop-shadow">SOS HELP</span>

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </motion.button>
      </div>

      {/* Emergency Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface dark:bg-surface border border-red-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 text-center space-y-6"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Rapid Emergency Hub</span>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-full text-text-tertiary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SOS Big Button */}
              <div className="flex flex-col items-center justify-center py-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSosTrigger}
                  className={`relative flex items-center justify-center rounded-full w-44 h-44 sm:w-48 sm:h-48 shadow-2xl transition-all select-none ${
                    sosState === 'idle'
                      ? 'bg-gradient-to-br from-coral-500 to-red-600 hover:from-coral-400 hover:to-red-500 text-white shadow-red-500/50'
                      : sosState === 'countdown'
                      ? 'bg-amber-500 text-white shadow-amber-500/50'
                      : 'bg-red-600 text-white animate-pulse shadow-red-600/60 ring-8 ring-red-400/40'
                  }`}
                >
                  {sosState === 'idle' && (
                    <div className="flex flex-col items-center">
                      <ShieldAlert className="w-14 h-14 mb-1" />
                      <span className="text-3xl font-black tracking-widest">SOS</span>
                      <span className="text-[10px] font-bold opacity-90 mt-1">PRESS FOR HELP</span>
                    </div>
                  )}

                  {sosState === 'countdown' && (
                    <div className="flex flex-col items-center">
                      <span className="text-6xl font-black">{countdown}</span>
                      <span className="text-[10px] font-bold mt-2 uppercase bg-black/20 px-2.5 py-0.5 rounded-full">
                        Tap to Cancel
                      </span>
                    </div>
                  )}

                  {sosState === 'active' && (
                    <div className="flex flex-col items-center px-2">
                      <span className="text-2xl font-black tracking-wider">ALERT SENT</span>
                      <span className="text-[11px] font-medium mt-1">Guard & Contacts Notified</span>
                      <span className="text-[10px] mt-2 bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                        Tap to Dismiss
                      </span>
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Safety Toggles */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Location Status */}
                <div
                  onClick={() => setLiveLocation(!liveLocation)}
                  className={`p-3 rounded-2xl border transition-colors cursor-pointer flex items-center gap-2.5 ${
                    liveLocation
                      ? 'border-brand-500/50 bg-brand-50/50 dark:bg-brand-950/20'
                      : 'border-border-hairline bg-canvas'
                  }`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 ${liveLocation ? 'text-brand-500' : 'text-text-tertiary'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">GPS Location</p>
                    <p className="text-[10px] text-text-secondary truncate">
                      {coords ? `${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}` : 'Auto-detecting...'}
                    </p>
                  </div>
                </div>

                {/* Women Safety Mode Toggle */}
                <div
                  onClick={() => {
                    const next = !womenSafetyMode;
                    setWomenSafetyMode(next);
                    if (!next && sirenPlaying) stopSiren();
                    toast.success(next ? 'Siren mode on' : 'Siren mode off');
                  }}
                  className={`p-3 rounded-2xl border transition-colors cursor-pointer flex items-center gap-2.5 ${
                    womenSafetyMode
                      ? 'border-coral-500/50 bg-coral-50/50 dark:bg-coral-950/20'
                      : 'border-border-hairline bg-canvas'
                  }`}
                >
                  {womenSafetyMode ? (
                    <Volume2 className="w-4 h-4 text-coral-500 shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-text-tertiary shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">Siren Alarm</p>
                    <p className="text-[10px] text-text-secondary truncate">
                      {womenSafetyMode ? 'Loud Siren On' : 'Silent SOS'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Hotlines Row */}
              <div className="pt-2 border-t border-border-hairline">
                <p className="text-[11px] font-bold text-text-secondary mb-2.5 text-left">
                  One-Tap Emergency Dials:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="tel:112"
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Police (112)</span>
                  </a>

                  <a
                    href="tel:108"
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Ambulance (108)</span>
                  </a>

                  <a
                    href="tel:101"
                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Fire (101)</span>
                  </a>
                </div>
              </div>

              {/* Link to Full Emergency Page */}
              <div className="pt-1">
                <Link
                  href="/emergency"
                  onClick={handleCloseModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Open Full Emergency Center & Contact Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
