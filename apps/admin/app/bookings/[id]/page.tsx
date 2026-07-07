"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BookingDetail from "@/components/bookings/BookingDetail";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAdmin } from "@/lib/admin-context";
import { canViewBooking } from "@/lib/permission-service";
import type { Account } from "@/lib/types";

export default function BookingDetailPage() {
  return (
    <ProtectedRoute screen="booking-detail">
      {(account) => <BookingDetailContent account={account} />}
    </ProtectedRoute>
  );
}

function BookingDetailContent({ account }: { account: Account }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { bookings, menus, updateBooking, updateBookingStatus } = useAdmin();
  const booking = bookings.find((item) => item.id === params.id) ?? null;

  useEffect(() => {
    if (!booking || !canViewBooking(account, booking)) router.replace("/bookings");
  }, [account, booking, router]);

  if (!booking || !canViewBooking(account, booking)) return null;

  return (
    <BookingDetail
      account={account}
      booking={booking}
      menus={menus}
      bookings={bookings}
      onBack={() => router.push("/bookings")}
      onCreate={() => undefined}
      onUpdate={(bookingId, patch) => {
        updateBooking(bookingId, patch);
        router.push("/bookings");
      }}
      onStatus={(bookingId, status) => {
        updateBookingStatus(bookingId, status);
        router.push("/bookings");
      }}
    />
  );
}
