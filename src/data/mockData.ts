import { Item, Claim, UserProfile, Category } from '../types';

export const FIXED_ADMIN_EMAIL = 'kickshu10@gmail.com';

export const currentUser: UserProfile = {
  id: 'u-student',
  name: 'Amit Kumar',
  rollNo: '23CS1027',
  email: 'student@aksuniversity.ac.in',
  phone: '+91 98765 43210',
  department: 'Computer Science & Engineering',
  year: '3rd Year (B.Tech)',
  role: 'Student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const adminUser: UserProfile = {
  id: 'u-admin-fixed',
  name: 'Chief Security Officer',
  rollNo: 'ADM-CS01',
  email: FIXED_ADMIN_EMAIL,
  phone: '+91 98765 00001',
  department: 'Proctorial Board & Security Office',
  year: 'Faculty Administrator',
  role: 'Admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
};

// Clean initial state: ZERO legacy mock items
export const initialItems: Item[] = [];

// Clean initial state: ZERO legacy mock claims
export const initialClaims: Claim[] = [];

export const categories: Category[] = [
  'Mobile Phone',
  'Electronics',
  'ID Card & Wallets',
  'Bags & Backpacks',
  'Documents & Notes',
  'Keys',
  'Accessories',
  'Clothing',
  'Other',
];

export const campusLocations: string[] = [
  'Central Library',
  'Computer Block',
  'Academic Block (Rooms 101-404)',
  'Main Canteen & Food Court',
  'Auditorium & Seminar Hall',
  'Sports Complex & Gym',
  'Administrative Block',
  'Science Labs & Workshop',
  'Central Parking Area',
  'Hostel Block A & B',
];
