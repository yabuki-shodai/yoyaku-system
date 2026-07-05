import type { ReactNode } from "react";

type TagLabelProps = {
  children: ReactNode;
  className?: string;
};

export default function TagLabel({ children, className = "" }: TagLabelProps) {
  return (
    <span
      className={`inline-flex rounded-full bg-[var(--soft)] px-2.5 py-1 text-[10.5px] font-bold tracking-[.06em] text-[var(--accent)] ${className}`}
    >
      {children}
    </span>
  );
}
