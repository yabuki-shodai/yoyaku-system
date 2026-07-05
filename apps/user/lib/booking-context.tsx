"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Stylist } from "./data";
import { makeCalCells, makeDates, type CalCell, type DateEntry } from "./booking-helpers";

export type Booking = {
  id: string;
  dateI: number;
  time: string;
  durMin: number;
  menus: string;
  itemIds: string[];
  stylist: string;
  total: string;
};

export type HistoryItem = {
  date: string;
  menus: string;
  itemIds: string[];
  stylist: string;
  total: string;
};

export type LoginTab = "login" | "signup";

export type BookingState = {
  sel: string[];
  cat: string;
  stylist: Stylist | null | undefined;
  dateI: number | null;
  timeI: number | null;
  name: string;
  phone: string;
  email: string;
  note: string;
  usePoints: boolean;
  auth: boolean;
  guestOk: boolean;
  returnTo: string | null;
  agreeTerms: boolean;
  loginTab: LoginTab;
  signupName: string;
  signupEmail: string;
  signupPass: string;
  doneId: string | null;
  bookings: Booking[];
  history: HistoryItem[];
};

const initialState: BookingState = {
  sel: [],
  cat: "カット",
  stylist: undefined,
  dateI: null,
  timeI: null,
  name: "木村 さくら",
  phone: "090-1234-5678",
  email: "",
  note: "",
  usePoints: false,
  auth: false,
  guestOk: false,
  returnTo: null,
  agreeTerms: false,
  loginTab: "login",
  signupName: "",
  signupEmail: "",
  signupPass: "",
  doneId: null,
  bookings: [
    {
      id: "LM-2607-0342",
      dateI: 5,
      time: "14:00",
      durMin: 90,
      menus: "カット＋ワンカラー",
      itemIds: ["c1", "k1"],
      stylist: "MEI",
      total: "¥12,650",
    },
  ],
  history: [
    { date: "2026/6/02", menus: "カット＋TOKIOトリートメント", itemIds: ["c1", "t1"], stylist: "RIO", total: "¥10,450" },
    { date: "2026/4/19", menus: "ダブルカラー", itemIds: ["k2"], stylist: "MEI", total: "¥14,300" },
    { date: "2026/3/07", menus: "カット", itemIds: ["c1"], stylist: "指名なし", total: "¥4,950" },
  ],
};

type Updater = Partial<BookingState> | ((prev: BookingState) => Partial<BookingState>);

type BookingContextValue = {
  state: BookingState;
  update: (patch: Updater) => void;
  dates: DateEntry[];
  calCells: CalCell[];
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  // 日付計算は初回だけ実行し、ページ移動中にカレンダーの並びが変わらないようにします。
  const [calendar] = useState(() => {
    const dates = makeDates();
    return { dates, calCells: makeCalCells(dates) };
  });

  // 部分更新と関数更新の両方を受け、各ページから必要な項目だけ変更できるようにします。
  const update = (patch: Updater) => {
    setState((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  };

  return (
    <BookingContext.Provider value={{ state, update, dates: calendar.dates, calCells: calendar.calCells }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
