"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";

export default function BookDonePage() {
  const router = useRouter();
  const { state } = useBooking();
  const { selItems, dateLabelFull, stylistName, feeNum } = useBookingComputed();

  const cMenus = selItems.map((m) => m.name).join("＋") || "—";
  const cStylist = stylistName + (feeNum ? ` ・ 指名料込み` : "");
  const doneId = state.doneId || "LM-2607-0000";

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[18px] px-5 pt-[60px] pb-20 text-center">
      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[var(--accent)] text-[34px] font-bold text-[var(--accent-ink)] shadow-[0_14px_34px_-12px_var(--accent)]">
        ✓
      </div>
      <h1 className="m-0 text-2xl font-bold">ご予約が完了しました</h1>
      <p className="m-0 text-[13.5px] text-[var(--sub)] [text-wrap:pretty]">
        確認メールをお送りしました。変更・キャンセルはマイページ、または前日20:00までお電話で承ります。
      </p>
      <div className="flex w-full max-w-[400px] flex-col gap-2 rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] px-[30px] py-6">
        <span className="font-outfit text-[11px] font-semibold tracking-[.16em] text-[var(--sub)]">
          予約番号
        </span>
        <span className="font-outfit text-2xl font-bold tracking-[.06em] text-[var(--accent)]">
          {doneId}
        </span>
        <span className="mt-1.5 font-bold">{dateLabelFull}</span>
        <span className="text-[13px] text-[var(--sub)]">
          {cMenus} ／ {cStylist}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => router.push("/mypage")}
          className="cursor-pointer rounded-full border-none bg-[var(--ink)] px-7 py-[13px] text-[13.5px] font-bold text-[var(--bg)] transition-[filter] hover:brightness-[1.15]"
        >
          マイページで確認
        </button>
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer rounded-full border-[1.5px] border-[var(--line)] bg-transparent px-[26px] py-3 text-[13.5px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          ホームへ戻る
        </button>
      </div>
    </main>
  );
}
