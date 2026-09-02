"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Calendar, Plus, X, Tag } from "lucide-react";

type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  month: string;
  day: string;
  time: string;
  location: string;
  attendees: number;
  organizer: string;
  image: string;
};

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Diwali Celebration Mela",
    category: "Festival",
    date: "Nov 12, 2023",
    month: "NOV",
    day: "12",
    time: "6:00 PM - 10:00 PM",
    location: "Central Courtyard",
    attendees: 145,
    organizer: "Society Committee",
    image: "https://images.unsplash.com/photo-1514222134-b57cbf8ce6db?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "Weekend Yoga Workshop",
    category: "Workshops",
    date: "Oct 28, 2023",
    month: "OCT",
    day: "28",
    time: "7:00 AM - 8:30 AM",
    location: "Clubhouse Terrace",
    attendees: 24,
    organizer: "Priya Wellness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "Blood Donation Drive",
    category: "Volunteer",
    date: "Nov 05, 2023",
    month: "NOV",
    day: "05",
    time: "9:00 AM - 2:00 PM",
    location: "Community Hall",
    attendees: 56,
    organizer: "Red Cross NGO",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
  },
];

const categories = ["All", "Festival", "Sports", "Society Meetings", "Workshops", "Blood Donation", "Volunteer"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  
  // RSVP State per event ID
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, string>>({});

  const filteredEvents = events.filter((e) => activeCategory === "All" || e.category === activeCategory);

  const handleRSVP = (eventId: string, status: string) => {
    setRsvpStatus((prev) => ({ ...prev, [eventId]: status }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Events</h1>
          <p className="text-gray-500 mt-1">Discover and join happenings in your neighborhood</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={event.id}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Image & Date Badge */}
            <div className="relative h-48 w-full">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
                <p className="text-xs font-bold text-red-500">{event.month}</p>
                <p className="text-xl font-black text-gray-900 leading-none">{event.day}</p>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <Tag className="w-3 h-3 mr-1" /> {event.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" /> {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" /> 
                  {event.attendees + (rsvpStatus[event.id] === "Going" ? 1 : 0)} attending
                </div>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-2">
                    {event.organizer.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">{event.organizer}</span>
                </div>
                
                {/* RSVP Actions */}
                <div className="flex space-x-1 bg-gray-50 rounded-lg p-1">
                  {["Going", "Maybe", "No"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleRSVP(event.id, status)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        rsvpStatus[event.id] === status
                          ? status === "Going" ? "bg-green-100 text-green-700" : status === "No" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          : "text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">Create New Event</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input type="text" className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Summer BBQ Party" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border rounded-xl p-3 bg-white outline-none">
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input type="datetime-local" className="w-full border rounded-xl p-3 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full border rounded-xl p-3 outline-none" placeholder="e.g. Community Clubhouse" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={4} className="w-full border rounded-xl p-3 outline-none resize-none" placeholder="What's this event about?"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                  <input type="number" className="w-full border rounded-xl p-3 outline-none" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price</label>
                  <input type="text" className="w-full border rounded-xl p-3 outline-none" placeholder="Free or amount" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700">
                Publish Event
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
