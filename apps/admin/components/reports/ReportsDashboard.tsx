import KpiCard from "@/components/ui/KpiCard";
import { formatYen } from "@/lib/date-time";
import { monthlySummary, stylists } from "@/lib/mock-data";
import type { Booking } from "@/lib/types";

type ReportsDashboardProps = {
  todayBookings: Booking[];
};

export default function ReportsDashboard({ todayBookings }: ReportsDashboardProps) {
  const activeBookings = todayBookings.filter((booking) => booking.status !== "cancelled");
  const todayRevenue = activeBookings.reduce((sum, booking) => sum + booking.total, 0);
  const monthRevenue = Object.values(monthlySummary.revenue).reduce((sum, value) => sum + value, 0);
  const monthCount = Object.values(monthlySummary.count).reduce((sum, value) => sum + value, 0);
  const weekValues = [58000, 71000, 64000, 82000, 90000, 105000, todayRevenue];
  const max = Math.max(...weekValues, 1);

  return (
    <section className="mx-auto grid max-w-[1320px] gap-4">
      <div className="mb-2">
        <h2 className="m-0 font-['Outfit'] text-[28px] font-bold leading-tight">売上・レポート</h2>
      </div>
      <div className="mb-7 grid grid-cols-4 gap-3.5 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
        <KpiCard label="本日売上見込" value={formatYen(todayRevenue)} note="前週同曜日比 +8%" />
        <KpiCard label="本日予約数" value={`${activeBookings.length}件`} note={`確定${activeBookings.length}件`} />
        <KpiCard label="今月売上" value={formatYen(monthRevenue)} note="前月比 +12%" />
        <KpiCard label="客単価（今月）" value={formatYen(Math.round(monthRevenue / monthCount))} note="前月比 +3%" />
      </div>
      <div className="grid grid-cols-[minmax(0,2.15fr)_minmax(330px,1fr)] items-stretch gap-4 max-[1100px]:grid-cols-1">
        <article className="row-span-2 min-h-[426px] rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
          <h2 className="m-0 font-['Outfit'] text-base font-bold">直近7日間の売上</h2>
          <div className="flex h-[255px] items-end gap-3 border-b border-[#e1e4e8] px-8 pt-8">
            {weekValues.map((value, index) => (
              <div className="grid flex-1 justify-items-center gap-2" key={`${index}-${value}`}>
                <span
                  className={`block w-full max-w-[38px] rounded-t-lg ${index === weekValues.length - 1 ? "bg-[#171a1f]" : "bg-[#c9ccd1]"}`}
                  style={{ height: `${Math.max(20, (value / max) * 170)}px` }}
                />
                <small className="text-[#6b7280]">{["6/29", "6/30", "7/1", "7/2", "7/3", "7/4", "7/5"][index]}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
          <h2 className="m-0 font-['Outfit'] text-base font-bold">人気メニュー（今月）</h2>
          <Ranking rows={[["ワンカラー", "34"], ["カット", "29"], ["TOKIOトリートメント", "21"], ["韓国風レイヤーパーマ", "14"]]} />
        </article>
        <article className="rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
          <h2 className="m-0 font-['Outfit'] text-base font-bold">スタイリスト別売上</h2>
          <ol className="m-0 mt-4 grid list-none gap-2.5 p-0">
            {stylists.map((stylist, index) => (
              <li className="grid grid-cols-[28px_1fr_auto] items-center gap-2.5 border-b border-[#e1e4e8] pb-2.5 last:border-b-0 last:pb-0" key={stylist.id}>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: stylist.color }}>{index + 1}</span>
                <strong>{stylist.name}</strong>
                <small className="font-bold text-[#6b7280]">{formatYen(monthlySummary.revenue[stylist.id])}</small>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

function Ranking({ rows }: { rows: string[][] }) {
  return (
    <ol className="m-0 mt-4 grid list-none gap-2.5 p-0">
      {rows.map(([name, value], index) => (
        <li className="grid grid-cols-[28px_1fr_auto] items-center gap-2.5 border-b border-[#e1e4e8] pb-2.5 last:border-b-0 last:pb-0" key={name}>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#eef0f2] text-xs font-bold">{index + 1}</span>
          <strong>{name}</strong>
          <small className="font-bold text-[#6b7280]">{value}件</small>
        </li>
      ))}
    </ol>
  );
}
