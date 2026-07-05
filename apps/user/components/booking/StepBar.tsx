import { getStep } from "@/lib/booking-steps";
import StepBarView from "./StepBarView";

export default function StepBar({ pathname }: { pathname: string }) {
  // 現在の予約ルートに対応するステップだけ、進捗バーとして表示します。
  const step = getStep(pathname);
  if (!step) return null;
  const [label, percent] = step;
  return <StepBarView label={label} percent={percent} />;
}
