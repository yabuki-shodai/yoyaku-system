# 05. データモデル（案）

本フェーズの機能要件を満たすための概念モデル。実装時のテーブル設計・カラム型は別途 ORM/スキーマ定義で確定する。

## 5.1 主要エンティティ

### User（一般ユーザー）
- id, email, password_hash, name, phone, created_at, updated_at

### Admin（管理者）
- id, email, password_hash, name, created_at, updated_at

### Staff（スタッフ、ログイン不要のマスタ）
- id, name, bio, photo_url, is_active, created_at, updated_at

### StaffSchedule（スタッフの稼働時間）
- id, staff_id, day_of_week, start_time, end_time
- （臨時休業は別途 StaffTimeOff 等で管理）

### MenuItem（施術メニュー）
- id, name, description, price, duration_minutes, category, is_published, created_at, updated_at

### MenuStaff（メニューと対応可能スタッフの中間テーブル）
- menu_item_id, staff_id

### BusinessHours（営業時間設定）
- id, day_of_week, open_time, close_time, is_closed

### Holiday（休業日・臨時休業）
- id, date, reason

### Reservation（予約）
- id, user_id, staff_id (nullable: 指定なしの場合あり), status（予約済み/来店済み/キャンセル/無断キャンセル）, start_at, end_at, created_at, updated_at, cancelled_at, cancel_reason

### ReservationMenuItem（予約に紐づくメニュー、複数選択対応）
- reservation_id, menu_item_id

### CustomerNote（顧客メモ、管理者が登録）
- id, user_id, admin_id, body, created_at

## 5.2 関連の概要
- User 1 : N Reservation
- Staff 1 : N Reservation（任意）
- Reservation N : N MenuItem（ReservationMenuItem経由）
- Staff N : N MenuItem（MenuStaff経由）
- Staff 1 : N StaffSchedule

## 5.3 検討事項
- 予約の重複防止のため、`(staff_id, start_at, end_at)` に対する排他制御・一意性チェックの実装方式は別途設計する。
- 監査ログ（誰がいつ予約を変更したか）を残す場合は ReservationHistory 的なテーブルを追加検討する（[[06_open_questions]]）。
