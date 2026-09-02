"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Mic,
  Send,
  Shield,
  Check,
  CheckCheck,
} from "lucide-react";

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isOutgoing: boolean;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: "Neighbor" | "Business" | "Group" | "Society";
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Aarav Patel",
    role: "Resident - Tower A 402",
    avatar: "https://i.pravatar.cc/150?u=1",
    online: true,
    lastMessage: "Are you coming to the society meeting?",
    timestamp: "10:30 AM",
    unread: 2,
    type: "Neighbor",
  },
  {
    id: "2",
    name: "FreshMart Groceries",
    role: "Local Business",
    avatar: "https://i.pravatar.cc/150?u=2",
    online: false,
    lastMessage: "Your order is ready for pickup.",
    timestamp: "Yesterday",
    unread: 0,
    type: "Business",
  },
  {
    id: "3",
    name: "Tennis Club",
    role: "Community Group",
    avatar: "https://i.pravatar.cc/150?u=3",
    online: true,
    lastMessage: "Court is booked for 5 PM.",
    timestamp: "Yesterday",
    unread: 5,
    type: "Group",
  },
  {
    id: "4",
    name: "Society Admin",
    role: "Management",
    avatar: "https://i.pravatar.cc/150?u=4",
    online: true,
    lastMessage: "Maintenance bill generated.",
    timestamp: "Monday",
    unread: 0,
    type: "Society",
  },
];

const initialMessages: Message[] = [
  {
    id: "m1",
    senderId: "1",
    text: "Hey! Are you coming to the society meeting?",
    timestamp: "10:30 AM",
    status: "read",
    isOutgoing: false,
  },
  {
    id: "m2",
    senderId: "me",
    text: "Yes, I'll be there. What's on the agenda?",
    timestamp: "10:32 AM",
    status: "read",
    isOutgoing: true,
  },
];

export default function ChatPage() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConv, setActiveConv] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate status updates and auto-reply
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: "delivered" } : m))
      );
    }, 500);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: "read" } : m))
      );
      
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConv.id,
        text: "Got it! See you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        isOutgoing: false,
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-50 overflow-hidden border rounded-xl shadow-sm">
      {/* Conversation List */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto p-2 border-b hide-scrollbar">
          {["All", "Neighbor", "Business", "Group", "Society"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap mr-2 transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConv.id === conv.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
              }`}
            >
              <div className="relative">
                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-500">{conv.timestamp}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat Window */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5]">
        {/* Header */}
        <div className="px-6 py-3 bg-white border-b flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center">
            <div className="relative">
              <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover" />
              {activeConv.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-gray-900">{activeConv.name}</h2>
              <p className="text-xs text-gray-500">{activeConv.role}</p>
            </div>
          </div>
          <div className="flex space-x-4 text-gray-600">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><Info className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-lg flex items-center shadow-sm">
              <Shield className="w-3 h-3 mr-1" /> Messages are end-to-end encrypted.
            </div>
          </div>

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isOutgoing ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative ${
                    msg.isOutgoing
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${msg.isOutgoing ? "text-blue-100" : "text-gray-400"}`}>
                    <span className="text-[10px]">{msg.timestamp}</span>
                    {msg.isOutgoing && (
                      <span>
                        {msg.status === "sent" && <Check className="w-3 h-3" />}
                        {msg.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                        {msg.status === "read" && <CheckCheck className="w-3 h-3 text-blue-300" />}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-gray-900"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            {inputValue.trim() ? (
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
