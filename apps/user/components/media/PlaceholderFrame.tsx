import type { ReactNode } from "react";

type PlaceholderFrameProps = {
  label: ReactNode;
  aspectRatio?: string;
  className?: string;
  labelClassName?: string;
};

export default function PlaceholderFrame({
  label,
  aspectRatio = "1 / 1",
  className = "",
  labelClassName = "",
}: PlaceholderFrameProps) {
  return (
    <div
      className={`placeholder-stripes flex items-center justify-center ${className}`}
      style={{ aspectRatio }}
    >
      <span
        className={`rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] text-[var(--sub)] ${labelClassName}`}
      >
        {label}
      </span>
    </div>
  );
}
