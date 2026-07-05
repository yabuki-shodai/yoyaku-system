type SummaryChip = {
  label: string;
  value: string;
  href: string;
  enabled: boolean;
  active: boolean;
  strong?: boolean;
};

type SummaryBarViewProps = {
  chips: SummaryChip[];
  onJump: (href: string, enabled: boolean) => void;
};

export default function SummaryBarView({ chips, onJump }: SummaryBarViewProps) {
  return (
    <div className="sticky top-[63px] z-40 border-b border-[var(--line)] bg-[var(--hdr)] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-2 px-5 py-2.5">
        {chips.map((chip, index) => (
          <div key={chip.href} className="contents">
            {index > 0 && <span className="text-xs text-[var(--line2)]">›</span>}
            <button
              onClick={() => onJump(chip.href, chip.enabled)}
              disabled={!chip.enabled}
              className="flex items-center gap-1.5 rounded-full border-[1.5px] bg-[var(--surface)] px-3.5 py-1.5 text-xs text-[var(--ink)] transition-colors disabled:cursor-default"
              style={{
                cursor: chip.enabled ? "pointer" : "default",
                opacity: chip.enabled ? 1 : 0.45,
                borderColor: chip.active ? "var(--accent)" : "var(--line)",
              }}
            >
              <span className="font-bold text-[var(--sub)]">{chip.label}</span>
              <span className={chip.strong ? "font-bold text-[var(--ink)]" : "text-[var(--sub)]"}>
                {chip.value}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
