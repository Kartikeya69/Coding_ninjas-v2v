export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  durationEstimate: string; // E.g., "2 weeks"
  status: 'pending' | 'in_progress' | 'completed';
  resources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'book';
  }[];
}

export interface RoadmapStage {
  id: string;
  phaseName: string; // E.g., "Phase 1: Fundamentals"
  completed: boolean;
  milestones: RoadmapMilestone[];
}

export interface CareerRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  industry: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  overallProgress: number; // Percentage 0-100
  stages: RoadmapStage[];
  createdAt: string;
  updatedAt: string;
}
