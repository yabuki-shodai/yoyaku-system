"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingTimeline from "@/components/bookings/BookingTimeline";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { dateKeyFromOffset, dateLabelFromOffset } from "@/lib/date-time";
import { useAdmin } from "@/lib/admin-context";
import type { Booking } from "@/lib/types";

export default function BookingsPage() {
  const router = useRouter();
  const { bookings } = useAdmin();
  const [dayOffset, setDayOffset] = useState(0);

  return (
    <ProtectedRoute screen="bookings">
      {(account) => (
        <BookingTimeline
          account={account}
          dateLabel={dateLabelFromOffset(dayOffset)}
          dateKey={dateKeyFromOffset(dayOffset)}
          dayOffset={dayOffset}
          bookings={bookings}
          onPrevDay={() => setDayOffset((value) => value - 1)}
          onNextDay={() => setDayOffset((value) => value + 1)}
          onToday={() => setDayOffset(0)}
          onOpenNew={() => router.push("/bookings/new")}
          onOpenBooking={(booking: Booking) => router.push(`/bookings/${booking.id}`)}
        />
      )}
    </ProtectedRoute>
  );
}
