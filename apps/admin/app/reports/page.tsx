"use client";

import ReportsDashboard from "@/components/reports/ReportsDashboard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { BASE_DATE } from "@/lib/date-time";
import { useAdmin } from "@/lib/admin-context";

export default function ReportsPage() {
  const { bookings } = useAdmin();

  return (
    <ProtectedRoute screen="reports">
      {() => <ReportsDashboard todayBookings={bookings.filter((booking) => booking.date === BASE_DATE)} />}
    </ProtectedRoute>
  );
}
