// Common Types
export type TripType = 'oneWay' | 'roundTrip' | 'hourly';

export interface Location {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
  bags: number;
}

export interface DateTimeSelection {
  selectedDateTimeIso?: string;
  returnDateTimeIso?: string;
  duration?: string;
}

// Auth Types
export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: number;
  verified?: boolean;
  mobileNo?: string | null;
  organization?: Organization;
}

export interface Organization {
  id?: string;
  companyName?: string;
  domainName?: string;
  country?: string;
  city?: string;
  orgCreditProfile?: CreditProfile;
}

export interface CreditProfile {
  creditLimit?: number;
  walletBalance?: number;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
  type: string;
}

// UI Component Props
export interface Destination {
  name: string;
  image: string;
}

export interface Vehicle {
  name: string;
  icon: string;
  desc: string;
  image: string;
}

export interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

export interface Shortcut {
  icon: string;
  label: string;
  variant: 'primary' | 'outline';
}

// API Response Types
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
