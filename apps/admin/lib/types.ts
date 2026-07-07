export type Role = "manager" | "reception" | "stylist";

export type Screen = "bookings" | "booking-detail" | "shifts" | "menus" | "reports";

export type BookingStatus = "confirmed" | "completed" | "cancelled";

export type Account = {
  loginId: string;
  name: string;
  role: Role;
  roleLabel: string;
  color: string;
  stylistId?: string;
};

export type Stylist = {
  id: string;
  name: string;
  role: string;
  color: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  min: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type Booking = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  stylistId: string;
  menuIds: string[];
  menuNames: string[];
  start: number;
  duration: number;
  total: number;
  status: BookingStatus;
  note: string;
};

export type ShiftMap = Record<string, boolean[]>;

export type MonthlySummary = {
  revenue: Record<string, number>;
  count: Record<string, number>;
};

export type BookingDraft = {
  customer: string;
  phone: string;
  stylistId: string;
  menuIds: string[];
  date: string;
  start: number | null;
  note: string;
};
