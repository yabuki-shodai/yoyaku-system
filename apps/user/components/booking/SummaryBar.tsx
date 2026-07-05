"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { useBookingComputed } from "@/lib/booking-selectors";
import SummaryBarView from "./SummaryBarView";

export default function SummaryBar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { state } = useBooking();
  const { hasSel, menuSummaryLabel, dateLabel } = useBookingComputed();

  const stylistLabel =
    state.stylist === undefined
      ? "未選択"
      : state.stylist === null
        ? "指名なし"
        : state.stylist.name;
  const dateOn = state.dateI !== null && state.timeI !== null;

  // 予約状態を3つのチップ情報に整えて、表示コンポーネントへ渡します。
  return (
    <SummaryBarView
      onJump={(target, enabled) => enabled && router.push(target)}
      chips={[
        {
          label: "メニュー",
          value: menuSummaryLabel,
          href: "/book/menu",
          enabled: true,
          active: pathname === "/book/menu",
          strong: hasSel,
        },
        {
          label: "スタイリスト",
          value: stylistLabel,
          href: "/book/stylist",
          enabled: hasSel,
          active: pathname === "/book/stylist",
          strong: state.stylist !== undefined,
        },
        {
          label: "日時",
          value: dateOn ? dateLabel : "未選択",
          href: "/book/date",
          enabled: hasSel,
          active: pathname === "/book/date",
          strong: dateOn,
        },
      ]}
    />
  );
}
