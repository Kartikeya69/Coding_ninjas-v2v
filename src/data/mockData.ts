import { Opportunity, Job, Mentor, Goal, Notification } from "../types";

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Google Generation Scholarship (Asia Pacific)",
    description: "Supporting computer science students who excel in technology and demonstrate leadership, with a strong focus on diversity and women in tech.",
    provider: "Google",
    category: "Scholarships",
    amount: "$2,500 USD",
    deadline: "2026-08-15",
    link: "https://buildyourfuture.withgoogle.com/scholarships",
    eligibilityCriteria: [
      "Currently enrolled in a full-time Bachelor's degree in CS or related field",
      "Academic year: 2nd or 3rd year undergraduate",
      "Demonstrate a strong passion for tech and diversity"
    ],
    matchScore: 95,
    urgencyScore: 85,
    recommendationReason: "Aligned perfectly with your Education level (B.Tech 2nd Year) and career goal to become a Software Engineer."
  },
  {
    id: "opp-2",
    title: "Thiel Fellowship 2026",
    description: "Two-year program for young people who want to build new things rather than sit in a classroom. Founded by Peter Thiel.",
    provider: "Thiel Foundation",
    category: "Fellowships",
    amount: "$100,000 USD",
    deadline: "2026-10-01",
    link: "https://thielfellowship.org",
    eligibilityCriteria: [
      "Under the age of 23",
      "Drop out of college or delay college to build a startup",
      "Working on a high-impact innovative technology idea"
    ],
    matchScore: 88,
    urgencyScore: 30,
    recommendationReason: "Matches your startup interest in DeepTech/AI and age eligibility."
  },
  {
    id: "opp-3",
    title: "AWS GenAI Accelerator for Women Founders",
    description: "An intensive equity-free startup program designed to supercharge women-led startups building with Generative AI on AWS.",
    provider: "Amazon Web Services",
    category: "Grants",
    amount: "$100,000 AWS Credits",
    deadline: "2026-07-25",
    link: "https://aws.amazon.com/startups",
    eligibilityCriteria: [
      "Woman-led startup or female co-founder",
      "Generative AI tech stack",
      "Pre-seed or Seed funded"
    ],
    matchScore: 92,
    urgencyScore: 95,
    recommendationReason: "Perfect match! Direct support for female entrepreneurs working with Generative AI solutions."
  },
  {
    id: "opp-4",
    title: "Microsoft Imagine Cup Global Hackathon",
    description: "The premier global student technology competition. Bring your technology solutions to life with AI on Microsoft Azure.",
    provider: "Microsoft",
    category: "Hackathons",
    amount: "$100,000 USD + Mentorship",
    deadline: "2026-09-10",
    link: "https://imaginecup.microsoft.com",
    eligibilityCriteria: [
      "Students aged 16 or older",
      "Teams of up to 4 students",
      "Leverage Microsoft Azure services"
    ],
    matchScore: 90,
    urgencyScore: 60,
    recommendationReason: "Combines your passion for Hackathons and AI/Cloud integration."
  },
  {
    id: "opp-5",
    title: "CERN Summer Student Fellowship Program",
    description: "Opportunity to join CERN's advanced research teams in Geneva, working on cutting-edge experimental physics, data science, and engineering.",
    provider: "CERN",
    category: "Research Programs",
    amount: "Paid Stipend + Travel + Accommodation",
    deadline: "2026-11-15",
    link: "https://careers.cern/summer",
    eligibilityCriteria: [
      "Undergraduate or master student in Physics, Engineering, or Computer Science",
      "Completed at least 3 years of university-level studies"
    ],
    matchScore: 82,
    urgencyScore: 10,
    recommendationReason: "Strong fit for your interest in scientific research and distributed systems."
  },
  {
    id: "opp-6",
    title: "Harvard-Amgen Scholars Program",
    description: "Undergraduate summer research program in biotechnology and sciences. Gain intensive laboratory research experience under top Harvard faculty.",
    provider: "Amgen Foundation",
    category: "Research Programs",
    amount: "$5,000 Stipend + Travel",
    deadline: "2026-08-01",
    link: "https://amgenscholars.com",
    eligibilityCriteria: [
      "Undergraduate students worldwide",
      "GPA equivalent of 3.2 or higher",
      "Interest in bio-tech or computational sciences"
    ],
    matchScore: 85,
    urgencyScore: 78,
    recommendationReason: "Matches your bioinformatics and data analysis background."
  },
  {
    id: "opp-7",
    title: "Y Combinator W2027 Funding Cycle",
    description: "Invests $500,000 in early-stage startups twice a year. High-intensity program in San Francisco.",
    provider: "Y Combinator",
    category: "Grants",
    amount: "$500,000 USD Equity Investment",
    deadline: "2026-09-30",
    link: "https://ycombinator.com",
    eligibilityCriteria: [
      "Any team working on a scalable technological idea",
      "Willingness to relocate to San Francisco for 3 months"
    ],
    matchScore: 86,
    urgencyScore: 50,
    recommendationReason: "Strongly recommended as your startup validator shows high scalability potential."
  },
  {
    id: "opp-8",
    title: "DAAD Germany Study Scholarships",
    description: "Fully funded master's program studies in any public German university for outstanding international graduates.",
    provider: "DAAD German Academic Exchange Service",
    category: "Exchange Programs",
    amount: "Fully Funded Tuition + €934/month + Insurance",
    deadline: "2026-10-15",
    link: "https://www.daad.de",
    eligibilityCriteria: [
      "Bachelor's degree completed within the last 6 years",
      "Excellent academic record",
      "IELTS or German language proficiency"
    ],
    matchScore: 80,
    urgencyScore: 25,
    recommendationReason: "For your goal to study overseas and gain global perspective."
  }
];

export const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Generative AI Engineering Intern",
    company: "OpenAI",
    description: "Work alongside world-class researchers to deploy models, optimize latency, and build the future of agentic applications. Experienced in Python, TypeScript, and vector search techniques.",
    location: "San Francisco, CA (Remote Friendly)",
    salary: "$45 - $65 / hour",
    type: "Internship",
    remote: true,
    salaryInsights: "Top tier intern compensation for GenAI roles, average $9,000/month.",
    provider: "JSearch",
    link: "https://openai.com/careers",
    matchScore: 96
  },
  {
    id: "job-2",
    title: "Junior Backend Developer",
    company: "Stripe",
    description: "Join the core billing infrastructure team. Write high-quality, robust API-driven code in Ruby and Go. Focus on reliability, transaction consistency, and security.",
    location: "Seattle, WA (Hybrid)",
    salary: "$115,000 - $145,000 / year",
    type: "Full-time",
    remote: false,
    salaryInsights: "Standard competitive junior package. Includes sign-on bonus and stock options.",
    provider: "Greenhouse",
    link: "https://stripe.com/careers",
    matchScore: 89
  },
  {
    id: "job-3",
    title: "React Frontend Engineer",
    company: "Vercel",
    description: "Craft modern user interfaces using Next.js and TailwindCSS. Optimize rendering pathways, implement fluid framer motion interactions, and elevate dashboard UX.",
    location: "Remote (Global)",
    salary: "$90,000 - $120,000 / year",
    type: "Full-time",
    remote: true,
    salaryInsights: "Remote equity-matched pay. Excellent work-life balance and high team impact.",
    provider: "Arbeitnow",
    link: "https://vercel.com/careers",
    matchScore: 91
  },
  {
    id: "job-4",
    title: "Research Scientist Intern - Machine Learning",
    company: "Google DeepMind",
    description: "Investigate novel transformer topologies and reinforcement learning models. Apply ideas directly to state-of-the-art multimodal foundations.",
    location: "London, UK (Office-based)",
    salary: "£4,500 / month",
    type: "Internship",
    remote: false,
    salaryInsights: "Research-specific stipend. High-profile networking opportunity with leading scientists.",
    provider: "Adzuna",
    link: "https://deepmind.google/careers",
    matchScore: 85
  }
];

export const mockMentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Dr. Anjali Mehta",
    title: "Lead AI Scientist",
    company: "Google DeepMind",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop",
    expertise: ["Generative AI", "NLP", "Career Roadmaps", "PhD Mentorship"],
    rating: 4.9,
    bio: "Ex-Stanford Researcher, dedicated to supporting women in Tech and AI fields. Mentored over 50+ students in landing competitive AI research roles.",
    availability: ["Monday 4:00 PM - 5:00 PM (IST)", "Thursday 10:00 AM - 11:30 AM (IST)"]
  },
  {
    id: "mentor-2",
    name: "Marcus Vance",
    title: "Managing Director",
    company: "Apex Ventures",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&fit=crop",
    expertise: ["Pitch Decks", "Seed Funding", "SaaS Startups", "Idea Validation"],
    rating: 4.8,
    bio: "Tech entrepreneur turned venture capitalist. Led 30+ pre-seed rounds in AI, cloud orchestration, and developer tooling startups.",
    availability: ["Wednesday 2:00 PM - 3:00 PM (PST)", "Friday 4:00 PM - 5:00 PM (PST)"]
  },
  {
    id: "mentor-3",
    name: "Tanya Roberts",
    title: "Senior Product Designer",
    company: "Linear",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop",
    expertise: ["UI/UX Design", "Figma", "Design Systems", "Portfolio Review"],
    rating: 5.0,
    bio: "Obsessed with details, beautiful micro-interactions, and visual craftsmanship. Helping developers think like high-end visual designers.",
    availability: ["Tuesday 9:00 AM - 10:30 AM (EST)", "Thursday 5:00 PM - 6:00 PM (EST)"]
  }
];

export const defaultGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Flesh out Lumina AI Startup Canvas",
    description: "Draft problem statement, unique value proposition, and customer acquisition channels.",
    category: "Weekly Action",
    targetDate: "2026-07-15",
    completed: false,
    progress: 30
  },
  {
    id: "goal-2",
    title: "Optimize resume for AI Engineer role",
    description: "Submit resume text to Career Copilot and integrate critical Generative AI keywords.",
    category: "Skill Gap",
    targetDate: "2026-07-20",
    completed: false,
    progress: 0
  },
  {
    id: "goal-3",
    title: "Complete 1 Mock Interview session",
    description: "Launch the Copilot Mock Interview chat and practice answering technical behavioral questions.",
    category: "Study Plan",
    targetDate: "2026-07-22",
    completed: false,
    progress: 0
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Urgent Deadline Alert",
    content: "AWS GenAI Accelerator application closes in 15 days! Complete your pitch deck using our Startup Incubator.",
    type: "Deadline",
    read: false,
    timestamp: "2 hours ago"
  },
  {
    id: "notif-2",
    title: "High Opportunity Match Found",
    content: "Based on your interest in computer science, you match 95% of the Google Generation Scholarship guidelines.",
    type: "Match",
    read: false,
    timestamp: "1 day ago"
  },
  {
    id: "notif-3",
    title: "Mentor Session Scheduled",
    content: "Your booking with Dr. Anjali Mehta has been confirmed for Monday, July 13th at 4:00 PM.",
    type: "Booking",
    read: true,
    timestamp: "2 days ago"
  }
];
