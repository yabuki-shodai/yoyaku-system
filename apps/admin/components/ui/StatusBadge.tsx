import type { BookingStatus } from "@/lib/types";

const statusLabels: Record<BookingStatus, string> = {
  confirmed: "確定",
  completed: "完了",
  cancelled: "キャンセル",
};

type StatusBadgeProps = {
  status: BookingStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const className = {
    confirmed: "border-[#d7dbe0] bg-[#eef0f2] text-[#525a66]",
    completed: "border-[#a9cdae] bg-[#e4f0e6] text-[#2f5b36]",
    cancelled: "border-[#d8a8a8] bg-[#f3e3e3] text-[#a13d3d]",
  }[status];

  return (
    <span className={`inline-flex min-h-[25px] items-center rounded-full border px-2.5 py-1 text-xs font-bold leading-none ${className}`}>
      {statusLabels[status]}
    </span>
  );
}
