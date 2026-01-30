// Day interface
export interface Day {
  id: number;
  date: string; // or Date if you're converting it
  isBooked: boolean;
  price: number | null;
}

// Month interface
export interface Month {
  id: number;
  year: number;
  month: number;
  price: number | null;
  days: Day[];
}

// Calendar response interface
export interface CalendarResponse {
  success: boolean;
  statusCode: number;
  data: Month;
  total: number;
}
