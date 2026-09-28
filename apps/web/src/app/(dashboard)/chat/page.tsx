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
  Users,
  Image as ImageIcon,
  MoreVertical,
  Pin,
  Sparkles,
  ArrowLeft,
  X,
  PhoneOff,
  MicOff,
  VideoOff,
  Bell,
  Download,
  Flame,
  ThumbsUp,
  Heart,
  Laugh,
  AlertCircle
} from "lucide-react";
import { Avatar, Badge, Button, Input } from "@/components/ui";
import toast from "react-hot-toast";

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isOutgoing: boolean;
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
  isPinned?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: "All" | "Groups" | "Neighbors" | "Businesses" | "Society";
  membersCount?: number;
  description?: string;
  pinnedNotice?: string;
};

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "🏢 Ajeenkya Residency - Community Lounge",
    role: "Official Society Group",
    avatar: "",
    initials: "AR",
    online: true,
    lastMessage: "Aarav: Sunday tree plantation drive starts at 8:30 AM!",
    timestamp: "10:32 AM",
    unread: 3,
    type: "Groups",
    membersCount: 142,
    description: "General open community lounge for all residents of Tower A, B, and C.",
    pinnedNotice: "📢 Annual General Society Meeting scheduled for this Sunday at 10:00 AM in Clubhouse.",
  },
  {
    id: "c2",
    name: "Urvesh Rane",
    role: "Founder & Lead Developer",
    avatar: "",
    initials: "UR",
    online: true,
    lastMessage: "The new community update is live! Let me know your feedback.",
    timestamp: "10:28 AM",
    unread: 0,
    type: "Neighbors",
    membersCount: 2,
    description: "Lead Developer of NearNest platform • Tower A 401.",
  },
  {
    id: "c3",
    name: "Sumit Gurjar",
    role: "Co-Founder & Operations",
    avatar: "",
    initials: "SG",
    online: true,
    lastMessage: "Campus facility guidelines have been shared with the society committee.",
    timestamp: "10:15 AM",
    unread: 1,
    type: "Neighbors",
    membersCount: 2,
    description: "ADYPU Academic Associate & NearNest Operations Co-Lead.",
  },
  {
    id: "c4",
    name: "👮 Society Main Security Desk",
    role: "24/7 Security Intercom",
    avatar: "",
    initials: "SD",
    online: true,
    lastMessage: "Visitor gate pass for Amazon Courier approved at Gate 1.",
    timestamp: "09:45 AM",
    unread: 0,
    type: "Society",
    membersCount: 5,
    description: "Direct real-time intercom line to Main Gate Security and Guards.",
  },
  {
    id: "c5",
    name: "⚽ Weekend Sports & Badminton Club",
    role: "Resident Hobby Group",
    avatar: "",
    initials: "SC",
    online: true,
    lastMessage: "Court 2 is reserved today from 6:00 PM to 8:00 PM.",
    timestamp: "Yesterday",
    unread: 0,
    type: "Groups",
    membersCount: 38,
    description: "Community group for evening badminton, cricket, and gym sessions.",
  },
  {
    id: "c6",
    name: "🛒 Green Mart Organic",
    role: "Local Verified Business",
    avatar: "",
    initials: "GM",
    online: false,
    lastMessage: "Your organic vegetable basket order has been packed for delivery.",
    timestamp: "Yesterday",
    unread: 0,
    type: "Businesses",
    membersCount: 2,
    description: "Fresh daily groceries, dairy, and organics delivered to your doorstep in 15 mins.",
  },
  {
    id: "c7",
    name: "🔧 Rajesh Electrician & Repair",
    role: "Verified Service Pro",
    avatar: "",
    initials: "RE",
    online: true,
    lastMessage: "I will visit your flat at 4:30 PM for the MCB inspection.",
    timestamp: "Oct 24",
    unread: 0,
    type: "Businesses",
    membersCount: 2,
    description: "Licensed electrician with 8+ years experience in domestic wiring.",
  },
];

const initialMessagesRecord: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      senderId: "u_aarav",
      senderName: "Aarav Patel",
      senderRole: "Tower A 402",
      text: "Good morning neighbors! Is anyone interested in joining the community garden plantation drive this Sunday?",
      timestamp: "10:15 AM",
      status: "read",
      isOutgoing: false,
      reactions: [{ emoji: "🌱", count: 6, userReacted: true }, { emoji: "👍", count: 4 }],
    },
    {
      id: "m2",
      senderId: "u_priya",
      senderName: "Priya Sharma",
      senderRole: "Tower B 204",
      text: "Count me and my kids in! We have some flowering saplings to contribute as well. 🌸",
      timestamp: "10:20 AM",
      status: "read",
      isOutgoing: false,
      reactions: [{ emoji: "❤️", count: 5 }],
    },
    {
      id: "m3",
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: "Great initiative! What time are we meeting at the central lawn?",
      timestamp: "10:30 AM",
      status: "read",
      isOutgoing: true,
    },
    {
      id: "m4",
      senderId: "u_aarav",
      senderName: "Aarav Patel",
      senderRole: "Tower A 402",
      text: "Sunday tree plantation drive starts at 8:30 AM! Free refreshments will be provided by the society committee.",
      timestamp: "10:32 AM",
      status: "read",
      isOutgoing: false,
      reactions: [{ emoji: "👏", count: 8 }],
    },
  ],
  c2: [
    {
      id: "m21",
      senderId: "u_urvesh",
      senderName: "Urvesh Rane",
      senderRole: "Founder & Lead Developer",
      text: "Hi! Welcome to NearNest. We just deployed the new instant community messaging and SOS rapid alert system.",
      timestamp: "10:25 AM",
      status: "read",
      isOutgoing: false,
    },
    {
      id: "m22",
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: "The platform looks super smooth and fast! Love the neighborhood features.",
      timestamp: "10:27 AM",
      status: "read",
      isOutgoing: true,
    },
    {
      id: "m23",
      senderId: "u_urvesh",
      senderName: "Urvesh Rane",
      senderRole: "Founder & Lead Developer",
      text: "The new community update is live! Let me know your feedback.",
      timestamp: "10:28 AM",
      status: "read",
      isOutgoing: false,
    },
  ],
  c3: [
    {
      id: "m31",
      senderId: "u_sumit",
      senderName: "Sumit Gurjar",
      senderRole: "Co-Founder & Operations",
      text: "Hello! Campus facility guidelines have been shared with the society committee.",
      timestamp: "10:15 AM",
      status: "read",
      isOutgoing: false,
    },
  ],
};

const EMOJIS = ["👍", "❤️", "👏", "🔥", "😂", "🎉", "🚨"];

export default function ChatPage() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConv, setActiveConv] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessagesRecord["c1"] || []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Switch conversation
  const handleSelectConv = (conv: Conversation) => {
    setActiveConv(conv);
    setMessages(initialMessagesRecord[conv.id] || [
      {
        id: "default_1",
        senderId: conv.id,
        senderName: conv.name,
        senderRole: conv.role,
        text: `Welcome to the chat with ${conv.name}. Say hello!`,
        timestamp: "Just now",
        status: "read",
        isOutgoing: false,
      }
    ]);
    setIsMobileListOpen(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || c.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowEmojiPicker(false);

    // Update message delivery checkmarks
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: "delivered" } : m))
      );
    }, 400);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: "read" } : m))
      );
      setIsTyping(true);
    }, 1000);

    // Interactive Auto-Response simulation
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Understood! Thanks for sharing with the community.";
      if (activeConv.id === "c1") {
        replyText = "Thanks for the update! Looking forward to seeing everyone there.";
      } else if (activeConv.id === "c2") {
        replyText = "Awesome! We are actively rolling out new enhancements every day. 🚀";
      } else if (activeConv.id === "c4") {
        replyText = "Guard Desk logged your message into the society gate register. ✓";
      }

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConv.id,
        senderName: activeConv.name.replace(/^[^\w\s]+/, '').trim(),
        senderRole: activeConv.role,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        isOutgoing: false,
        reactions: [{ emoji: "👍", count: 1 }],
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2400);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existingReactions = m.reactions || [];
        const index = existingReactions.findIndex((r) => r.emoji === emoji);

        if (index > -1) {
          const current = existingReactions[index];
          const updated = [...existingReactions];
          if (current.userReacted) {
            if (current.count <= 1) {
              updated.splice(index, 1);
            } else {
              updated[index] = { ...current, count: current.count - 1, userReacted: false };
            }
          } else {
            updated[index] = { ...current, count: current.count + 1, userReacted: true };
          }
          return { ...m, reactions: updated };
        } else {
          return {
            ...m,
            reactions: [...existingReactions, { emoji, count: 1, userReacted: true }],
          };
        }
      })
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const photoMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: `Uploaded attachment: ${file.name}`,
      imageUrl: file.type.startsWith('image') ? fakeUrl : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "read",
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, photoMessage]);
    toast.success(`Attached ${file.name}`);
  };

  return (
    <div className="h-[calc(100vh-5.5rem)] flex bg-surface border border-border-hairline rounded-3xl overflow-hidden shadow-card relative">
      
      {/* 1. Left Sidebar: Conversation & Channel List */}
      <div
        className={`${
          isMobileListOpen ? "flex" : "hidden"
        } md:flex w-full md:w-80 lg:w-96 flex-col bg-surface border-r border-border-hairline shrink-0 z-20`}
      >
        {/* Header & Search */}
        <div className="p-4 border-b border-border-hairline space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-text-primary">Community Chat</h1>
            </div>
            <Badge variant="success" size="sm" className="text-[11px] font-semibold">
              Live Hub
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search groups or neighbors..."
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-hairline overflow-x-auto no-scrollbar">
          {(["All", "Groups", "Neighbors", "Society", "Businesses"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-canvas"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-hairline/40">
          {filteredConversations.map((conv) => {
            const isSelected = activeConv.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-brand-50/60 dark:bg-brand-950/30 border-l-4 border-brand-500"
                    : "hover:bg-surface-subtle/70"
                }`}
              >
                {/* Avatar with Status */}
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-teal-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-sm text-brand-700 dark:text-brand-300">
                    {conv.initials}
                  </div>
                  {conv.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full shadow-sm" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className={`text-xs font-bold truncate ${isSelected ? "text-brand-700 dark:text-brand-400" : "text-text-primary"}`}>
                      {conv.name}
                    </h3>
                    <span className="text-[10px] text-text-tertiary whitespace-nowrap">{conv.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-text-secondary truncate mt-0.5">{conv.lastMessage}</p>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-medium text-text-tertiary px-1.5 py-0.2 rounded bg-surface-subtle border border-border-hairline/60">
                      {conv.role}
                    </span>
                    {conv.unread > 0 && (
                      <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-canvas overflow-hidden ${!isMobileListOpen ? "flex" : "hidden md:flex"}`}>
        
        {/* Chat Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-surface border-b border-border-hairline flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back Button */}
            <button
              onClick={() => setIsMobileListOpen(true)}
              className="p-1.5 -ml-1 text-text-secondary hover:text-text-primary md:hidden rounded-lg hover:bg-surface-subtle"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/15 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-500/20">
                {activeConv.initials}
              </div>
              {activeConv.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface rounded-full animate-pulse" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-text-primary truncate flex items-center gap-2">
                <span>{activeConv.name}</span>
                {activeConv.membersCount && activeConv.membersCount > 2 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-text-secondary font-medium">
                    {activeConv.membersCount} members
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-text-secondary truncate">
                {activeConv.online ? "🟢 Active now" : "Offline"} • {activeConv.role}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-text-secondary">
            <button
              onClick={() => setActiveCall("audio")}
              title="Voice Call"
              className="p-2 rounded-xl hover:bg-surface-subtle hover:text-brand-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveCall("video")}
              title="Video Call"
              className="p-2 rounded-xl hover:bg-surface-subtle hover:text-brand-600 transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowInfoSidebar(!showInfoSidebar)}
              title="Community Info"
              className={`p-2 rounded-xl transition-colors ${
                showInfoSidebar ? "bg-brand-500 text-white" : "hover:bg-surface-subtle hover:text-brand-600"
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pinned Announcement Bar (if available in group) */}
        {activeConv.pinnedNotice && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2 min-w-0">
              <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium truncate">{activeConv.pinnedNotice}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded ml-2 shrink-0">
              Pinned
            </span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Security Notice */}
          <div className="flex justify-center my-2">
            <div className="bg-surface border border-border-hairline text-text-tertiary text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>NearNest End-to-End Encrypted Community Channel</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.isOutgoing ? "items-end" : "items-start"} group/msg`}
              >
                {/* Sender Name for incoming group messages */}
                {!msg.isOutgoing && (
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-text-primary">{msg.senderName}</span>
                    {msg.senderRole && (
                      <span className="text-[10px] text-text-tertiary">• {msg.senderRole}</span>
                    )}
                  </div>
                )}

                <div className="relative max-w-[85%] sm:max-w-[70%]">
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm space-y-2 text-xs leading-relaxed ${
                      msg.isOutgoing
                        ? "bg-brand-500 text-white rounded-br-none"
                        : "bg-surface border border-border-hairline text-text-primary rounded-bl-none"
                    }`}
                  >
                    {/* Attached Image */}
                    {msg.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/20 max-h-60 mb-2">
                        <img src={msg.imageUrl} alt="Attached" className="w-full object-cover" />
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] pt-1 ${
                        msg.isOutgoing ? "text-brand-100" : "text-text-tertiary"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isOutgoing && (
                        <span>
                          {msg.status === "sent" && <Check className="w-3 h-3" />}
                          {msg.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                          {msg.status === "read" && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emoji Reactions Tray */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddReaction(msg.id, r.emoji)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-all ${
                            r.userReacted
                              ? "bg-brand-50 dark:bg-brand-950/40 border-brand-300 text-brand-700 dark:text-brand-300 font-bold"
                              : "bg-surface border-border-hairline text-text-secondary hover:bg-surface-subtle"
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Hover Quick Reaction Buttons */}
                  <div
                    className={`absolute -top-3 ${
                      msg.isOutgoing ? "right-2" : "left-2"
                    } opacity-0 group-hover/msg:opacity-100 transition-opacity bg-surface border border-border-hairline shadow-md rounded-full px-2 py-0.5 flex items-center gap-1 z-10`}
                  >
                    {["👍", "❤️", "👏", "🔥"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform text-xs p-0.5"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Animation */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-text-tertiary text-xs bg-surface border border-border-hairline px-3.5 py-2 rounded-2xl w-fit shadow-sm"
            >
              <span className="font-semibold text-text-secondary">{activeConv.name}</span> is typing
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Input & Attachment Bar */}
        <div className="p-3 sm:p-4 bg-surface border-t border-border-hairline relative">
          
          {/* Quick Emoji Picker Drawer */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-4 mb-2 p-2 bg-surface border border-border-hairline rounded-2xl shadow-xl flex items-center gap-2 z-20 animate-fade-in">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputValue((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1.5 hover:scale-125 transition-transform text-base"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-canvas border border-border-hairline rounded-2xl p-1.5 px-3 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
              title="Attach File / Photo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />

            <input
              type="text"
              placeholder={`Message ${activeConv.name}...`}
              className="flex-1 bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-tertiary px-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            {inputValue.trim() ? (
              <button
                type="button"
                onClick={handleSendMessage}
                className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toast.success("Hold to record voice message (Simulated)")}
                className="p-2 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
                title="Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Right Sidebar: Channel / Community Info Drawer */}
      {showInfoSidebar && (
        <div className="w-80 border-l border-border-hairline bg-surface p-5 flex flex-col justify-between overflow-y-auto z-20">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
              <h3 className="text-sm font-bold text-text-primary">Channel Info</h3>
              <button
                onClick={() => setShowInfoSidebar(false)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-subtle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-brand-500/15 text-brand-600 font-bold text-xl flex items-center justify-center border border-brand-500/20 shadow-sm">
                {activeConv.initials}
              </div>
              <h4 className="text-sm font-bold text-text-primary">{activeConv.name}</h4>
              <p className="text-xs text-text-secondary">{activeConv.role}</p>
            </div>

            <div className="bg-canvas p-3.5 rounded-2xl border border-border-hairline space-y-1">
              <span className="text-[10px] font-bold uppercase text-text-tertiary tracking-wider">About</span>
              <p className="text-xs text-text-secondary leading-relaxed">{activeConv.description}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-text-tertiary tracking-wider">Community Controls</span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => toast.success("Notifications muted for 8 hours")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-brand-500" />
                  <span>Mute Notifications</span>
                </button>
                <button
                  onClick={() => toast.success("Channel history exported")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-brand-500" />
                  <span>Export Chat History</span>
                </button>
                <button
                  onClick={() => toast.error("Report submitted to Society Committee")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors text-left"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Report Suspicious Activity</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-hairline text-center text-[11px] text-text-tertiary">
            NearNest Community Verified • 2026
          </div>
        </div>
      )}

      {/* 5. Audio / Video Call Simulation Modal */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-surface rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-border-hairline"
            >
              <div className="relative mx-auto w-24 h-24 rounded-full bg-brand-500/15 text-brand-600 font-bold text-2xl flex items-center justify-center border-2 border-brand-500/30 shadow-lg">
                {activeConv.initials}
                <span className="absolute inset-0 rounded-full border-2 border-brand-500 animate-ping opacity-50" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-text-primary">{activeConv.name}</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold animate-pulse mt-1">
                  Connecting {activeCall === "video" ? "HD Video" : "Voice"} Call...
                </p>
                <p className="text-[11px] text-text-secondary mt-0.5">{activeConv.role}</p>
              </div>

              {/* Call Control Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-full transition-colors ${
                    isMuted ? "bg-red-500 text-white" : "bg-surface-subtle text-text-secondary hover:bg-canvas"
                  }`}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setActiveCall(null)}
                  className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-600/40 hover:scale-105 transition-all"
                  title="End Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                {activeCall === "video" && (
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3.5 rounded-full transition-colors ${
                      isVideoOff ? "bg-red-500 text-white" : "bg-surface-subtle text-text-secondary hover:bg-canvas"
                    }`}
                    title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
