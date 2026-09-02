export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: 'RESIDENT' | 'BUSINESS' | 'SERVICE_PROVIDER' | 'ADMIN';
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
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
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}
