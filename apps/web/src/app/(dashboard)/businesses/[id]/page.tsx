"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Phone, Clock, Share2, Heart,
  CheckCircle2, Info, MessageSquare, Calendar, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BUSINESS = {
  id: "1",
  name: "The Artisan Bakery",
  category: "Bakery",
  address: "123 Main St, Block B, Neighborhood Area",
  distance: "0.5 km",
  rating: 4.8,
  reviews: 124,
  phone: "+91 98765 43210",
  email: "hello@artisanbakery.com",
  openNow: true,
  hours: "Mon-Sun: 7:00 AM - 9:00 PM",
  verified: true,
  description: "Freshly baked artisanal breads, pastries, and custom cakes made with locally sourced ingredients. Serving the community since 2015.",
  coverPhoto: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
  logo: "https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=0ea5e9",
  services: [
    { name: "Custom Cakes", price: "From ₹800" },
    { name: "Fresh Sourdough", price: "₹250" },
    { name: "Pastry Box", price: "₹450" },
    { name: "Coffee & Espresso", price: "From ₹150" }
  ],

  gallery: [
    "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=400&q=80",
    "https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?w=400&q=80",
    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=80"
  ]
};

export default function BusinessDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking confirmed! (Simulated)");
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="h-64 md:h-80 relative bg-slate-900 w-full">
        <img src={BUSINESS.coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-80" />
        <div className="absolute top-4 left-4">
          <Link href="/businesses" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <ChevronRight className="rotate-180" size={16} /> Back
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img src={BUSINESS.logo} alt="Logo" className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white" />
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{BUSINESS.name}</h1>
                  {BUSINESS.verified && <CheckCircle2 size={24} className="text-blue-500" fill="currentColor" stroke="white" />}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 mb-3">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700">{BUSINESS.category}</span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-800">{BUSINESS.rating}</span>
                    <span>({BUSINESS.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Clock size={16} />
                    <span>Open Now</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {BUSINESS.address}</div>
                  <div className="flex items-center gap-1.5"><Phone size={16} className="text-slate-400" /> {BUSINESS.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-100 hide-scrollbar">
              {['overview', 'services', 'reviews', 'photos'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
                    <p className="text-slate-600 leading-relaxed">{BUSINESS.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Operating Hours</h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 inline-block">
                      <div className="flex items-center gap-3 text-slate-700">
                        <Clock size={20} className="text-indigo-500" />
                        <span className="font-medium">{BUSINESS.hours}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Location</h3>
                    <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                      Map Integration Placeholder
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Menu / Services</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {BUSINESS.services.map((s, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:border-slate-200 bg-slate-50/50 transition-colors">
                        <span className="font-medium text-slate-800">{s.name}</span>
                        <span className="text-indigo-600 font-semibold">{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Write a Review</button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">John Doe</p>
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, idx) => <Star key={idx} size={12} fill="currentColor" />)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">2 days ago</span>
                        </div>
                        <p className="text-sm text-slate-600">Great service and amazing quality. Highly recommended to everyone in the neighborhood!</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {BUSINESS.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-32 sm:h-48 object-cover rounded-xl border border-slate-200" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:sticky lg:top-24">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Book Appointment</h3>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Service</label>
                <select required className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select service...</option>
                  {BUSINESS.services.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                  <input required type="date" className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
                  <input required type="time" className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm flex justify-center items-center gap-2">
                <Calendar size={18} /> Confirm Booking
              </button>
            </form>
            
            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium transition-colors flex justify-center items-center gap-2">
              <MessageSquare size={18} /> Chat with Business
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
