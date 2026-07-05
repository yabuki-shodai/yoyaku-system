import Link from "next/link";
import BrandLogo from "./BrandLogo";

export type HeaderAccount = {
  href: string;
  label: string;
  avatarChar: string;
  authed: boolean;
};

type HeaderViewProps = {
  open: boolean;
  account: HeaderAccount;
  onToggle: () => void;
  onClose: () => void;
};

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/menu", label: "メニュー" },
  { href: "/stylists", label: "スタイリスト" },
];

function AccountLink({
  account,
  onClick,
  className = "",
}: {
  account: HeaderAccount;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Link
      href={account.href}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-bold text-[var(--ink)] transition-colors hover:bg-[var(--soft)] ${className}`}
    >
      {account.authed && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10.5px] text-[var(--accent-ink)]">
          {account.avatarChar}
        </span>
      )}
      {account.label}
    </Link>
  );
}

export default function HeaderView({
  open,
  account,
  onToggle,
  onClose,
}: HeaderViewProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--hdr)] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1080px] items-center gap-[18px] px-5 py-3">
        <BrandLogo onClick={onClose} />

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-[var(--sub)] transition-colors hover:bg-[var(--soft)] hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
          <AccountLink account={account} onClick={onClose} />
          <Link
            href="/book/menu"
            onClick={onClose}
            className="rounded-full bg-[var(--accent)] px-[22px] py-2.5 text-[13px] font-bold tracking-[.05em] text-[var(--accent-ink)] transition-[filter] hover:brightness-[1.06]"
          >
            予約する
          </Link>
        </nav>

        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          className="ml-auto flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)] md:hidden"
        >
          <span
            className="h-[2px] w-4 rounded-full bg-[var(--ink)] transition-transform"
            style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }}
          />
          <span
            className="h-[2px] w-4 rounded-full bg-[var(--ink)] transition-opacity"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="h-[2px] w-4 rounded-full bg-[var(--ink)] transition-transform"
            style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--line)] bg-[var(--hdr)] px-5 py-3 backdrop-blur-[14px] md:hidden">
          <div className="mx-auto flex max-w-[1080px] flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-2xl px-4 py-3 text-[14px] font-medium text-[var(--sub)] transition-colors hover:bg-[var(--soft)] hover:text-[var(--ink)]"
              >
                {link.label}
              </Link>
            ))}
            <AccountLink account={account} onClick={onClose} className="px-4 py-3" />
            <Link
              href="/book/menu"
              onClick={onClose}
              className="mt-1 rounded-full bg-[var(--accent)] px-5 py-3.5 text-center text-[14px] font-bold tracking-[.05em] text-[var(--accent-ink)] transition-[filter] hover:brightness-[1.06]"
            >
              予約する
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
