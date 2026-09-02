"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/ui';
import { m, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  data: any;
}

export function PostCard({ data }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(data.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-hairline shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={data.author.avatar} name={data.author.name} className="h-10 w-10" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary text-sm">{data.author.name}</h3>
              {data.author.role === 'Admin' && (
                <Badge variant="secondary" className="bg-brand-100 text-brand-700 text-[10px] px-1.5 py-0">Admin</Badge>
              )}
            </div>
            <p className="text-xs text-text-tertiary">{data.timestamp} • {data.author.role}</p>
          </div>
        </div>
        <button className="text-text-secondary hover:bg-surface-subtle p-1.5 rounded-full transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-text-secondary whitespace-pre-wrap text-sm leading-relaxed">{data.content}</p>
        
        {data.eventDetails && (
          <div className="mt-4 p-4 rounded-xl border border-border-hairline bg-surface-subtle flex items-center justify-between">
            <div>
              <p className="font-semibold text-text-primary text-sm flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-brand-500"/> {data.eventDetails.date}</p>
              <p className="text-xs text-text-secondary flex items-center gap-2 mt-1"><MapPin className="h-4 w-4 text-text-tertiary"/> {data.eventDetails.location}</p>
            </div>
            <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg">RSVP</Button>
          </div>
        )}
      </div>

      {/* Images (if any) */}
      {data.images && data.images.length > 0 && (
        <div className="px-5 pb-4">
          <div className="relative h-64 w-full rounded-xl overflow-hidden">
            <img src={data.images[0]} alt="Post media" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-text-tertiary border-b border-border-hairline">
        <div className="flex items-center gap-1">
          <div className="bg-brand-500 rounded-full p-1"><Heart className="h-2 w-2 text-white fill-current" /></div>
          <span>{likesCount}</span>
        </div>
        <div>
          <span>{data.comments} comments</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center justify-between">
        <div className="flex">
          <Button 
            variant="ghost" 
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${liked ? 'text-coral-500 hover:text-coral-600 hover:bg-coral-50' : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'}`}
            onClick={handleLike}
          >
            <m.div animate={liked ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </m.div>
            Like
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>
        
        <Button variant="ghost" className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-subtle">
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>

      {/* Simple comments mockup area if expanded */}
      {showComments && (
        <div className="px-5 pb-5 pt-2 border-t border-border-hairline bg-surface-subtle">
          <div className="flex gap-3 items-center mt-2">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name={data.author.name} className="h-8 w-8" />
            <div className="flex-1 bg-surface border border-border-hairline rounded-full px-4 py-2 flex items-center">
              <input type="text" placeholder="Write a comment..." className="w-full bg-transparent border-none focus:ring-0 text-sm p-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
