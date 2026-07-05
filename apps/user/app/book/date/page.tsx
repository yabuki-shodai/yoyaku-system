"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";
import { computeTimeSlots } from "@/lib/booking-helpers";

const WEEKDAY_HEADERS = [
  { label: "日", color: "#c96b6b" },
  { label: "月", color: "var(--sub)" },
  { label: "火", color: "var(--sub)" },
  { label: "水", color: "var(--sub)" },
  { label: "木", color: "var(--sub)" },
  { label: "金", color: "var(--sub)" },
  { label: "土", color: "#6b8fc9" },
];

export default function BookDatePage() {
  const router = useRouter();
  const { state, update, calCells } = useBooking();
  const { hasSel, selMinNum, canConfirmDate, dateLabelFull } = useBookingComputed();

  useEffect(() => {
    if (!hasSel) router.replace("/book/menu");
  }, [hasSel, router]);

  if (!hasSel) return null;

  const times = computeTimeSlots(state.dateI, state.stylist, selMinNum);

  // 日付を変えたら、前の日付で選んでいた時間は無効になるためリセットします。
  const pickDate = (idx: number) => update({ dateI: idx, timeI: null });
  const pickTime = (i: number) => update({ timeI: i });

  const next = () => {
    if (!canConfirmDate) return;

    // 未ログインの場合は、確認画面の前にログイン/ゲスト続行の選択を挟みます。
    if (!state.auth && !state.guestOk) {
      router.push("/book/auth-gate");
      return;
    }
    router.push("/book/confirm");
  };

  return (
    <main className="mx-auto w-full max-w-[820px] px-5 pt-7 pb-10">
      <h1 className="m-0 mb-1 text-[30px] font-bold">日時選択</h1>
      <p className="m-0 mb-[22px] text-[13.5px] text-[var(--sub)]">
        ご希望の日時を選んでください（約{Math.max(selMinNum, 30)}分の施術です）
      </p>

      <div className="mb-2 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] px-[18px] py-5">
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {WEEKDAY_HEADERS.map((w) => (
            <span key={w.label} className="text-center text-[11px] font-bold" style={{ color: w.color }}>
              {w.label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {calCells.map((cell, i) => {
            if (cell.blank) {
              return <span key={i} className="invisible min-h-[52px]" />;
            }
            const ok = !cell.closed && !cell.past && cell.idx >= 0;
            const on = ok && state.dateI === cell.idx;
            return (
              <button
                key={i}
                disabled={!ok}
                onClick={() => ok && pickDate(cell.idx)}
                className="flex min-h-[52px] flex-col items-center justify-center gap-px rounded-[14px] border-[1.5px] py-1.5 transition-all"
                style={{
                  cursor: ok ? "pointer" : "default",
                  borderColor: on ? "var(--accent)" : ok ? "var(--line)" : "transparent",
                  background: on ? "var(--accent)" : ok ? "var(--bg)" : "transparent",
                  color: on ? "var(--accent-ink)" : ok ? "var(--ink)" : "var(--line2)",
                }}
              >
                <span
                  className="min-h-[13px] text-[9.5px] leading-[13px] font-bold"
                  style={{ color: on ? "var(--accent-ink)" : "var(--accent)" }}
                >
                  {cell.sub}
                </span>
                <span
                  className="font-outfit text-base font-bold"
                  style={{ textDecoration: ok ? "none" : "line-through" }}
                >
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
        <p className="m-0 mt-3 text-[11px] text-[var(--sub)]">
          火曜と過ぎた日は選択できません
        </p>
      </div>

      <div className="mt-3.5 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5">
        {times.map((t, i) => {
          const on = state.timeI === i;
          return (
            <button
              key={t.label}
              disabled={!t.ok}
              onClick={() => t.ok && pickTime(i)}
              className="font-outfit rounded-[14px] border-[1.5px] py-3 text-[14.5px] font-semibold transition-all"
              style={{
                cursor: t.ok ? "pointer" : "default",
                borderColor: on ? "var(--accent)" : t.ok ? "var(--line)" : "transparent",
                background: on ? "var(--accent)" : t.ok ? "var(--surface)" : "transparent",
                color: on ? "var(--accent-ink)" : t.ok ? "var(--ink)" : "var(--line2)",
                textDecoration: t.ok ? "none" : "line-through",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3.5 mb-0 text-[11.5px] text-[var(--sub)]">薄い時間帯はご予約いただけません</p>

      <div className="sticky bottom-4 mt-6 flex items-center gap-4 rounded-full bg-[var(--ink)] py-3 pr-3 pl-[26px] text-[var(--bg)] shadow-[0_16px_40px_-14px_rgba(30,15,20,.5)]">
        <div className="flex flex-col leading-[1.35]">
          <span className="text-[11px] opacity-70">選択中の日時</span>
          <span className="font-outfit text-base font-bold">{dateLabelFull}</span>
        </div>
        <button
          onClick={next}
          disabled={!canConfirmDate}
          className="ml-auto cursor-pointer rounded-full border-none px-7 py-[13px] text-sm font-bold tracking-[.03em] transition-all disabled:cursor-default"
          style={{ background: "var(--accent)", color: "var(--accent-ink)", opacity: canConfirmDate ? 1 : 0.35 }}
        >
          予約内容の確認へ →
        </button>
      </div>
      <button
        onClick={() => router.push("/book/stylist")}
        className="mt-[18px] cursor-pointer border-none bg-transparent py-2 text-[13px] text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
      >
        ← スタイリスト選択に戻る
      </button>
    </main>
  );
}
