"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, AlertTriangle, Building, Wrench, Search, MapPin, Loader2, X } from 'lucide-react';
import { Button, Input, Card, Avatar, Badge } from '@/components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
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
    content: "Hi! I'm NeighbourBot, your neighborhood AI concierge. How can I help you today? You can ask me about local services, community notices, society rules, or anything else about the neighborhood.",
    timestamp: new Date()
  }
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAIResponse = (prompt: string) => {
    setIsTyping(true);
    let responseText = "I can help with that. ";
    let metadata: any = null;

    if (prompt.includes('plumber')) {
      responseText = "Here are the top-rated plumbers in the neighborhood based on community reviews:";
      metadata = {
        type: 'business_list',
        items: [
          { name: "FixIt Plumbing Services", rating: 4.9, distance: "0.5 miles", phone: "555-0101" },
          { name: "Joe's Pipes & Drains", rating: 4.7, distance: "1.2 miles", phone: "555-0102" }
        ]
      };
    } else if (prompt.includes('power cuts')) {
      responseText = "Yes, there is a scheduled maintenance notice from the Electricity Board.";
      metadata = {
        type: 'notice',
        title: "Power Outage - Sector 4",
        date: "Tomorrow, 2:00 PM - 5:00 PM",
        severity: "High"
      };
    } else if (prompt.includes('restaurants')) {
       responseText = "Today's special offers from local restaurants:";
       metadata = {
         type: 'business_list',
         items: [
           { name: "Spice Route", rating: 4.8, distance: "0.3 miles", offer: "20% off on dine-in" },
           { name: "The Burger Joint", rating: 4.5, distance: "0.8 miles", offer: "Free fries with meals" }
         ]
       }
    } else if (prompt.includes('meeting')) {
      responseText = "Here is a summary of the latest society meeting minutes:\n\n*   **Maintenance Fees**: Agreed to keep fees unchanged for the next quarter.\n*   **Security**: Approved budget for new CCTV cameras at the main gate.\n*   **Community Events**: The annual summer fair is scheduled for next month. Volunteers needed.";
    } else if (prompt.includes('pet')) {
      responseText = "Here is a draft for your lost pet announcement:\n\n**LOST PET ALERT!**\n\nI have lost my dog near [Location]. He is a [Breed], wearing a [Color] collar. He answers to the name [Name]. If you have seen him, please contact me immediately at [Your Phone Number]. Thank you!";
    } else {
      responseText = "That sounds interesting! Let me check the neighborhood hub for more details on '" + prompt + "'. I am still learning, but I'll do my best to provide accurate information based on community data.";
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          metadata
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;
    
    const newUserMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    simulateAIResponse(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.role === 'user') {
      return <p className="text-white whitespace-pre-wrap">{msg.content}</p>;
    }

    // Simple markdown renderer for bold and lists
    const formattedContent = msg.content
      .split('\n')
      .map((line, i) => {
        let formattedLine = line;
        // Bold
        const boldRegex = /\*\*(.*?)\*\*/g;
        if (boldRegex.test(line)) {
          const parts = line.split(boldRegex);
          return (
            <p key={i} className="mb-2 last:mb-0">
              {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part)}
            </p>
          );
        }
        if (line.startsWith('* ')) {
          return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
        }
        return <p key={i} className="mb-2 last:mb-0">{line}</p>;
      });

    return (
      <div className="text-text-primary">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {formattedContent}
        </div>
        
        {msg.metadata?.type === 'business_list' && (
          <div className="mt-4 space-y-3">
            {msg.metadata.items.map((item: any, idx: number) => (
              <div key={idx} className="bg-surface border border-border-hairline rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{item.name}</div>
                  <div className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                    <span className="flex items-center text-yellow-500"><Sparkles className="w-3 h-3 mr-1"/> {item.rating}</span>
                    <span>•</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {item.distance}</span>
                  </div>
                  {item.offer && (
                    <div className="text-sm text-brand-600 mt-1 font-medium">{item.offer}</div>
                  )}
                </div>
                {item.phone && (
                  <Button variant="outline" size="sm">Call</Button>
                )}
              </div>
            ))}
          </div>
        )}

        {msg.metadata?.type === 'notice' && (
          <div className="mt-4">
            <div className="bg-coral-50 border border-coral-200 dark:bg-coral-950/30 dark:border-coral-900 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-coral-500 w-5 h-5" />
                  <h4 className="font-semibold text-coral-900 dark:text-coral-100">{msg.metadata.title}</h4>
                </div>
                <Badge variant="danger">{msg.metadata.severity}</Badge>
              </div>
              <p className="mt-2 text-sm text-coral-800 dark:text-coral-200">{msg.metadata.date}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col bg-surface rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border-hairline flex items-center justify-between bg-surface-subtle">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 p-2 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-text-primary">NeighbourBot</h1>
            <p className="text-xs text-text-secondary">AI Neighborhood Concierge</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <Avatar name="User" className="w-8 h-8" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-surface-subtle border border-border-hairline rounded-tl-sm'}`}>
                {renderMessageContent(msg)}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-hairline rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
                <span className="text-sm text-text-secondary">NeighbourBot is typing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-hairline bg-surface">
        {messages.length < 3 && (
          <div className="mb-4 hidden md:flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSendMessage(prompt.text)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-surface-subtle hover:bg-surface-glass border border-border-hairline rounded-full text-text-secondary hover:text-text-primary transition-colors"
              >
                <prompt.icon className="w-3.5 h-3.5 text-brand-500" />
                {prompt.text}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end relative">
          <div className="flex-1">
            <textarea
              className="w-full bg-surface-subtle border border-border-hairline rounded-2xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none min-h-[52px] max-h-32"
              placeholder="Ask me anything about the neighborhood..."
              rows={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            className="rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 bg-brand-600 hover:bg-brand-700" 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
