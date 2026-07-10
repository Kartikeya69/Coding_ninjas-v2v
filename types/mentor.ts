export interface MentorProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  company: string;
  role: string;
  bio: string;
  expertise: string[];
  skillsToShare: string[];
  availability: {
    days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    slots: string[]; // E.g., ["14:00 - 15:00"]
  };
  rating: number;
  reviewCount: number;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  userId: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  dateTime: string;
  durationMinutes: number;
  meetingLink?: string;
  topic: string;
  notes?: string;
  createdAt: string;
}

export interface MentorChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: string;
}
