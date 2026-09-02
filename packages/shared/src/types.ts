export enum UserRole {
  RESIDENT = 'RESIDENT',
  SOCIETY_ADMIN = 'SOCIETY_ADMIN',
  SHOP_OWNER = 'SHOP_OWNER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  GOVERNMENT_AUTHORITY = 'GOVERNMENT_AUTHORITY',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum PostType {
  TEXT = 'TEXT',
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  EVENT = 'EVENT',
  QUESTION = 'QUESTION',
  POLL = 'POLL',
  LOST_AND_FOUND = 'LOST_AND_FOUND',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export enum ListingCategory {
  FURNITURE = 'FURNITURE',
  ELECTRONICS = 'ELECTRONICS',
  VEHICLES = 'VEHICLES',
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER'
}

export enum BusinessCategory {
  GROCERY = 'GROCERY',
  RESTAURANT = 'RESTAURANT',
  PHARMACY = 'PHARMACY',
  SALON = 'SALON',
  OTHER = 'OTHER'
}

export enum ServiceCategory {
  PLUMBER = 'PLUMBER',
  ELECTRICIAN = 'ELECTRICIAN',
  CARPENTER = 'CARPENTER',
  CLEANING = 'CLEANING',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
