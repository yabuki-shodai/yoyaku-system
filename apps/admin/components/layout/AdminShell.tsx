"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Account, Screen } from "@/lib/types";

type AdminShellProps = {
  account: Account;
  onLogout: () => void;
  children: ReactNode;
};

export default function AdminShell({ account, onLogout, children }: AdminShellProps) {
  const pathname = usePathname();
  const nav: Array<{ href: string; screen: Screen; label: string }> = account.role === "manager"
    ? [
      { href: "/bookings", screen: "bookings", label: "予約一覧" },
      { href: "/bookings/new", screen: "booking-detail", label: "新規予約登録" },
      { href: "/shifts", screen: "shifts", label: "スタッフ・シフト" },
      { href: "/menus", screen: "menus", label: "メニュー編集" },
      { href: "/reports", screen: "reports", label: "レポート" },
    ]
    : account.role === "reception"
      ? [
        { href: "/bookings", screen: "bookings", label: "予約一覧" },
        { href: "/bookings/new", screen: "booking-detail", label: "新規予約登録" },
      ]
      : [
        { href: "/bookings", screen: "bookings", label: "自分の予約" },
        { href: "/shifts", screen: "shifts", label: "自分のシフト" },
      ];

  const isActive = (href: string) => {
    if (href === "/bookings") return pathname === "/bookings" || (pathname.startsWith("/bookings/") && pathname !== "/bookings/new");
    return pathname === href;
  };

  return (
    <main className="min-h-screen bg-[#eef0f2] text-[#1f2328]">
      <header className="min-h-[74px] border-b border-[#2a2f37] bg-[#171a1f] text-white">
        <div className="mx-auto flex min-h-[74px] max-w-[1500px] items-center gap-7 px-5 max-[1100px]:flex-wrap max-[1100px]:items-start max-[1100px]:gap-3 max-[1100px]:py-3">
          <div className="flex shrink-0 items-center gap-4 max-[720px]:w-full">
            <p className="m-0 font-['Outfit'] text-[22px] font-bold leading-none text-white">
              Lumi<span className="text-[#c17a8f]">.</span>
            </p>
            <p className="m-0 border-l border-[#2a2f37] pl-3.5 font-['Outfit'] text-[11px] font-bold tracking-[.2em] text-[#b7bec8]">ADMIN</p>
          </div>
          <nav className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto max-[1100px]:order-3 max-[1100px]:w-full" aria-label="管理メニュー">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-[42px] shrink-0 rounded-lg border px-[18px] py-2.5 font-bold whitespace-nowrap ${
                  isActive(item.href)
                    ? "border-white bg-white text-[#171a1f]"
                    : "border-transparent bg-transparent text-[#b7bec8] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-3 max-[720px]:ml-0 max-[720px]:w-full">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]" style={{ backgroundColor: account.color }}>{account.name.charAt(0)}</span>
            <div>
              <strong className="block leading-tight">{account.name}</strong>
              <small className="block text-xs text-[#b7bec8]">{account.roleLabel}</small>
            </div>
            <button className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-[#3a414c] bg-transparent px-[18px] py-2 font-bold text-white" onClick={onLogout}>ログアウト</button>
          </div>
        </div>
      </header>
      <section className="mx-auto block max-w-[1500px] px-5 py-7 pb-16 max-[720px]:px-3 max-[720px]:py-5">
        <h1 className="sr-only">Lumi Admin</h1>
        {children}
      </section>
    </main>
  );
}
