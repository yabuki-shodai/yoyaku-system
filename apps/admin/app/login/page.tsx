"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginScreen from "@/components/auth/LoginScreen";
import { useAdmin } from "@/lib/admin-context";

export default function LoginPage() {
  const router = useRouter();
  const { account, login } = useAdmin();
  const [error, setError] = useState("");

  useEffect(() => {
    if (account) router.replace("/bookings");
  }, [account, router]);

  return (
    <LoginScreen
      error={error}
      onLogin={(loginId, password) => {
        if (!login(loginId, password)) {
          setError("IDまたはパスワードが正しくありません。");
          return;
        }
        setError("");
        router.replace("/bookings");
      }}
    />
  );
}
