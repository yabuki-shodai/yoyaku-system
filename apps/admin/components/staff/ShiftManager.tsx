"use client";

import { formatYen, TODAY_INDEX, WEEK_DAYS } from "@/lib/date-time";
import { monthlySummary, stylistById, stylists } from "@/lib/mock-data";
import { canEditShift } from "@/lib/permission-service";
import type { Account, Booking, ShiftMap } from "@/lib/types";

type ShiftManagerProps = {
  account: Account;
  shifts: ShiftMap;
  bookings: Booking[];
  submitted: boolean;
  onToggle: (stylistId: string, dayIndex: number) => void;
  onSubmit: () => void;
};

export default function ShiftManager({ account, shifts, bookings, submitted, onToggle, onSubmit }: ShiftManagerProps) {
  const isManager = account.role === "manager";

  return (
    <section className="mx-auto grid max-w-[1230px] gap-4">
      <div className="relative mb-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="m-0 font-['Outfit'] text-[26px] font-bold">{isManager ? "スタッフ・シフト管理" : "自分のシフト"}</h2>
          <span className="inline-flex rounded-full bg-[#e4f0e6] px-3.5 py-1.5 text-xs font-bold text-[#2f5b36]">{isManager ? "管理者（全員編集可）" : `${stylistById[account.stylistId ?? "s1"].name}（本人のみ）`}</span>
        </div>
        <p className="mt-2 text-[#6b7280]">{isManager ? "管理者権限：全スタッフの勤務シフトを編集できます。クリックで出勤/休みを切替。予約が入っている日は自動的に出勤で固定されます。" : "自分の希望シフトのみ編集・提出できます。他スタッフは閲覧のみ。予約が入っている日は出勤で固定されます。"}</p>
        {!isManager && <button className="absolute right-0 top-0 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#171a1f] bg-[#171a1f] px-4 py-2 font-bold text-white max-[720px]:static max-[720px]:mt-3" onClick={onSubmit}>この内容で提出する</button>}
      </div>

      {!isManager && <p className={`m-0 rounded-[10px] border px-3.5 py-3 ${submitted ? "border-[#a9cdae] bg-[#e4f0e6] text-[#2f5b36]" : "border-[#e1e4e8] bg-[#fbfaf6] text-[#6b7280]"}`}>{submitted ? "提出済み：管理者の承認待ちです" : "編集後、この内容で管理者へ提出してください。"}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] overflow-hidden rounded-xl border border-[#d7dbe0] bg-white shadow-[0_16px_44px_-38px_rgba(31,35,40,.55)]">
          <thead>
            <tr>
              <th className="h-[58px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-3 text-left text-xs font-bold tracking-[.04em] text-[#6b7280]">スタッフ</th>
              {WEEK_DAYS.map((day, index) => <th key={day} className={`h-[58px] border-b border-[#e1e4e8] bg-[#f7f8fa] px-3 text-center text-xs font-bold tracking-[.04em] ${index >= 5 ? "text-[#c17a8f]" : "text-[#6b7280]"}`}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {stylists.map((stylist) => {
              const isOwn = account.stylistId === stylist.id;
              const hasBookingToday = bookings.some((booking) => booking.stylistId === stylist.id && booking.status !== "cancelled");
              return (
                <tr key={stylist.id} className={!isManager && isOwn ? "bg-[#fbfaf6]" : "bg-white"}>
                  <td className="h-[72px] border-b border-[#e1e4e8] px-3 align-middle">
                    <div className="flex min-w-[190px] items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: stylist.color }} />
                      <div>
                        <strong className="block">{stylist.name}</strong>
                        <small className="block text-xs text-[#6b7280]">{stylist.role}</small>
                      </div>
                      {!isManager && <em className={`ml-auto rounded-full px-2 py-1 text-xs not-italic font-bold ${isOwn ? "bg-[#171a1f] text-white" : "bg-[#eef0f2] text-[#525a66]"}`}>{isOwn ? "自分" : "閲覧のみ"}</em>}
                    </div>
                  </td>
                  {shifts[stylist.id].map((on, index) => {
                    const locked = index === TODAY_INDEX && hasBookingToday;
                    const active = locked || on;
                    const editable = canEditShift(account, stylist.id) && !locked;
                    return (
                      <td className="h-[72px] border-b border-[#e1e4e8] px-2 text-center align-middle" key={`${stylist.id}-${index}`}>
                        <button
                          disabled={!editable}
                          className={`min-h-[38px] w-full rounded-lg border px-3 py-1.5 font-bold disabled:cursor-not-allowed ${active ? "text-[#1f2328] disabled:opacity-90" : "border-[#e1e4e8] bg-[#fafbfc] text-[#8b93a1] disabled:opacity-60"}`}
                          style={active ? { borderColor: stylist.color, backgroundColor: `${stylist.color}1f` } : undefined}
                          onClick={() => onToggle(stylist.id, index)}
                          title={locked ? "予約が入っているため出勤で固定されています" : editable ? "クリックで切り替え" : "閲覧のみ"}
                        >
                          {locked ? "🔒 出勤" : active ? "出勤" : "休み"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isManager && (
        <div className="mt-2.5 grid grid-cols-4 gap-3.5 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
          {stylists.map((stylist) => (
            <article className="grid min-h-32 gap-2 rounded-xl border border-[#e1e4e8] border-t-4 bg-white p-4 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]" style={{ borderTopColor: stylist.color }} key={stylist.id}>
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stylist.color }} />
              <h3 className="m-0">{stylist.name}</h3>
              <dl className="m-0 grid gap-2.5">
                <div className="flex items-center justify-between"><dt className="text-[#6b7280]">今週出勤</dt><dd className="m-0 font-bold">{shifts[stylist.id].filter(Boolean).length}日</dd></div>
                <div className="flex items-center justify-between"><dt className="text-[#6b7280]">本日の予約</dt><dd className="m-0 font-bold">{bookings.filter((booking) => booking.stylistId === stylist.id && booking.status !== "cancelled").length}件</dd></div>
                <div className="flex items-center justify-between"><dt className="text-[#6b7280]">今月の指名売上</dt><dd className="m-0 font-bold">{formatYen(monthlySummary.revenue[stylist.id])}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
