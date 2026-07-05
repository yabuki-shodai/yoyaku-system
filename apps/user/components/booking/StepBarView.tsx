type StepBarViewProps = {
  label: string;
  percent: string;
};

export default function StepBarView({ label, percent }: StepBarViewProps) {
  return (
    <div className="mx-auto max-w-[1080px] px-5 pt-[18px]">
      <div className="flex items-center gap-3">
        <span className="font-outfit text-xs font-semibold tracking-[.14em] text-[var(--accent)]">
          {label}
        </span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--soft)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-[400ms] ease-in-out"
            style={{ width: percent }}
          />
        </div>
      </div>
    </div>
  );
}
