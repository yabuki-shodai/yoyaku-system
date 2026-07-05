"use client";

import { useRouter } from "next/navigation";
import PillButton from "@/components/buttons/PillButton";
import TagLabel from "@/components/labels/TagLabel";
import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { useBooking } from "@/lib/booking-context";
import { MENUS, yen } from "@/lib/data";

export default function MenuInfoPage() {
  const router = useRouter();
  const { update } = useBooking();

  const bookThis = (id: string, cat: string) => {
    // メニュー紹介ページから予約へ進むときは、そのメニューを選択済みにします。
    update({ sel: [id], cat, stylist: undefined });
    router.push("/book/menu");
  };

  return (
    <main className="mx-auto w-full max-w-[960px] px-5 pt-9 pb-[60px]">
      <span className="font-outfit text-xs font-semibold tracking-[.22em] text-[var(--accent)]">
        メニュー一覧
      </span>
      <h1
        className="m-0 mt-2 mb-1.5 font-bold [text-wrap:pretty]"
        style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
      >
        メニュー・料金のご案内
      </h1>
      <p className="m-0 mb-10 text-sm text-[var(--sub)]">
        表示は税込価格です。ご予約は各メニューの「予約する」からどうぞ。
      </p>

      {MENUS.map((group) => (
        <section key={group.cat} className="mb-[46px]">
          <h2 className="mb-[18px] inline-block border-b-2 border-[var(--ink)] pb-2.5 text-xl font-bold">
            {group.cat}
          </h2>
          <div className="flex flex-col gap-0.5">
            {group.items.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center gap-5 border-b border-[var(--line)] py-5"
              >
                <PlaceholderFrame
                  label="メニュー写真"
                  className="h-[88px] w-[88px] flex-none rounded-2xl"
                  labelClassName="text-[10px]"
                />
                <div className="flex min-w-[200px] flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[17px] font-bold">{m.name}</span>
                    {m.tag && (
                      <TagLabel>{m.tag}</TagLabel>
                    )}
                  </div>
                  <span className="text-[13px] text-[var(--sub)]">
                    {m.desc} ・ 約{m.min}分
                  </span>
                </div>
                <div className="flex flex-none flex-col items-end gap-2">
                  <span className="font-outfit text-xl font-bold">
                    {m.group === "consult" ? "カウンセリング無料" : yen(m.price)}
                  </span>
                  <PillButton
                    variant="secondary"
                    onClick={() => bookThis(m.id, group.cat)}
                    className="border-[var(--ink)] px-[18px] py-2 text-[12.5px] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
                  >
                    予約する
                  </PillButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
