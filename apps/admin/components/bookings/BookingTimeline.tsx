"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { BASE_DATE, CLOSE_MIN, formatTime, formatYen, hourMarks, NOW_MIN, OPEN_MIN } from "@/lib/date-time";
import { stylistById, stylists } from "@/lib/mock-data";
import { canCreateBooking } from "@/lib/permission-service";
import type { Account, Booking } from "@/lib/types";

type BookingTimelineProps = {
  account: Account;
  dateLabel: string;
  dateKey: string;
  dayOffset: number;
  bookings: Booking[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onOpenNew: () => void;
  onOpenBooking: (booking: Booking) => void;
};

const pxPerMin = 80 / 60;

export default function BookingTimeline({
  account,
  dateLabel,
  dateKey,
  dayOffset,
  bookings,
  onPrevDay,
  onNextDay,
  onToday,
  onOpenNew,
  onOpenBooking,
}: BookingTimelineProps) {
  const visibleStylists = account.role === "stylist"
    ? stylists.filter((stylist) => stylist.id === account.stylistId)
    : stylists;
  const scopedBookings = bookings.filter((booking) => (
    booking.date === dateKey &&
    (account.role !== "stylist" || booking.stylistId === account.stylistId)
  ));
  const activeBookings = scopedBookings.filter((booking) => booking.status !== "cancelled");
  const revenue = activeBookings.reduce((sum, booking) => sum + booking.total, 0);
  const isBaseDate = dateKey === BASE_DATE;
  const gridHeight = (CLOSE_MIN - OPEN_MIN) * pxPerMin;

  return (
    <section className="grid gap-5">
      <div className="grid min-h-[76px] grid-cols-[40px_minmax(180px,220px)_40px_auto_minmax(420px,1fr)] items-center gap-4 max-[1100px]:grid-cols-[40px_1fr_40px]">
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d7dbe0] bg-white text-[22px] font-bold text-[#1f2328]" onClick={onPrevDay} aria-label="前日">‹</button>
        <div className="text-center">
          <h2 className="m-0 font-['Outfit'] text-2xl font-bold leading-tight">{dateLabel}</h2>
          <p className="mt-2 mb-0 text-xs text-[#8b93a1]">{account.role === "stylist" ? `${stylistById[account.stylistId ?? "s1"].name} の予約` : "全スタイリスト"}</p>
        </div>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d7dbe0] bg-white text-[22px] font-bold text-[#1f2328]" onClick={onNextDay} aria-label="翌日">›</button>
        <button className="inline-flex min-h-10 justify-self-start items-center justify-center rounded-lg border border-[#d7dbe0] bg-white px-4 py-2 font-bold text-[#1f2328] disabled:opacity-45 max-[1100px]:col-span-full" onClick={onToday} disabled={dayOffset === 0}>本日へ</button>
        <div className="flex items-stretch justify-end gap-3 max-[1100px]:col-span-full max-[1100px]:justify-stretch max-[720px]:flex-col">
          <SmallKpi label="予約数" value={`${activeBookings.length}件`} />
          <SmallKpi label="売上見込" value={formatYen(revenue)} />
          {canCreateBooking(account) && (
            <button className="inline-flex min-h-[70px] min-w-[152px] items-center justify-center rounded-lg border border-[#171a1f] bg-[#171a1f] px-5 py-3 font-bold text-white max-[1100px]:flex-1" onClick={onOpenNew}>
              ＋ 手動予約登録
            </button>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[10px] border border-[#d7dbe0] bg-white shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
        <div className="overflow-x-auto bg-white">
          <div
            className="grid min-h-[800px]"
            style={{
              gridTemplateColumns: `72px repeat(${visibleStylists.length}, minmax(210px, 1fr))`,
              minWidth: `${72 + visibleStylists.length * 210}px`,
            }}
          >
            <div className="relative border-r border-[#e1e4e8] bg-[#f7f8fa]" style={{ height: gridHeight + 50 }}>
              <div className="h-[50px] border-b border-[#e1e4e8] bg-[#fbfcfd]" />
              {hourMarks().map((mark) => (
                <span className="absolute right-3 -translate-y-1/2 font-['Outfit'] text-xs font-semibold text-[#7b8491]" key={mark} style={{ top: `${50 + (mark - OPEN_MIN) * pxPerMin}px` }}>{formatTime(mark)}</span>
              ))}
            </div>
            {visibleStylists.map((stylist) => {
              const stylistBookings = scopedBookings.filter((booking) => booking.stylistId === stylist.id);
              return (
                <div className="min-w-0" key={stylist.id}>
                  <div className="flex h-[50px] items-center gap-2 border-b border-[#e1e4e8] bg-[#fbfcfd] px-3.5">
                    <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: stylist.color }} />
                    <strong className="font-['Outfit'] text-[15px] font-bold tracking-[.04em]">{stylist.name}</strong>
                    <small className="ml-auto text-xs text-[#6b7280]">{stylistBookings.filter((booking) => booking.status !== "cancelled").length}件</small>
                  </div>
                  <div className="relative border-r border-[#e1e4e8]" style={{ height: gridHeight }}>
                    {hourMarks().map((mark) => (
                      <span className="absolute left-0 right-0 border-t border-[#edf0f3]" key={mark} style={{ top: `${(mark - OPEN_MIN) * pxPerMin}px` }} />
                    ))}
                    {isBaseDate && (
                      <span className="absolute left-0 right-0 z-30 border-t-2 border-[#d64545]" style={{ top: `${(NOW_MIN - OPEN_MIN) * pxPerMin}px` }}>
                        <b className="absolute left-2 top-[-11px] rounded-full bg-[#d64545] px-2 py-1 text-[10px] leading-none text-white">現在</b>
                      </span>
                    )}
                    {stylistBookings.map((booking) => (
                      <button
                        key={booking.id}
                        className={`absolute z-20 grid gap-px overflow-hidden rounded-md border border-l-[6px] px-2.5 py-2 text-left shadow-[0_10px_24px_-22px_rgba(23,26,31,.6)] transition hover:-translate-y-px ${
                          booking.status === "completed"
                            ? "border-[#a9cdae] bg-[#e4f0e6] text-[#2f5b36]"
                            : booking.status === "cancelled"
                              ? "border-[#d8a8a8] bg-[#f3e3e3] text-[#a13d3d] opacity-55 line-through"
                              : "border-[#d7dbe0] bg-[#eef0f2] text-[#1f2328]"
                        }`}
                        style={{
                          top: `${(booking.start - OPEN_MIN) * pxPerMin}px`,
                          height: `${Math.max(booking.duration * pxPerMin, 34)}px`,
                          borderLeftColor: stylist.color,
                          left: "10px",
                          right: "10px",
                        }}
                        onClick={() => onOpenBooking(booking)}
                      >
                        <strong className="truncate text-[13px]">{formatTime(booking.start)} {booking.customer}</strong>
                        <span className="truncate text-xs">{booking.menuNames.join(" + ")}</span>
                      </button>
                    ))}
                    {stylistBookings.length === 0 && <p className="m-0 pt-[120px] text-center text-[#8b93a1]">予約なし</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {scopedBookings.length === 0 && <div className="border-t border-[#e1e4e8] p-5 text-center text-[#8b93a1]">この日の予約はありません</div>}
        <div className="flex justify-end gap-2.5 border-t border-[#e1e4e8] bg-[#fbfcfd] p-3">
          <StatusBadge status="confirmed" />
          <StatusBadge status="completed" />
          <StatusBadge status="cancelled" />
        </div>
      </div>
    </section>
  );
}

function SmallKpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="grid min-h-[70px] min-w-[126px] place-items-center rounded-xl border border-[#e1e4e8] bg-white px-4 py-2.5 text-center shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)] max-[1100px]:flex-1">
      <span className="text-xs font-bold text-[#6b7280]">{label}</span>
      <strong className="font-['Outfit'] text-2xl leading-tight">{value}</strong>
    </article>
  );
}
