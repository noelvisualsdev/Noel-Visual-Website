export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Editing' | 'Thumbnails' | 'Graphic Design' | 'Brand Identity' | 'VFX';
  client: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  views?: string;
  ctrIncrease?: string;
  description: string;
  deliverables: string[];
  year: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  benefits: string[];
  deliverables: string[];
  deliverTime: string;
  featured?: boolean;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverables: string[];
  timeframe: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Pricing & Delivery' | 'Workflow' | 'Rights & Files';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  subscribers?: string;
  viewsCount?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  specialties: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
}
