export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  min: number;
  tag?: string;
  group?: "consult" | "cut" | "fringe" | "color" | "perm";
};

export type MenuCategory = {
  cat: string;
  items: MenuItem[];
};

export const MENUS: MenuCategory[] = [
  {
    cat: "ご相談",
    items: [
      {
        id: "z1",
        name: "スタイリストと相談して決める",
        desc: "カウンセリングは無料。お悩み・ご要望を伺い当日その場でメニューを決定・施術まで行います（施術時間の目安として120分お確保します。料金は内容確定後にご案内）",
        price: 0,
        min: 120,
        tag: "決めきれない方に",
        group: "consult",
      },
    ],
  },
  {
    cat: "カット",
    items: [
      { id: "c1", name: "カット", desc: "シャンプー・ブロー込み", price: 4950, min: 60, tag: "定番", group: "cut" },
      { id: "c2", name: "前髪カット", desc: "お直し・メンテナンスに", price: 1650, min: 20, group: "fringe" },
      { id: "c3", name: "学割カット（U22）", desc: "学生証のご提示で", price: 3850, min: 60, tag: "学割", group: "cut" },
    ],
  },
  {
    cat: "カラー",
    items: [
      { id: "k1", name: "ワンカラー", desc: "イルミナ / アディクシー", price: 7150, min: 90, tag: "人気No.1", group: "color" },
      { id: "k2", name: "ダブルカラー", desc: "ブリーチ1回＋オンカラー", price: 14300, min: 150, tag: "トレンド", group: "color" },
      { id: "k3", name: "インナーカラー", desc: "ポイントブリーチ＋カラー", price: 9900, min: 120, group: "color" },
      { id: "k4", name: "リタッチカラー", desc: "根元2cmまで", price: 5500, min: 60, group: "color" },
    ],
  },
  {
    cat: "パーマ",
    items: [
      { id: "p1", name: "ゆるふわパーマ", desc: "コスメパーマ / カット別", price: 8800, min: 120, group: "perm" },
      { id: "p2", name: "韓国風レイヤーパーマ", desc: "ヨシンモリ・くびれヘア", price: 12100, min: 150, tag: "トレンド", group: "perm" },
      { id: "p3", name: "縮毛矯正", desc: "カット込み", price: 16500, min: 180, group: "perm" },
    ],
  },
  {
    cat: "ケア・スパ",
    items: [
      { id: "t1", name: "TOKIOトリートメント", desc: "集中補修 4step", price: 4400, min: 30, tag: "人気" },
      { id: "t2", name: "髪質改善トリートメント", desc: "酸熱 / うる艶仕上げ", price: 8800, min: 90 },
      { id: "t3", name: "ヘッドスパ 20分", desc: "炭酸クレンジング", price: 3300, min: 20 },
    ],
  },
];

export const ALL_ITEMS: MenuItem[] = MENUS.flatMap((c) => c.items);
export const ITEM_MAP: Record<string, MenuItem> = Object.fromEntries(
  ALL_ITEMS.map((m) => [m.id, m])
);

export type Stylist = {
  id: string;
  name: string;
  role: string;
  spec: string;
  fee: number;
};

export const STYLISTS: Stylist[] = [
  { id: "s1", name: "RIO", role: "トップスタイリスト", spec: "ショート・ハンサムショート", fee: 1100 },
  { id: "s2", name: "MEI", role: "スタイリスト", spec: "韓国風カラー・インナーカラー", fee: 550 },
  { id: "s3", name: "SORA", role: "ディレクター", spec: "レイヤー・パーマ", fee: 1650 },
  { id: "s4", name: "HINA", role: "スタイリスト", spec: "髪質改善・艶カラー", fee: 550 },
];

export const PICKUP_ITEM_IDS = ["c3", "p1", "t1"];

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
