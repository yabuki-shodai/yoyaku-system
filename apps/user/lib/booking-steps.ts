export const STEP_MAP: Record<string, [string, string]> = {
  "/book/menu": ["1 / 4・メニュー", "25%"],
  "/book/stylist": ["2 / 4・スタイリスト", "50%"],
  "/book/date": ["3 / 4・日時", "75%"],
  "/book/confirm": ["4 / 4・確認", "100%"],
};

// 予約フロー以外のページでは undefined を返し、ステップ表示を出さないようにします。
export function getStep(pathname: string) {
  return STEP_MAP[pathname];
}
