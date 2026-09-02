"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Video, Calendar, BarChart3, X, Globe, Building2 } from 'lucide-react';
import { Avatar, Button, Textarea, Modal } from '@/components/ui';

export function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  return (
    <>
      <div className="bg-surface rounded-2xl border border-border-hairline shadow-card p-4">
        <div className="flex gap-3 items-center">
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="ME" />
          <div 
            className="flex-1 bg-surface-subtle hover:bg-surface-subtle/80 transition-colors rounded-full px-4 py-3 text-text-tertiary cursor-text border border-transparent hover:border-border-hairline"
            onClick={() => setIsOpen(true)}
          >
            What's on your mind?
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-hairline">
          <div className="flex gap-1 sm:gap-2">
            <Button variant="ghost" className="text-text-secondary hover:text-brand-600 hover:bg-brand-50 px-3 h-9 rounded-full" onClick={() => setIsOpen(true)}>
              <ImageIcon className="h-4 w-4 mr-2 text-brand-500" /> Photo
            </Button>
            <Button variant="ghost" className="text-text-secondary hover:text-brand-600 hover:bg-brand-50 px-3 h-9 rounded-full hidden sm:flex" onClick={() => setIsOpen(true)}>
              <Video className="h-4 w-4 mr-2 text-coral-500" /> Video
            </Button>
            <Button variant="ghost" className="text-text-secondary hover:text-brand-600 hover:bg-brand-50 px-3 h-9 rounded-full" onClick={() => setIsOpen(true)}>
              <Calendar className="h-4 w-4 mr-2 text-accent-500" /> Event
            </Button>
            <Button variant="ghost" className="text-text-secondary hover:text-brand-600 hover:bg-brand-50 px-3 h-9 rounded-full hidden md:flex" onClick={() => setIsOpen(true)}>
              <BarChart3 className="h-4 w-4 mr-2 text-blue-500" /> Poll
            </Button>
          </div>
          <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-5" onClick={() => setIsOpen(true)}>
            Post
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl w-full max-w-lg shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border-hairline flex justify-between items-center bg-surface">
              <h2 className="text-lg font-bold text-text-primary">Create Post</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-surface-subtle text-text-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="You" />
                <div>
                  <p className="font-semibold text-sm text-text-primary">John Doe</p>
                  <button className="flex items-center text-xs bg-surface-subtle border border-border-hairline rounded-md px-2 py-1 mt-0.5 text-text-secondary font-medium">
                    <Globe className="h-3 w-3 mr-1" /> Public
                  </button>
                </div>
              </div>

              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full border-none shadow-none resize-none focus:ring-0 p-0 text-lg text-text-primary min-h-[150px]"
              />
            </div>

            <div className="p-4 border-t border-border-hairline bg-surface">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"><ImageIcon className="h-5 w-5" /></button>
                  <button className="p-2 text-coral-600 hover:bg-coral-50 rounded-full transition-colors"><Video className="h-5 w-5" /></button>
                  <button className="p-2 text-accent-600 hover:bg-accent-50 rounded-full transition-colors"><Calendar className="h-5 w-5" /></button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><BarChart3 className="h-5 w-5" /></button>
                </div>
                <Button 
                  className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-6"
                  disabled={!content.trim()}
                  onClick={() => setIsOpen(false)}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
