export const BASE_DATE = "2026-07-05";
export const OPEN_MIN = 10 * 60;
export const CLOSE_MIN = 20 * 60;
export const NOW_MIN = 14 * 60 + 20;
export const TODAY_INDEX = 6;
export const WEEK_DAYS = ["月", "火", "水", "木", "金", "土", "日"];

export function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export function dateFromOffset(offset: number) {
  return new Date(2026, 6, 5 + offset);
}

export function dateKeyFromOffset(offset: number) {
  const date = dateFromOffset(offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function offsetFromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return 0;
  const base = dateFromOffset(0);
  const target = new Date(year, month - 1, day);
  return Math.round((target.getTime() - base.getTime()) / 86400000);
}

export function dateLabelFromOffset(offset: number) {
  const date = dateFromOffset(offset);
  const weekIndex = (date.getDay() + 6) % 7;
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEK_DAYS[weekIndex]}）`;
}

export function hourMarks() {
  const marks: number[] = [];
  for (let min = OPEN_MIN; min <= CLOSE_MIN; min += 60) {
    marks.push(min);
  }
  return marks;
}

export function startTimeOptions() {
  const options: number[] = [];
  for (let min = OPEN_MIN; min <= 19 * 60; min += 30) {
    options.push(min);
  }
  return options;
}
