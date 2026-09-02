"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Clock, Camera, Plus, X, 
  MessageCircle, Tag
} from "lucide-react";

const CATEGORIES = ["All", "Furniture", "Electronics", "Vehicles", "Books", "Home Appliances", "Flat Rent", "PG", "Parking"];

const LISTINGS = [
  {
    id: "1",
    title: "Wooden Dining Table with 4 Chairs",
    price: "₹4,500",
    category: "Furniture",
    condition: "Good",
    type: "Sell",
    location: "Block A",
    timeAgo: "2h ago",
    sellerName: "Rohan K.",
    sellerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=RK",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "2BHK Fully Furnished Flat",
    price: "₹22,000/mo",
    category: "Flat Rent",
    condition: "Like New",
    type: "Rent",
    location: "Tower 3, 5th Floor",
    timeAgo: "5h ago",
    sellerName: "Neha S.",
    sellerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NS",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Sony PlayStation 4 (500GB)",
    price: "₹12,000",
    category: "Electronics",
    condition: "Good",
    type: "Sell",
    location: "Block C",
    timeAgo: "1d ago",
    sellerName: "Vikram M.",
    sellerAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=VM",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400&auto=format&fit=crop"
  }
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const filteredListings = LISTINGS.filter(l => {
    if (activeCategory !== "All" && l.category !== activeCategory) return false;
    if (searchQuery) {
      return l.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Listing posted! (Simulated)");
    setIsPostModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Marketplace</h1>
          <p className="text-slate-500 mt-1">Buy, sell, and rent items within your neighborhood</p>
        </div>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Post Listing
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col space-y-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                activeCategory === category 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredListings.map(listing => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={listing.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 backdrop-blur text-xs font-semibold rounded-lg shadow-sm text-white ${
                    listing.type === 'Sell' ? 'bg-indigo-500/90' : 'bg-emerald-500/90'
                  }`}>
                    For {listing.type}
                  </span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-lg shadow-sm text-slate-800">
                    {listing.condition}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug">{listing.title}</h3>
                </div>
                <div className="font-black text-xl text-slate-900 mb-3">{listing.price}</div>
                
                <div className="space-y-1.5 text-xs text-slate-500 mb-4 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} /> <span>{listing.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} /> <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} /> <span>Posted {listing.timeAgo}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={listing.sellerAvatar} alt="Seller" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-medium text-slate-700">{listing.sellerName}</span>
                  </div>
                  <button className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors" title="Chat with Seller">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredListings.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No items found.
          </div>
        )}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                  <h3 className="font-bold text-lg">Post a Listing</h3>
                  <p className="text-sm text-slate-500">Sell or rent items in your community</p>
                </div>
                <button onClick={() => setIsPostModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              <div className="overflow-y-auto p-5">
                <form id="post-form" onSubmit={handlePost} className="space-y-4">
                  {/* Image Upload Simulation */}
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <Camera size={32} className="mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click to upload photos</span>
                    <span className="text-xs mt-1">Up to 5 images</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input required type="text" placeholder="e.g. Wooden Dining Table" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select required className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="">Select...</option>
                        {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <select required className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="Sell">Sell</option>
                        <option value="Rent">Rent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                      <input required type="text" placeholder="e.g. 5000" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                      <select required className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea required rows={3} placeholder="Describe the item, reason for selling..." className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0">
                <button type="submit" form="post-form" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                  Post Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
