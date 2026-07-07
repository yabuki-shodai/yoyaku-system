import { CLOSE_MIN } from "./date-time";
import type { Booking, BookingDraft, MenuCategory } from "./types";

export function cloneMenus(menus: MenuCategory[]) {
  return menus.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item })),
  }));
}

export function allMenuItems(menus: MenuCategory[]) {
  return menus.flatMap((category) => category.items);
}

export function calculateBookingTotals(menuIds: string[], menus: MenuCategory[]) {
  const selected = allMenuItems(menus).filter((item) => menuIds.includes(item.id));
  return {
    selected,
    duration: selected.reduce((sum, item) => sum + item.min, 0),
    total: selected.reduce((sum, item) => sum + item.price, 0),
  };
}

export function getUnavailableReason(params: {
  bookings: Booking[];
  date: string;
  stylistId: string | null;
  start: number;
  duration: number;
}) {
  const { bookings, date, stylistId, start, duration } = params;
  if (!stylistId || !duration) return "wait";
  if (start + duration > CLOSE_MIN) return "close";

  const hasClash = bookings.some((booking) => (
    booking.date === date &&
    booking.stylistId === stylistId &&
    booking.status !== "cancelled" &&
    start < booking.start + booking.duration &&
    start + duration > booking.start
  ));

  return hasClash ? "clash" : "";
}

export function createBookingFromDraft(draft: BookingDraft, menus: MenuCategory[], id: string): Booking | null {
  if (!draft.customer || !draft.stylistId || draft.menuIds.length === 0 || draft.start === null) return null;
  const totals = calculateBookingTotals(draft.menuIds, menus);
  if (!totals.duration) return null;

  return {
    id,
    date: draft.date,
    customer: draft.customer,
    phone: draft.phone,
    stylistId: draft.stylistId,
    menuIds: draft.menuIds,
    menuNames: totals.selected.map((item) => item.name),
    start: draft.start,
    duration: totals.duration,
    total: totals.total,
    status: "confirmed",
    note: draft.note,
  };
}

export function nextBookingId(bookings: Booking[]) {
  const largest = bookings.reduce((max, booking) => {
    const numeric = Number(booking.id.replace("BK-", ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);
  return `BK-${String(largest + 1).padStart(3, "0")}`;
}

export function unavailableReasonLabel(reason: string) {
  if (reason === "wait") return "担当とメニューを選択すると空き時間が表示されます";
  if (reason === "close") return "閉店時間を超えるため選択できません";
  if (reason === "clash") return "既存予約と重複しています";
  return "";
}
