export enum Role {
  CUSTOMER = 'CUSTOMER',
  ORGANIZER = 'ORGANIZER'
}

export enum TransactionStatus {
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum EventCategory {
  MUSIC = 'Entertainment',
  WORKSHOP = 'Educational & Business',
  CULTURE = 'Cultural & Arts',
  SPORTS = 'Sports & Fitness',
  TECH = 'Technology & Innovation',
  TRAVEL = 'Travel & Adventure'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In real app, hashed
  role: Role;
  referralCode: string;
  points: number;
  pointsExpiry: number | null; // Timestamp
  referredBy?: string;
  avatar?: string;
  interestedEventIds?: string[];
  // Extended Profile Fields
  firstName?: string;
  lastName?: string;
  website?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  pincode?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountAmount: number; // Flat IDR amount
  validUntil: number; // Timestamp
  userId: string;
  isUsed: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  eventId: string;
  discountPercentage: number;
  validUntil: number;
  startDate: number;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  startDate: number;
  endDate: number;
  price: number; // 0 for free
  seatsAvailable: number;
  totalSeats: number;
  image: string;
  isPublished: boolean;
  tags: string[];
  interestedCount: number;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  originalPrice: number;
  pointsUsed: number;
  couponUsedId?: string;
  voucherUsedId?: string;
  status: TransactionStatus;
  createdAt: number;
  paymentProofUrl?: string;
  paymentProofUploadedAt?: number;
}

export interface DashboardStat {
  date: string; // YYYY-MM-DD
  revenue: number;
  ticketsSold: number;
}