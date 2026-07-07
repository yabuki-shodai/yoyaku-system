import type { Account, Booking, MenuCategory, MonthlySummary, ShiftMap, Stylist } from "./types";

export const stylists: Stylist[] = [
  { id: "s1", name: "RIO", role: "トップスタイリスト", color: "#c17a8f" },
  { id: "s2", name: "MEI", role: "スタイリスト", color: "#7a93c1" },
  { id: "s3", name: "SORA", role: "ディレクター", color: "#8fb38a" },
  { id: "s4", name: "HINA", role: "スタイリスト", color: "#c1a37a" },
];

export const stylistById = Object.fromEntries(stylists.map((stylist) => [stylist.id, stylist])) as Record<string, Stylist>;

export const accounts: Account[] = [
  { loginId: "manager", name: "佐々木 蓮", role: "manager", roleLabel: "管理者", color: "#4a5568" },
  { loginId: "reception", name: "受付", role: "reception", roleLabel: "受付スタッフ", color: "#5a8a8f" },
  { loginId: "rio", name: "RIO", role: "stylist", roleLabel: "トップスタイリスト", color: "#c17a8f", stylistId: "s1" },
  { loginId: "mei", name: "MEI", role: "stylist", roleLabel: "スタイリスト", color: "#7a93c1", stylistId: "s2" },
  { loginId: "sora", name: "SORA", role: "stylist", roleLabel: "ディレクター", color: "#8fb38a", stylistId: "s3" },
  { loginId: "hina", name: "HINA", role: "stylist", roleLabel: "スタイリスト", color: "#c1a37a", stylistId: "s4" },
];

export const initialMenus: MenuCategory[] = [
  {
    id: "cut",
    name: "カット",
    items: [
      { id: "c1", name: "カット", price: 4950, min: 60 },
      { id: "c2", name: "前髪カット", price: 1650, min: 20 },
      { id: "c3", name: "学割カット（U22）", price: 3850, min: 60 },
    ],
  },
  {
    id: "color",
    name: "カラー",
    items: [
      { id: "k1", name: "ワンカラー", price: 7150, min: 90 },
      { id: "k2", name: "ダブルカラー", price: 14300, min: 150 },
      { id: "k3", name: "インナーカラー", price: 9900, min: 120 },
      { id: "k4", name: "リタッチカラー", price: 5500, min: 60 },
    ],
  },
  {
    id: "perm",
    name: "パーマ",
    items: [
      { id: "p1", name: "ゆるふわパーマ", price: 8800, min: 120 },
      { id: "p2", name: "韓国風レイヤーパーマ", price: 12100, min: 150 },
      { id: "p3", name: "縮毛矯正", price: 16500, min: 180 },
    ],
  },
  {
    id: "care",
    name: "ケア・スパ",
    items: [
      { id: "t1", name: "TOKIOトリートメント", price: 4400, min: 30 },
      { id: "t2", name: "髪質改善トリートメント", price: 8800, min: 90 },
      { id: "t3", name: "ヘッドスパ 20分", price: 3300, min: 20 },
    ],
  },
];

export const initialBookings: Booking[] = [
  { id: "BK-001", date: "2026-07-05", customer: "田中 美咲", phone: "090-1111-2222", stylistId: "s1", menuIds: ["c1"], menuNames: ["カット"], start: 600, duration: 60, total: 4950, status: "confirmed", note: "毛先を整える。前髪は相談。" },
  { id: "BK-002", date: "2026-07-05", customer: "佐藤 玲奈", phone: "080-3333-4444", stylistId: "s1", menuIds: ["k1"], menuNames: ["ワンカラー"], start: 780, duration: 90, total: 7150, status: "completed", note: "明るさは前回と同じ。" },
  { id: "BK-003", date: "2026-07-05", customer: "中村 恵", phone: "070-5555-6666", stylistId: "s1", menuIds: ["c1"], menuNames: ["カット"], start: 990, duration: 60, total: 4950, status: "confirmed", note: "ショート希望。" },
  { id: "BK-004", date: "2026-07-05", customer: "木村 さくら", phone: "090-2222-3333", stylistId: "s2", menuIds: ["k3"], menuNames: ["インナーカラー"], start: 660, duration: 120, total: 9900, status: "confirmed", note: "耳周りにベージュ。" },
  { id: "BK-005", date: "2026-07-05", customer: "小林 陽菜", phone: "080-4444-5555", stylistId: "s2", menuIds: ["k2"], menuNames: ["ダブルカラー"], start: 870, duration: 90, total: 14300, status: "cancelled", note: "当日キャンセル。" },
  { id: "BK-006", date: "2026-07-05", customer: "高橋 樹里", phone: "070-6666-7777", stylistId: "s3", menuIds: ["p2"], menuNames: ["韓国風レイヤーパーマ"], start: 630, duration: 150, total: 12100, status: "confirmed", note: "顔周りは軽め。" },
  { id: "BK-007", date: "2026-07-05", customer: "渡辺 愛", phone: "090-7777-8888", stylistId: "s3", menuIds: ["c1"], menuNames: ["カット"], start: 1020, duration: 60, total: 4950, status: "confirmed", note: "" },
  { id: "BK-008", date: "2026-07-05", customer: "伊藤 未羽", phone: "080-8888-9999", stylistId: "s4", menuIds: ["t3"], menuNames: ["ヘッドスパ 20分"], start: 720, duration: 30, total: 3300, status: "completed", note: "静かに過ごしたい。" },
  { id: "BK-009", date: "2026-07-05", customer: "山本 結衣", phone: "070-9999-0000", stylistId: "s4", menuIds: ["c2"], menuNames: ["前髪カット"], start: 900, duration: 20, total: 1650, status: "confirmed", note: "眉下ライン。" },
];

export const initialShifts: ShiftMap = {
  s1: [true, true, false, true, true, true, false],
  s2: [true, false, true, true, true, true, true],
  s3: [false, true, true, true, false, true, true],
  s4: [true, true, true, false, true, true, false],
};

export const monthlySummary: MonthlySummary = {
  revenue: { s1: 412000, s2: 368000, s3: 301000, s4: 255000 },
  count: { s1: 58, s2: 52, s3: 44, s4: 39 },
};
