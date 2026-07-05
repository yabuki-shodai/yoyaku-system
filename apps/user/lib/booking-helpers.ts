import type { Stylist } from "./data";

export const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
];
export const CLOSE_MIN = 20 * 60; // 20:00
export const WDAYS = ["日", "月", "火", "水", "木", "金", "土"];
export const POINTS_BALANCE = 320;

export const toMin = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
};

// 分単位の時刻を画面表示用の「HH:mm」形式に戻します。
export const fmtMin = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

// デモ用の空き判定で、スタイリストごとに少し違う結果を出すための種を作ります。
export const stylistSeed = (st: Stylist | null | undefined) =>
  st ? [...st.id].reduce((a, c) => a + c.charCodeAt(0), 0) : 0;

export type DateEntry = { y: number; m: number; day: number; w: string; dow: number };

// 実際に予約できる日だけを持つリストです。表示カレンダーとは分け、火曜定休はここで除外します。
export function makeDates(): DateEntry[] {
  const out: DateEntry[] = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (d.getDay() === 2) continue; // 火曜定休
    out.push({ y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate(), w: WDAYS[d.getDay()], dow: d.getDay() });
  }
  return out;
}

export type CalCell =
  | { blank: true }
  | {
      blank: false;
      closed: boolean;
      past: boolean;
      idx: number;
      day: number;
      m: number;
      dow: number;
      sub: string;
    };

// カレンダー表示用のセルを作ります。月初から表示し、過去日や定休日は選択不可にします。
export function makeCalCells(dates: DateEntry[]): CalCell[] {
  const cells: CalCell[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let b = 0; b < first.getDay(); b++) cells.push({ blank: true });
  const daysToShow = Math.max(30, now.getDate() + 29);
  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
    const closed = d.getDay() === 2;
    const past = d < today;
    const idx =
      closed || past
        ? -1
        : dates.findIndex(
            (x) =>
              x.y === d.getFullYear() &&
              x.m === d.getMonth() + 1 &&
              x.day === d.getDate()
          );
    cells.push({
      blank: false,
      closed,
      past,
      idx,
      day: d.getDate(),
      m: d.getMonth() + 1,
      dow: d.getDay(),
      sub: i === 0 || d.getDate() === 1 ? `${d.getMonth() + 1}月` : "",
    });
  }
  return cells;
}

export type TimeSlot = { label: string; ok: boolean };

// 営業終了を超える枠と、デモ用の疑似予約済み枠を選択不可にします。
export function computeTimeSlots(
  dateI: number | null,
  stylist: Stylist | null | undefined,
  selMinNum: number
): TimeSlot[] {
  const di = dateI ?? 0;
  const seed = stylistSeed(stylist);
  return TIME_SLOTS.map((label, i) => {
    const fitsClose = toMin(label) + Math.max(selMinNum, 30) <= CLOSE_MIN;
    const staffFree = (di * 5 + i * 3 + seed) % 4 !== 0;
    return { label, ok: fitsClose && staffFree };
  });
}
