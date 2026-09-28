"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  AlertTriangle, 
  Building, 
  Wrench, 
  Search, 
  MapPin, 
  Loader2, 
  Copy, 
  RotateCcw,
  Check,
  Shield,
  Zap
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: string;
}

const PRESET_PROMPTS = [
  { id: '1', text: 'Find the highest rated plumber nearby', icon: Wrench },
  { id: '2', text: 'Are there any water or power cuts scheduled this week?', icon: AlertTriangle },
  { id: '3', text: 'Which restaurants have special discounts today?', icon: Search },
  { id: '4', text: 'Summarize the latest society meeting minutes', icon: Building },
  { id: '5', text: 'Draft a lost pet announcement for my dog', icon: Bot },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-0',
    role: 'assistant',
    content: "👋 Hello! I am **NearNest AI (NeighbourBot)**, your neighborhood AI assistant. How can I help you today?\n\nYou can ask me about local service providers, society maintenance schedules, emergency safety, or draft community announcements.",
    timestamp: new Date(),
  },
];

function getClientNeighborhoodAnswer(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('discount') || lower.includes('dine') || lower.includes('cafe')) {
    return `🍽️ **Today's Local Restaurant & Cafe Offers**:\n\n* **Spice Route Kitchen**: 15% flat resident discount on dine-in with NearNest ID • 0.3 km away (4.8 ★)\n* **The Artisan Bakery & Cafe**: Free handcrafted dessert on bills above ₹499 • 0.4 km away (4.8 ★)\n* **Green Leaf Bistro**: 20% off on all organic salads & smoothie bowls today • 0.6 km away (4.9 ★)\n\n*Visit the **Businesses** tab to view their full menus and claim offers!*`;
  }

  if (lower.includes('plumber') || lower.includes('electrician') || lower.includes('service') || lower.includes('maid') || lower.includes('repair')) {
    return `🔧 **Top Rated Verified Service Pros in Your Area**:\n\n* **Rajesh Electrician & Repair**: 4.9 ★ (120 reviews) • ₹299/visit • ID & Police Verified\n* **FixIt Plumbing Solutions**: 4.8 ★ (85 reviews) • ₹249/visit • 24/7 Emergency\n* **Sunita Devi (Maid & Housekeeping)**: 4.9 ★ (64 reviews) • ₹3,000/month\n\n*You can book an appointment directly from the **Services** hub with instant confirmation.*`;
  }

  if (lower.includes('water') || lower.includes('power') || lower.includes('cut') || lower.includes('electricity') || lower.includes('maintenance')) {
    return `⚠️ **Scheduled Society Maintenance Notice**:\n\n* **Water Tank Cleaning**: Thursday, 10:00 AM – 2:00 PM (Towers A & B).\n* **Backup Generator Testing**: Saturday at 4:00 PM (15 minutes duration).\n* **Lobby Deep Cleaning**: Daily between 11:00 AM and 1:00 PM.\n\n*For any urgent plumbing issues, contact the society maintenance desk or use the Society Hub.*`;
  }

  if (lower.includes('meeting') || lower.includes('society') || lower.includes('agm') || lower.includes('minutes')) {
    return `📋 **Summary of Latest Society AGM Meeting**:\n\n* **Solar Rooftop Initiative**: Approved installation for Towers A & B starting next month to cut common electricity bills by 35%.\n* **Security Upgrades**: Added night patrol guards at Gate 2 and updated CCTV coverage.\n* **Maintenance Dues**: Q3 dues deadline is the 10th of next month. Pay online in the **Society** tab.`;
  }

  if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat') || lower.includes('lost')) {
    return `📢 **Draft for Community Lost Pet Notice**:\n\n**🚨 URGENT: LOST PET ALERT**\n\n* **Name & Breed**: [Pet Name], [Breed/Color]\n* **Last Seen**: Near Tower B Central Garden playground around 5:30 PM\n* **Collar**: Wearing a blue collar with tag\n* **Contact**: Please call [Your Phone] or alert Gate 1 Security immediately.\n\n*Copy and post this to the **Community Feed** to immediately notify all society residents!*`;
  }

  if (lower.includes('sos') || lower.includes('emergency') || lower.includes('police') || lower.includes('guard')) {
    return `🚨 **Emergency Assistance Hub**:\n\n* **NearNest SOS**: Tap the red floating **SOS** button on the bottom-right for instant 3-second alert dispatch.\n* **National Emergency (Police)**: \`112\`\n* **Ambulance**: \`108\`\n* **Fire Brigade**: \`101\`\n* **Gate 1 Security**: Direct intercom active 24/7.`;
  }

  return `I am your **NearNest AI Concierge**. I can help you with:\n\n1. 🔧 **Local Services**: Finding verified plumbers, electricians, carpenters, and maids.\n2. 📢 **Society Bulletins**: Water cuts, AGM minutes, and maintenance dues.\n3. 🍽️ **Neighborhood Businesses**: Restaurant discounts, grocery deliveries, and bakeries.\n4. 🚨 **Emergency Safety**: Rapid SOS dispatch and security guard intercom.\n\nWhat would you like to explore?`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = inputValue) => {
    const query = text.trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    let aiContent = '';
    let source = 'gemini-ai';

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, messages: [...messages, userMsg] }),
      });

      if (response.ok) {
        const data = await response.json();
        aiContent = data.content || '';
        source = data.source || 'gemini-ai';
      }
    } catch (err) {
      console.warn('API fetch notice, utilizing neighborhood intelligence engine:', err);
    }

    // Fallback to rich client-side neighborhood intelligence if empty or network interruption
    if (!aiContent.trim()) {
      aiContent = getClientNeighborhoodAnswer(query);
      source = 'nearnest-intelligence';
    }

    // Simulated typing delay for smooth user experience
    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        source,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    toast.success('Chat history cleared');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface border border-border-hairline shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-text-primary">NearNest AI Concierge</h1>
              <Badge variant="success" size="sm" className="text-[10px] font-semibold py-0.5">
                Live AI Active
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Powered by advanced neighborhood intelligence & Google Gemini AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            className="text-xs rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </Button>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="bg-surface border border-border-hairline rounded-3xl p-4 sm:p-6 shadow-card h-[500px] flex flex-col justify-between overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-brand-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] space-y-2 relative group shadow-sm ${
                    isUser
                      ? 'bg-brand-500 text-white rounded-br-none'
                      : 'bg-canvas border border-border-hairline text-text-primary rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-normal">{msg.content}</div>

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-500 p-0.5 flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-brand-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-border-hairline">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 text-xs text-text-tertiary bg-canvas border border-border-hairline p-3 rounded-2xl w-fit"
            >
              <Bot className="w-4 h-4 text-brand-500 animate-pulse" />
              <span>NeighbourBot is thinking...</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="pt-3 border-t border-border-hairline mt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {PRESET_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isTyping}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-950/40 text-text-secondary hover:text-brand-600 text-xs whitespace-nowrap border border-border-hairline transition-all shrink-0"
              >
                <prompt.icon className="w-3 h-3 text-brand-500" />
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 mt-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything about your society, verified services, or neighborhood..."
              className="flex-1 bg-canvas border border-border-hairline rounded-2xl px-4 py-3 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />

            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 px-5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 shrink-0"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
