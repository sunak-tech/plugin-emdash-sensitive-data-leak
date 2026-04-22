# @snack222/plugin-emdash-sensitive-data-leak

A plugin for [emdash CMS](https://emdash.dev) that scans content for sensitive data before saving.
If sensitive information is detected, the save operation is blocked.

***

## Detected Patterns

| Type | Pattern |
|---|---|
| API Key (OpenAI) | Strings starting with `sk-` (32+ characters) |
| GitHub Token | Strings starting with `ghp_` (36 characters) |
| JWT Token | Three-section strings in `eyJ...` format |
| Email Address | Standard email address format |

## Installation

```bash
pnpm add @snack222/plugin-emdash-sensitive-data-leak
```

## Usage

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

## How It Works

All content fields are scanned via the `content:beforeSave` hook before saving.
If sensitive information is detected, the save is blocked and an error is shown to the editor.

## License

MIT

***

# @snack222/plugin-emdash-sensitive-data-leak（日本語）

[emdash CMS](https://emdash.dev) 用の機密情報検出プラグインです。
コンテンツの保存時に機密情報が含まれていないかをスキャンし、
検出した場合は保存をブロックします。

***

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

コンテンツの保存前（`content:beforeSave`）に全フィールドをスキャンします。
機密情報が検出された場合、保存がブロックされ編集画面にエラーが表示されます。

## ライセンス

MIT