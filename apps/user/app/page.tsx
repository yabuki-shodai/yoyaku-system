"use client";

import { useRouter } from "next/navigation";
import PillButton from "@/components/buttons/PillButton";
import Footer from "@/components/layouts/Footer";
import SectionHeading from "@/components/labels/SectionHeading";
import TagLabel from "@/components/labels/TagLabel";
import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { useBooking } from "@/lib/booking-context";
import { ALL_ITEMS, MENUS, PICKUP_ITEM_IDS, STYLISTS, yen } from "@/lib/data";

const pickupItems = PICKUP_ITEM_IDS.map(
  (id) => ALL_ITEMS.find((m) => m.id === id)!
);

export default function Home() {
  const router = useRouter();
  const { update } = useBooking();

  const pickMenu = (id: string) => {
    // ホームのおすすめから予約へ進むため、選んだメニューとカテゴリを先に保存します。
    const cat = MENUS.find((c) => c.items.some((m) => m.id === id))!.cat;
    update({ sel: [id], cat });
    router.push("/book/menu");
  };

  const pickStylistFromHome = (stylistId: string) => {
    // スタイリストだけ先に指名し、メニュー選択後は指名ステップを飛ばせる状態にします。
    const stylist = STYLISTS.find((s) => s.id === stylistId)!;
    update({ stylist });
    router.push("/book/menu");
  };

  return (
    <>
      <main className="mx-auto w-full max-w-[1080px] px-5 pt-9 pb-[60px]">
        {/* Hero */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-9">
          <div className="flex flex-col gap-5">
            <span className="font-outfit text-xs font-semibold tracking-[.22em] text-[var(--accent)]">
              渋谷の美容室
            </span>
            <h1
              className="m-0 font-bold leading-[1.3] tracking-[.01em] [text-wrap:pretty]"
              style={{ fontSize: "clamp(34px, 5vw, 52px)" }}
            >
              なりたい私に、
              <br />
              最短距離で。
            </h1>
            <p className="m-0 max-w-[42ch] text-[15px] text-[var(--sub)] [text-wrap:pretty]">
              トレンドのレイヤー、韓国風カラー、髪質改善まで。Lumiはあなたの「好き」を一緒に見つけるサロンです。24時間いつでもオンライン予約できます。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PillButton
                href="/book/menu"
                className="px-[34px] py-[15px] text-[15px] tracking-[.04em] transition-transform hover:-translate-y-px"
              >
                今すぐ予約する
              </PillButton>
              <PillButton href="/menu" variant="secondary" className="text-sm font-medium">
                メニューを見る
              </PillButton>
            </div>
            <div className="flex flex-wrap gap-6 text-[12.5px] text-[var(--sub)]">
              <span>営業 10:00–20:00</span>
              <span>火曜定休</span>
              <span>渋谷駅 徒歩4分</span>
            </div>
          </div>
          <PlaceholderFrame
            label="サロン写真"
            aspectRatio="4 / 4.6"
            className="rounded-[var(--r)]"
            labelClassName="px-3.5 py-1.5 text-xs"
          />
        </section>

        {/* おすすめ */}
        <section className="mt-[70px]">
          <SectionHeading title="おすすめ" subtitle="今月の人気メニュー" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {pickupItems.map((m) => (
              <button
                key={m.id}
                onClick={() => pickMenu(m.id)}
                className="flex cursor-pointer flex-col gap-2.5 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-[22px] text-left transition-all hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-18px_rgba(60,30,40,.35)]"
              >
                <TagLabel className="self-start px-3 text-[11px] tracking-[.08em]">
                  {m.tag ?? "おすすめ"}
                </TagLabel>
                <span className="text-[17px] font-bold">{m.name}</span>
                <span className="text-[12.5px] text-[var(--sub)]">{m.desc}</span>
                <span className="font-outfit mt-auto text-xl font-bold">
                  {yen(m.price)}
                  <span className="ml-2 text-xs font-medium text-[var(--sub)]">
                    約{m.min}分
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* スタイリスト */}
        <section className="mt-[70px]">
          <SectionHeading title="スタイリスト" subtitle="お気に入りを見つけて指名しよう" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {STYLISTS.map((st) => (
              <button
                key={st.id}
                onClick={() => pickStylistFromHome(st.id)}
                className="flex cursor-pointer flex-col items-start gap-3 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-all hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-18px_rgba(60,30,40,.35)]"
              >
                <PlaceholderFrame
                  label="スタッフ写真"
                  aspectRatio="1 / 1.15"
                  className="w-full rounded-2xl"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-outfit text-lg font-bold tracking-[.08em]">
                    {st.name}
                  </span>
                  <span className="text-[11.5px] font-bold text-[var(--accent)]">
                    {st.role}
                  </span>
                  <span className="text-xs text-[var(--sub)]">{st.spec}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
