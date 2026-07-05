# Lumi ユーザー画面 UI ドキュメント

## 目的

このドキュメントは、`apps/user` に実装されている Lumi 美容院予約システムのユーザー向け UI 方針をまとめたものです。
画面の見た目、共通コンポーネント、予約フローの状態表示、レスポンシブ対応を確認するときの入口として使います。

## デザイン方針

- 日本人ユーザー向けの予約サイトとして、画面内の汎用 UI ラベルは日本語を基本にします。
- 店舗名、SNS名、商品名、スタッフ名などの固有名は英字表記を許容します。
  - 例: `Lumi.`, `Instagram`, `TikTok`, `TOKIOトリートメント`, `RIO`
- 全体は落ち着いた美容室らしいブラッシュ系トーンを使います。
- 背景は淡色、カードは白、選択状態はアクセントの淡色で表現します。
- 予約導線では、選択済み内容が常に分かることを優先します。

## 主要画面

| ルート | 役割 |
| --- | --- |
| `/` | ホーム。サロン紹介、おすすめメニュー、スタイリスト導線 |
| `/menu` | メニュー紹介。カテゴリごとのメニュー・料金一覧 |
| `/stylists` | スタイリスト紹介。プロフィールと指名予約導線 |
| `/book/menu` | 予約フロー: メニュー選択 |
| `/book/stylist` | 予約フロー: スタイリスト選択 |
| `/book/date` | 予約フロー: 日時選択 |
| `/book/auth-gate` | 未ログイン時のログイン/ゲスト続行選択 |
| `/book/confirm` | 予約確認、顧客情報入力、ポイント利用 |
| `/book/done` | 予約完了 |
| `/mypage` | マイページ。次回予約、履歴、再予約、キャンセル |
| `/login` | ログイン/新規登録 |

## 共通レイアウト

### Header

実装:

- `apps/user/components/headers/Header.tsx`
- `apps/user/components/headers/HeaderView.tsx`
- `apps/user/components/headers/BrandLogo.tsx`

役割:

- `Header.tsx` はログイン状態などの Context を読み、表示用 props に変換します。
- `HeaderView.tsx` は受け取った props を描画する表示コンポーネントです。
- PC では横並びナビ、スマホではハンバーガーメニューを表示します。

表示項目:

- ブランドロゴ `Lumi.`
- ホーム
- メニュー
- スタイリスト
- ログインまたはマイページ
- 予約する

### Footer

実装:

- `apps/user/components/layouts/Footer.tsx`

表示項目:

- 店舗名
- 住所
- 営業時間
- 電話番号
- 公式アカウント

## デザイントークン

定義:

- `apps/user/app/globals.css`

主な CSS 変数:

| 変数 | 用途 |
| --- | --- |
| `--bg` | ページ背景 |
| `--surface` | カード・フォームなどの面 |
| `--ink` | メイン文字色 |
| `--sub` | 補助文字色 |
| `--accent` | 予約ボタン、選択状態、強調色 |
| `--accent-ink` | アクセント背景上の文字 |
| `--soft` | タグ、選択背景、淡い強調面 |
| `--ph` | プレースホルダー画像のストライプ |
| `--line` | 通常の罫線 |
| `--line2` | やや強い罫線 |
| `--r` | 基本角丸 |
| `--hdr` | ヘッダー背景 |

フォント:

- 見出し・数字・ラベル: `Outfit`
- 本文: `Zen Kaku Gothic New`

## 共通コンポーネント

### Buttons

実装:

- `apps/user/components/buttons/PillButton.tsx`

用途:

- 丸型ボタンの共通表示。
- `primary`, `secondary`, `dark`, `ghost` の見た目を持ちます。
- 遷移先がある場合は `href` を渡し、通常操作の場合は `onClick` を渡します。

注意:

- 予約状態の更新や画面遷移の判断は page 側に置きます。
- `PillButton` は見た目と押下イベントの受け渡しだけを担当します。

### Labels

実装:

- `apps/user/components/labels/TagLabel.tsx`
- `apps/user/components/labels/SectionHeading.tsx`

用途:

- メニュータグ、人気バッジ、セクション見出しの共通表示。
- タグは淡いアクセント背景を基本にします。

### Media

実装:

- `apps/user/components/media/PlaceholderFrame.tsx`

用途:

- 実画像がない場所のプレースホルダー表示。
- ストライプ背景と中央ラベルを共通化します。

## 予約フロー UI

### StepBar

実装:

- `apps/user/components/booking/StepBar.tsx`
- `apps/user/components/booking/StepBarView.tsx`
- `apps/user/lib/booking-steps.ts`

役割:

- 現在の予約ルートに応じて、`1 / 4` から `4 / 4` までの進捗を表示します。
- ステップ定義は `lib/booking-steps.ts` に置き、コンポーネント側へロジックを寄せすぎないようにしています。

### SummaryBar

実装:

- `apps/user/components/booking/SummaryBar.tsx`
- `apps/user/components/booking/SummaryBarView.tsx`

役割:

- 予約フロー中に、メニュー、スタイリスト、日時の選択状態をチップで表示します。
- `SummaryBar.tsx` は予約状態を読み、表示用のチップ配列を作ります。
- `SummaryBarView.tsx` はチップを描画する表示コンポーネントです。

状態表示:

- メニュー未選択時は、スタイリストと日時チップを無効表示にします。
- 現在のステップはアクセント枠で強調します。
- 選択済みのチップは文字を強めに表示します。

## 予約ロジックと UI の境界

予約ロジックは可能な限り `lib` に置きます。

| ファイル | 役割 |
| --- | --- |
| `lib/booking-context.tsx` | 予約状態、ログイン状態、予約履歴の保持 |
| `lib/booking-selectors.ts` | 選択メニュー、料金、時間、ポイントなどの派生値 |
| `lib/booking-helpers.ts` | カレンダー、時間枠、疑似空き判定 |
| `lib/booking-steps.ts` | 予約ステップ定義 |
| `lib/data.ts` | メニュー、スタイリストの静的データ |

コンポーネント側の基本方針:

- 表示専用コンポーネントは props を受け取って描画するだけにします。
- Context を読む必要がある場合は、できるだけ薄いコンテナに閉じ込めます。
- メニュー排他制御、料金計算、空き時間判定は components に入れません。

## メニュー選択 UI

実装:

- `apps/user/app/book/menu/page.tsx`

表示:

- カテゴリタブ
- メニューカード
- 選択中のアイコン
- 下部 sticky 注文バー

ルール:

- ご相談メニューは他メニューと排他。
- カット、カラー、パーマは同一グループ内で1つまで。
- ケア系や前髪カットは複数選択を許可。

## スタイリスト選択 UI

実装:

- `apps/user/app/book/stylist/page.tsx`

表示:

- 指名なしカード
- スタイリストカード
- 人気/指名率バッジ
- 評価バッジ
- 指名料

状態:

- `undefined`: 未選択
- `null`: 指名なしを選択済み
- `Stylist`: 指名あり

## 日時選択 UI

実装:

- `apps/user/app/book/date/page.tsx`

表示:

- 月初から始まるカレンダー
- 火曜定休と過去日は選択不可
- 30分単位の時間枠
- 選択中日時の sticky バー

無効化ルール:

- 火曜日
- 今日より前の日
- 施術時間を足すと閉店時間を超える枠
- 疑似的に予約済みとして判定された枠

## ログイン/ゲスト導線

実装:

- `apps/user/app/book/auth-gate/page.tsx`
- `apps/user/app/login/page.tsx`

ルール:

- 未ログインで予約確認へ進む場合、ログイン確認ゲートを表示します。
- ログインを選ぶと `returnTo` に `/book/confirm` を保存します。
- ゲスト続行を選ぶと `guestOk` を true にし、確認画面へ進みます。

## マイページ UI

実装:

- `apps/user/app/mypage/page.tsx`

表示:

- プロフィールカード
- 保有ポイント
- 次回予約
- 来店履歴
- 再予約ボタン
- キャンセルボタン

ルール:

- 未ログイン時はログイン誘導を表示します。
- 再予約では履歴と同じメニューを選択済みにして、予約フローへ戻します。
- キャンセルはデモとしてブラウザ標準の確認ダイアログを使います。

## レスポンシブ対応

Header:

- PC: 横並びナビ
- スマホ: ハンバーガー

カード:

- `repeat(auto-fit, minmax(...))` または `repeat(auto-fill, minmax(...))` を使い、横幅に応じて列数を変えます。

予約フロー:

- SummaryBar は折り返し可能なチップ配置にします。
- 下部 sticky バーはスマホでも操作ボタンが見えるよう、内容を短く保ちます。

## 実装時の注意

- UI 文言の汎用ラベルは日本語を基本にします。
- 固有名は英字を維持して構いません。
- `components` にビジネスロジックを増やさないようにします。
- ページ側に残すロジックが大きくなった場合は、`lib` へ切り出します。
- 表示専用コンポーネントを増やす場合は、既存フォルダーの責務に合わせて配置します。
