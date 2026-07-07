type KpiCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function KpiCard({ label, value, note }: KpiCardProps) {
  return (
    <article className="grid min-h-[116px] gap-1 rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
      <span className="text-xs font-bold text-[#6b7280]">{label}</span>
      <strong className="font-['Outfit'] text-[34px] leading-tight text-[#1f2328]">{value}</strong>
      <small className="text-xs text-[#6b7280]">{note}</small>
    </article>
  );
}
