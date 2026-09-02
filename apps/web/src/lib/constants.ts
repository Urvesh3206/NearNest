import { APP_CONFIG } from '@/config/app';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Contact', href: '/contact' },
];

export const DASHBOARD_NAV_LINKS = [
  { label: 'Feed', href: '/dashboard', icon: 'Home' },
  { label: 'Neighbors', href: '/dashboard/neighbors', icon: 'Users' },
  { label: 'Local Businesses', href: '/dashboard/businesses', icon: 'Store' },
  { label: 'Services', href: '/dashboard/services', icon: 'Wrench' },
  { label: 'Messages', href: '/dashboard/messages', icon: 'MessageSquare' },
];

export const USER_ROLES = [
  { value: 'RESIDENT', label: 'Resident', description: 'Join your local neighborhood' },
  { value: 'BUSINESS', label: 'Local Business', description: 'Promote your local business' },
  { value: 'SERVICE_PROVIDER', label: 'Service Provider', description: 'Offer your professional services' },
];

export const POST_TYPES = [
  { value: 'DISCUSSION', label: 'Discussion', icon: 'MessageCircle' },
  { value: 'EVENT', label: 'Event', icon: 'Calendar' },
  { value: 'MARKETPLACE', label: 'Marketplace', icon: 'ShoppingBag' },
  { value: 'RECOMMENDATION', label: 'Recommendation', icon: 'Star' },
  { value: 'ALERT', label: 'Alert', icon: 'AlertTriangle' },
];

export const BUSINESS_CATEGORIES = [
  'Restaurant', 'Retail', 'Grocery', 'Health & Wellness', 'Entertainment', 'Other'
];

export const SERVICE_CATEGORIES = [
  'Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Tutoring', 'Handyman', 'Other'
];
