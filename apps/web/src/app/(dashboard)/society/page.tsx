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
  Plus
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
          <h1 className="text-2xl font-bold text-gray-900">Society Hub</h1>
          <p className="text-gray-500">Manage your residential community efficiently</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b hide-scrollbar pb-2">
        {(["Notice Board", "Maintenance", "Gate Pass", "Complaints", "Amenities"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[500px]">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            {paymentStatus === "idle" && (
              <>
                <h3 className="text-xl font-bold mb-4">Pay Maintenance Bill</h3>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between"><span>Society Maintenance</span><span>₹3,500.00</span></div>
                  <div className="flex justify-between"><span>Water Charges</span><span>₹600.00</span></div>
                  <div className="flex justify-between"><span>Sinking Fund</span><span>₹1,200.00</span></div>
                  <div className="flex justify-between font-bold border-t pt-2"><span>Total Amount</span><span>₹5,300.00</span></div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setShowBillModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handlePayment} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center">
                    <CreditCard className="w-4 h-4 mr-2" /> Pay via UPI / Card
                  </button>
                </div>
              </>
            )}
            {paymentStatus === "processing" && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Processing payment via Razorpay / Stripe...</p>
              </div>
            )}
            {paymentStatus === "success" && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-500 mb-6">Your digital society receipt is ready.</p>
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex justify-center items-center">
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
        <h2 className="text-lg font-semibold flex items-center"><Bell className="w-5 h-5 mr-2 text-blue-600" /> Recent Notices</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Post Notice
        </button>
      </div>
      
      <div className="border border-red-200 bg-red-50 p-4 rounded-xl flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-red-900">Urgent: Water Supply Interruption</h3>
            <span className="text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">Urgent</span>
          </div>
          <p className="text-sm text-red-800 mt-1">Water supply will be suspended in Tower A from 2 PM to 5 PM today due to emergency maintenance.</p>
          <p className="text-xs text-red-600 mt-2">Posted by Admin • 2 hours ago</p>
        </div>
      </div>

      <div className="border p-4 rounded-xl">
        <h3 className="font-bold text-gray-900">Annual General Meeting (AGM)</h3>
        <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-2 inline-block">High</span>
        <p className="text-sm text-gray-600 mt-2">The AGM for the current financial year will be held on Sunday at the Clubhouse. All flat owners are requested to attend.</p>
        <p className="text-xs text-gray-500 mt-2">Posted by Secretary • 1 day ago</p>
      </div>
    </div>
  );
}

function Maintenance({ onClickPay }: { onClickPay: () => void }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white flex justify-between items-center">
        <div>
          <p className="text-blue-100 mb-1">Current Maintenance Bill</p>
          <h2 className="text-3xl font-bold">₹5,300.00</h2>
          <p className="text-sm text-blue-200 mt-2">Due on: 15th of this month</p>
        </div>
        <button onClick={onClickPay} className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-10 shadow-sm transition-colors">
          Pay Now
        </button>
      </div>
      
      <h3 className="font-bold mt-8 mb-4">Previous Paid Bills</h3>
      <div className="space-y-3">
        {["Last Month", "2 Months Ago"].map((month) => (
          <div key={month} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
            <div>
              <p className="font-medium">{month}</p>
              <p className="text-xs text-gray-500">Paid on time</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-700">₹5,300.00</span>
              <button className="p-2 text-gray-500 hover:text-gray-900 bg-white border rounded"><Download className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function GatePass() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Generate Gate Pass</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
            <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" className="w-full border rounded-lg p-2" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <select className="w-full border rounded-lg p-2 bg-white">
                <option>Delivery</option>
                <option>Guest</option>
                <option>Service</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Generate Pass</button>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-gray-50">
        <QrCode className="w-32 h-32 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center mb-6">Fill the details to generate a unique QR code entry pass for your visitor.</p>
        <div className="flex space-x-3 w-full opacity-50 pointer-events-none">
          <button className="flex-1 py-2 bg-white border rounded-lg flex justify-center items-center"><Share2 className="w-4 h-4 mr-2" /> Share</button>
          <button className="flex-1 py-2 bg-green-600 text-white rounded-lg flex justify-center items-center"><CheckCircle className="w-4 h-4 mr-2" /> Approve</button>
        </div>
      </div>
    </div>
  );
}

function Complaints() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center"><Wrench className="w-5 h-5 mr-2 text-gray-600" /> Active Complaints</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Log New
        </button>
      </div>
      <div className="space-y-4">
        <div className="border p-4 rounded-xl flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold">Lift not working in Tower B</h3>
              <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full uppercase">In Progress</span>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">Lift</span>
            </div>
            <p className="text-sm text-gray-600">The service lift is making strange noises and gets stuck on the 4th floor.</p>
            <p className="text-xs text-gray-500 mt-2">Ticket #1042 • Assigned to: Otis Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Amenities() {
  return (
    <div>
      <h2 className="text-lg font-semibold flex items-center mb-6"><CalendarDays className="w-5 h-5 mr-2 text-gray-600" /> Book Amenities</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Club House", "Tennis Court", "Swimming Pool", "Party Hall"].map((amenity) => (
          <div key={amenity} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Image</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{amenity}</h3>
            <p className="text-sm text-gray-500 mb-4">Available slots today: 3</p>
            <button className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100">Book Slot</button>
          </div>
        ))}
      </div>
    </div>
  );
}
