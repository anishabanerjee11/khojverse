
export type Category = 'Trending' | 'Hackathons' | 'Projects' | 'Research' | 'Articles' | 'Saved' | 'AI Lab' | 'Live Assistant';

export enum Popularity {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface IdeaItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  popularity: Popularity;
  views: number;
  tags: string[];
  theme?: string;
  organizer?: string;
  deadline?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  domain?: string;
  abstract?: string;
  author?: string;
  date?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
}

export interface Activity {
  id: string;
  type: 'post' | 'comment' | 'project' | 'achievement';
  content: string;
  time: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  date: string;
}

export interface User {
  name: string;
  username: string; // New
  email: string;
  avatar: string;
  coverImage?: string; // New
  bio?: string; // New
  phoneNumber?: string;

  // Academic
  institution?: string; // New
  course?: string; // New
  branch?: string; // New
  semester?: string; // New
  cgpa?: number; // New
  skills?: string[]; // New
  subjects?: string[]; // New

  // Social & Gamification
  followers?: number; // New
  following?: number; // New
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  level?: number; // New
  rank?: string; // New
  streak?: number; // New
  badges?: Achievement[]; // New

  // Content
  projects?: Project[]; // New
  recentActivity?: Activity[]; // New

  // Personal & Detailed
  dob?: string;
  gender?: string;
  location?: string;

  // Status
  status?: 'online' | 'busy' | 'studying' | 'offline';
  customStatusMessage?: string;

  // Preferences
  privacySettings?: {
    isPrivate: boolean;
    showContactInfo: boolean;
    showOnlineStatus: boolean;
  };

  themeColor?: string;

  interestedTopics?: string[];
  subscriptionStatus: 'Free' | 'Pro';
  credits: number;
}

export type SortOption = 'views' | 'new' | 'trending' | 'popularity';
