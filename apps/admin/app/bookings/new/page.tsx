"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingDetail from "@/components/bookings/BookingDetail";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAdmin } from "@/lib/admin-context";
import { canCreateBooking } from "@/lib/permission-service";
import type { Account } from "@/lib/types";

export default function NewBookingPage() {
  return (
    <ProtectedRoute screen="booking-detail">
      {(account) => <NewBookingContent account={account} />}
    </ProtectedRoute>
  );
}

function NewBookingContent({ account }: { account: Account }) {
  const router = useRouter();
  const { bookings, menus, createBooking } = useAdmin();

  useEffect(() => {
    if (!canCreateBooking(account)) router.replace("/bookings");
  }, [account, router]);

  if (!canCreateBooking(account)) return null;

  return (
    <BookingDetail
      account={account}
      booking={null}
      menus={menus}
      bookings={bookings}
      onBack={() => router.push("/bookings")}
      onCreate={(draft) => {
        const created = createBooking(draft);
        if (created) router.push("/bookings");
      }}
      onUpdate={() => undefined}
      onStatus={() => undefined}
    />
  );
}
