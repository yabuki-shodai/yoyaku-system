"use client";

import { useRouter } from "next/navigation";
import TagLabel from "@/components/labels/TagLabel";
import { useBooking } from "@/lib/booking-context";
import { toggleMenuItemId, useBookingComputed } from "@/lib/booking-selectors";
import { MENUS } from "@/lib/data";

export default function BookMenuPage() {
  const router = useRouter();
  const { state, update } = useBooking();
  const { selItems, selTotalNum, selMinNum, hasSel, isConsultOnly } = useBookingComputed();

  const catData = MENUS.find((c) => c.cat === state.cat) ?? MENUS[0];

  const toggle = (id: string) => {
    // メニューの排他ルールは lib に集約し、ページ側は選択結果だけ反映します。
    update((prev) => ({ sel: toggleMenuItemId(prev.sel, id) }));
  };

  const next = () => {
    if (!hasSel) return;

    // すでに指名済みなら、スタイリスト選択をスキップして日時選択へ進みます。
    router.push(state.stylist !== undefined ? "/book/date" : "/book/stylist");
  };

  return (
    <main className="mx-auto w-full max-w-[820px] px-5 pt-7 pb-10">
      <h1 className="m-0 mb-1 text-[30px] font-bold">メニュー選択</h1>
      <p className="m-0 mb-[22px] text-[13.5px] text-[var(--sub)]">
        メニューは複数選択できます（表示は税込価格）
      </p>

      <div className="mb-6 flex flex-wrap gap-2.5 border-b border-[var(--line)] pb-0.5">
        {MENUS.map((c) => {
          const on = c.cat === state.cat;
          return (
            <button
              key={c.cat}
              onClick={() => update({ cat: c.cat })}
              className="relative cursor-pointer border-none bg-transparent px-1 pt-2 pb-3.5 text-sm font-bold transition-colors"
              style={{ color: on ? "var(--ink)" : "var(--sub)" }}
            >
              {c.cat}
              <span
                className="absolute right-0 bottom-[-1px] left-0 h-[2.5px] rounded"
                style={{ background: on ? "var(--accent)" : "transparent" }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5">
        {catData.items.map((m) => {
          const on = state.sel.includes(m.id);
          const isConsult = m.group === "consult";
          return (
            <div
              key={m.id}
              onClick={() => toggle(m.id)}
              className="flex cursor-pointer items-start gap-4 rounded-[var(--r)] border-[1.5px] p-4 transition-all hover:shadow-[0_10px_24px_-18px_rgba(60,30,40,.4)]"
              style={{
                background: on ? "var(--soft)" : "var(--surface)",
                borderColor: on ? "var(--accent)" : "var(--line)",
              }}
            >
              <div
                className="font-outfit flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-base font-bold transition-all"
                style={{
                  background: on ? "var(--accent)" : "var(--soft)",
                  color: on ? "var(--accent-ink)" : "var(--accent)",
                }}
              >
                {m.name.charAt(0)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[15.5px] font-bold">{m.name}</span>
                  {m.tag && (
                    <TagLabel>{m.tag}</TagLabel>
                  )}
                </div>
                <span className="text-[12.5px] text-[var(--sub)] [text-wrap:pretty]">
                  {m.desc} ・ 約{m.min}分
                </span>
              </div>
              <div className="flex max-w-[104px] flex-none flex-col items-end gap-2">
                <span
                  className="font-outfit text-right leading-[1.25] font-bold"
                  style={{ fontSize: isConsult ? "13px" : "17px" }}
                >
                  {isConsult ? "カウンセリング無料" : `¥${m.price.toLocaleString("ja-JP")}`}
                </span>
                <div
                  className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 text-xs font-bold text-[var(--accent-ink)] transition-all"
                  style={{
                    borderColor: on ? "var(--accent)" : "var(--line2)",
                    background: on ? "var(--accent)" : "transparent",
                  }}
                >
                  {on ? "✓" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-4 rounded-full bg-[var(--ink)] py-3 pr-3 pl-[26px] text-[var(--bg)] shadow-[0_16px_40px_-14px_rgba(30,15,20,.5)]">
        <div className="flex min-w-0 flex-1 flex-col leading-[1.35]">
          <span className="text-[11px] opacity-70">
            {hasSel ? `${selItems.length}件 選択中` : "メニュー未選択"}
          </span>
          <span className="font-outfit text-[15.5px] font-bold">
            {hasSel && isConsultOnly ? "カウンセリング後に確定" : `¥${selTotalNum.toLocaleString("ja-JP")}`}
            {hasSel && (
              <span className="ml-2 text-[11px] font-medium whitespace-nowrap opacity-70">
                約{selMinNum}分
              </span>
            )}
          </span>
        </div>
        <button
          onClick={next}
          disabled={!hasSel}
          className="ml-auto flex-none cursor-pointer rounded-full border-none px-[22px] py-[13px] text-[13.5px] font-bold tracking-[.03em] whitespace-nowrap transition-all disabled:cursor-default"
          style={{ background: "var(--accent)", color: "var(--accent-ink)", opacity: hasSel ? 1 : 0.35 }}
        >
          スタイリスト選択へ →
        </button>
      </div>
    </main>
  );
}
