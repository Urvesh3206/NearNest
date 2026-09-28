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
  AlertCircle,
  Plus,
  Reply,
  Copy,
  Trash2,
  Share2,
  MapPin,
  FileText,
  Radio,
  StopCircle,
  Hash,
  MessageSquare
} from "lucide-react";
import { Avatar, Badge, Button, Input, Modal } from "@/components/ui";
import toast from "react-hot-toast";

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  text: string;
  imageUrl?: string;
  attachmentType?: "image" | "document" | "location" | "audio";
  attachmentName?: string;
  attachmentMeta?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isOutgoing: boolean;
  replyTo?: {
    senderName: string;
    text: string;
  };
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
  isPinned?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  initials: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  category: "all" | "groups" | "neighbors" | "society" | "services";
  membersCount?: number;
  description?: string;
  pinnedNotice?: string;
  badge?: string;
};

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "🏢 Ajeenkya Residency - Main Lounge",
    role: "Official Society Group",
    initials: "AR",
    online: true,
    lastMessage: "Aarav: Sunday tree plantation drive starts at 8:30 AM in central lawn!",
    timestamp: "10:32 AM",
    unread: 3,
    category: "groups",
    membersCount: 142,
    badge: "Official",
    description: "General community lounge for all residents of Tower A, B, and C. Share society updates, inquiries, and social news.",
    pinnedNotice: "📢 Annual General Society Meeting (AGM) scheduled for this Sunday at 10:00 AM in Clubhouse.",
  },
  {
    id: "c2",
    name: "Urvesh Rane",
    role: "Founder & Lead Developer",
    initials: "UR",
    online: true,
    lastMessage: "The new community update and instant SOS alert system are live!",
    timestamp: "10:28 AM",
    unread: 0,
    category: "neighbors",
    membersCount: 2,
    badge: "Lead",
    description: "NearNest Creator & Lead Developer • Tower A 401 • Contact: urveshrane3206@gmail.com",
  },
  {
    id: "c3",
    name: "Sumit Gurjar",
    role: "Co-Founder & Operations",
    initials: "SG",
    online: true,
    lastMessage: "Campus facility guidelines have been shared with the society committee.",
    timestamp: "10:15 AM",
    unread: 1,
    category: "neighbors",
    membersCount: 2,
    badge: "Operations",
    description: "ADYPU Academic Associate & Operations Co-Lead • Contact: sumit.gurjar@adypu.edu.in",
  },
  {
    id: "c4",
    name: "👮 Society Main Security Desk (Gate 1)",
    role: "24/7 Security Intercom",
    initials: "SD",
    online: true,
    lastMessage: "Visitor gate pass for Amazon Courier approved at Gate 1.",
    timestamp: "09:45 AM",
    unread: 0,
    category: "society",
    membersCount: 6,
    badge: "Security",
    description: "Direct real-time intercom line to Main Gate Security and Society Watch.",
    pinnedNotice: "🔒 Night visitor registration is strictly mandatory after 10:30 PM.",
  },
  {
    id: "c5",
    name: "⚽ Weekend Sports & Badminton Club",
    role: "Resident Sports Group",
    initials: "SC",
    online: true,
    lastMessage: "Court 2 is reserved today from 6:00 PM to 8:00 PM. Who is in?",
    timestamp: "Yesterday",
    unread: 0,
    category: "groups",
    membersCount: 38,
    badge: "Sports",
    description: "Community sports club for evening badminton, cricket tournaments, and clubhouse gym workouts.",
  },
  {
    id: "c6",
    name: "🛍️ Buy, Sell & Swap Marketplace",
    role: "Neighborhood Barter",
    initials: "BS",
    online: true,
    lastMessage: "Preeti: Wooden bookshelf in mint condition available for ₹1,200.",
    timestamp: "Yesterday",
    unread: 0,
    category: "groups",
    membersCount: 89,
    badge: "Market",
    description: "Sell, buy, or donate pre-loved furniture, electronics, and books with zero commission.",
  },
  {
    id: "c7",
    name: "🛒 Green Mart Organic",
    role: "Local Verified Grocery",
    initials: "GM",
    online: true,
    lastMessage: "Your organic vegetable basket order has been packed for 15-min delivery.",
    timestamp: "Yesterday",
    unread: 0,
    category: "services",
    membersCount: 2,
    badge: "Store",
    description: "Daily fresh vegetables, farm milk, and artisan bakery products delivered directly to your flat.",
  },
  {
    id: "c8",
    name: "🔧 Rajesh Electrician & Repair",
    role: "ID Verified Pro",
    initials: "RE",
    online: false,
    lastMessage: "I will visit your flat at 4:30 PM for the MCB wiring inspection.",
    timestamp: "Oct 24",
    unread: 0,
    category: "services",
    membersCount: 2,
    badge: "Verified",
    description: "Licensed society electrician with 8+ years experience in electrical troubleshooting.",
  },
];

const initialMessagesRecord: Record<string, Message[]> = {
  c1: [
    {
      id: "m1",
      senderId: "u_aarav",
      senderName: "Aarav Patel",
      senderRole: "Tower A 402",
      text: "Good morning neighbors! 🌿 Is anyone interested in joining our community plantation drive this Sunday?",
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
      text: "Count me and my kids in! We have 10 flowering saplings to contribute to the central garden. 🌸",
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
      text: "Great initiative! What time are we gathering at the central lawn?",
      timestamp: "10:30 AM",
      status: "read",
      isOutgoing: true,
    },
    {
      id: "m4",
      senderId: "u_aarav",
      senderName: "Aarav Patel",
      senderRole: "Tower A 402",
      text: "Sunday tree plantation drive starts at 8:30 AM in central lawn! Free refreshments & saplings provided by the society committee.",
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
      text: "Hi! Welcome to NearNest. We just launched the real-time community chat and emergency SOS hub.",
      timestamp: "10:25 AM",
      status: "read",
      isOutgoing: false,
    },
    {
      id: "m22",
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: "The interface looks super smooth and fast! Love the community features.",
      timestamp: "10:27 AM",
      status: "read",
      isOutgoing: true,
    },
    {
      id: "m23",
      senderId: "u_urvesh",
      senderName: "Urvesh Rane",
      senderRole: "Founder & Lead Developer",
      text: "The new community update and instant SOS alert system are live!",
      timestamp: "10:28 AM",
      status: "read",
      isOutgoing: false,
      reactions: [{ emoji: "🚀", count: 2, userReacted: true }],
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

const EMOJIS = ["👍", "❤️", "👏", "🔥", "😂", "🎉", "🌱", "🚀", "🚨"];

// Web Audio sound synthesizer for realistic chime
function playNotificationChime(isOutgoing = true) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;

    if (isOutgoing) {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConv, setActiveConv] = useState<Conversation>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessagesRecord["c1"] || []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Call simulation state
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // New Group Modal
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupRole, setNewGroupRole] = useState("Community Club");

  // Mobile layout switch
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isTyping]);

  // Handle voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Switch Active Conversation
  const handleSelectConv = (conv: Conversation) => {
    setActiveConv(conv);
    setReplyingTo(null);
    setMessages(initialMessagesRecord[conv.id] || [
      {
        id: `welcome_${conv.id}`,
        senderId: conv.id,
        senderName: conv.name,
        senderRole: conv.role,
        text: `Welcome to ${conv.name}! You can now share updates and chat with members.`,
        timestamp: "Just now",
        status: "read",
        isOutgoing: false,
      },
    ]);
    setIsMobileListOpen(false);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || c.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // Send message handler
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
      replyTo: replyingTo
        ? {
            senderName: replyingTo.senderName,
            text: replyingTo.text,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
    playNotificationChime(true);

    // Update message delivery status simulation
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

    // Dynamic intelligent reply simulation
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = "Got it! Thanks for reaching out.";
      if (activeConv.id === "c1") {
        replyContent = "Great! See you at the central lawn on Sunday morning. 🌱";
      } else if (activeConv.id === "c2") {
        replyContent = "Awesome! We're building new community features every week. Let us know any suggestions! 🚀";
      } else if (activeConv.id === "c4") {
        replyContent = "Gate 1 Guard verified and logged the entry pass into the digital society register. ✓";
      } else if (activeConv.id === "c5") {
        replyContent = "Awesome! Court is booked. Bring your racket and shuttlecock at 6 PM! 🏸";
      }

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConv.id,
        senderName: activeConv.name.replace(/^[^\w\s]+/, '').trim(),
        senderRole: activeConv.role,
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        isOutgoing: false,
        reactions: [{ emoji: "👍", count: 1 }],
      };

      setMessages((prev) => [...prev, replyMsg]);
      playNotificationChime(false);
    }, 2500);
  };

  // Reactions Handler
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = m.reactions || [];
        const index = currentReactions.findIndex((r) => r.emoji === emoji);

        if (index > -1) {
          const item = currentReactions[index];
          const updated = [...currentReactions];
          if (item.userReacted) {
            if (item.count <= 1) {
              updated.splice(index, 1);
            } else {
              updated[index] = { ...item, count: item.count - 1, userReacted: false };
            }
          } else {
            updated[index] = { ...item, count: item.count + 1, userReacted: true };
          }
          return { ...m, reactions: updated };
        } else {
          return {
            ...m,
            reactions: [...currentReactions, { emoji, count: 1, userReacted: true }],
          };
        }
      })
    );
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const isImg = file.type.startsWith("image");

    const fileMsg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: isImg ? `Shared photo: ${file.name}` : `Shared document: ${file.name}`,
      imageUrl: isImg ? fakeUrl : undefined,
      attachmentType: isImg ? "image" : "document",
      attachmentName: file.name,
      attachmentMeta: `${(file.size / 1024).toFixed(1)} KB`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "read",
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, fileMsg]);
    playNotificationChime(true);
    toast.success(`Sent ${file.name}`);
  };

  // Send Voice Note Simulation
  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const duration = recordingSeconds || 3;

    const voiceMsg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderRole: "Resident",
      text: `🎤 Voice message (${duration}s)`,
      attachmentType: "audio",
      attachmentMeta: `0:${duration < 10 ? '0' : ''}${duration}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "read",
      isOutgoing: true,
    };

    setMessages((prev) => [...prev, voiceMsg]);
    playNotificationChime(true);
    toast.success("Voice note sent");
  };

  // Create new group handler
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: Conversation = {
      id: `group_${Date.now()}`,
      name: `👥 ${newGroupName.trim()}`,
      role: newGroupRole,
      initials: newGroupName.substring(0, 2).toUpperCase(),
      online: true,
      lastMessage: "Group created. Start chatting!",
      timestamp: "Just now",
      unread: 0,
      category: "groups",
      membersCount: 1,
      badge: "Group",
      description: `Community group for ${newGroupName}.`,
    };

    setConversations([newGroup, ...conversations]);
    setActiveConv(newGroup);
    setMessages([
      {
        id: `welcome_${newGroup.id}`,
        senderId: "system",
        senderName: "NearNest System",
        text: `🎉 You created "${newGroupName}". Invite neighbors and start collaborating!`,
        timestamp: "Just now",
        status: "read",
        isOutgoing: false,
      },
    ]);
    setIsNewGroupModalOpen(false);
    setNewGroupName("");
    toast.success(`Group "${newGroupName}" created!`);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[540px] flex bg-surface border border-border-hairline rounded-3xl overflow-hidden shadow-card relative">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR: CHANNEL & CONVERSATION DIRECTORY */}
      {/* ========================================================================= */}
      <div
        className={`${
          isMobileListOpen ? "flex" : "hidden"
        } md:flex w-full md:w-80 lg:w-[350px] flex-col bg-surface border-r border-border-hairline shrink-0 z-20`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-border-hairline space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-text-primary leading-none">Community Chat</h1>
                <span className="text-[10px] text-text-tertiary">Real-time Neighborhood Hub</span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsNewGroupModalOpen(true)}
              className="h-8 px-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              title="Create New Channel / Group"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Group</span>
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search conversations, clubs, or flats..."
              className="w-full pl-9 pr-4 py-2 bg-canvas border border-border-hairline rounded-xl text-xs text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills Tabs */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-hairline overflow-x-auto no-scrollbar bg-surface-subtle/30">
          {[
            { id: "all", label: "All" },
            { id: "groups", label: "Groups" },
            { id: "neighbors", label: "Neighbors" },
            { id: "society", label: "Society" },
            { id: "services", label: "Services" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-surface text-text-secondary hover:text-text-primary hover:bg-canvas border border-border-hairline/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-hairline/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary text-xs">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`flex items-start gap-3 p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-brand-50/70 dark:bg-brand-950/40 border-l-4 border-brand-500"
                      : "hover:bg-surface-subtle/70"
                  }`}
                >
                  {/* Avatar with Status Pulse */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-teal-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-sm text-brand-700 dark:text-brand-300 shadow-sm">
                      {conv.initials}
                    </div>
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full shadow-sm" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-xs font-bold truncate ${isSelected ? "text-brand-700 dark:text-brand-400" : "text-text-primary"}`}>
                        {conv.name}
                      </h3>
                      <span className="text-[10px] text-text-tertiary whitespace-nowrap">{conv.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{conv.lastMessage}</p>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-semibold text-text-tertiary px-1.5 py-0.2 rounded bg-surface-subtle border border-border-hairline/60">
                        {conv.badge || conv.role}
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
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN ACTIVE CHAT WINDOW */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col bg-canvas overflow-hidden ${!isMobileListOpen ? "flex" : "hidden md:flex"}`}>
        
        {/* Top Chat Bar */}
        <div className="px-4 sm:px-6 py-3 bg-surface border-b border-border-hairline flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back to List */}
            <button
              onClick={() => setIsMobileListOpen(true)}
              className="p-1.5 -ml-1 text-text-secondary hover:text-text-primary md:hidden rounded-lg hover:bg-surface-subtle"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/15 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-500/20 shadow-sm">
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
              <p className="text-[11px] text-text-secondary truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{activeConv.online ? "Online" : "Offline"} • {activeConv.role}</span>
              </p>
            </div>
          </div>

          {/* Quick Chat Actions */}
          <div className="flex items-center gap-1 sm:gap-2 text-text-secondary">
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
              title="Channel Information"
              className={`p-2 rounded-xl transition-colors ${
                showInfoSidebar ? "bg-brand-500 text-white" : "hover:bg-surface-subtle hover:text-brand-600"
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pinned Notice Header (if present) */}
        {activeConv.pinnedNotice && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2 min-w-0">
              <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium truncate">{activeConv.pinnedNotice}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded ml-2 shrink-0">
              Pinned Notice
            </span>
          </div>
        )}

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Security Banner */}
          <div className="flex justify-center my-1">
            <div className="bg-surface border border-border-hairline text-text-tertiary text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>NearNest End-to-End Encrypted Society Channel</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
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

                <div className="relative max-w-[85%] sm:max-w-[72%]">
                  
                  {/* Quoted Message (if replying) */}
                  {msg.replyTo && (
                    <div className="mb-1 p-2 rounded-xl bg-surface-subtle/80 border-l-4 border-brand-500 text-[11px] text-text-secondary truncate">
                      <span className="font-bold text-brand-600 block">{msg.replyTo.senderName}</span>
                      <span className="truncate">{msg.replyTo.text}</span>
                    </div>
                  )}

                  {/* Message Bubble Body */}
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm space-y-1.5 text-xs leading-relaxed ${
                      msg.isOutgoing
                        ? "bg-brand-500 text-white rounded-br-none shadow-brand-500/20"
                        : "bg-surface border border-border-hairline text-text-primary rounded-bl-none"
                    }`}
                  >
                    {/* Attached Photo */}
                    {msg.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/20 max-h-64 mb-2 shadow-sm">
                        <img src={msg.imageUrl} alt="Attached media" className="w-full object-cover" />
                      </div>
                    )}

                    {/* Attached Document / File */}
                    {msg.attachmentType === "document" && (
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/10 dark:bg-white/10 mb-1.5">
                        <FileText className="w-5 h-5" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold truncate text-[11px]">{msg.attachmentName}</p>
                          <span className="text-[10px] opacity-80">{msg.attachmentMeta}</span>
                        </div>
                      </div>
                    )}

                    {/* Voice Note Pill */}
                    {msg.attachmentType === "audio" && (
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/10 dark:bg-white/10 mb-1">
                        <div className="w-7 h-7 rounded-full bg-white text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                          ▶
                        </div>
                        <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-white rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold">{msg.attachmentMeta}</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] pt-0.5 ${
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

                  {/* Emoji Reactions Badges */}
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

                  {/* Hover Quick Actions Bar */}
                  <div
                    className={`absolute -top-3.5 ${
                      msg.isOutgoing ? "right-2" : "left-2"
                    } opacity-0 group-hover/msg:opacity-100 transition-opacity bg-surface border border-border-hairline shadow-md rounded-full px-2 py-0.5 flex items-center gap-1.5 z-10`}
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
                    <span className="w-px h-3 bg-border-hairline" />
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="text-text-tertiary hover:text-brand-600 p-0.5"
                      title="Reply"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.text);
                        toast.success("Message copied");
                      }}
                      className="text-text-tertiary hover:text-brand-600 p-0.5"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
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

        {/* ========================================================================= */}
        {/* 3. BOTTOM MESSAGE COMPOSER & ACTIONS */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 bg-surface border-t border-border-hairline relative">
          
          {/* Replying Banner */}
          {replyingTo && (
            <div className="mb-2 p-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <Reply className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="text-text-secondary">Replying to <b className="text-brand-600">{replyingTo.senderName}</b>:</span>
                <span className="text-text-tertiary truncate max-w-xs">{replyingTo.text}</span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 text-text-tertiary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Emoji Palette Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-4 mb-2 p-2.5 bg-surface border border-border-hairline rounded-2xl shadow-2xl flex items-center gap-2 z-30 animate-fade-in">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputValue((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1 hover:scale-130 transition-transform text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Composer Input Bar */}
          {isRecording ? (
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-900 rounded-2xl p-2 px-4 animate-pulse">
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                <span>Recording voice note... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecording(false)}
                  className="p-1.5 text-text-secondary hover:text-text-primary text-xs"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={handleSendVoiceNote}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-8 px-3"
                >
                  <Send className="w-3.5 h-3.5 mr-1" /> Send Note
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-canvas border border-border-hairline rounded-2xl p-1.5 px-3 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
              
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
                title="Attach Photo or File"
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
                placeholder={`Message ${activeConv.name}... (Press Enter to send)`}
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
                  onClick={() => setIsRecording(true)}
                  className="p-2 text-text-tertiary hover:text-brand-500 hover:bg-surface rounded-xl transition-colors"
                  title="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RIGHT SIDEBAR: CHANNEL & COMMUNITY INFO */}
      {/* ========================================================================= */}
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
              <span className="text-[10px] font-bold uppercase text-text-tertiary tracking-wider">About Channel</span>
              <p className="text-xs text-text-secondary leading-relaxed">{activeConv.description}</p>
            </div>

            {/* Community Controls */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-text-tertiary tracking-wider">Controls & Tools</span>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => toast.success("Notifications muted for 8 hours")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-brand-500" />
                  <span>Mute Notifications</span>
                </button>
                <button
                  onClick={() => toast.success("Chat history exported to PDF")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-brand-500" />
                  <span>Export Chat History</span>
                </button>
                <button
                  onClick={() => toast.error("Report sent to Society Committee")}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors text-left"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Report Suspicious Message</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-hairline text-center text-[11px] text-text-tertiary">
            NearNest Verified Channel • 2026
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HD VOICE / VIDEO CALL MODAL SIMULATION */}
      {/* ========================================================================= */}
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
                    title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. CREATE NEW GROUP MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        title="Create New Community Group"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1.5">Group / Club Name *</label>
            <Input
              required
              placeholder="e.g. Tower A Yoga Club / Book Readers"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-primary block mb-1.5">Group Category</label>
            <select
              value={newGroupRole}
              onChange={(e) => setNewGroupRole(e.target.value)}
              className="w-full bg-canvas border border-border-hairline rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="Community Club">Resident Hobby / Social Club</option>
              <option value="Tower Floor Group">Wing / Floor Specific Group</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Kids & Parenting">Kids & Parenting</option>
              <option value="Emergency Watch">Security & Emergency Watch</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewGroupModalOpen(false)}
              className="flex-1 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold"
            >
              Create Group
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
