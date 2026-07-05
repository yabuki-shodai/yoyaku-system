"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";
import { POINTS_BALANCE } from "@/lib/booking-helpers";
import { yen } from "@/lib/data";

export default function BookConfirmPage() {
  const router = useRouter();
  const { state, update } = useBooking();
  const {
    selItems,
    hasSel,
    isConsultOnly,
    feeNum,
    selTotalNum,
    selMinNum,
    dateLabelFull,
    stylistName,
    tSel,
    pointsUsed,
    totalNum,
    canConfirmDate,
  } = useBookingComputed();

  useEffect(() => {
    if (!hasSel) {
      router.replace("/book/menu");
      return;
    }
    if (!canConfirmDate) {
      router.replace("/book/date");
      return;
    }
    if (!state.auth && !state.guestOk) {
      router.replace("/book/auth-gate");
    }
  }, [hasSel, canConfirmDate, state.auth, state.guestOk, router]);

  if (!hasSel || !canConfirmDate || (!state.auth && !state.guestOk)) return null;

  const cMenus = selItems.map((m) => m.name).join("＋") || "—";
  const cStylist = stylistName + (feeNum ? ` ・ 指名料 ${yen(feeNum)}` : "");
  const subtotalLabel = isConsultOnly ? "カウンセリング後に確定" : yen(selTotalNum + feeNum);
  const totalLabel = isConsultOnly ? "カウンセリング後に確定" : yen(totalNum);

  const confirmBooking = () => {
    // デモ用に予約番号を発番し、マイページの「次回のご予約」に追加します。
    const id = "LM-2607-" + String(Math.floor(1000 + Math.random() * 9000));
    update((prev) => ({
      doneId: id,
      guestOk: false,
      bookings: [
        ...prev.bookings,
        {
          id,
          dateI: prev.dateI!,
          time: tSel ?? "",
          durMin: selMinNum,
          menus: cMenus,
          itemIds: [...prev.sel],
          stylist: prev.stylist ? prev.stylist.name : "指名なし",
          total: totalLabel,
        },
      ],
    }));
    router.push("/book/done");
  };

  return (
    <main className="mx-auto w-full max-w-[640px] px-5 pt-7 pb-[60px]">
      <h1 className="m-0 mb-1 text-[30px] font-bold">予約内容の確認</h1>
      <p className="m-0 mb-[22px] text-[13.5px] text-[var(--sub)]">
        内容を確認して予約を確定してください
      </p>

      <div className="flex flex-col rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-[26px]">
        <div className="flex justify-between gap-4 border-b border-dashed border-[var(--line)] py-3">
          <span className="w-[88px] flex-none text-[12.5px] text-[var(--sub)]">日時</span>
          <span className="text-right font-bold">{dateLabelFull}</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-dashed border-[var(--line)] py-3">
          <span className="w-[88px] flex-none text-[12.5px] text-[var(--sub)]">メニュー</span>
          <span className="text-right font-medium">{cMenus}</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-dashed border-[var(--line)] py-3">
          <span className="w-[88px] flex-none text-[12.5px] text-[var(--sub)]">スタイリスト</span>
          <span className="text-right font-medium">{cStylist}</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-dashed border-[var(--line)] py-3">
          <span className="w-[88px] flex-none text-[12.5px] text-[var(--sub)]">所要時間</span>
          <span className="text-right font-medium">約{selMinNum}分</span>
        </div>
        <div className="flex justify-between gap-4 py-3 pb-1">
          <span className="text-[12.5px] text-[var(--sub)]">小計（税込）</span>
          <span className="font-medium">{subtotalLabel}</span>
        </div>
        {pointsUsed > 0 && (
          <div className="flex justify-between gap-4 py-1">
            <span className="text-[12.5px] text-[var(--accent)]">ポイント利用（{pointsUsed}ポイント）</span>
            <span className="font-medium text-[var(--accent)]">-{yen(pointsUsed)}</span>
          </div>
        )}
        <div className="mt-1.5 flex items-baseline justify-between gap-4 border-t border-dashed border-[var(--line)] py-3 pb-1">
          <span className="text-[12.5px] text-[var(--sub)]">合計（税込）</span>
          <span className="font-outfit text-right font-bold" style={{ fontSize: isConsultOnly ? "17px" : "26px" }}>
            {totalLabel}
          </span>
        </div>
        <label
          onClick={() => update((prev) => ({ usePoints: !prev.usePoints }))}
          className="mt-2 flex cursor-pointer items-center gap-2.5 border-t border-[var(--line)] pt-3.5"
        >
          <input type="checkbox" checked={state.usePoints} readOnly className="h-[17px] w-[17px] accent-[var(--accent)]" />
          <span className="text-[12.5px] text-[var(--sub)]">
            保有 {POINTS_BALANCE}ポイントを1ポイント=1円で使用
          </span>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3.5 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-[26px]">
        <span className="text-sm font-bold">お客様情報</span>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
          お名前
          <input
            value={state.name}
            onChange={(e) => update({ name: e.target.value })}
            className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
          電話番号
          <input
            value={state.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
          メールアドレス（確認メールの送付先）
          <input
            value={state.email}
            onChange={(e) => update({ email: e.target.value })}
            className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
          ご要望（任意）
          <textarea
            value={state.note}
            onChange={(e) => update({ note: e.target.value })}
            rows={3}
            placeholder="なりたいイメージ、髪のお悩みなど"
            className="resize-y rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <p className="mx-1 mt-4 mb-0 text-[11.5px] text-[var(--sub)] [text-wrap:pretty]">
        キャンセル・変更は前日20:00までマイページまたはお電話で承ります。以降のキャンセルはキャンセル料（施術料金の50%）が発生する場合があります。
      </p>

      <button
        onClick={confirmBooking}
        className="mt-3.5 w-full cursor-pointer rounded-full border-none bg-[var(--accent)] py-[17px] text-[15.5px] font-bold tracking-[.05em] text-[var(--accent-ink)] shadow-[0_10px_28px_-10px_var(--accent)] transition-[filter] hover:brightness-[1.06]"
      >
        この内容で予約を確定する
      </button>
      <button
        onClick={() => router.push("/book/date")}
        className="mt-3.5 w-full cursor-pointer border-none bg-transparent py-2 text-[13px] text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
      >
        ← 日時選択に戻る
      </button>
    </main>
  );
}
