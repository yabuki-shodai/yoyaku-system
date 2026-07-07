"use client";

import { useState } from "react";

type LoginScreenProps = {
  error: string;
  onLogin: (loginId: string, password: string) => void;
};

export default function LoginScreen({ error, onLogin }: LoginScreenProps) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen bg-[#eef0f2] text-[#1f2328]">
      <header className="h-[72px] border-b border-[#2a2f37] bg-[#171a1f] text-white">
        <div className="flex h-full items-center px-8">
          <div className="flex items-center gap-3.5">
            <p className="m-0 font-['Outfit'] text-[22px] font-bold leading-none text-white">
              Lumi<span className="text-[#c17a8f]">.</span>
            </p>
            <p className="m-0 border-l border-[#2a2f37] pl-3 font-['Outfit'] text-[11px] font-bold tracking-[.2em] text-[#b7bec8]">ADMIN</p>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-[62px] grid w-full max-w-[462px] gap-6 rounded-2xl border border-[#d7dbe0] bg-white p-8 shadow-[0_18px_50px_-38px_rgba(31,35,40,.65)]">
        <div>
          <h1 className="m-0 text-[26px] font-bold leading-tight tracking-normal text-[#1f2328]">管理システムにログイン</h1>
          <p className="mt-3 text-sm leading-6 text-[#8b93a1]">スタッフID とパスワードを入力してください。</p>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">スタッフID</span>
            <input
              className="h-[52px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-4 py-3 font-bold text-[#1f2328] outline-none placeholder:text-[#8b93a1] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15"
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="staff ID"
              autoComplete="username"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">パスワード</span>
            <input
              className="h-[52px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-4 py-3 font-bold text-[#1f2328] outline-none placeholder:text-[#8b93a1] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onLogin(loginId, password);
              }}
              type="password"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="m-0 rounded-lg border border-[#d8a8a8] bg-[#f3e3e3] px-3 py-2 text-[#a13d3d]">{error}</p>}
          <button className="mt-0.5 inline-flex h-[56px] items-center justify-center rounded-lg border border-[#171a1f] bg-[#171a1f] px-4 py-2 font-bold text-white" onClick={() => onLogin(loginId, password)}>ログイン</button>
        </div>

        <div className="border-t border-dashed border-[#d7dbe0] pt-4">
          <p className="m-0 text-xs font-bold text-[#b7bec8]">デモ用ログインID（パスワードは任意）</p>
          <p className="mt-2 text-xs leading-6 text-[#6b7280]">
            管理者： <strong>manager</strong> ／ 受付： <strong>reception</strong> ／ スタッフ： <strong>rio, mei, sora, hina</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
