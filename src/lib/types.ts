export type TUser = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string | null;
  status: string;
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
};

export type TAchievement = {
  id: number;
  title: string;
  description: string;
  badge: string;
  achieved: boolean;
};

export type TAdventure = {
  id: number;
  title: string;
  description: null;
  country: string;
  continent: string;
  price: number;
  capacity: number;
  slug: string;
  startDate: string;
  endDate: string;
  giftPoints: number;
  gender: string;
  isFull: boolean;
  isUpcoming: boolean;
  addOns: any[];
};

export interface Links {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface TPaginatedAdventures {
  data: TAdventure[];
  links: Links;
  meta: Meta;
}

export enum OrderType {
  adventure,
  consultation,
}

export type TConsultation = {
  id: number;
  tier: string;
  numberOfDays: number;
  price: string;
};

export type TOrders = {
  data: TOrder[];
};

export type TOrder = {
  type: string;
  dateBooked: string;
  details: TAdventure | TConsultation;
};

export type TLevels = {
  data: TLevel[];
  links: Links;
  meta: Meta;
};

export type TLevel = {
  id: number;
  name: string;
  minDays: number;
  maxDays: number;
  badge: string;
};
