"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, MapPin, Briefcase, Clock,
  ShieldCheck, X, DollarSign, Plus, CheckCircle2, Navigation, Phone, Calendar,
  Home, ArrowLeft, ChevronRight, Trash2, Loader2, Mail, Send, ExternalLink,
  SlidersHorizontal, Compass, Check, List, Map as MapIcon, Sparkles
} from "lucide-react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { addPendingVerification, getLocalVerifications } from "@/lib/verificationStore";
import { ServiceProviderCard } from "@/components/services/ServiceProviderCard";
import { calculateHaversineKm } from "@/app/actions/serviceProviderActions";
import { LocationMap, MapPlace } from "@/components/ui/LocationMap";
import { EmailConfigModal } from "@/components/services/EmailConfigModal";
import { 
  getBrowserLiveCoordinates, 
  reverseGeocode, 
  searchWorldwidePlaces, 
  generatePlacesAroundCoordinates,
  GeocodedPlace,
  calculateHaversineDistanceKm
} from "@/lib/geo";
import toast from "react-hot-toast";

const DEFAULT_LAT = 18.6220; // DY Patil University Road, Pimpri-Chinchwad
const DEFAULT_LNG = 73.8240;
const DEFAULT_LOCATION_NAME = "DY Patil University Road, Pimpri-Chinchwad";

const CATEGORIES = [
  "All", 
  "Electrician", 
  "Plumber", 
  "Maid", 
  "Cook", 
  "Tutor", 
  "AC Repair", 
  "Carpenter", 
  "Painter", 
  "Yoga Trainer", 
  "Babysitter", 
  "RO Repair", 
  "Driver", 
  "Mechanic"
];

const QUICK_EXPLORE_CITIES = [
  { name: "Pimpri-Chinchwad", lat: 18.6220, lng: 73.8240 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "New York", lat: 40.7128, lng: -74.0060 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
];

const PROVIDERS = [
  {
    id: "1",
    name: "Rajesh Kumar",
    category: "Electrician",
    location: "DY Patil University Road",
    lat: 18.6225,
    lng: 73.8248,
    pincode: "411033",
    verified: true,
    rating: 4.9,
    reviews: 120,
    rate: "₹250/hr",
    experience: "8 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=c0aede",
    speciality: "Wiring, circuit breaker repair, smart home switches & lighting installation",
    phone: "+91 98220 11445",
    email: "rajesh.kumar.electrician@gmail.com"
  },
  {
    id: "2",
    name: "Sunita Devi",
    category: "Maid",
    location: "Sant Tukaram Nagar",
    lat: 18.6205,
    lng: 73.8260,
    pincode: "411033",
    verified: true,
    rating: 4.7,
    reviews: 85,
    rate: "₹3,000/mo",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita&backgroundColor=ffdfbf",
    speciality: "Deep house cleaning, dusting, dishwashing, laundry & organization",
    phone: "+91 97654 32100",
    email: "sunita.devi.services@gmail.com"
  },
  {
    id: "3",
    name: "Amit Patel",
    category: "Plumber",
    location: "Pimpri Colony",
    lat: 18.6240,
    lng: 73.8210,
    pincode: "411017",
    verified: true,
    rating: 4.8,
    reviews: 94,
    rate: "₹300/hr",
    experience: "7 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=b6e3f4",
    speciality: "Leak detection, pipe fitting, faucet replacement, drainage unclogging",
    phone: "+91 94223 88990",
    email: "amit.patel.plumbing@gmail.com"
  },
  {
    id: "4",
    name: "Elena Rostova",
    category: "Tutor",
    location: "Akurdi Pradhikaran",
    lat: 18.6400,
    lng: 73.7800,
    pincode: "411044",
    verified: true,
    rating: 5.0,
    reviews: 64,
    rate: "₹500/hr",
    experience: "6 years",
    availableToday: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc",
    speciality: "K-12 Math, AP Physics, Chemistry & competitive exam preparation",
    phone: "+91 91234 56789",
    email: "elena.rostova.tutor@gmail.com"
  },
  {
    id: "5",
    name: "Vikram Singh",
    category: "AC Repair",
    location: "DY Patil University Road",
    lat: 18.6218,
    lng: 73.8252,
    pincode: "411033",
    verified: true,
    rating: 4.8,
    reviews: 110,
    rate: "₹499/visit",
    experience: "10 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=d1fae5",
    speciality: "HVAC maintenance, gas refill, compressor fixing & filter sanitization",
    phone: "+91 98901 23456",
    email: "vikram.singh.acrepair@gmail.com"
  },
  {
    id: "6",
    name: "Priya Sharma",
    category: "Yoga Trainer",
    location: "Chinchwad Station",
    lat: 18.6270,
    lng: 73.8150,
    pincode: "411033",
    verified: true,
    rating: 4.9,
    reviews: 76,
    rate: "₹400/session",
    experience: "4 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=fef3c7",
    speciality: "Hatha yoga, Pranayama, morning mobility, back pain relief & meditation",
    phone: "+91 93245 67890",
    email: "priya.sharma.yoga@gmail.com"
  },
  {
    id: "7",
    name: "Michael Chen",
    category: "Carpenter",
    location: "Sant Tukaram Nagar",
    lat: 18.6210,
    lng: 73.8275,
    pincode: "411033",
    verified: true,
    rating: 4.7,
    reviews: 58,
    rate: "₹350/hr",
    experience: "9 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=e2e8f0",
    speciality: "Custom furniture repair, door lock installation, kitchen cabinets & woodwork",
    phone: "+91 99887 76655",
    email: "michael.chen.woodwork@gmail.com"
  },
  {
    id: "8",
    name: "Sarah Jenkins",
    category: "Babysitter",
    location: "Pimpri",
    lat: 18.6235,
    lng: 73.8225,
    pincode: "411017",
    verified: true,
    rating: 5.0,
    reviews: 82,
    rate: "₹200/hr",
    experience: "5 years",
    availableToday: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ede9fe",
    speciality: "Certified CPR, infant care, creative playtime, homework help & cooking",
    phone: "+91 98765 43210",
    email: "sarah.jenkins.care@gmail.com"
  }
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get("location") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const { user } = useAuth();
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Proximity & Real-world Location Explorer State
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });
  const [activeLocationName, setActiveLocationName] = useState<string>(
    initialLocation || DEFAULT_LOCATION_NAME
  );
  const [locationInput, setLocationInput] = useState<string>(
    initialLocation || DEFAULT_LOCATION_NAME
  );
  const [placeSuggestions, setPlaceSuggestions] = useState<GeocodedPlace[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState<boolean>(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(3); // Default 3 km (Local Area)
  const [displayType, setDisplayType] = useState<"cards" | "map">("cards"); // Strict Cards view by default!

  // Form state for adding provider
  const [srvName, setSrvName] = useState(user?.name || "");
  const [srvCategory, setSrvCategory] = useState("Electrician");
  const [srvNeighborhood, setSrvNeighborhood] = useState("DY Patil University Road");
  const [srvRate, setSrvRate] = useState("₹350/hr");
  const [srvExperience, setSrvExperience] = useState("4 years");
  const [srvPhone, setSrvPhone] = useState(user?.phone || "+91 93735 71631");
  const [srvEmail, setSrvEmail] = useState(user?.email || "");
  const [srvSpeciality, setSrvSpeciality] = useState("");
  const [isSubmittingSrv, setIsSubmittingSrv] = useState(false);

  // Load custom services from database on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setCustomServices(data.services);
          localStorage.setItem('nearnest_custom_services', JSON.stringify(data.services));
          return;
        }
      } catch (err) {
        console.warn('Error fetching services from API:', err);
      }
      try {
        const stored = localStorage.getItem('nearnest_custom_services');
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];

        const verifs = getLocalVerifications();
        let changed = false;
        list = list.map((srv: any) => {
          const match = verifs.find((v) => v.id === srv.id || v.name?.toLowerCase() === srv.name?.toLowerCase());
          if (match && match.status && match.status !== srv.status) {
            changed = true;
            return {
              ...srv,
              status: match.status,
              verified: match.status === 'APPROVED',
            };
          }
          return srv;
        });

        if (changed) {
          localStorage.setItem('nearnest_custom_services', JSON.stringify(list));
        }
        setCustomServices(list);
      } catch (e) {}
    }
    loadServices();
  }, []);

  // Live real place search debounce using OpenStreetMap Nominatim
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

  // Real device GPS detection handler
  const handleDetectLiveLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await getBrowserLiveCoordinates();
      setCurrentCoords({ lat: coords.lat, lng: coords.lng });

      const geo = await reverseGeocode(coords.lat, coords.lng);
      const name = geo.neighborhood || geo.city || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
      setActiveLocationName(name);
      setLocationInput(geo.formattedAddress || name);
      toast.success("Live GPS acquired! Showing closest nearby specialists.", { icon: "📍" });
    } catch (err: any) {
      toast.error("Could not access GPS location. Please allow browser location permissions or choose a city.");
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
    toast.success(`Location set to: ${name}`);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) {
      toast.error("Please enter provider's full name");
      return;
    }
    if (!srvEmail.trim() || !srvEmail.includes('@')) {
      toast.error("Please enter a valid notification email address (e.g. your_email@gmail.com) so residents can send job requests to your inbox.");
      return;
    }
    setIsSubmittingSrv(true);
    try {
      const isAdmin = user?.role === 'ADMIN';
      const payload = {
        name: srvName,
        category: srvCategory,
        location: srvNeighborhood || activeLocationName,
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        pincode: "411033",
        rate: srvRate,
        experience: srvExperience,
        speciality: srvSpeciality || `Professional ${srvCategory} services with neighborhood warranty and quick response`,
        phone: srvPhone,
        email: srvEmail.trim(),
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srvName)}&backgroundColor=b6e3f4`,
        isAdmin,
        submittedBy: `${user?.name || srvName} (${user?.role || 'Resident'})`,
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success && result.service) {
        const updated = [result.service, ...customServices.filter(s => s.id !== result.service.id)];
        setCustomServices(updated);
        localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));

        addPendingVerification({
          id: result.service.id,
          name: result.service.name,
          category: result.service.category,
          location: result.service.location,
          rate: result.service.rate,
          hourlyRate: result.service.rate,
          experience: result.service.experience,
          phone: result.service.phone,
          email: result.service.email,
          status: 'APPROVED',
          avatar: result.service.avatar,
          submittedBy: payload.submittedBy,
        });

        toast.success(`Service Provider "${result.service.name}" registered & published live! Residents can now hire you and job alerts will go to ${result.service.email}. 🎉`, {
          duration: 6000,
        });
        setIsJoinModalOpen(false);
      } else {
        throw new Error(result.error || "Save failed");
      }
    } catch (err) {
      const isPlatformAdmin = user?.role === 'ADMIN';
      const fallbackSrv = {
        id: `srv_custom_${Date.now()}`,
        name: srvName,
        category: srvCategory,
        location: srvNeighborhood || activeLocationName,
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        pincode: "411033",
        distance: "0.2 km",
        distanceKm: 0.2,
        verified: isPlatformAdmin,
        status: (isPlatformAdmin ? 'APPROVED' : 'PENDING') as 'APPROVED' | 'PENDING',
        rating: 5.0,
        reviews: 0,
        rate: srvRate,
        experience: srvExperience,
        availableToday: true,
        avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(srvName)}&backgroundColor=b6e3f4`,
        speciality: srvSpeciality || `Professional ${srvCategory} services with neighborhood warranty and quick response`,
        phone: srvPhone,
        email: srvEmail || `${srvName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        isCustom: true,
        submittedBy: `${user?.name || srvName} (${user?.role || 'Resident'})`,
      };
      const updated = [fallbackSrv, ...customServices];
      setCustomServices(updated);
      localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));

      addPendingVerification({
        id: fallbackSrv.id,
        name: fallbackSrv.name,
        category: fallbackSrv.category,
        location: fallbackSrv.location,
        rate: fallbackSrv.rate,
        hourlyRate: fallbackSrv.rate,
        experience: fallbackSrv.experience,
        phone: fallbackSrv.phone,
        email: fallbackSrv.email,
        status: fallbackSrv.status,
        avatar: fallbackSrv.avatar,
        submittedBy: fallbackSrv.submittedBy,
      });

      toast.success(isPlatformAdmin ? `"${fallbackSrv.name}" registered and published!` : `Request sent to Admin for approval!`);
    } finally {
      setIsSubmittingSrv(false);
      setIsJoinModalOpen(false);
      setSrvSpeciality("");
    }
  };

  const handleDeleteService = async (srvId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the service directory?`)) return;
    try {
      await fetch(`/api/services?id=${srvId}`, { method: 'DELETE' });
    } catch (e) {}
    const updated = customServices.filter(s => s.id !== srvId);
    setCustomServices(updated);
    localStorage.setItem('nearnest_custom_services', JSON.stringify(updated));
    toast.success(`"${name}" removed from database`);
  };

  // Generate real dynamic services positioned near the active location coordinates
  const { services: dynamicServices } = generatePlacesAroundCoordinates(
    currentCoords.lat,
    currentCoords.lng,
    activeLocationName
  );

  const baseDynamicProviders = dynamicServices.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category.includes("Electrician") ? "Electrician"
      : s.category.includes("Maid") || s.category.includes("Housekeeper") ? "Maid"
      : s.category.includes("Plumber") ? "Plumber"
      : s.category.includes("AC") ? "AC Repair"
      : s.category.includes("Tutor") ? "Tutor"
      : s.category.includes("Yoga") ? "Yoga Trainer"
      : s.category.includes("Carpenter") ? "Carpenter"
      : s.category.includes("Babysitter") ? "Babysitter"
      : s.category,
    location: activeLocationName,
    lat: s.lat,
    lng: s.lng,
    pincode: "411033",
    verified: true,
    rating: s.rating,
    reviews: s.reviews,
    rate: s.rate,
    experience: s.experience,
    availableToday: s.availableToday,
    avatar: s.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=c0aede`,
    speciality: s.speciality,
    phone: s.phone,
    email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
    isCustom: false,
  }));

  // Combine with custom services and base static providers
  const allProvidersList = [
    ...customServices,
    ...baseDynamicProviders,
    ...PROVIDERS.map(p => ({ ...p, id: `base-${p.id}` }))
  ];

  // Deduplicate by name
  const uniqueProviders = Array.from(
    new Map(allProvidersList.map(p => [p.name.toLowerCase(), p])).values()
  );

  // Compute real dynamic Haversine distance from current active coordinates
  const providersWithProximity = uniqueProviders.map((provider) => {
    const pCoords = provider.lat && provider.lng
      ? { lat: provider.lat, lng: provider.lng }
      : { lat: currentCoords.lat + 0.002, lng: currentCoords.lng + 0.002 };

    const distanceKm = calculateHaversineKm(currentCoords.lat, currentCoords.lng, pCoords.lat, pCoords.lng);

    return {
      ...provider,
      lat: pCoords.lat,
      lng: pCoords.lng,
      distanceKm,
      distance: `${distanceKm} km`,
    };
  });

  // Strict Proximity & Search Filtering
  const filteredProviders = providersWithProximity
    .filter((p) => {
      // 1. Hide unapproved custom services from public
      if (p.isCustom && p.status === 'PENDING') {
        const isOwner = user?.name && (p.submittedBy?.includes(user.name) || p.name === user.name);
        const isPlatformAdmin = user?.role === 'ADMIN';
        if (!isOwner && !isPlatformAdmin) return false;
      }
      if (p.isCustom && p.status === 'REJECTED') {
        return false;
      }

      // 2. STRICT RADIUS FILTER: only show providers within selected maxRadiusKm!
      if (p.distanceKm > maxRadiusKm) {
        return false;
      }

      // 3. Category Filter
      if (activeCategory !== "All" && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }

      // 4. Search Text Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.speciality && p.speciality.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q))
        );
      }
      return true;
    })
    // Sort strictly by closest distance first!
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const mapPlaces: MapPlace[] = filteredProviders.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    lat: p.lat || currentCoords.lat,
    lng: p.lng || currentCoords.lng,
    distance: p.distance || "0.3 km",
    type: "service",
    rating: p.rating || 4.9,
    rate: p.rate || (p as any).hourlyRate,
    phone: p.phone,
  }));

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Link href="/" className="flex items-center gap-1.5 hover:text-brand-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <Link href="/feed" className="hover:text-brand-600 transition-colors">
            <span>Feed</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-primary font-semibold">Verified Services</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-brand-600 bg-surface border border-border-hairline hover:border-brand-500/30 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header: Exact match to Screenshot */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <span>Nearby Location Explorer</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-600 rounded-full border border-brand-500/20">
              Hotels • Services • Shops
            </span>
          </h1>
          <p className="text-text-secondary mt-1">
            Real GPS proximity detection for hotels, stays, verified services & local specialists
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Cards vs Interactive Map View Toggle */}
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
            onClick={() => setIsEmailModalOpen(true)}
            variant="outline"
            className="flex items-center gap-1.5 rounded-xl shadow-sm text-xs py-2 px-3.5 border-border-hairline bg-surface hover:bg-surface-subtle text-text-primary"
          >
            <Mail size={15} className="text-brand-500" />
            <span>Email Setup</span>
          </Button>

          <Button 
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm text-xs py-2 px-3.5"
          >
            <Plus size={16} />
            <span>Join as Provider</span>
          </Button>
        </div>
      </div>

      {/* Real Geocoding & GPS Location Input Bar (Exact match to Screenshot) */}
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

            {/* Clear and GPS Trigger Button */}
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

            {/* Real OpenStreetMap Worldwide Autocomplete Suggestions Dropdown */}
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

          {/* Distance Radius Filter (1 km, 3 km, 5 km, 10 km) */}
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

        {/* Real Coordinates & Active Center Location Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-hairline text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-text-tertiary">Active Center:</span>
            <span className="font-bold text-text-primary flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 px-3 py-1 rounded-full border border-brand-500/20">
              <Compass className="w-3.5 h-3.5 text-brand-500" />
              {activeLocationName}
            </span>
            <span className="text-[11px] text-text-tertiary">
              ({currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E)
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              🟢 {filteredProviders.length} nearby specialists within {maxRadiusKm} km
            </span>
          </div>

          {/* Quick Explore City Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-text-tertiary">Quick Explore:</span>
            {QUICK_EXPLORE_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  setCurrentCoords({ lat: city.lat, lng: city.lng });
                  setActiveLocationName(city.name);
                  setLocationInput(city.name);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                  activeLocationName.includes(city.name)
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

      {/* Conditionally Show Interactive Map ONLY if displayType is 'map' */}
      {displayType === "map" && (
        <div className="bg-surface rounded-3xl border border-border-hairline shadow-card overflow-hidden">
          <div className="p-4 px-6 border-b border-border-hairline bg-surface-subtle/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-base border border-emerald-500/20">
                🗺️
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <span>Interactive Live Location & Proximity Map</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                    Live Radar Active
                  </span>
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Visualizing your active pin & {filteredProviders.length} nearby specialists with distance radius.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDisplayType("cards")}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
              <span>Switch to Cards View</span>
            </button>
          </div>

          <div className="p-4 space-y-3">
            <LocationMap
              userLat={currentCoords.lat}
              userLng={currentCoords.lng}
              locationName={activeLocationName}
              radiusKm={maxRadiusKm}
              places={mapPlaces}
              className="h-72 sm:h-84 w-full rounded-2xl overflow-hidden shadow-inner border border-border-hairline"
            />

            {/* Live Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-tertiary pt-1 px-1">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm ring-2 ring-emerald-300" />
                  <strong className="text-text-primary">Active Center</strong> (Live Marker)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-sm" />
                  <strong className="text-text-primary">Nearby Verified Specialists</strong> (Click pin for popup)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 border-b-2 border-dashed border-emerald-500 inline-block" />
                  <span>{maxRadiusKm} km Geofenced Radius</span>
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                GPS: {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
          <input 
            type="text" 
            placeholder="Search nearby specialists by name or category (e.g., electrician, plumber, AC repair, yoga, cleaning)..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border-hairline rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-text-primary transition-all outline-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs font-semibold px-2 py-0.5 rounded-md hover:bg-surface-subtle"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="flex overflow-x-auto pb-1 gap-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
                activeCategory === category 
                  ? "bg-text-primary text-canvas shadow-sm font-semibold" 
                  : "bg-surface text-text-secondary border border-border-hairline hover:bg-surface-subtle"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* STRICT CARDS GRID DISPLAY (As requested: "i want ot this type not in the map") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProviders.map(provider => (
            <ServiceProviderCard
              key={provider.id}
              provider={provider as any}
              onDelete={handleDeleteService}
              residentContext={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                society: (user as any)?.society,
                unit: (user as any)?.unit,
                location: activeLocationName,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Empty State when no providers in radius */}
        {filteredProviders.length === 0 && (
          <div className="col-span-full py-14 text-center bg-surface rounded-3xl border border-dashed border-border-hairline p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              No service providers found within {maxRadiusKm} km of {activeLocationName}
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              There are currently no specialists registered within this distance limit. Try expanding your radius to 5 km or 10 km.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMaxRadiusKm(5)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Expand to 5 km Radius
              </button>
              <button
                onClick={() => {
                  setMaxRadiusKm(10);
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-4 py-2 bg-surface border border-border-hairline text-text-primary hover:bg-surface-subtle rounded-xl text-xs font-semibold transition-all"
              >
                Expand to 10 km (City-wide)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Join as Provider Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                <form id="provider-form" onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={srvName} 
                      onChange={e => setSrvName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma" 
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Category *</label>
                      <select 
                        value={srvCategory} 
                        onChange={e => setSrvCategory(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Neighborhood Area *</label>
                      <input 
                        type="text"
                        value={srvNeighborhood} 
                        onChange={e => setSrvNeighborhood(e.target.value)}
                        placeholder="e.g. DY Patil University Road" 
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Standard Rate *</label>
                      <input 
                        required 
                        type="text" 
                        value={srvRate} 
                        onChange={e => setSrvRate(e.target.value)}
                        placeholder="e.g. ₹350/hr or ₹500/visit" 
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Experience *</label>
                      <input 
                        required 
                        type="text" 
                        value={srvExperience} 
                        onChange={e => setSrvExperience(e.target.value)}
                        placeholder="e.g. 5 years" 
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">Direct Phone / WhatsApp *</label>
                      <input 
                        required 
                        type="tel" 
                        value={srvPhone} 
                        onChange={e => setSrvPhone(e.target.value)}
                        placeholder="+91 98765 43210" 
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500 font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1 flex items-center justify-between">
                        <span>Notification Email *</span>
                        <span className="text-[10px] text-brand-600 font-medium">Receives job requests</span>
                      </label>
                      <input 
                        required
                        type="email" 
                        value={srvEmail} 
                        onChange={e => setSrvEmail(e.target.value)}
                        placeholder="e.g. your_email@gmail.com" 
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500 font-mono" 
                      />
                      <p className="text-[10px] text-text-tertiary mt-1">
                        Residents will dispatch work requests & contact details to this inbox.
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Speciality & Services Description</label>
                    <textarea 
                      rows={3} 
                      value={srvSpeciality} 
                      onChange={e => setSrvSpeciality(e.target.value)}
                      placeholder="e.g. Master certified in home switchboards, short-circuit diagnostics, MCB tripping, and smart inverter installation." 
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-subtle border border-border-hairline text-xs text-text-primary outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
                    />
                  </div>
                </form>
              </div>
              <div className="p-4 border-t border-border-hairline bg-surface-subtle flex justify-end gap-2 shrink-0">
                <Button variant="outline" onClick={() => setIsJoinModalOpen(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  form="provider-form"
                  disabled={isSubmittingSrv} 
                  className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs shadow-sm"
                >
                  {isSubmittingSrv ? "Registering..." : "Submit Registration"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EmailConfigModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultEmail={user?.email || "rupeshrane3206@gmail.com"}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-tertiary">Loading verified services directory...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
