import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-[22px] flex items-baseline gap-3.5 ${className}`}>
      <h2 className="m-0 text-2xl font-bold">{title}</h2>
      {subtitle && <span className="text-[12.5px] text-[var(--sub)]">{subtitle}</span>}
    </div>
  );
}
