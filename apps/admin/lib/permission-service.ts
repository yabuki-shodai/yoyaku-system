import type { Account, Booking, Screen } from "./types";

export function allowedScreens(account: Account): Screen[] {
  if (account.role === "manager") return ["bookings", "booking-detail", "shifts", "menus", "reports"];
  if (account.role === "reception") return ["bookings", "booking-detail"];
  return ["bookings", "booking-detail", "shifts"];
}

export function canAccessScreen(account: Account, screen: Screen) {
  return allowedScreens(account).includes(screen);
}

export function canCreateBooking(account: Account) {
  return account.role === "manager" || account.role === "reception";
}

export function canEditBooking(account: Account) {
  return account.role === "manager" || account.role === "reception";
}

export function canCancelBooking(account: Account) {
  return account.role === "manager" || account.role === "reception";
}

export function canCompleteBooking(account: Account, booking: Booking) {
  if (account.role === "manager" || account.role === "reception") return true;
  return account.stylistId === booking.stylistId;
}

export function canViewBooking(account: Account, booking: Booking) {
  if (account.role === "manager" || account.role === "reception") return true;
  return account.stylistId === booking.stylistId;
}

export function canEditShift(account: Account, stylistId: string) {
  return account.role === "manager" || account.stylistId === stylistId;
}
