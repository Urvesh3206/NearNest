"use client";

import React from 'react';
import { CreatePost, PostCard, FeedFilters } from '@/features/feed';
import { Button } from '@/components/ui';

// Mock Data
const MOCK_POSTS = [
  {
    id: '1',
    author: { name: 'Sarah Jenkins', role: 'Resident', avatar: 'https://i.pravatar.cc/150?u=1' },
    content: 'Just discovered the new bakery down the street! Their croissants are amazing. Highly recommend to everyone in the neighborhood! 🥐✨',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    type: 'post'
  },
  {
    id: '2',
    author: { name: 'Greenwood Society HOA', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=2' },
    content: 'Reminder: Water maintenance scheduled for building B tomorrow from 10 AM to 2 PM. Please plan accordingly.',
    timestamp: '5 hours ago',
    likes: 45,
    comments: 12,
    type: 'announcement',
    images: ['https://images.unsplash.com/photo-1585728748176-455ac5eed962?w=800&auto=format&fit=crop']
  },
  {
    id: '3',
    author: { name: 'Mike Ross', role: 'Resident', avatar: 'https://i.pravatar.cc/150?u=3' },
    content: 'Anyone interested in a weekend cycling group? Thinking of doing the lake trail this Saturday.',
    timestamp: '1 day ago',
    likes: 18,
    comments: 8,
    type: 'event',
    eventDetails: { date: 'Oct 14, 2023', location: 'Crystal Lake Trail' }
  }
];

export default function FeedPage() {
  return (
    <div className="flex gap-6 w-full">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-3xl space-y-6">
        <CreatePost />
        <FeedFilters />
        
        <div className="space-y-6">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
        </div>

        <div className="py-4 flex justify-center">
          <Button variant="outline" className="rounded-full px-8">Load More</Button>
        </div>
      </div>

      {/* Right Sidebar (Hidden on smaller screens) */}
      <div className="hidden xl:block w-80 space-y-6">
        <div className="bg-surface rounded-2xl border border-border-hairline shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Trending Topics</h3>
          <ul className="space-y-3">
            {['#BlockParty2023', 'Lost Pets', 'Plumber Recommendations', 'New Park Rules'].map((topic, i) => (
              <li key={i} className="text-sm font-medium text-brand-600 hover:underline cursor-pointer">
                {topic}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-surface rounded-2xl border border-border-hairline shadow-card p-5">
          <h3 className="font-semibold text-text-primary mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center bg-brand-50 rounded-lg p-2 min-w-14 text-center">
                <span className="text-xs text-brand-600 font-semibold uppercase">Oct</span>
                <span className="text-lg font-bold text-brand-700">14</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Cycling Meetup</h4>
                <p className="text-xs text-text-secondary">Crystal Lake Trail</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center bg-brand-50 rounded-lg p-2 min-w-14 text-center">
                <span className="text-xs text-brand-600 font-semibold uppercase">Oct</span>
                <span className="text-lg font-bold text-brand-700">21</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">HOA Meeting</h4>
                <p className="text-xs text-text-secondary">Community Hall</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
