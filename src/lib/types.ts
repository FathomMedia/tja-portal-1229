import { WeekNumberLabel } from "react-day-picker";

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
  englishTitle: string;
  arabicTitle: string;
  englishDescription: string;
  arabicDescription: string;
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
export type TCoupons = {
  data: TCoupon[];
  links: Links;
  meta: TMeta;
};

export type TCountry = {
  id: number;
  name: string;
  continent: string;
};

export type TAdventure = {
  id: number;
  link: string;
  title: string;
  description: string | null;
  createdAt: string;
  country: string;
  countryId: number;
  continent: string;
  price: number;
  slug: string;
  availableSeats: number;
  capacity: number;
  startDate: string;
  endDate: string;
  image: string | null;
  continentImage: string | null;
  giftPoints: number;
  gender: string;
  genderValue: string;
  arabicTitle: string;
  englishTitle: string;
  arabicDescription: string | null;
  englishDescription: string | null;
  isFull: boolean;
  isUpcoming: boolean;
  numberOfBookings: number;
  addOns: TAddon[];
  package: string | null;
  englishPackage: string | null;
  arabicPackage: string | null;
  priceWithCurrency: string;
  isPartialAllowed: boolean;
  partialPrice: number;
  partialPriceWithCurrency: string;
  partialRemaining: string;
};

export type TAddon = {
  id: number;
  name: string;
  price: number;
  priceWithCurrency: string;
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

export type TAdventureBookingOrder = {
  id: number;
  customer: TCustomer;
  adventure: TAdventure;
  dateBooked: Date;
  isFullyPaid: boolean;
  isPartiallyPaid: boolean;
  addOns: any[];
  totalPrice: number;
  totalPriceWithCurrency: string;
  partialInvoice: TInvoice | null;
  fullInvoice: TInvoice | null;
  remainingInvoice: TInvoice | null;
};
export type TInvoice = {
  id: number;
  amount: number;
  amountWithCurrency: null | string;
  paymentType: string;
  paymentMethod: null | string;
  datePaid: null | string;
};

export type TOrder = {
  id: number;
  type: string;
  dateBooked: string;
  details: TAdventure | TConsultation;
  invoice:
    | {
        id: number;
        path: string | null;
        isPartial: boolean;
        isPaid: boolean;
        totalAmount: number;
        date: string;
      }[]
    | null;
  isFullyPaid: boolean;
  isPartiallyPaid: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

export type TAchievements = {
  data: TAchievement[];
  links?: Links;
  meta?: TMeta;
};
export type TLevels = {
  data: TLevel[];
  links?: Links;
  meta?: TMeta;
};

export type TLevel = {
  id: number;
  name: string;
  arabicName?: string;
  englishName?: string;
  minDays: number;
  maxDays: number;
  badge: string;
};

// Admin Types
export type TAdmins = {
  data: TAdmin[];
  links: Links;
  meta: TMeta;
};

export type TAdminInvitations = {
  data: TAdminInvitation[];
  links: Links;
  meta: TMeta;
};

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

export type TConsultationBookings = {
  data: TConsultationBooking[];
  links: Links;
  meta: TMeta;
};

export type TAdventures = {
  data: TAdventure[];
  links: Links;
  meta: TMeta;
};

export type TConsultations = {
  data: TConsultation[];
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
    image: string | null;
  };
  dateBooked: string;
  isFullyPaid: boolean;
  isPartiallyPaid: null;
  addOns: any[];
  totalPrice: number;
  totalPriceWithCurrency: string;
};

export type TConsultationBooking = {
  id: number;
  isPaid: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  consultation: TConsultation;
  dateBooked: string;
  startDate: string;
  endDate: string;
  class: string;
  numberOfTravelers: number;
  destination: string;
  departureAirport: string;
  budget: string;
  budgetPriority: string;
  budgetIncludes: string[];
  vacationType: string;
  accommodationType: string[];
  bestTravelExperience: string | null;
  phobias: string | null;
  activities: string[];
  invoice: null;
  coupon: TCoupon;
  adventureMeaning: string[];
  morningActivity: string;
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

export type TAdmin = {
  adminId: number;
  name: string;
  email: string;
  gender: string;
  dateFormatted: string;
  role: string;
  joinedAt: string;
  verified: boolean;
  invitedBy: TLevel;
  isAccepted: boolean;
  acceptedAt: string | null;
};

export type TAdminInvitation = {
  adminId: number;
  userId: number;
  name: string;
  email: string;
  gender: string;
  invitedBy: TLevel;
  isAccepted: boolean;
  acceptedAt: string | null;
  invitedAt: string | null;
};
