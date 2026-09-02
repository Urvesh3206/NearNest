"use client";

import { Star } from 'lucide-react';

const testimonials = [
  { quote: "NeighbourHub completely changed how we manage our society. Maintenance requests are handled in a breeze now.", author: "Sarah Jenkins", hood: "Greenfield Park", rating: 5 },
  { quote: "I found the best local plumber and a great dog walker within hours of moving in. Incredible app!", author: "Mike T.", hood: "Riverside Heights", rating: 5 },
  { quote: "The emergency SOS feature gives my family so much peace of mind. Every neighborhood should have this.", author: "Priya Patel", hood: "Maplewood West", rating: 5 },
  { quote: "As a local bakery owner, this platform helped me connect with hundreds of new customers right around the corner.", author: "David Kim", hood: "Sunnyvale", rating: 4 },
  { quote: "I love the community feed. It's like the old days of knowing your neighbors, but modernized.", author: "Emily R.", hood: "Oakland Estates", rating: 5 },
  { quote: "Finally, an app where I don't get lost in noise. Just relevant, local updates and friendly faces.", author: "James Wilson", hood: "Downtown Central", rating: 5 },
  { quote: "Organizing our block party was so easy this year thanks to the events feature. Highly recommend!", author: "Maria Garcia", hood: "Westside", rating: 5 },
  { quote: "The verification process ensures everyone is actually local. It feels incredibly safe and authentic.", author: "Alex Chen", hood: "North Hills", rating: 4 },
];

export function Testimonials() {
  return (
    <section className="py-24 overflow-hidden bg-canvas">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Loved by neighbors everywhere</h2>
        <p className="text-lg text-text-secondary">Don't just take our word for it.</p>
      </div>

      <div 
        className="relative w-full flex flex-col gap-6"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        {/* Row 1 - Left to Right */}
        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={`row1-${i}`} className="w-[350px] md:w-[400px] p-6 rounded-2xl bg-surface border border-border-hairline shadow-sm flex-shrink-0">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-text-primary mb-6 text-lg leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-brand-600">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{t.author}</p>
                  <p className="text-xs text-text-tertiary">{t.hood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex gap-6 w-max animate-marquee-reverse hover:[animation-play-state:paused] -ml-20">
          {[...[...testimonials].reverse(), ...testimonials].map((t, i) => (
            <div key={`row2-${i}`} className="w-[350px] md:w-[400px] p-6 rounded-2xl bg-surface border border-border-hairline shadow-sm flex-shrink-0">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-text-primary mb-6 text-lg leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-brand-600">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{t.author}</p>
                  <p className="text-xs text-text-tertiary">{t.hood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
