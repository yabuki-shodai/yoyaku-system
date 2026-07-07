"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { loginWithStaffId } from "@/lib/auth-service";
import { cloneMenus, createBookingFromDraft, nextBookingId } from "@/lib/booking-service";
import { initialBookings, initialMenus, initialShifts } from "@/lib/mock-data";
import type { Account, Booking, BookingDraft, BookingStatus, MenuCategory, ShiftMap } from "@/lib/types";

type AdminContextValue = {
  account: Account | null;
  bookings: Booking[];
  menus: MenuCategory[];
  shifts: ShiftMap;
  shiftSubmitted: boolean;
  login: (loginId: string, password: string) => boolean;
  logout: () => void;
  createBooking: (draft: BookingDraft) => Booking | null;
  updateBooking: (bookingId: string, patch: Pick<Booking, "customer" | "phone" | "note">) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  toggleShift: (stylistId: string, dayIndex: number) => void;
  submitShift: () => void;
  changeMenuItem: (categoryIndex: number, itemIndex: number, patch: { name?: string; price?: number; min?: number }) => void;
  addMenuItem: (categoryIndex: number) => void;
  removeMenuItem: (categoryIndex: number, itemIndex: number) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [menus, setMenus] = useState<MenuCategory[]>(() => cloneMenus(initialMenus));
  const [shifts, setShifts] = useState<ShiftMap>(initialShifts);
  const [shiftSubmitted, setShiftSubmitted] = useState(false);

  const value = useMemo<AdminContextValue>(() => ({
    account,
    bookings,
    menus,
    shifts,
    shiftSubmitted,
    login: (loginId, password) => {
      const nextAccount = loginWithStaffId(loginId, password);
      if (!nextAccount) return false;
      setAccount(nextAccount);
      setShiftSubmitted(false);
      return true;
    },
    logout: () => {
      setAccount(null);
      setShiftSubmitted(false);
    },
    createBooking: (draft) => {
      const created = createBookingFromDraft(draft, menus, nextBookingId(bookings));
      if (!created) return null;
      setBookings((current) => [...current, created]);
      return created;
    },
    updateBooking: (bookingId, patch) => {
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, ...patch } : booking));
    },
    updateBookingStatus: (bookingId, status) => {
      setBookings((current) => current.map((booking) => booking.id === bookingId ? { ...booking, status } : booking));
    },
    toggleShift: (stylistId, dayIndex) => {
      setShifts((current) => ({
        ...current,
        [stylistId]: current[stylistId].map((value, index) => index === dayIndex ? !value : value),
      }));
      setShiftSubmitted(false);
    },
    submitShift: () => setShiftSubmitted(true),
    changeMenuItem: (categoryIndex, itemIndex, patch) => {
      setMenus((current) => current.map((category, ci) => ci !== categoryIndex ? category : {
        ...category,
        items: category.items.map((item, ii) => ii === itemIndex ? { ...item, ...patch } : item),
      }));
    },
    addMenuItem: (categoryIndex) => {
      setMenus((current) => current.map((category, index) => index === categoryIndex ? {
        ...category,
        items: [...category.items, { id: `new-${Date.now()}`, name: "新規メニュー", price: 0, min: 30 }],
      } : category));
    },
    removeMenuItem: (categoryIndex, itemIndex) => {
      setMenus((current) => current.map((category, index) => index === categoryIndex ? {
        ...category,
        items: category.items.filter((_, i) => i !== itemIndex),
      } : category));
    },
  }), [account, bookings, menus, shiftSubmitted, shifts]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used within AdminProvider");
  return value;
}
