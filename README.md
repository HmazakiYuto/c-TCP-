## https://github.com/HmazakiYuto/portforio

## デッキメーカー

React + Node.js + SQLite3 を使ったカード管理・デッキ作成アプリです。

## 概要
- ユーザーごとにカードを登録
- デッキを作成してカードを追加
- デッキ内のカード枚数を管理（最大3枚／カード、デッキ合計40枚）
- 登録したデッキを閲覧可能

##未実装機能
-カード・デッキ編集（削除・更新）機能
-

## 技術スタック
- フロントエンド: React (Vite)
- バックエンド: Node.js + Express
- データベース: SQLite3
- 認証: JWT トークン

## セットアップ

### 1. リポジトリをクローン

git clone https://github.com/HmazakiYuto/portforio.git
cd リポジトリ名

### 2 .フロントエンドのセットアップ
cd card_frontend
npm install
npm run dev

### 3 .バックエンドのセットアップ
cd card_backend
npm install
node index.js

### 4 . dbの初期化
sqlite3 card.db < init.sql



