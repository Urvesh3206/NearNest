"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MapPin, Briefcase, Clock,
  ShieldCheck, X, DollarSign, Plus, CheckCircle2, Navigation, Phone, Calendar
} from "lucide-react";
import { Badge, Button } from "@/components/ui";

const CATEGORIES = ["All", "Electrician", "Plumber", "Maid", "Cook", "Tutor", "AC Repair", "Carpenter", "Painter", "Yoga Trainer", "Babysitter", "RO Repair", "Driver", "Mechanic"];

const NEIGHBORHOODS = [
  "All Locations",
  "Greenfield Park",
  "Riverside Heights",
  "Downtown Central",
  "Maplewood West",
  "Sunnyvale"
];

const PROVIDERS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    category: "Electrician",
    location: "Greenfield Park",
    distance: "0.3 km",
    verified: true,
    rating: 4.9,
    reviews: 120,
    rate: "₹250/hr",
    experience: "8 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=c0aede",
    speciality: "Wiring, circuit breaker repair, smart home switches & lighting installation"
  },
  {
    id: "2",
    name: "Sunita Devi",
    category: "Maid",
    location: "Riverside Heights",
    distance: "0.5 km",
    verified: true,
    rating: 4.7,
    reviews: 85,
    rate: "₹3,000/mo",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita&backgroundColor=ffdfbf",
    speciality: "Deep house cleaning, dusting, dishwashing, laundry & organization"
  },
  {
    id: "3",
    name: "Amit Patel",
    category: "Plumber",
    location: "Downtown Central",
    distance: "0.9 km",
    verified: true,
    rating: 4.8,
    reviews: 94,
    rate: "₹300/hr",
    experience: "7 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=b6e3f4",
    speciality: "Leak detection, pipe fitting, faucet replacement, drainage unclogging"
  },
  {
    id: "4",
    name: "Elena Rostova",
    category: "Tutor",
    location: "Maplewood West",
    distance: "1.2 km",
    verified: true,
    rating: 5.0,
    reviews: 64,
    rate: "₹500/hr",
    experience: "6 years",
    availableToday: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc",
    speciality: "K-12 Math, AP Physics, Chemistry & competitive exam preparation"
  },
  {
    id: "5",
    name: "Vikram Singh",
    category: "AC Repair",
    location: "Greenfield Park",
    distance: "0.6 km",
    verified: true,
    rating: 4.8,
    reviews: 110,
    rate: "₹499/visit",
    experience: "10 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=d1fae5",
    speciality: "HVAC maintenance, gas refill, compressor fixing & filter sanitization"
  },
  {
    id: "6",
    name: "Priya Sharma",
    category: "Yoga Trainer",
    location: "Riverside Heights",
    distance: "0.7 km",
    verified: true,
    rating: 4.9,
    reviews: 76,
    rate: "₹400/session",
    experience: "4 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=fef3c7",
    speciality: "Hatha yoga, Pranayama, morning mobility, back pain relief & meditation"
  },
  {
    id: "7",
    name: "Michael Chen",
    category: "Carpenter",
    location: "Downtown Central",
    distance: "0.8 km",
    verified: true,
    rating: 4.7,
    reviews: 58,
    rate: "₹350/hr",
    experience: "9 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=e2e8f0",
    speciality: "Custom furniture repair, door lock installation, kitchen cabinets & woodwork"
  },
  {
    id: "8",
    name: "Sarah Jenkins",
    category: "Babysitter",
    location: "Greenfield Park",
    distance: "0.4 km",
    verified: true,
    rating: 5.0,
    reviews: 82,
    rate: "₹200/hr",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ede9fe",
    speciality: "Certified CPR, infant care, creative playtime, homework help & cooking"
  }
];


function ServicesContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "All Locations";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";


  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialLocation);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [bookingProvider, setBookingProvider] = useState<any>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (initialLocation && initialLocation !== "All Locations") {
      setSelectedNeighborhood(initialLocation);
    }
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
    if (initialCategory && initialCategory !== "All") {
      setActiveCategory(initialCategory);
    }
  }, [initialLocation, initialSearch, initialCategory]);

  const filteredProviders = PROVIDERS.filter(p => {
    if (selectedNeighborhood !== "All Locations" && !p.location.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
      return false;
    }
    if (activeCategory !== "All" && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.speciality.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingProvider(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Verified Service Providers</h1>
          <p className="text-text-secondary mt-1">Hire trusted, background-checked neighborhood professionals</p>
        </div>
        <Button 
          onClick={() => setIsJoinModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Join as Provider
        </Button>
      </div>

      {/* Location Filter Pills */}
      <div className="bg-surface p-4 rounded-2xl border border-border-hairline shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>Search by Neighborhood Location</span>
          </div>
          <button
            onClick={() => setSelectedNeighborhood("Greenfield Park")}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full"
          >
            <Navigation className="w-3 h-3" />
            <span>Nearby GPS</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
          {NEIGHBORHOODS.map(hood => (
            <button
              key={hood}
              onClick={() => setSelectedNeighborhood(hood)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedNeighborhood === hood
                  ? "bg-brand-500 text-white shadow-sm font-semibold"
                  : "bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface border border-border-hairline"
              }`}
            >
              <MapPin className={`w-3 h-3 ${selectedNeighborhood === hood ? 'text-white' : 'text-text-tertiary'}`} />
              {hood}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
          <input 
            type="text" 
            placeholder="Search by specialty (e.g. plumber, electrician, tutor, deep cleaning)..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-hairline rounded-xl focus:ring-2 focus:ring-brand-500 text-text-primary transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
                activeCategory === category 
                  ? "bg-text-primary text-canvas shadow-sm" 
                  : "bg-surface text-text-secondary border border-border-hairline hover:bg-surface-subtle"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProviders.map(provider => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={provider.id}
              className="bg-surface rounded-2xl p-5 border border-border-hairline shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full border border-border-hairline bg-surface-subtle" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-text-primary">{provider.name}</h3>
                        {provider.verified && (
                          <span title="ID Verified Provider">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-brand-600 font-semibold">{provider.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                  {provider.speciality}
                </p>

                <div className="space-y-2 py-3 border-y border-border-hairline text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Estimated Rate:</span>
                    <span className="font-bold text-text-primary">{provider.rate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Experience:</span>
                    <span className="text-text-secondary">{provider.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Location:</span>
                    <span className="text-text-primary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {provider.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-brand-600 font-medium">
                    <span>Distance:</span>
                    <span>{provider.distance} away</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{provider.rating}</span>
                  <span className="text-text-tertiary font-normal">({provider.reviews})</span>
                </div>
                <Button 
                  onClick={() => setBookingProvider(provider)}
                  className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs py-2 px-4 shadow-sm"
                >
                  Hire Provider
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredProviders.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface rounded-2xl border border-border-hairline p-8">
            <MapPin className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
            <h3 className="text-base font-semibold text-text-primary">No service providers found for {selectedNeighborhood}</h3>
            <p className="text-xs text-text-secondary mt-1">Try choosing another location or clearing your specialty search.</p>
            <Button onClick={() => { setSelectedNeighborhood("All Locations"); setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-xs">
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-md overflow-hidden border border-border-hairline"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Hire {bookingProvider.name}</h3>
                  <p className="text-xs text-text-secondary">{bookingProvider.category} • {bookingProvider.rate}</p>
                </div>
                <button onClick={() => setBookingProvider(null)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary">Booking Request Sent!</h4>
                  <p className="text-xs text-text-secondary">{bookingProvider.name} has been notified and will arrive at your requested time. Contact details are saved in your Chat.</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Service Required</label>
                    <input required type="text" placeholder="e.g. Kitchen tap leaking, AC master cleaning..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Date</label>
                      <input required type="date" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Preferred Time</label>
                      <input required type="time" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Your Address & Unit</label>
                    <input required type="text" placeholder="e.g. Block A, Apt 402, Greenfield Park" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm">
                      Send Hire Request
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join as Provider Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-lg overflow-hidden border border-border-hairline flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle shrink-0">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Join as Verified Provider</h3>
                  <p className="text-xs text-text-secondary">Get hired directly by local residents & housing societies</p>
                </div>
                <button onClick={() => setIsJoinModalOpen(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <div className="overflow-y-auto p-5">
                <form id="provider-form" onSubmit={(e) => { e.preventDefault(); alert('Application submitted! Our verification team will contact you to verify your ID badge.'); setIsJoinModalOpen(false); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Full Name</label>
                    <input required type="text" placeholder="e.g. Rajesh Kumar" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Service Skill</label>
                      <select required className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary">
                        {CATEGORIES.filter(c => c !== "All").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Primary Neighborhood</label>
                      <select required className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary">
                        {NEIGHBORHOODS.filter(n => n !== "All Locations").map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Hourly / Visit Rate</label>
                      <input required type="text" placeholder="e.g. $35/hr" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Years Experience</label>
                      <input required type="text" placeholder="e.g. 5 years" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Phone Number</label>
                    <input required type="tel" placeholder="+1 (555)..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Description of Experience & Tools</label>
                    <textarea required rows={2} placeholder="Describe your background..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-text-primary"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-5 border-t border-border-hairline bg-surface-subtle shrink-0">
                <Button type="submit" form="provider-form" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm">
                  Submit Verification
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-text-secondary">Loading service providers...</div>}>
      <ServicesContent />
    </React.Suspense>
  );
}

