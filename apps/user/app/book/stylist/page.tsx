"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TagLabel from "@/components/labels/TagLabel";
import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";
import { STYLISTS } from "@/lib/data";

export default function BookStylistPage() {
  const router = useRouter();
  const { update } = useBooking();
  const { hasSel } = useBookingComputed();

  useEffect(() => {
    if (!hasSel) router.replace("/book/menu");
  }, [hasSel, router]);

  const pick = (stylistId: string) => {
    // 指名したスタイリストを予約状態に保存し、そのまま日時選択へ進みます。
    const stylist = STYLISTS.find((s) => s.id === stylistId)!;
    update({ stylist });
    router.push("/book/date");
  };

  const pickNoStylist = () => {
    // null は「未選択」ではなく「指名なしを選択済み」という意味で扱います。
    update({ stylist: null });
    router.push("/book/date");
  };

  if (!hasSel) return null;

  return (
    <main className="mx-auto w-full max-w-[820px] px-5 pt-7 pb-[60px]">
      <h1 className="m-0 mb-1 text-[30px] font-bold">スタイリスト選択</h1>
      <p className="m-0 mb-[22px] text-[13.5px] text-[var(--sub)]">
        指名するスタイリストを選んでください
      </p>

      <button
        onClick={pickNoStylist}
        className="mb-3.5 flex w-full cursor-pointer items-center gap-3.5 rounded-[var(--r)] border-[1.5px] border-dashed border-[var(--line2)] bg-transparent px-[22px] py-[18px] text-left transition-colors hover:border-[var(--accent)]"
      >
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[var(--soft)] text-lg font-bold text-[var(--accent)]">
          ?
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold">指名なしで予約する</span>
          <span className="text-[12.5px] text-[var(--sub)]">当日のスタッフが担当・指名料 ¥0</span>
        </div>
        <span className="ml-auto text-[13px] font-bold text-[var(--accent)]">選択 →</span>
      </button>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
        {STYLISTS.map((s, i) => {
          const rating = (4.6 + (i % 3) * 0.1).toFixed(1);
          const hasBadge = s.role === "トップスタイリスト" || s.role === "ディレクター";
          const badge = s.role === "ディレクター" ? "指名率No.1" : "人気";
          return (
            <button
              key={s.id}
              onClick={() => pick(s.id)}
              className="flex cursor-pointer flex-col gap-3.5 rounded-[var(--r)] border-[1.5px] border-[var(--line)] bg-[var(--surface)] p-[18px] text-left transition-all hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[0_14px_30px_-18px_rgba(60,30,40,.35)]"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <PlaceholderFrame
                  label="スタッフ写真"
                  aspectRatio="1 / 1.05"
                  className="w-full"
                />
                {hasBadge && (
                  <TagLabel className="absolute top-2.5 left-2.5 bg-[var(--accent)] text-white">
                    {badge}
                  </TagLabel>
                )}
                <span className="absolute right-2.5 bottom-2.5 flex items-center gap-0.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-[var(--ink)]">
                  ★ {rating}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-outfit text-[19px] font-bold tracking-[.08em]">{s.name}</span>
                  <span className="text-[11px] font-bold text-[var(--accent)]">{s.role}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.spec.split("・").map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-[3px] text-[11px] text-[var(--sub)]">
                      {chip}
                    </span>
                  ))}
                </div>
                <span className="mt-0.5 text-[12.5px] font-bold">
                  指名料 ¥{s.fee.toLocaleString("ja-JP")}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => router.push("/book/menu")}
        className="mt-6 cursor-pointer border-none bg-transparent py-2 text-[13px] text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
      >
        ← メニュー選択に戻る
      </button>
    </main>
  );
}
