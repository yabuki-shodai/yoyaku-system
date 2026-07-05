import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PillButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "onClick">;

const variantClasses = {
  primary:
    "border-none bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_10px_28px_-10px_var(--accent)] hover:brightness-[1.06]",
  secondary:
    "border-[1.5px] border-[var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  dark:
    "border-none bg-[var(--ink)] text-[var(--bg)] hover:brightness-[1.15]",
  ghost:
    "border-none bg-transparent text-[var(--sub)] hover:text-[var(--ink)]",
};

export default function PillButton({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  ...buttonProps
}: PillButtonProps) {
  const classes = `inline-flex cursor-pointer items-center justify-center rounded-full px-7 py-3.5 text-[13.5px] font-bold transition-all ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
