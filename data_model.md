データモデル

1 ユーザーテーブル (users)
フィールド	型	説明
id	UUID (PK)	ユーザーの一意識別子
email	VARCHAR	ユーザーのメールアドレス
password_hash	VARCHAR	パスワードのハッシュ
created_at	TIMESTAMP	アカウント作成日時
updated_at	TIMESTAMP	最終更新日時
注: Supabase Authを利用する場合、ユーザー管理はAuthテーブルで行われるため、必要に応じて追加情報を保存するためのprofilesテーブルを作成します。

2 プロファイルテーブル (profiles)
フィールド	型	説明
id	UUID (PK)	ユーザーID（外部キー）
username	VARCHAR	ユーザー名
avatar_url	VARCHAR	アバター画像のURL
bio	TEXT	ユーザーの自己紹介
created_at	TIMESTAMP	プロファイル作成日時
updated_at	TIMESTAMP	最終更新日時

3 タスクテーブル (tasks)
フィールド	型	説明
id	UUID (PK)	タスクの一意識別子
user_id	UUID	タスク作成者のユーザーID
title	VARCHAR	タスクのタイトル
description	TEXT	タスクの詳細説明
status	VARCHAR	タスクのステータス（例: 未完了、進行中、完了）
priority	VARCHAR	タスクの優先度（例: 低、中、高）
due_date	DATE	タスクの期限日
created_at	TIMESTAMP	タスク作成日時
updated_at	TIMESTAMP	タスク最終更新日時

4 タグテーブル (tags) (オプション)
フィールド	型	説明
id	UUID (PK)	タグの一意識別子
name	VARCHAR	タグ名
created_at	TIMESTAMP	タグ作成日時

5 タスクタグ関連テーブル (task_tags) (オプション)
フィールド	型	説明
task_id	UUID	タスクID（外部キー）
tag_id	UUID	タグID（外部キー）