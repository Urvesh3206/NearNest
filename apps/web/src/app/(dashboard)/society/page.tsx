"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CreditCard,
  QrCode,
  Wrench,
  CalendarDays,
  AlertTriangle,
  Download,
  Share2,
  CheckCircle,
  Plus,
  Copy,
  Check
} from "lucide-react";

type Tab = "Notice Board" | "Maintenance" | "Gate Pass" | "Complaints" | "Amenities";

export default function SocietyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Notice Board");
  const [showBillModal, setShowBillModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Society Hub</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your residential community efficiently</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 dark:border-slate-700 hide-scrollbar pb-2">
        {(["Notice Board", "Maintenance", "Gate Pass", "Complaints", "Amenities"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Notice Board" && <NoticeBoard />}
            {activeTab === "Maintenance" && (
              <Maintenance onClickPay={() => setShowBillModal(true)} />
            )}
            {activeTab === "Gate Pass" && <GatePass />}
            {activeTab === "Complaints" && <Complaints />}
            {activeTab === "Amenities" && <Amenities />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Payment Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl shadow-lg p-6 max-w-md w-full">
            {paymentStatus === "idle" && (
              <>
                <h3 className="text-xl font-bold mb-4">Pay Maintenance Bill</h3>
                <div className="space-y-3 mb-6 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex justify-between"><span>Society Maintenance</span><span>₹3,500.00</span></div>
                  <div className="flex justify-between"><span>Water Charges</span><span>₹600.00</span></div>
                  <div className="flex justify-between"><span>Sinking Fund</span><span>₹1,200.00</span></div>
                  <div className="flex justify-between font-bold border-t border-gray-200 dark:border-slate-700 pt-2 text-gray-900 dark:text-white"><span>Total Amount</span><span>₹5,300.00</span></div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowBillModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800">Cancel</button>
                  <button onClick={handlePayment} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center">
                    <CreditCard className="w-4 h-4 mr-2" /> Pay via UPI / Card
                  </button>
                </div>
              </>
            )}
            {paymentStatus === "processing" && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Processing payment via Razorpay / Stripe...</p>
              </div>
            )}
            {paymentStatus === "success" && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Your digital society receipt is ready.</p>
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 flex justify-center items-center">
                    <Download className="w-4 h-4 mr-2" /> Receipt
                  </button>
                  <button onClick={() => { setShowBillModal(false); setPaymentStatus("idle"); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function NoticeBoard() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white"><Bell className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> Recent Notices</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Post Notice
        </button>
      </div>
      
      <div className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 rounded-xl flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-red-900 dark:text-red-200">Urgent: Water Supply Interruption</h3>
            <span className="text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">Urgent</span>
          </div>
          <p className="text-sm text-red-800 dark:text-red-300 mt-1">Water supply will be suspended in Tower A from 2 PM to 5 PM today due to emergency maintenance.</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">Posted by Admin • 2 hours ago</p>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-850 p-4 rounded-xl">
        <h3 className="font-bold text-gray-900 dark:text-white">Annual General Meeting (AGM)</h3>
        <span className="text-[10px] uppercase font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full mt-2 inline-block">High</span>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">The AGM for the current financial year will be held on Sunday at the Clubhouse. All flat owners are requested to attend.</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Posted by Secretary • 1 day ago</p>
      </div>
    </div>
  );
}

function Maintenance({ onClickPay }: { onClickPay: () => void }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white flex justify-between items-center shadow-sm">
        <div>
          <p className="text-blue-100 mb-1">Current Maintenance Bill</p>
          <h2 className="text-3xl font-bold">₹5,300.00</h2>
          <p className="text-sm text-blue-200 mt-2">Due on: 15th of this month</p>
        </div>
        <button onClick={onClickPay} className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
          Pay Now
        </button>
      </div>
      
      <h3 className="font-bold mt-8 mb-4 text-gray-900 dark:text-white">Previous Paid Bills</h3>
      <div className="space-y-3">
        {["Last Month", "2 Months Ago"].map((month) => (
          <div key={month} className="flex justify-between items-center p-4 border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-800/40">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{month}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Paid on time</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-700 dark:text-gray-200">₹5,300.00</span>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function GatePass() {
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("Delivery");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [passData, setPassData] = useState<{
    id: string;
    visitorName: string;
    phone: string;
    purpose: string;
    date: string;
    time: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      setStatusMessage("Please enter the visitor's name");
      return;
    }
    setStatusMessage("");
    const passId = `NN-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setPassData({
      id: passId,
      visitorName: visitorName.trim(),
      phone: phone.trim() || "+91 98765 43210",
      purpose,
      date,
      time: currentTime
    });
  };

  const handleShare = () => {
    if (!passData) return;
    const text = `NearNest Digital Gate Pass\nPass ID: #${passData.id}\nVisitor: ${passData.visitorName}\nPhone: ${passData.phone}\nPurpose: ${passData.purpose}\nValid Date: ${passData.date}\nStatus: Approved by Resident`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Generate Gate Pass</h2>
        <form className="space-y-4" onSubmit={handleGenerate}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Visitor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors cursor-pointer"
              >
                <option value="Delivery" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Delivery</option>
                <option value="Guest" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Guest</option>
                <option value="Service" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Service / Maintenance</option>
                <option value="Cab" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Cab / Ride</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Pass Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          {statusMessage && (
            <p className="text-sm text-red-500 font-medium">{statusMessage}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.99]"
          >
            {passData ? "Regenerate Pass" : "Generate Pass"}
          </button>
        </form>
      </div>

      {passData ? (
        <div className="flex flex-col items-center justify-between border border-blue-200 dark:border-blue-900/50 rounded-xl p-6 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800/80 dark:to-slate-800/40 shadow-sm">
          <div className="w-full flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">Pass Approved</span>
            </div>
            <span className="text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              #{passData.id}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-4 flex flex-col items-center">
            <QrCode className="w-32 h-32 text-gray-900" />
            <span className="text-[11px] font-mono text-gray-600 mt-2 font-medium tracking-widest">{passData.id}</span>
          </div>

          <div className="w-full bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-xs space-y-1.5 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Visitor:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{passData.visitorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Phone:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{passData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Purpose:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{passData.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Valid Date:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{passData.date}</span>
            </div>
          </div>

          <div className="flex space-x-3 w-full">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex justify-center items-center text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-1.5" />
                  Share Pass
                </>
              )}
            </button>
            <button
              type="button"
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex justify-center items-center text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Verified
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 bg-gray-50/70 dark:bg-slate-800/40">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Instant QR Gate Pass</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6 max-w-xs">
            Fill the visitor details on the left to generate a digital entry pass with a QR code for security verification.
          </p>
          <div className="flex space-x-3 w-full opacity-40 pointer-events-none">
            <div className="flex-1 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg flex justify-center items-center text-sm font-medium text-gray-600 dark:text-gray-300">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </div>
            <div className="flex-1 py-2 bg-green-600 text-white rounded-lg flex justify-center items-center text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Complaints() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
          <Wrench className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" /> Active Complaints
        </h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Log New
        </button>
      </div>
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 p-4 rounded-xl flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white">Lift not working in Tower B</h3>
              <span className="text-[10px] font-bold bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full uppercase">In Progress</span>
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full uppercase">Lift</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">The service lift is making strange noises and gets stuck on the 4th floor.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ticket #1042 • Assigned to: Otis Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amenities() {
  return (
    <div>
      <h2 className="text-lg font-semibold flex items-center mb-6 text-gray-900 dark:text-white">
        <CalendarDays className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" /> Book Amenities
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Club House", "Tennis Court", "Swimming Pool", "Party Hall"].map((amenity) => (
          <div key={amenity} className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 dark:bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-300 font-medium">Image</span>
            </div>
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{amenity}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Available slots today: 3</p>
            <button className="w-full py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors">Book Slot</button>
          </div>
        ))}
      </div>
    </div>
  );
}
