"use client";

import { usePathname } from "next/navigation";
import StepBar from "@/components/booking/StepBar";
import SummaryBar from "@/components/booking/SummaryBar";
import { getStep } from "@/lib/booking-steps";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inFlow = !!getStep(pathname);

  return (
    <>
      {inFlow && <StepBar pathname={pathname} />}
      {inFlow && <SummaryBar pathname={pathname} />}
      {children}
    </>
  );
}
