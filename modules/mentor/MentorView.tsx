'use client';

import React, { useState } from 'react';
import { Search, Star, MessageSquare, Calendar, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MentorItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  expertise: string[];
  rating: number;
  reviews: number;
  available: boolean;
}

export const MentorView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const MOCK_MENTORS: MentorItem[] = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      role: 'Staff Software Engineer',
      company: 'Stripe',
      avatar: 'SJ',
      bio: 'Ex-Google. Specialises in cloud microservices, database design, and tech interview prep.',
      expertise: ['System Design', 'Cloud Architecture', 'Distributed Systems'],
      rating: 4.9,
      reviews: 42,
      available: true,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Product Design Lead',
      company: 'Airbnb',
      avatar: 'PS',
      bio: 'Crafting premium user interfaces for 8+ years. Passionate about helping women build design portfolios.',
      expertise: ['UI/UX Design', 'Design Systems', 'Product Strategy'],
      rating: 4.8,
      reviews: 31,
      available: true,
    },
    {
      id: '3',
      name: 'Elena Rostova',
      role: 'AI Research Director',
      company: 'OpenAI',
      avatar: 'ER',
      bio: 'Specialist in transformer models and reinforcement learning. Advises on machine learning tracks.',
      expertise: ['Deep Learning', 'LLMs', 'Career Transition'],
      rating: 5.0,
      reviews: 19,
      available: false,
    },
  ];

  const handleBook = (name: string) => {
    setBookingSuccess(name);
    setTimeout(() => {
      setBookingSuccess(null);
    }, 3000);
  };

  const filteredMentors = MOCK_MENTORS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 select-none animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">1:1 Mentorship Hub</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Connect with vetted female leaders in tech for mock interviews, portfolio reviews, and career guidance.
        </p>
      </div>

      {/* Alert Banner */}
      {bookingSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-white font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Session request sent to <strong className="text-emerald-400">{bookingSuccess}</strong>! Confirmation email will arrive shortly.</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 border-b border-border/60 pb-5">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mentors by name, company or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card/60 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-hidden focus:border-primary/60 transition-colors"
          />
        </div>
      </div>

      {/* Grid of mentors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((m) => (
          <div 
            key={m.id}
            className="rounded-xl border border-border bg-card/45 backdrop-blur-xl p-6 flex flex-col justify-between gap-5 relative hover:border-primary/30 transition-all duration-300"
          >
            {/* Header info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-sm font-bold text-white uppercase shrink-0 shadow-md">
                  {m.avatar}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mt-1 leading-snug">{m.name}</h3>
                  <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{m.role} at {m.company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                <Star className="h-3.5 w-3.5 fill-yellow-500 stroke-yellow-500 shrink-0" />
                <span className="text-white font-medium">{m.rating}</span>
                <span>({m.reviews} reviews)</span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {m.bio}
              </p>

              <div className="flex flex-wrap gap-1 mt-1">
                {m.expertise.map((exp) => (
                  <span key={exp} className="px-2.5 py-0.5 rounded bg-muted/40 border border-border/40 text-[9px] text-muted-foreground">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-2.5 border-t border-border/60 pt-4">
              <button className="flex-1 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 border border-border text-[11px] font-semibold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </button>
              <button 
                onClick={() => handleBook(m.name)}
                disabled={!m.available}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[11px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md",
                  m.available
                    ? "bg-primary hover:opacity-95 shadow-primary/10"
                    : "bg-muted/20 border border-border text-muted-foreground cursor-not-allowed"
                )}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{m.available ? 'Book Session' : 'Fully Booked'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
export default MentorView;
