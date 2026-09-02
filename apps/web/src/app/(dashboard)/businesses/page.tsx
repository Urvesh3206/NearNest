"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MapPin, Phone, Clock, Plus,
  Calendar, CheckCircle2, X, Store, Wrench, Navigation, Filter,
  ShieldCheck, ArrowRight, Sparkles, Map as MapIcon, List, Loader2,
  Compass, ExternalLink, BedDouble, Wifi, UtensilsCrossed, Car, Users
} from "lucide-react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { LocationMap } from "@/components/ui/LocationMap";
import { 
  getBrowserLiveCoordinates, 
  reverseGeocode, 
  searchWorldwidePlaces, 
  generatePlacesAroundCoordinates,
  fetchLiveNearbyHotels,
  GeocodedPlace,
  LiveHotel,
  LiveService,
  LiveBusiness
} from "@/lib/geo";

const DEFAULT_LAT = 37.7749;
const DEFAULT_LNG = -122.4194;
const DEFAULT_LOCATION_NAME = "San Francisco, CA";

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "";
  const initialSearch = searchParams.get("search") || "";

  // Real GPS & Location Coordinates
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });
  const [activeLocationName, setActiveLocationName] = useState<string>(initialLocation || DEFAULT_LOCATION_NAME);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationInput, setLocationInput] = useState<string>(initialLocation || "");
  const [placeSuggestions, setPlaceSuggestions] = useState<GeocodedPlace[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState<boolean>(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);

  // View & Filter States
  const [viewMode, setViewMode] = useState<"all" | "hotels" | "services" | "businesses">("all");
  const [displayType, setDisplayType] = useState<"cards" | "map">("cards");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(5);

  // Live Real Hotels state
  const [hotels, setHotels] = useState<LiveHotel[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState<boolean>(false);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [bookingBusiness, setBookingBusiness] = useState<LiveBusiness | null>(null);
  const [hiringService, setHiringService] = useState<LiveService | null>(null);
  const [bookingHotel, setBookingHotel] = useState<LiveHotel | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Real-time dynamic places calculated from current coordinates
  const { businesses: allBusinesses, services: allServices } = generatePlacesAroundCoordinates(
    currentCoords.lat,
    currentCoords.lng,
    activeLocationName
  );

  // Fetch real OpenStreetMap live hotels whenever coordinates change
  useEffect(() => {
    let isCurrent = true;
    setIsLoadingHotels(true);

    fetchLiveNearbyHotels(currentCoords.lat, currentCoords.lng, activeLocationName)
      .then((realHotels) => {
        if (isCurrent) {
          setHotels(realHotels);
          setIsLoadingHotels(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsLoadingHotels(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentCoords.lat, currentCoords.lng, activeLocationName]);

  // Live real place search debounce
  useEffect(() => {
    if (!locationInput.trim() || locationInput.length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingPlaces(true);
      const results = await searchWorldwidePlaces(locationInput);
      setPlaceSuggestions(results);
      setIsSearchingPlaces(false);
      setIsSuggestionsOpen(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [locationInput]);

  // Initial geocode if location param provided
  useEffect(() => {
    if (initialLocation && initialLocation !== DEFAULT_LOCATION_NAME) {
      searchWorldwidePlaces(initialLocation).then((places) => {
        if (places.length > 0) {
          setCurrentCoords({ lat: places[0].lat, lng: places[0].lng });
          setActiveLocationName(places[0].displayName.split(",")[0]);
        }
      });
    }
  }, [initialLocation]);

  // Browser HTML5 Live GPS Locator
  const handleDetectLiveLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await getBrowserLiveCoordinates();
      setCurrentCoords({ lat: coords.lat, lng: coords.lng });

      const geo = await reverseGeocode(coords.lat, coords.lng);
      const name = geo.neighborhood || geo.city || "My Live GPS Location";
      setActiveLocationName(name);
      setLocationInput(geo.formattedAddress || name);
    } catch (err: any) {
      alert("Could not access GPS location. Please allow browser location permissions or choose a city from the list.");
    } finally {
      setIsLocating(false);
      setIsSuggestionsOpen(false);
    }
  };

  const handleSelectPlace = (place: GeocodedPlace) => {
    setCurrentCoords({ lat: place.lat, lng: place.lng });
    const name = place.name || place.displayName.split(",")[0];
    setActiveLocationName(name);
    setLocationInput(place.displayName);
    setIsSuggestionsOpen(false);
  };

  // Filtered lists
  const filteredHotels = hotels.filter((h) => {
    if (h.distanceKm > maxRadiusKm) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredBusinesses = allBusinesses.filter((b) => {
    if (b.distanceKm > maxRadiusKm) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredServices = allServices.filter((s) => {
    if (s.distanceKm > maxRadiusKm) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.speciality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Map markers payload
  const mapPlaces = [
    ...filteredHotels.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      lat: h.lat,
      lng: h.lng,
      distance: h.distance,
      type: "hotel" as const,
      rating: h.rating,
    })),
    ...filteredBusinesses.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      lat: b.lat,
      lng: b.lng,
      distance: b.distance,
      type: "business" as const,
      rating: b.rating,
    })),
    ...filteredServices.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      lat: s.lat,
      lng: s.lng,
      distance: s.distance,
      type: "service" as const,
      rating: s.rating,
    })),
  ];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingBusiness(null);
      setHiringService(null);
      setBookingHotel(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <span>Nearby Location Explorer</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-600 rounded-full border border-brand-500/20">
              Hotels • Services • Shops
            </span>
          </h1>
          <p className="text-text-secondary mt-1">
            Real GPS proximity detection for hotels, stays, verified services & local businesses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Map vs List View Toggle */}
          <div className="flex items-center p-1 bg-surface rounded-2xl border border-border-hairline shadow-sm">
            <button
              onClick={() => setDisplayType("cards")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                displayType === "cards"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setDisplayType("map")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                displayType === "map"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
          </div>

          <Button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm text-xs py-2 px-3.5"
          >
            <Plus size={16} />
            <span>List Place</span>
          </Button>
        </div>
      </div>

      {/* Real Geocoding & GPS Location Input Bar */}
      <div className="bg-surface p-5 rounded-3xl border border-border-hairline shadow-card space-y-4 relative z-30">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Worldwide Location Search Box */}
          <div className="flex-1 w-full relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500 w-5 h-5" />
            <input 
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onFocus={() => { if (placeSuggestions.length > 0) setIsSuggestionsOpen(true); }}
              placeholder="Search any real location, hotel, street or city (e.g. Bandra Mumbai, Times Square NY, London)..."
              className="w-full pl-11 pr-32 py-3 bg-canvas border border-border-hairline rounded-2xl text-text-primary text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-inner"
            />

            {/* GPS Trigger Button */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {locationInput && (
                <button
                  onClick={() => { setLocationInput(""); setPlaceSuggestions([]); }}
                  className="text-xs text-text-tertiary hover:text-text-primary p-1 mr-1"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                onClick={handleDetectLiveLocation}
                disabled={isLocating}
                className="px-3 py-1.5 bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>My Real GPS</span>
                  </>
                )}
              </button>
            </div>

            {/* Real OpenStreetMap Worldwide Autocomplete Suggestions */}
            <AnimatePresence>
              {isSuggestionsOpen && placeSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-modal border border-border-hairline overflow-hidden z-50 divide-y divide-border-hairline"
                >
                  <div className="px-4 py-2 bg-surface-subtle text-[11px] font-semibold text-text-tertiary uppercase tracking-wider flex justify-between items-center">
                    <span>Real-World Locations</span>
                    <button onClick={() => setIsSuggestionsOpen(false)} className="hover:text-text-primary">Close</button>
                  </div>
                  {placeSuggestions.map((place) => (
                    <button
                      key={place.placeId}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className="w-full px-4 py-2.5 text-left text-xs hover:bg-surface-subtle transition-colors flex items-start gap-2.5 group"
                    >
                      <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                          {place.name}
                        </div>
                        <div className="text-text-secondary text-[11px] truncate">
                          {place.displayName}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Distance Radius Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-xs text-text-secondary whitespace-nowrap font-medium">Radius:</span>
            <select
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="py-2.5 px-3 bg-canvas border border-border-hairline rounded-xl text-xs font-semibold text-text-primary outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={1}>1 km (Walking)</option>
              <option value={3}>3 km (Local Area)</option>
              <option value={5}>5 km (Neighborhood)</option>
              <option value={10}>10 km (City-wide)</option>
            </select>
          </div>
        </div>

        {/* Real Coordinates & Location Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-hairline text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-tertiary">Active Center:</span>
            <span className="font-bold text-text-primary flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 px-3 py-1 rounded-full border border-brand-500/20">
              <Compass className="w-3.5 h-3.5 text-brand-500" />
              {activeLocationName}
            </span>
            <span className="text-[11px] text-text-tertiary">
              ({currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° W)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-tertiary">Quick Explore:</span>
            {[
              { name: "Mumbai", lat: 19.076, lng: 72.8777 },
              { name: "New York", lat: 40.7128, lng: -74.006 },
              { name: "London", lat: 51.5074, lng: -0.1278 },
              { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
              { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
            ].map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  setCurrentCoords({ lat: city.lat, lng: city.lng });
                  setActiveLocationName(city.name);
                  setLocationInput(city.name);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                  activeLocationName === city.name
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-surface-subtle text-text-secondary border-border-hairline hover:text-text-primary"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs: All / Hotels / Services / Businesses */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-border-hairline shadow-sm w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setViewMode("all")}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              viewMode === "all"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Nearby ({filteredHotels.length + filteredServices.length + filteredBusinesses.length})</span>
          </button>
          <button
            onClick={() => setViewMode("hotels")}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              viewMode === "hotels"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Hotels & Stays ({filteredHotels.length})</span>
          </button>
          <button
            onClick={() => setViewMode("services")}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              viewMode === "services"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Services ({filteredServices.length})</span>
          </button>
          <button
            onClick={() => setViewMode("businesses")}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
              viewMode === "businesses"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Shops & Cafes ({filteredBusinesses.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
          <input 
            type="text" 
            placeholder="Search hotel name, electrician, cafe..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border-hairline rounded-xl text-xs focus:ring-2 focus:ring-brand-500 text-text-primary transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE MAP VIEW */}
      {/* ======================================================== */}
      {displayType === "map" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-text-secondary px-1">
            <span className="font-semibold text-text-primary">
              Live Map • Centered on {activeLocationName}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                You (GPS)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"></span>
                Hotels
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Services
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                Shops
              </span>
            </div>
          </div>

          <LocationMap
            userLat={currentCoords.lat}
            userLng={currentCoords.lng}
            locationName={activeLocationName}
            places={mapPlaces}
            onSelectPlace={(place) => {
              if (place.type === "hotel") {
                const found = hotels.find((h) => h.id === place.id);
                if (found) setBookingHotel(found);
              } else if (place.type === "service") {
                const found = allServices.find((s) => s.id === place.id);
                if (found) setHiringService(found);
              } else {
                const found = allBusinesses.find((b) => b.id === place.id);
                if (found) setBookingBusiness(found);
              }
            }}
            className="h-96 w-full rounded-3xl overflow-hidden shadow-modal border border-border-hairline"
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: REAL NEARBY HOTELS & STAYS */}
      {/* ======================================================== */}
      {(viewMode === "all" || viewMode === "hotels") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Nearby Hotels & Stays
                </h2>
                <p className="text-xs text-text-secondary">
                  Real-life hotels and guest houses in {activeLocationName} (Sorted by closest)
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-purple-600 bg-purple-500/10 px-2.5 py-1 rounded-full">
              {filteredHotels.length} Hotels Nearby
            </span>
          </div>

          {isLoadingHotels ? (
            <div className="py-12 text-center bg-surface rounded-3xl border border-border-hairline">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-secondary">Scanning OpenStreetMap for real hotels near {activeLocationName}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredHotels.map((hotel) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={hotel.id}
                    className="bg-surface rounded-3xl overflow-hidden border border-border-hairline shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 relative overflow-hidden bg-surface-subtle">
                        <img src={hotel.coverPhoto} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 bg-surface/95 backdrop-blur text-xs font-bold rounded-lg shadow-sm text-purple-700">
                            {hotel.pricePerNight}
                          </span>
                          <span className="px-2.5 py-1 bg-emerald-500/95 backdrop-blur text-xs font-bold rounded-lg shadow-sm text-white">
                            Available Today
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/75 backdrop-blur text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          <span>{hotel.distance}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-base text-text-primary group-hover:text-purple-600 transition-colors leading-snug">
                            {hotel.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-3 font-semibold">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span>{hotel.rating}</span>
                          <span className="text-text-tertiary font-normal">({hotel.reviews} guest reviews)</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 my-3">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary border border-border-hairline">
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="text-xs text-text-secondary flex items-start gap-1.5 pt-3 border-t border-border-hairline">
                          <MapPin size={13} className="text-purple-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hotel.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Button
                        onClick={() => setBookingHotel(hotel)}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs shadow-sm"
                      >
                        Book Hotel Room
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoadingHotels && filteredHotels.length === 0 && (
            <div className="py-8 text-center bg-surface rounded-2xl border border-border-hairline p-6">
              <BedDouble className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
              <p className="text-xs font-semibold text-text-primary">No hotels found within {maxRadiusKm} km of {activeLocationName}</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: NEARBY SERVICE PROVIDERS */}
      {/* ======================================================== */}
      {(viewMode === "all" || viewMode === "services") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Nearby Verified Service Providers
                </h2>
                <p className="text-xs text-text-secondary">
                  Electricians, plumbers, housekeepers, AC techs & tutors around {activeLocationName}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-full">
              {filteredServices.length} Pros Nearby
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={service.id}
                  className="bg-surface rounded-2xl p-4 border border-border-hairline shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <img src={service.avatar} alt={service.name} className="w-11 h-11 rounded-full bg-brand-50 border border-border-hairline shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-sm text-text-primary truncate">{service.name}</h3>
                          {service.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-semibold">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-text-secondary line-clamp-2 my-2 leading-relaxed">
                      {service.speciality}
                    </p>

                    <div className="space-y-1.5 py-2.5 border-y border-border-hairline text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Rate:</span>
                        <span className="font-bold text-text-primary">{service.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Experience:</span>
                        <span className="text-text-secondary">{service.experience}</span>
                      </div>
                      <div className="flex justify-between text-blue-600 font-bold">
                        <span>Distance:</span>
                        <span>{service.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{service.rating}</span>
                      <span className="text-text-tertiary font-normal">({service.reviews})</span>
                    </div>
                    <Button 
                      onClick={() => setHiringService(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs py-1.5 px-3 shadow-sm"
                    >
                      Hire Pro
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: NEARBY LOCAL BUSINESSES & SHOPS */}
      {/* ======================================================== */}
      {(viewMode === "all" || viewMode === "businesses") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Nearby Shops, Bakeries & Cafes
                </h2>
                <p className="text-xs text-text-secondary">
                  Local neighborhood establishments in {activeLocationName}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
              {filteredBusinesses.length} Shops
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredBusinesses.map((business) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={business.id}
                  className="bg-surface rounded-2xl overflow-hidden border border-border-hairline shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 relative overflow-hidden bg-surface-subtle">
                      <img src={business.coverPhoto} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-surface/90 backdrop-blur text-[11px] font-semibold rounded-md shadow-sm text-text-primary">
                          {business.category}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/90 backdrop-blur text-[11px] font-semibold rounded-md shadow-sm text-white">
                          Open Now
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/75 backdrop-blur text-white text-[11px] font-bold rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" />
                        <span>{business.distance}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex gap-2.5 items-center mb-1.5">
                        <img src={business.logo} alt="Logo" className="w-8 h-8 rounded-lg border border-border-hairline shadow-sm shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-text-primary truncate group-hover:text-brand-500 transition-colors">{business.name}</h3>
                          <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                            <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                            <span className="font-bold text-text-primary">{business.rating}</span>
                            <span>({business.reviews})</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-text-secondary line-clamp-2 my-2 leading-relaxed">
                        {business.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <Link href={`/businesses/${business.id}`} className="flex-1 text-center py-1.5 bg-surface-subtle hover:bg-surface border border-border-hairline text-text-primary rounded-xl font-medium text-xs transition-colors">
                      Details
                    </Link>
                    <button 
                      onClick={() => setBookingBusiness(business)}
                      className="flex-1 text-center py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-xs transition-colors shadow-sm"
                    >
                      Book Visit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* HOTEL BOOKING MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {bookingHotel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-md overflow-hidden border border-border-hairline"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-purple-500/10">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Reserve Hotel Room</h3>
                  <p className="text-xs text-purple-600 font-semibold">{bookingHotel.name} • {bookingHotel.pricePerNight} • {bookingHotel.distance}</p>
                </div>
                <button onClick={() => setBookingHotel(null)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary">Hotel Booking Confirmed!</h4>
                  <p className="text-xs text-text-secondary">Your room at {bookingHotel.name} is reserved. Booking vouchers and check-in instructions have been sent to your email.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Room Selection</label>
                    <select required className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-text-primary">
                      {bookingHotel.roomTypes.map((room, idx) => (
                        <option key={idx} value={room}>{room} ({bookingHotel.pricePerNight})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Check-in Date</label>
                      <input required type="date" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Check-out Date</label>
                      <input required type="date" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Guests</label>
                      <select className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-text-primary">
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4+ Family</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Guest Name</label>
                      <input required type="text" placeholder="Full name" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-sm">
                      Confirm Room Reservation
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Booking Modal */}
      <AnimatePresence>
        {bookingBusiness && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-md overflow-hidden border border-border-hairline"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Book Visit</h3>
                  <p className="text-xs text-text-secondary">{bookingBusiness.name} • {bookingBusiness.distance}</p>
                </div>
                <button onClick={() => setBookingBusiness(null)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary">Appointment Confirmed!</h4>
                  <p className="text-xs text-text-secondary">Your booking with {bookingBusiness.name} is placed.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Service or Visit Type</label>
                    <select required className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl focus:ring-2 focus:ring-brand-500 text-sm outline-none text-text-primary">
                      <option value="consultation">General Consultation & Visit</option>
                      <option value="service1">Standard Service Package</option>
                      <option value="premium">Full Service & Reservation</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Date</label>
                      <input required type="date" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl focus:ring-2 focus:ring-brand-500 text-sm outline-none text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Time Slot</label>
                      <input required type="time" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl focus:ring-2 focus:ring-brand-500 text-sm outline-none text-text-primary" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium shadow-sm">
                      Confirm Visit
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hire Service Provider Modal */}
      <AnimatePresence>
        {hiringService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-md overflow-hidden border border-border-hairline"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Hire {hiringService.name}</h3>
                  <p className="text-xs text-text-secondary">{hiringService.category} • {hiringService.rate} • {hiringService.distance}</p>
                </div>
                <button onClick={() => setHiringService(null)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary">Hire Request Sent!</h4>
                  <p className="text-xs text-text-secondary">{hiringService.name} has accepted the request and will arrive at your address.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Service Task Description</label>
                    <input required type="text" placeholder="e.g. Electrical wiring, pipe leak, AC service..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Date</label>
                      <input required type="date" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Time</label>
                      <input required type="time" className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Your Address & Unit</label>
                    <input required type="text" placeholder="e.g. Apt 4B, 120 Main St..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm">
                      Send Hire Request
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Place Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-3xl shadow-modal w-full max-w-lg overflow-hidden border border-border-hairline flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border-hairline flex justify-between items-center bg-surface-subtle shrink-0">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">Add Hotel, Business or Service</h3>
                  <p className="text-xs text-text-secondary">Join your neighborhood verified directory</p>
                </div>
                <button onClick={() => setIsRegisterModalOpen(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>
              <div className="overflow-y-auto p-5">
                <form id="register-form" onSubmit={(e) => { e.preventDefault(); alert('Listing submitted! Our verification team will review your profile.'); setIsRegisterModalOpen(false); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Place / Business Name</label>
                    <input required type="text" placeholder="e.g. Radisson Blu Hotel, The Artisan Bakery..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">Type</label>
                      <select required className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary">
                        <option value="hotel">Hotel & Stay</option>
                        <option value="service">Service Provider</option>
                        <option value="restaurant">Restaurant / Cafe</option>
                        <option value="shop">Retail / Bakery</option>
                        <option value="medical">Medical / Clinic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-primary mb-1">City / Area</label>
                      <input required type="text" placeholder="e.g. Mumbai, New York..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Full Street Address</label>
                    <input required type="text" placeholder="123 Street..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Phone Number</label>
                    <input required type="tel" placeholder="+1 (555)..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-primary mb-1">Description</label>
                    <textarea required rows={2} placeholder="Describe rooms, pricing, amenities..." className="w-full p-2.5 bg-canvas border border-border-hairline rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-text-primary"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-5 border-t border-border-hairline bg-surface-subtle shrink-0">
                <Button type="submit" form="register-form" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-sm">
                  Submit Listing
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
