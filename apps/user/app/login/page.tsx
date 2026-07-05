"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useBooking } from "@/lib/booking-context";

export default function LoginPage() {
  const router = useRouter();
  const { state, update } = useBooking();
  const [loginEmail, setLoginEmail] = useState(state.email);
  const [loginPass, setLoginPass] = useState("");
  const isSignup = state.loginTab === "signup";
  const signupReady = Boolean(
    state.signupName.trim() &&
      state.signupEmail.trim() &&
      state.signupPass.trim() &&
      state.agreeTerms
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignup && !signupReady) return;

    // 予約フローやマイページから来た場合は、ログイン後に元の画面へ戻します。
    const nextName = isSignup ? state.signupName.trim() : state.name;
    const nextEmail = isSignup ? state.signupEmail.trim() : loginEmail.trim() || state.email;
    const nextPath = state.returnTo ?? "/mypage";

    update({
      auth: true,
      guestOk: false,
      returnTo: null,
      name: nextName || state.name,
      email: nextEmail,
    });
    router.push(nextPath);
  };

  return (
    <main className="mx-auto flex w-full max-w-[420px] flex-col px-5 pt-[54px] pb-20">
      <div className="rounded-[var(--r)] border border-[var(--line)] bg-[var(--surface)] p-[26px] shadow-[0_16px_40px_-30px_rgba(60,30,40,.45)]">
        <div className="mb-5 flex flex-col gap-1.5 text-center">
          <span className="font-outfit text-xs font-semibold tracking-[.18em] text-[var(--accent)]">
            会員ページ
          </span>
          <h1 className="m-0 text-2xl font-bold">
            {isSignup ? "新規登録" : "ログイン"}
          </h1>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-full bg-[var(--bg)] p-1">
          <button
            type="button"
            onClick={() => update({ loginTab: "login" })}
            className="cursor-pointer rounded-full border-none px-3 py-2.5 text-[13px] font-bold transition-colors"
            style={{
              background: !isSignup ? "var(--surface)" : "transparent",
              color: !isSignup ? "var(--ink)" : "var(--sub)",
              boxShadow: !isSignup ? "0 6px 18px -14px rgba(60,30,40,.45)" : "none",
            }}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => update({ loginTab: "signup" })}
            className="cursor-pointer rounded-full border-none px-3 py-2.5 text-[13px] font-bold transition-colors"
            style={{
              background: isSignup ? "var(--surface)" : "transparent",
              color: isSignup ? "var(--ink)" : "var(--sub)",
              boxShadow: isSignup ? "0 6px 18px -14px rgba(60,30,40,.45)" : "none",
            }}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          {isSignup && (
            <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
              お名前
              <input
                value={state.signupName}
                onChange={(e) => update({ signupName: e.target.value })}
                placeholder="例）木村 さくら"
                className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
            メールアドレス
            <input
              type="email"
              value={isSignup ? state.signupEmail : loginEmail}
              onChange={(e) =>
                isSignup
                  ? update({ signupEmail: e.target.value })
                  : setLoginEmail(e.target.value)
              }
              placeholder="メールアドレスを入力"
              className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs text-[var(--sub)]">
            パスワード
            <input
              type="password"
              value={isSignup ? state.signupPass : loginPass}
              onChange={(e) =>
                isSignup
                  ? update({ signupPass: e.target.value })
                  : setLoginPass(e.target.value)
              }
              placeholder="8文字以上"
              className="rounded-2xl border-[1.5px] border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          {isSignup && (
            <label
              onClick={() => update((prev) => ({ agreeTerms: !prev.agreeTerms }))}
              className="mt-1 flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-[1.6] text-[var(--sub)]"
            >
              <input
                type="checkbox"
                checked={state.agreeTerms}
                readOnly
                className="mt-1 h-[16px] w-[16px] flex-none accent-[var(--accent)]"
              />
              <span>利用規約・プライバシーポリシーに同意します</span>
            </label>
          )}

          <button
            type="submit"
            disabled={isSignup && !signupReady}
            className="mt-1 cursor-pointer rounded-full border-none bg-[var(--accent)] py-[15px] text-[14.5px] font-bold tracking-[.04em] text-[var(--accent-ink)] shadow-[0_10px_28px_-10px_var(--accent)] transition-[filter] hover:brightness-[1.06] disabled:cursor-default"
            style={{ opacity: isSignup && !signupReady ? 0.4 : 1 }}
          >
            {isSignup ? "登録してはじめる" : "ログイン"}
          </button>
        </form>

        {!isSignup && (
          <button
            type="button"
            className="mt-4 w-full cursor-pointer border-none bg-transparent py-1 text-center text-[12.5px] text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
          >
            パスワードをお忘れですか？
          </button>
        )}
      </div>
    </main>
  );
}
