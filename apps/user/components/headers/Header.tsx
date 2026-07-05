"use client";

import { useState } from "react";
import { useBooking } from "@/lib/booking-context";
import HeaderView from "./HeaderView";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { state } = useBooking();
  const authed = state.auth;

  // Context のログイン状態を、表示専用の HeaderView が扱いやすい props に変換します。
  return (
    <HeaderView
      open={open}
      onToggle={() => setOpen((value) => !value)}
      onClose={() => setOpen(false)}
      account={{
        authed,
        href: authed ? "/mypage" : "/login",
        label: authed ? state.name.split(" ")[0] || "マイページ" : "ログイン",
        avatarChar: (state.name || "L").charAt(0),
      }}
    />
  );
}
