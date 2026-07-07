"use client";

import ShiftManager from "@/components/staff/ShiftManager";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { BASE_DATE } from "@/lib/date-time";
import { useAdmin } from "@/lib/admin-context";

export default function ShiftsPage() {
  const { bookings, shifts, shiftSubmitted, toggleShift, submitShift } = useAdmin();

  return (
    <ProtectedRoute screen="shifts">
      {(account) => (
        <ShiftManager
          account={account}
          shifts={shifts}
          bookings={bookings.filter((booking) => booking.date === BASE_DATE)}
          submitted={shiftSubmitted}
          onToggle={toggleShift}
          onSubmit={submitShift}
        />
      )}
    </ProtectedRoute>
  );
}
