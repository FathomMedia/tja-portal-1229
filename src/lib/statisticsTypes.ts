export type TStatistics = {
  totalCustomers: number;
  totalProducts: TTotal;
  totalBookings: TTotal;
  estimatedTotalRevenue: number;
  upcomingAdventures: TUpcomingAdventure[];
  topAdventuresThisQuarter: TTopAdventuresThisQuarter[];
  topCustomers: TTopCustomer[];
};

export type TTopAdventuresThisQuarter = {
  title: string;
  totalCustomers: number;
  slug: string;
  image: null;
};

export type TTopCustomer = {
  id: number;
  name: string;
  email: string;
  totalPoints: number;
};

export type TTotal = {
  adventures: number;
  consultations: number;
};

export type TUpcomingAdventure = {
  title: string;
  slug: string;
  image: null;
  startDate: string;
  endDate: string;
};

export type TStatisticsRevenueChart = {
  month: string;
  year: string;
  revenue: number;
};
