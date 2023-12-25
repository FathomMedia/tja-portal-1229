export type TUser = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string | null;
  status: string;
  role?: string;
  level: {
    id: number;
    name: string;
    badge: string;
  };
  points: number;
  age: number;
  dateOfBirth: string;
  daysTravelled: number;
  joinedAt: string;
  verified: boolean;
  dateFormatted: string;
};

export type TAchievement = {
  id: number;
  title: string;
  description: string;
  badge: string;
  achieved: boolean;
};

export type TCoupon = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  percentOff?: number;
  value?: number;
  minPoints: number;
  maxPoints: number;
  applyTo: string;
  isUsed?: number;
};

export type TAdventure = {
  id: number;
  title: string;
  description: string | null;
  country: string;
  continent: string;
  price: number;
  partialPrice: number;
  priceWithCurrency: string;
  partialPriceWithCurrency: string;
  partialRemaining: string;
  capacity: number;
  slug: string;
  startDate: string;
  endDate: string;
  giftPoints: number;
  gender: string;
  isFull: boolean;
  isUpcoming: boolean;
  isPartialAllowed: boolean;
  addOns: TAddon[];
};

export type TAddon = {
  id: number;
  title: string;
  price: number;
};

export interface Links {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export type TMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
  pagination: TPagination;
};

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface TPaginatedAdventures {
  data: TAdventure[];
  links: Links;
  meta: TMeta;
}

export enum OrderType {
  adventure,
  consultation,
}

export type TConsultation = {
  id: number;
  tier: string;
  numberOfDays: number;
  price: number;
  priceWithCurrency: string;
};

export type TOrders = {
  data: TOrder[];
};

export type TOrder = {
  id: number;
  type: string;
  dateBooked: string;
  details: TAdventure | TConsultation;
  invoice: null;
  isFullyPaid: boolean;
  isPartiallyPaid: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

export type TLevels = {
  data: TLevel[];
  links: Links;
  meta: TMeta;
};

export type TLevel = {
  id: number;
  name: string;
  minDays: number;
  maxDays: number;
  badge: string;
};

// Admin Types

export type TCustomers = {
  data: TCustomer[];
  links: Links;
  meta: TMeta;
};
export type TAdventureBookings = {
  data: TAdventureBooking[];
  links: Links;
  meta: TMeta;
};

export type TAdventureBooking = {
  id: number;
  customer: {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
  };
  adventure: {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    price: number;
  };
  dateBooked: string;
  isFullyPaid: boolean;
  isPartiallyPaid: null;
  addOns: any[];
  totalPrice: number;
  totalPriceWithCurrency: string;
};

export type TPagination = {
  per_page: number;
  current_page: number;
  total_pages: number;
  next_page_number: number | null;
  prev_page_number: number | null;
};

export type TCustomer = {
  customerId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  status: string;
  level: TLevel;
  points: number;
  dateFormatted: string;
  totalPoints: number;
  role: string;
  age: number;
  dateOfBirth: string;
  daysTravelled: number;
  joinedAt: string;
  verified: boolean;
  nextLevel: TLevel;
  isSuspended: boolean;
};
