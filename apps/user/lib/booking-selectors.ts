import { ALL_ITEMS, ITEM_MAP, yen, type MenuItem } from "./data";
import { fmtMin, POINTS_BALANCE, TIME_SLOTS, toMin, type DateEntry } from "./booking-helpers";
import { useBooking, type BookingState } from "./booking-context";

export function toggleMenuItemId(sel: string[], id: string): string[] {
  const item = ITEM_MAP[id];
  if (sel.includes(id)) return sel.filter((x) => x !== id);
  if (item.group === "consult") return [id]; // 相談を選ぶと他の選択はリセット

  // 相談メニューは他メニューと同時選択できないため、通常メニュー選択時に外します。
  const withoutConsult = sel.filter((x) => ITEM_MAP[x].group !== "consult");

  // カット・カラー・パーマなど同一グループ内は1つだけ選べるようにします。
  const withoutSameGroup = item.group
    ? withoutConsult.filter((x) => ITEM_MAP[x].group !== item.group)
    : withoutConsult;
  return [...withoutSameGroup, id];
}

export function useBookingComputed() {
  const { state, dates } = useBooking();
  return computeBookingDerived(state, dates);
}

// 画面ごとに同じ集計を繰り返さないため、予約状態から表示用の派生値をまとめて作ります。
export function computeBookingDerived(state: BookingState, dates: DateEntry[]) {
  const selItems: MenuItem[] = ALL_ITEMS.filter((m) => state.sel.includes(m.id));
  const selTotalNum = selItems.reduce((a, m) => a + m.price, 0);
  const selMinNum = selItems.reduce((a, m) => a + m.min, 0);
  const hasSel = selItems.length > 0;
  const isConsultOnly = hasSel && selItems.every((m) => m.group === "consult");
  const feeNum = state.stylist ? state.stylist.fee : 0;

  const dSel = state.dateI !== null ? dates[state.dateI] : null;
  const tSel = state.timeI !== null ? TIME_SLOTS[state.timeI] : null;

  // 日時は通常表示と、確認画面向けの終了時刻つき表示を分けて持ちます。
  const dateLabel = dSel ? `${dSel.m}月${dSel.day}日(${dSel.w}) ${tSel ?? ""}` : "未選択";
  const dateLabelFull =
    dSel && tSel
      ? `${dSel.m}月${dSel.day}日(${dSel.w}) ${tSel}〜${fmtMin(toMin(tSel) + Math.max(selMinNum, 30))}`
      : dateLabel;

  const stylistName =
    state.stylist === undefined ? "" : state.stylist === null ? "指名なし" : `${state.stylist.name}（${state.stylist.role}）`;

  // ポイントは保有数と合計金額の小さい方まで使える想定です。
  const pointsUsed = state.usePoints ? Math.min(POINTS_BALANCE, selTotalNum + feeNum) : 0;
  const totalNum = Math.max(0, selTotalNum + feeNum - pointsUsed);
  const canConfirmDate = state.dateI !== null && state.timeI !== null;

  return {
    selItems,
    selTotalNum,
    selMinNum,
    hasSel,
    isConsultOnly,
    feeNum,
    dSel,
    tSel,
    dateLabel,
    dateLabelFull,
    stylistName,
    pointsUsed,
    totalNum,
    canConfirmDate,
    menuSummaryLabel: hasSel ? `${selItems.length}件・${isConsultOnly ? "カウンセリング後に確定" : yen(selTotalNum)}` : "未選択",
  };
}
