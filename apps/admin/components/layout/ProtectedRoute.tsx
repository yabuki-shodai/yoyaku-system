"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";
import { useAdmin } from "@/lib/admin-context";
import { canAccessScreen } from "@/lib/permission-service";
import type { Account, Screen } from "@/lib/types";

type ProtectedRouteProps = {
  screen: Screen;
  children: (account: Account) => ReactNode;
};

export default function ProtectedRoute({ screen, children }: ProtectedRouteProps) {
  const router = useRouter();
  const { account, logout } = useAdmin();

  useEffect(() => {
    if (!account) {
      router.replace("/login");
      return;
    }
    if (!canAccessScreen(account, screen)) {
      router.replace("/bookings");
    }
  }, [account, router, screen]);

  if (!account || !canAccessScreen(account, screen)) return null;

  return (
    <AdminShell account={account} onLogout={() => {
      logout();
      router.replace("/login");
    }}>
      {children(account)}
    </AdminShell>
  );
}
