"use client";

import { motion } from 'framer-motion';
import { Apple, Play } from 'lucide-react';

export function DownloadApp() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-br from-brand-600 to-brand-800 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 lg:p-20 relative">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        
        <div className="w-full md:w-1/2 z-10 mb-12 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Take your neighborhood with you
          </h2>
          <p className="text-brand-100 text-lg mb-10 max-w-lg">
            Stay connected on the go. Get real-time alerts, chat with neighbors, and discover local businesses straight from your phone.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition-colors shadow-xl">
              <Apple className="w-8 h-8 fill-white" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-gray-300">Download on the</div>
                <div className="text-lg font-semibold leading-tight">App Store</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition-colors shadow-xl">
              <Play className="w-7 h-7 fill-white" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-gray-300">GET IT ON</div>
                <div className="text-lg font-semibold leading-tight">Google Play</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center z-10 perspective-[1000px]">
          <motion.div 
            initial={{ rotateY: 20, rotateX: 10, y: 50, opacity: 0 }}
            whileInView={{ rotateY: -10, rotateX: 5, y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-[300px] h-[600px] bg-black rounded-[2.5rem] border-8 border-gray-900 shadow-2xl relative overflow-hidden"
          >
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-1/2 mx-auto z-20" />
            
            {/* Mockup Screen */}
            <div className="absolute inset-0 bg-canvas pt-12 p-4 overflow-hidden flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-hairline">
                <div className="font-bold text-lg text-text-primary">Greenfield Park</div>
                <div className="w-8 h-8 rounded-full bg-brand-500/20" />
              </div>
              
              {/* Post 1 */}
              <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border-hairline">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20" />
                  <div>
                    <div className="font-semibold text-sm text-text-primary">Sarah Jenkins</div>
                    <div className="text-xs text-text-tertiary">2 hours ago</div>
                  </div>
                </div>
                <div className="text-sm text-text-secondary mb-3">Does anyone know a good plumber available this weekend?</div>
                <div className="w-full h-32 bg-canvas rounded-xl mb-3" />
                <div className="flex gap-4 text-xs text-text-tertiary">
                  <span>12 Likes</span>
                  <span>4 Comments</span>
                </div>
              </div>

              {/* Post 2 */}
              <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border-hairline opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20" />
                  <div>
                    <div className="font-semibold text-sm text-text-primary">Mike T.</div>
                    <div className="text-xs text-text-tertiary">5 hours ago</div>
                  </div>
                </div>
                <div className="text-sm text-text-secondary">Found some lost keys near the central park...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
