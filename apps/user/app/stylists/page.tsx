"use client";

import { useRouter } from "next/navigation";
import PillButton from "@/components/buttons/PillButton";
import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { useBooking } from "@/lib/booking-context";
import { STYLISTS } from "@/lib/data";

const QUOTES = [
  "トレンドを取り入れつつ、その人の“らしさ”を大切にしたいです。",
  "骨格・質感診断から似合わせるスタイルを一緒に探します。",
  "再現性重視。おうちでのスタイリングまでご提案します。",
  "髪の悩みに寄り添う丁寧なカウンセリングが得意です。",
];

export default function StylistInfoPage() {
  const router = useRouter();
  const { update } = useBooking();

  const bookThis = (stylistId: string) => {
    // スタイリスト紹介ページからは、指名だけ先に保存してメニュー選択へ進みます。
    const stylist = STYLISTS.find((s) => s.id === stylistId)!;
    update({ stylist, sel: [] });
    router.push("/book/menu");
  };

  return (
    <main className="mx-auto w-full max-w-[900px] px-5 pt-9 pb-[60px]">
      <span className="font-outfit text-xs font-semibold tracking-[.22em] text-[var(--accent)]">
        スタッフ紹介
      </span>
      <h1
        className="m-0 mt-2 mb-1.5 font-bold [text-wrap:pretty]"
        style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
      >
        スタイリスト紹介
      </h1>
      <p className="m-0 mb-11 text-sm text-[var(--sub)]">
        それぞれの得意分野から、あなたに合うスタイリストを見つけてください。
      </p>

      {STYLISTS.map((st, i) => (
        <section
          key={st.id}
          className={`flex flex-wrap items-center gap-9 border-b border-[var(--line)] py-9 ${
            i % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <PlaceholderFrame
            label="スタッフ写真"
            aspectRatio="1 / 1.1"
            className="w-[220px] flex-none rounded-[20px]"
          />
          <div className="flex min-w-[260px] flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="font-outfit text-[26px] font-bold tracking-[.08em]">
                {st.name}
              </span>
              <span className="text-xs font-bold text-[var(--accent)]">{st.role}</span>
            </div>
            <p className="m-0 text-[14.5px] [text-wrap:pretty]">“{QUOTES[i % 4]}”</p>
            <div className="flex flex-wrap gap-1.5">
              {st.spec.split("・").map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[11.5px] text-[var(--sub)]"
                >
                  {chip}
                </span>
              ))}
            </div>
            <span className="font-outfit text-xs text-[var(--sub)]">
              @lumi_{st.name.toLowerCase()}
            </span>
            <PillButton
              onClick={() => bookThis(st.id)}
              className="mt-1.5 self-start px-[26px] py-3"
            >
              {st.name}を指名して予約する
            </PillButton>
          </div>
        </section>
      ))}
    </main>
  );
}
