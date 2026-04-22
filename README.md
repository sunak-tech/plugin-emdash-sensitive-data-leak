# @snack222/plugin-emdash-sensitive-data-leak

emdash CMS 用の機密情報検出プラグインです。  
コンテンツの保存時に機密情報が含まれていないかをスキャンし、
検出した場合は保存をブロックします。

## 検出対象

| 種類 | パターン |
|---|---|
| APIキー (OpenAI) | `sk-` で始まる32文字以上の文字列 |
| GitHub Token | `ghp_` で始まる36文字の文字列 |
| JWT Token | `eyJ...` 形式の3セクション文字列 |
| メールアドレス | 標準的なメールアドレス形式 |

## インストール

```bash
pnpm add @snack222/plugin-emdash-sensitive-data-leak
```

## 使い方

```ts
// astro.config.ts
import { sensitiveDataLeakPlugin } from "@snack222/plugin-emdash-sensitive-data-leak";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [
        sensitiveDataLeakPlugin(),
      ],
    }),
  ],
});
```

## 動作

コンテンツの保存前 (`content:beforeSave`) に全フィールドをスキャンします。
機密情報が検出された場合、保存がブロックされエラーが表示されます。

## ライセンス

MIT