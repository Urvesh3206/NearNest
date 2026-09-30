"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Camera,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Clock,
  User,
  Phone,
  Building,
  Car,
  RefreshCw,
  LogOut,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CameraOff
} from "lucide-react";

export interface GatePassRecord {
  id: string;
  visitorName: string;
  phone: string;
  purpose: string;
  date: string;
  hostName: string;
  flatNumber: string;
  status: "approved" | "checked_in" | "departed" | "denied";
  checkInTime?: string;
  checkOutTime?: string;
  gate?: string;
  vehicleNumber?: string;
  denialReason?: string;
}

const DEFAULT_SAMPLE_PASSES: GatePassRecord[] = [
  {
    id: "NN-1042",
    visitorName: "Vikram Sharma",
    phone: "+91 98765 43210",
    purpose: "Delivery",
    date: new Date().toISOString().split("T")[0],
    hostName: "Priya Nair",
    flatNumber: "Tower B - Flat 302",
    status: "approved",
  },
  {
    id: "NN-8921",
    visitorName: "Amit Roy",
    phone: "+91 98200 11223",
    purpose: "Guest",
    date: new Date().toISOString().split("T")[0],
    hostName: "Rahul Desai",
    flatNumber: "Tower A - Flat 104",
    status: "approved",
  },
  {
    id: "NN-5510",
    visitorName: "Sunita Devi",
    phone: "+91 99300 44556",
    purpose: "Service",
    date: new Date().toISOString().split("T")[0],
    hostName: "Kavita Rao",
    flatNumber: "Tower C - Flat 501",
    status: "checked_in",
    checkInTime: "09:30 AM",
    gate: "Gate 1 (Main Entrance)",
    vehicleNumber: "MH 12 AB 4591",
  },
];

export const PASSES_STORAGE_KEY = "nearnest_gate_passes";

export function loadStoredPasses(): GatePassRecord[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_PASSES;
  try {
    const raw = localStorage.getItem(PASSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_PASSES));
      return DEFAULT_SAMPLE_PASSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAMPLE_PASSES;
  } catch {
    return DEFAULT_SAMPLE_PASSES;
  }
}

export function saveStoredPasses(passes: GatePassRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(passes));
  } catch (err) {
    console.error("Failed to save passes to localStorage", err);
  }
}

export default function GateScanner({ onSwitchToCreate }: { onSwitchToCreate?: () => void }) {
  const [passes, setPasses] = useState<GatePassRecord[]>([]);
  const [scanMode, setScanMode] = useState<"camera" | "search">("camera");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePass, setActivePass] = useState<GatePassRecord | null>(null);
  const [selectedGate, setSelectedGate] = useState("Gate 1 (Main Entrance)");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Camera scanner states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Filter logs state
  const [logFilter, setLogFilter] = useState<"all" | "inside" | "departed">("all");

  // Load passes on mount
  useEffect(() => {
    const loaded = loadStoredPasses();
    setPasses(loaded);
  }, []);

  // Sync back to localStorage whenever passes state changes
  const updatePasses = (newPasses: GatePassRecord[]) => {
    setPasses(newPasses);
    saveStoredPasses(newPasses);
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not supported by your browser in this environment.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unable to access camera. Check device permissions.";
      setCameraError(errMsg);
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount or mode switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (scanMode !== "camera") {
      stopCamera();
    }
  }, [scanMode]);

  // Simulate or trigger scan detection
  const handleSelectPass = (pass: GatePassRecord) => {
    setActivePass(pass);
    setVehicleNumber(pass.vehicleNumber || "");
    setActionFeedback(null);
    stopCamera();
  };

  // Search filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase().replace("#", "");
    if (!query) return;

    const match = passes.find(
      (p) =>
        p.id.toLowerCase().includes(query) ||
        p.visitorName.toLowerCase().includes(query) ||
        p.phone.includes(query)
    );

    if (match) {
      handleSelectPass(match);
      setSearchQuery("");
    } else {
      setActionFeedback(`No pass found matching "${searchQuery}". Check the pass ID or create one.`);
    }
  };

  // Action: Allow Entry / Check-In
  const handleCheckIn = () => {
    if (!activePass) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = passes.map((p) => {
      if (p.id === activePass.id) {
        return {
          ...p,
          status: "checked_in" as const,
          checkInTime: now,
          gate: selectedGate,
          vehicleNumber: vehicleNumber.trim() || undefined,
        };
      }
      return p;
    });

    updatePasses(updated);
    const updatedActive = updated.find((p) => p.id === activePass.id) || null;
    setActivePass(updatedActive);
    setActionFeedback(`Success: ${activePass.visitorName} checked in at ${now} via ${selectedGate}.`);
  };

  // Action: Mark Departed / Check-Out
  const handleCheckOut = (passId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = passes.map((p) => {
      if (p.id === passId) {
        return {
          ...p,
          status: "departed" as const,
          checkOutTime: now,
        };
      }
      return p;
    });

    updatePasses(updated);
    if (activePass && activePass.id === passId) {
      setActivePass(updated.find((p) => p.id === passId) || null);
    }
  };

  // Action: Deny Entry
  const handleDeny = () => {
    if (!activePass) return;
    const reason = prompt("Enter reason for denying entry:", "Invalid host verification / unapproved visit");
    if (reason === null) return;

    const updated = passes.map((p) => {
      if (p.id === activePass.id) {
        return {
          ...p,
          status: "denied" as const,
          denialReason: reason || "Refused by Security Guard",
        };
      }
      return p;
    });

    updatePasses(updated);
    setActivePass(updated.find((p) => p.id === activePass.id) || null);
    setActionFeedback(`Entry denied for ${activePass.visitorName}: ${reason}`);
  };

  // Compute logs
  const filteredLogs = passes.filter((p) => {
    if (logFilter === "inside") return p.status === "checked_in";
    if (logFilter === "departed") return p.status === "departed";
    return true; // all
  });

  const insideCount = passes.filter((p) => p.status === "checked_in").length;
  const approvedCount = passes.filter((p) => p.status === "approved").length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-blue-800/40">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300">
              <ShieldCheck className="w-5 h-5 text-blue-300" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Security Gate Scanner & Verification</h2>
          </div>
          <p className="text-sm text-blue-200/80">
            Real-time QR verification for guards at society access booths. Point camera or enter Pass ID.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
            <p className="text-[11px] uppercase tracking-wider text-blue-200">Inside Premises</p>
            <p className="text-xl font-bold text-green-400">{insideCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
            <p className="text-[11px] uppercase tracking-wider text-blue-200">Pending Passes</p>
            <p className="text-xl font-bold text-amber-300">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Scanner Section: Left = Camera / Search, Right = Active Verification Card */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Viewfinder & Search (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setScanMode("camera")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                scanMode === "camera"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Live Camera Scanner
            </button>
            <button
              onClick={() => setScanMode("search")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                scanMode === "search"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Manual Pass Lookup
            </button>
          </div>

          {/* Camera Viewfinder */}
          {scanMode === "camera" && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">QR Camera Viewfinder</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Position the visitor&apos;s QR pass inside the frame</p>
                </div>
                {isCameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-semibold rounded-lg flex items-center hover:bg-red-100 transition-colors"
                  >
                    <CameraOff className="w-3.5 h-3.5 mr-1.5" /> Stop Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center hover:bg-blue-700 shadow-sm transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5" /> Start Camera
                  </button>
                )}
              </div>

              {/* Viewfinder Window */}
              <div className="relative aspect-video max-h-80 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-700 shadow-inner">
                {isCameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Viewfinder Target Crosshairs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-blue-400/80 rounded-2xl relative shadow-lg">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-400 -mt-1 -ml-1 rounded-tl"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-400 -mt-1 -mr-1 rounded-tr"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-400 -mb-1 -ml-1 rounded-bl"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-400 -mb-1 -mr-1 rounded-br"></div>
                        {/* Laser line animation */}
                        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-bounce"></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-blue-400">
                      <QrCode className="w-7 h-7" />
                    </div>
                    {cameraError ? (
                      <p className="text-xs text-amber-400 max-w-sm mx-auto">{cameraError}</p>
                    ) : (
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Click &quot;Start Camera&quot; to allow booth webcam or mobile rear camera scanner.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick simulation helper for testing */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" /> One-Click Test Pass:
                </span>
                <div className="flex flex-wrap gap-2">
                  {passes.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPass(p)}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 border border-gray-200 dark:border-slate-700 rounded-md text-xs font-medium transition-colors"
                    >
                      Scan #{p.id} ({p.visitorName})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Lookup */}
          {scanMode === "search" && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Pass ID / Phone Lookup</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Pass ID (e.g. NN-1042) or visitor phone number"
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Verify
                </button>
              </form>

              {/* Available passes quick list */}
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  All Active Passes in System ({passes.length})
                </p>
                <div className="divide-y divide-gray-100 dark:divide-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  {passes.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPass(p)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{p.visitorName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                            #{p.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {p.purpose} • Visiting {p.flatNumber} ({p.hostName})
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                          p.status === "approved"
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                            : p.status === "checked_in"
                            ? "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {p.status === "approved" ? "Valid" : p.status === "checked_in" ? "Inside" : p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {actionFeedback && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-blue-900 dark:text-blue-200 text-sm flex items-center justify-between">
              <span>{actionFeedback}</span>
              <button
                onClick={() => setActionFeedback(null)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Pass Verification & Check-In Action Card (5 Cols) */}
        <div className="lg:col-span-5">
          {activePass ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-600 rounded-2xl p-6 shadow-md space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                    Pass #{activePass.id}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-1">Verification Details</h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center ${
                    activePass.status === "approved"
                      ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                      : activePass.status === "checked_in"
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                      : activePass.status === "denied"
                      ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {activePass.status === "approved"
                    ? "Pass Valid"
                    : activePass.status === "checked_in"
                    ? "Currently Inside"
                    : activePass.status === "denied"
                    ? "Entry Denied"
                    : activePass.status}
                </div>
              </div>

              {/* Visitor & Host Info */}
              <div className="space-y-3.5">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Visitor Full Name</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{activePass.visitorName}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center mt-0.5">
                      <Phone className="w-3 h-3 mr-1" /> {activePass.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <Building className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Destination & Resident Host</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{activePass.flatNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Resident: {activePass.hostName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Purpose</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{activePass.purpose}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Valid Date</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{activePass.date}</p>
                  </div>
                </div>

                {/* Gate & Optional Vehicle Input */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Verification Gate
                    </label>
                    <select
                      value={selectedGate}
                      onChange={(e) => setSelectedGate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Gate 1 (Main Entrance)</option>
                      <option>Gate 2 (Service / Commercial)</option>
                      <option>Gate 3 (South Resident Gate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle Plate Number (Optional)
                    </label>
                    <div className="relative">
                      <Car className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="e.g. MH 12 AB 1234"
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                {activePass.status === "approved" && (
                  <button
                    onClick={handleCheckIn}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Allow Entry & Check-In
                  </button>
                )}

                {activePass.status === "checked_in" && (
                  <button
                    onClick={() => handleCheckOut(activePass.id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Mark Exit / Check-Out
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleDeny}
                    className="flex-1 py-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-300 dark:border-slate-700 text-red-600 dark:text-red-400 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Deny Entry
                  </button>
                  <button
                    onClick={() => setActivePass(null)}
                    className="flex-1 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg text-xs transition-colors"
                  >
                    Clear Card
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-slate-900/50">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Awaiting QR Pass Scan</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1.5 mb-6">
                When a visitor shows their gate QR pass, scan it with the camera or search the Pass ID to verify flat host details.
              </p>
              {onSwitchToCreate && (
                <button
                  onClick={onSwitchToCreate}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-semibold flex items-center transition-colors shadow-sm"
                >
                  Generate New Visitor Pass <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Gate Entry Logs (Audit Trail) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Live Gate Entry Logs (Today)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time audit log of visitors entering and leaving society premises
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs font-medium border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setLogFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                logFilter === "all"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              All Passes ({passes.length})
            </button>
            <button
              onClick={() => setLogFilter("inside")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                logFilter === "inside"
                  ? "bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Inside ({insideCount})
            </button>
            <button
              onClick={() => setLogFilter("departed")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                logFilter === "departed"
                  ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Departed
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-y border-gray-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Visitor & Pass ID</th>
                <th className="py-3 px-4">Visiting Host / Flat</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Gate & Check-In</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span>{log.visitorName}</span>
                      <span className="font-mono text-[10px] bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                        #{log.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">{log.phone}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    <div className="font-medium text-gray-900 dark:text-white">{log.flatNumber}</div>
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">{log.hostName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {log.purpose}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {log.checkInTime ? (
                      <>
                        <div className="font-semibold text-gray-900 dark:text-white">{log.checkInTime}</div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{log.gate || "Gate 1"}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Not checked in yet</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.status === "approved"
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          : log.status === "checked_in"
                          ? "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                          : log.status === "departed"
                          ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                          : "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {log.status === "approved"
                        ? "Pass Valid"
                        : log.status === "checked_in"
                        ? "Inside"
                        : log.status === "departed"
                        ? "Departed"
                        : log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {log.status === "checked_in" ? (
                      <button
                        onClick={() => handleCheckOut(log.id)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded font-semibold text-[11px] transition-colors"
                      >
                        Check-Out
                      </button>
                    ) : log.status === "approved" ? (
                      <button
                        onClick={() => handleSelectPass(log)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded font-semibold text-[11px] transition-colors"
                      >
                        Verify Now
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
