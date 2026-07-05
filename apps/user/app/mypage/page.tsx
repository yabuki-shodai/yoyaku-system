"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { POINTS_BALANCE } from "@/lib/booking-helpers";
import { ITEM_MAP, MENUS } from "@/lib/data";

export default function MyPage() {
  const router = useRouter();
  const { state, update, dates } = useBooking();

  if (!state.auth) {
    return (
      <main className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 px-5 pt-[60px] pb-20 text-center">
        <h1 className="m-0 text-2xl font-bold">マイページ</h1>
        <p className="m-0 text-[13.5px] text-[var(--sub)]">
          マイページの閲覧にはログインが必要です。
        </p>
        <button
          onClick={() => {
            update({ returnTo: "/mypage" });
            router.push("/login");
          }}
          className="cursor-pointer rounded-full border-none bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[var(--accent-ink)] transition-[filter] hover:brightness-[1.06]"
        >
          ログイン / 会員登録する
        </button>
      </main>
    );
  }

  const doLogout = () => {
    // ログアウト時はゲスト続行フラグも消して、次回予約時に再度確認を出します。
    update({ auth: false, guestOk: false });
    router.push("/");
  };

  const cancelBooking = (id: string) => {
    // デモではブラウザ標準の確認ダイアログでキャンセル操作を表現します。
    if (confirm("この予約をキャンセルしますか？")) {
      update((prev) => ({ bookings: prev.bookings.filter((b) => b.id !== id) }));
    }
  };

  const rebook = (itemIds: string[]) => {
    // 来店履歴と同じメニューを選択済みにして、予約フローの最初へ戻します。
    const items = itemIds.filter((id) => ITEM_MAP[id]);
    const cat = items.length ? MENUS.find((c) => c.items.some((m) => m.id === items[0]))!.cat : state.cat;
    update({ sel: items, cat });
    router.push("/book/menu");
  };

  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pt-7 pb-[60px]">
      <h1 className="m-0 mb-[22px] text-[30px] font-bold">マイページ</h1>

      <div className="flex flex-wrap items-center gap-[18px] rounded-[var(--r)] bg-[var(--ink)] px-[26px] py-6 text-[var(--bg)]">
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[var(--accent)] text-xl font-bold text-[var(--accent-ink)]">
          {(state.name || "ル").charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[17px] font-bold">{state.name} さん</span>
          <span className="text-xs opacity-70">会員ランク：シルバー ・ ご来店 8回</span>
        </div>
        <div className="ml-auto flex flex-col items-end gap-2 text-right">
          <div className="flex flex-col">
            <span className="text-[11px] opacity-70">保有ポイント</span>
            <span className="font-outfit text-2xl font-bold text-[var(--accent)]">
              {POINTS_BALANCE}
              <span className="ml-1 text-xs">ポイント</span>
            </span>
          </div>
          <button
            onClick={doLogout}
            className="cursor-pointer self-end rounded-full border border-white/25 bg-transparent px-3.5 py-1.5 text-[11.5px] text-inherit transition-colors hover:border-white/50"
          >
            ログアウト
          </button>
        </div>
      </div>

      <h2 className="mt-8 mb-3.5 flex items-center gap-2.5 text-[15px] font-bold">
        次回のご予約
        <span className="rounded-full bg-[var(--soft)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--accent)]">
          {state.bookings.length}件
        </span>
      </h2>
      {state.bookings.length > 0 ? (
        <div className="flex flex-col gap-3">
          {state.bookings.map((b) => {
            const d = dates[b.dateI] ?? dates[5];
            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center gap-4 rounded-[var(--r)] border-[1.5px] border-[var(--accent)] bg-[var(--surface)] px-[22px] py-5"
              >
                <div className="flex flex-none flex-col items-center rounded-2xl bg-[var(--soft)] px-4 py-2.5">
                  <span className="text-[10.5px] font-bold text-[var(--accent)]">{d.m}月</span>
                  <span className="font-outfit text-[22px] leading-[1.1] font-bold">{d.day}</span>
                  <span className="text-[10.5px] text-[var(--sub)]">({d.w})</span>
                </div>
                <div className="flex min-w-[180px] flex-1 flex-col gap-0.5">
                  <span className="font-bold">
                    {b.time} ～ ・ {b.menus}
                  </span>
                  <span className="text-[12.5px] text-[var(--sub)]">
                    担当：{b.stylist} ・ {b.total}
                  </span>
                  <span className="font-outfit text-[11px] text-[var(--sub)]">{b.id}</span>
                </div>
                <button
                  onClick={() => cancelBooking(b.id)}
                  className="cursor-pointer rounded-full border-[1.5px] border-[var(--line)] bg-transparent px-[18px] py-2.5 text-xs font-bold text-[var(--sub)] transition-colors hover:border-[#c96b6b] hover:text-[#c96b6b]"
                >
                  キャンセル
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3.5 rounded-[var(--r)] border-[1.5px] border-dashed border-[var(--line2)] p-7 text-center text-[13.5px] text-[var(--sub)]">
          <span>予約はまだありません</span>
          <button
            onClick={() => router.push("/book/menu")}
            className="cursor-pointer rounded-full border-none bg-[var(--accent)] px-[26px] py-3 text-[13px] font-bold text-[var(--accent-ink)] transition-[filter] hover:brightness-[1.06]"
          >
            新しく予約する
          </button>
        </div>
      )}

      <h2 className="mt-[34px] mb-3.5 text-[15px] font-bold">ご来店履歴</h2>
      <div className="flex flex-col">
        {state.history.map((h, i) => (
          <div key={i} className="flex flex-wrap items-center gap-4 border-b border-[var(--line)] py-3.5">
            <span className="font-outfit w-[86px] flex-none text-[13px] font-semibold text-[var(--sub)]">
              {h.date}
            </span>
            <div className="flex min-w-[160px] flex-1 flex-col">
              <span className="text-[13.5px] font-bold">{h.menus}</span>
              <span className="text-xs text-[var(--sub)]">担当：{h.stylist}</span>
            </div>
            <span className="font-outfit text-[13.5px] font-semibold">{h.total}</span>
            <button
              onClick={() => rebook(h.itemIds)}
              className="cursor-pointer rounded-full border-[1.5px] border-[var(--line)] bg-transparent px-4 py-2 text-xs font-bold text-[var(--accent)] transition-colors hover:border-[var(--accent)]"
            >
              再予約
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
