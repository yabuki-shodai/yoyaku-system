"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { BASE_DATE, formatTime, formatYen, startTimeOptions } from "@/lib/date-time";
import { calculateBookingTotals, getUnavailableReason, unavailableReasonLabel } from "@/lib/booking-service";
import { stylistById, stylists } from "@/lib/mock-data";
import { canCancelBooking, canCompleteBooking, canEditBooking } from "@/lib/permission-service";
import type { Account, Booking, BookingDraft, BookingStatus, MenuCategory } from "@/lib/types";

type BookingDetailProps = {
  account: Account;
  booking: Booking | null;
  menus: MenuCategory[];
  bookings: Booking[];
  onBack: () => void;
  onCreate: (draft: BookingDraft) => void;
  onUpdate: (bookingId: string, patch: Pick<Booking, "customer" | "phone" | "note">) => void;
  onStatus: (bookingId: string, status: BookingStatus) => void;
};

const emptyDraft: BookingDraft = {
  customer: "",
  phone: "",
  stylistId: "",
  menuIds: [],
  date: BASE_DATE,
  start: null,
  note: "",
};

export default function BookingDetail({ account, booking, menus, bookings, onBack, onCreate, onUpdate, onStatus }: BookingDetailProps) {
  const isNew = !booking;
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);

  useEffect(() => {
    setDraft(booking ? {
      customer: booking.customer,
      phone: booking.phone,
      stylistId: booking.stylistId,
      menuIds: booking.menuIds,
      date: booking.date,
      start: booking.start,
      note: booking.note,
    } : emptyDraft);
  }, [booking]);

  const totals = useMemo(() => calculateBookingTotals(draft.menuIds, menus), [draft.menuIds, menus]);
  const editable = isNew ? canEditBooking(account) : canEditBooking(account);
  const readonly = !editable;
  const selectedStart = draft.start;
  const newBookingUnavailableReason = selectedStart === null
    ? "wait"
    : getUnavailableReason({
      bookings,
      date: draft.date,
      stylistId: draft.stylistId,
      start: selectedStart,
      duration: totals.duration,
    });
  const canSaveNew = Boolean(
    isNew &&
    editable &&
    draft.customer &&
    draft.stylistId &&
    draft.menuIds.length > 0 &&
    selectedStart !== null &&
    !newBookingUnavailableReason
  );
  const canSaveExisting = !isNew && editable;
  const isOwnStaffBooking = account.role === "stylist" && account.stylistId === booking?.stylistId;

  const setDraftValue = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="mx-auto max-w-[920px]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="m-0 font-['Outfit'] text-[28px] font-bold">{isNew ? "新規予約を登録" : "予約詳細"}</h2>
        <button className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#d7dbe0] bg-white px-4 py-2 font-bold text-[#1f2328]" onClick={onBack}>← 一覧に戻る</button>
      </div>
      <div className="grid gap-5">
      <div className="rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#e1e4e8] pb-4">
          <div>
            <p className="mb-1.5 font-['Outfit'] text-[11px] font-bold uppercase tracking-[.16em] text-[#8b93a1]">{isNew ? "New booking" : booking?.id}</p>
            <h2 className="m-0 font-['Outfit'] text-2xl font-bold">{isNew ? "新規予約を登録" : "予約詳細"}</h2>
          </div>
          {booking && <StatusBadge status={booking.status} />}
        </div>

        {isOwnStaffBooking && (
          <p className="mb-4 rounded-[10px] border border-[#e1e4e8] bg-[#fbfaf6] px-3.5 py-3 text-[#6b7280]">スタッフ権限では閲覧と完了報告のみ可能です。編集・キャンセルは管理者または受付が行います。</p>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3.5 max-[720px]:grid-cols-1">
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">お客様名</span>
            <input className="min-h-[42px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 py-2.5 outline-none disabled:cursor-not-allowed disabled:bg-[#f2f3f5] disabled:text-[#6b7280] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15" disabled={readonly} value={draft.customer} onChange={(event) => setDraftValue("customer", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">電話番号</span>
            <input className="min-h-[42px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 py-2.5 outline-none disabled:cursor-not-allowed disabled:bg-[#f2f3f5] disabled:text-[#6b7280] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15" disabled={readonly} value={draft.phone} onChange={(event) => setDraftValue("phone", event.target.value)} />
          </label>
        </div>

        <div className="mb-4 grid gap-2">
          <span className="text-xs font-bold text-[#6b7280]">担当スタイリスト</span>
          <div className="flex flex-wrap gap-2">
            {stylists.map((stylist) => (
              <button
                key={stylist.id}
                disabled={readonly}
                className={`min-h-[34px] rounded-full border px-3 py-1.5 font-bold transition disabled:cursor-not-allowed ${
                  draft.stylistId === stylist.id ? "text-white" : "border-[#d7dbe0] bg-white text-[#1f2328]"
                }`}
                style={draft.stylistId === stylist.id ? { backgroundColor: stylist.color, borderColor: stylist.color } : undefined}
                onClick={() => setDraft((current) => ({ ...current, stylistId: stylist.id, start: null }))}
              >
                {stylist.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid gap-2">
          <span className="text-xs font-bold text-[#6b7280]">メニュー</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-2">
            {menus.flatMap((category) => category.items).map((item) => {
              const selected = draft.menuIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  disabled={readonly}
                  className={`grid min-h-[68px] gap-1 rounded-[10px] border bg-white px-3 py-2.5 text-left transition disabled:cursor-not-allowed ${
                    selected ? "border-[#171a1f] bg-[#f6f7f8] shadow-[inset_4px_0_0_#171a1f]" : "border-[#e1e4e8]"
                  }`}
                  onClick={() => {
                    setDraft((current) => ({
                      ...current,
                      start: null,
                      menuIds: selected
                        ? current.menuIds.filter((id) => id !== item.id)
                        : [...current.menuIds, item.id],
                    }));
                  }}
                >
                  <span className="font-bold">{item.name}</span>
                  <small className="text-xs text-[#6b7280]">{formatYen(item.price)} / 約{item.min}分</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3.5 max-[720px]:grid-cols-1">
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">日付</span>
            <input className="min-h-[42px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 py-2.5 outline-none disabled:cursor-not-allowed disabled:bg-[#f2f3f5] disabled:text-[#6b7280] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15" disabled={readonly} type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value, start: null }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-[#6b7280]">開始時刻</span>
            {!isNew ? (
              <input className="min-h-[42px] rounded-lg border border-[#d7dbe0] bg-[#f2f3f5] px-3 py-2.5 text-[#6b7280]" disabled value={booking ? `${formatTime(booking.start)} - ${formatTime(booking.start + booking.duration)}` : ""} />
            ) : !draft.stylistId || draft.menuIds.length === 0 ? (
              <p className="m-0 text-[#6b7280]">担当とメニューを選択すると空き時間が表示されます。</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {startTimeOptions().map((start) => {
                  const reason = getUnavailableReason({
                    bookings,
                    date: draft.date,
                    stylistId: draft.stylistId,
                    start,
                    duration: totals.duration,
                  });
                  return (
                    <button
                      key={start}
                      disabled={!!reason}
                      title={unavailableReasonLabel(reason)}
                      className={`min-h-[34px] rounded-full border px-3 py-1.5 disabled:cursor-not-allowed ${
                        draft.start === start
                          ? "border-[#171a1f] bg-[#171a1f] text-white"
                          : reason
                            ? "border-transparent text-[#b7bec8] line-through"
                            : "border-[#d7dbe0] bg-white text-[#1f2328]"
                      }`}
                      onClick={() => setDraftValue("start", start)}
                    >
                      {formatTime(start)}
                    </button>
                  );
                })}
              </div>
            )}
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-bold text-[#6b7280]">メモ</span>
          <textarea className="min-h-[110px] rounded-lg border border-[#d7dbe0] bg-[#fbfbfc] px-3 py-2.5 outline-none disabled:cursor-not-allowed disabled:bg-[#f2f3f5] disabled:text-[#6b7280] focus:border-[#9aa3af] focus:ring-4 focus:ring-[#8b93a1]/15" disabled={readonly} value={draft.note} rows={4} onChange={(event) => setDraftValue("note", event.target.value)} />
        </label>
      </div>

      <aside className="grid gap-3 rounded-xl border border-[#e1e4e8] bg-white p-5 shadow-[0_16px_44px_-36px_rgba(31,35,40,.55)]">
        <h2 className="m-0 border-b border-[#e1e4e8] pb-3 font-['Outfit'] text-2xl font-bold">予約サマリー</h2>
        <dl className="m-0 grid gap-2.5">
          <div className="flex items-center justify-between"><dt className="text-[#6b7280]">担当</dt><dd className="m-0 font-bold">{draft.stylistId ? stylistById[draft.stylistId].name : "未選択"}</dd></div>
          <div className="flex items-center justify-between"><dt className="text-[#6b7280]">合計時間</dt><dd className="m-0 font-bold">約{isNew ? totals.duration : booking?.duration ?? 0}分</dd></div>
          <div className="flex items-center justify-between"><dt className="text-[#6b7280]">合計金額</dt><dd className="m-0 font-bold">{formatYen(isNew ? totals.total : booking?.total ?? 0)}</dd></div>
        </dl>
        {isNew && <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#171a1f] bg-[#171a1f] px-4 py-2 font-bold text-white disabled:opacity-45" disabled={!canSaveNew} onClick={() => onCreate(draft)}>この内容で登録する</button>}
        {!isNew && canSaveExisting && booking && <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#171a1f] bg-[#171a1f] px-4 py-2 font-bold text-white" onClick={() => onUpdate(booking.id, { customer: draft.customer, phone: draft.phone, note: draft.note })}>変更を保存</button>}
        {booking?.status === "confirmed" && canCompleteBooking(account, booking) && <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#a9cdae] bg-[#e4f0e6] px-4 py-2 font-bold text-[#2f5b36]" onClick={() => onStatus(booking.id, "completed")}>完了にする</button>}
        {booking?.status === "confirmed" && canCancelBooking(account) && <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#d8a8a8] bg-[#f3e3e3] px-4 py-2 font-bold text-[#a13d3d]" onClick={() => { if (confirm("この予約をキャンセルしますか？")) onStatus(booking.id, "cancelled"); }}>この予約をキャンセル</button>}
        <button className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#d7dbe0] bg-white px-4 py-2 font-bold text-[#1f2328]" onClick={onBack}>一覧へ戻る</button>
      </aside>
      </div>
    </section>
  );
}
