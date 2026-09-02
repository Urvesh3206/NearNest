"use client";

import React, { useState } from 'react';
import { Heart, Reply } from 'lucide-react';
import { Avatar, Button, Input } from '@/components/ui';

// Mock data
const MOCK_COMMENTS = [
  {
    id: 1,
    author: { name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?u=a04258' },
    content: 'This is amazing! I will definitely join you next time.',
    timestamp: '2h ago',
    likes: 4,
    replies: [
      {
        id: 11,
        author: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f' },
        content: 'Awesome, looking forward to it!',
        timestamp: '1h ago',
        likes: 1,
      }
    ]
  },
  {
    id: 2,
    author: { name: 'David Smith', avatar: 'https://i.pravatar.cc/150?u=b04258' },
    content: 'Is there a sign up sheet?',
    timestamp: '5h ago',
    likes: 0,
    replies: []
  }
];

export function CommentSection() {
  const [expanded, setExpanded] = useState(false);
  
  if (!expanded) {
    return (
      <div className="px-5 pb-5">
        <button 
          onClick={() => setExpanded(true)}
          className="text-sm font-medium text-text-tertiary hover:text-text-secondary transition-colors"
        >
          View all 12 comments
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 pt-2 border-t border-border-hairline bg-surface-subtle">
      <div className="space-y-4 mb-4">
        {MOCK_COMMENTS.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex gap-3">
              <Avatar src={comment.author.avatar} name={comment.author.name} className="h-8 w-8 mt-1" />
              <div className="flex-1">
                <div className="bg-surface border border-border-hairline p-3 rounded-2xl rounded-tl-sm shadow-sm inline-block w-full">
                  <h4 className="text-sm font-semibold text-text-primary">{comment.author.name}</h4>
                  <p className="text-sm text-text-secondary mt-0.5">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-2 text-xs text-text-tertiary font-medium">
                  <span>{comment.timestamp}</span>
                  <button className="hover:text-text-primary flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {comment.likes > 0 && comment.likes}
                  </button>
                  <button className="hover:text-text-primary flex items-center gap-1">
                    <Reply className="h-3 w-3" /> Reply
                  </button>
                </div>
              </div>
            </div>
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-11 space-y-3 mt-2">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex gap-3">
                    <Avatar src={reply.author.avatar} name={reply.author.name} className="h-6 w-6 mt-1" />
                    <div className="flex-1">
                      <div className="bg-surface border border-border-hairline p-2.5 rounded-2xl rounded-tl-sm shadow-sm inline-block w-full">
                        <h4 className="text-xs font-semibold text-text-primary">{reply.author.name}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">{reply.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-2 text-[10px] text-text-tertiary font-medium">
                        <span>{reply.timestamp}</span>
                        <button className="hover:text-text-primary flex items-center gap-1">
                          <Heart className="h-3 w-3" /> {reply.likes > 0 && reply.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 items-center mt-4">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" name="You" className="h-8 w-8" />
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Write a comment..." 
            className="flex-1 rounded-full bg-surface"
          />
          <Button size="sm" className="rounded-full px-4 bg-brand-600 hover:bg-brand-700 text-white">Post</Button>
        </div>
      </div>
    </div>
  );
}
