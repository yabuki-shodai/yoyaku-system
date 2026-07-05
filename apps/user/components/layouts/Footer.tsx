export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] px-5 pt-8 pb-14">
      <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 text-[13px] text-[var(--sub)]">
        <div className="flex flex-col gap-1.5">
          <span className="font-outfit text-xl font-bold text-[var(--ink)]">
            Lumi<span className="text-[var(--accent)]">.</span>
          </span>
          <span>東京都渋谷区神南 1-2-3 LumiBLDG 2F</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-[.1em] text-[var(--ink)]">営業時間</span>
          <span>10:00 – 20:00（火曜定休）</span>
          <span>電話 03-1234-5678</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-[.1em] text-[var(--ink)]">公式アカウント</span>
          <span>Instagram @lumi_hair</span>
          <span>TikTok @lumi.hair</span>
        </div>
      </div>
    </footer>
  );
}
