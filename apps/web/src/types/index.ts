export type UserRole = 'ADMIN' | 'RESIDENT' | 'BUSINESS' | 'SERVICE_PROVIDER';

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  coverURL?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  society?: string;
  unit?: string;
  city?: string;
  street?: string;
  zip?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  interests?: string[];
  joinedDate?: string;
  businessName?: string;
  businessCategory?: string;
  serviceCategory?: string;
  hourlyRate?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  allowedRoles?: UserRole[];
  badge?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface FeedPost {
  id: string;
  type: 'DISCUSSION' | 'EVENT' | 'MARKETPLACE' | 'RECOMMENDATION' | 'ALERT';
  title: string;
  content: string;
  media?: string[];
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  authorRole?: UserRole;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}
