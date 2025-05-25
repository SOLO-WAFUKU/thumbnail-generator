# 自動サムネイル生成システム

YouTube サムネイル画像を OpenAI DALL·E 3 API を使用して自動生成するシステムです。

## セットアップ手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd thumbnail-generator
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local` ファイルを編集し、OpenAI API キーを設定してください。

4. 開発サーバーを起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 必要な環境変数

- `OPENAI_API_KEY`: OpenAI API キー（必須）

## コスト計算

- 1画像あたり: $0.032（DALL·E 3 の料金）
- 計算式: `生成画像数 × $0.032`
- 例: 10枚生成 = 10 × $0.032 = $0.32

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- OpenAI API
- Zustand (状態管理)
