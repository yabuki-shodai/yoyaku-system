"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";

export default function AuthGatePage() {
  const router = useRouter();
  const { state, update } = useBooking();
  const { hasSel, canConfirmDate } = useBookingComputed();

  useEffect(() => {
    if (!hasSel) {
      router.replace("/book/menu");
      return;
    }
    if (!canConfirmDate) {
      router.replace("/book/date");
      return;
    }
    if (state.auth || state.guestOk) router.replace("/book/confirm");
  }, [hasSel, canConfirmDate, state.auth, state.guestOk, router]);

  const gateLogin = () => {
    // ログイン完了後に予約確認へ戻れるよう、戻り先を保存します。
    update({ returnTo: "/book/confirm" });
    router.push("/login");
  };

  const gateGuest = () => {
    // ゲスト続行を選んだ場合だけ、未ログインでも確認画面へ進めます。
    update({ guestOk: true });
    router.push("/book/confirm");
  };

  if (!hasSel || !canConfirmDate || state.auth || state.guestOk) return null;

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 px-5 pt-[60px] pb-20 text-center">
      <h1 className="m-0 text-2xl font-bold">ご予約の前に</h1>
      <p className="m-0 text-[13.5px] text-[var(--sub)] [text-wrap:pretty]">
        ログインすると次回から入力不要・予約履歴やポイントを確認できます。ログインせずゲストとして予約を続けることもできます。
      </p>
      <div className="mt-3 flex w-full flex-col gap-3">
        <button
          onClick={gateLogin}
          className="cursor-pointer rounded-full border-none bg-[var(--accent)] py-[15px] text-[14.5px] font-bold text-[var(--accent-ink)] transition-[filter] hover:brightness-[1.06]"
        >
          ログイン / 会員登録する
        </button>
        <button
          onClick={gateGuest}
          className="cursor-pointer rounded-full border-[1.5px] border-[var(--line)] bg-transparent py-3.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          ゲストとして予約を続ける
        </button>
      </div>
    </main>
  );
}
