import Link from "next/link";

type BrandLogoProps = {
  onClick?: () => void;
  className?: string;
};

export default function BrandLogo({ onClick, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`font-outfit text-[26px] font-bold tracking-[.02em] text-[var(--ink)] no-underline ${className}`}
    >
      Lumi<span className="text-[var(--accent)]">.</span>
    </Link>
  );
}
