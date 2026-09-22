# @snack222/plugin-emdash-sensitive-data-leak

[![npm version](https://img.shields.io/npm/v/@snack222/plugin-emdash-sensitive-data-leak.svg)](https://www.npmjs.com/package/@snack222/plugin-emdash-sensitive-data-leak)
[![license](https://img.shields.io/npm/l/@snack222/plugin-emdash-sensitive-data-leak.svg)](./LICENSE)

A plugin for [emdash CMS](https://emdash.dev) that scans content for secrets when an entry is saved.
Detections are recorded and surfaced in the admin UI.

**The save is not blocked.** A false positive should never stop an editor from saving their work,
so the plugin warns instead of refusing. Review the warnings and act on them yourself.

***

## Detected Patterns

| Type | Pattern |
|---|---|
| API Key (OpenAI) | Strings starting with `sk-` (32+ characters) |
| GitHub Token | Strings starting with `ghp_` (36 characters) |
| JWT Token | Three-section strings in `eyJ...` format |

## Requirements

`emdash` is a peer dependency — this plugin expects the host project to provide it.

## Installation

```bash
pnpm add @snack222/plugin-emdash-sensitive-data-leak
```

## Usage

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { sensitiveDataLeakPlugin } from "@snack222/plugin-emdash-sensitive-data-leak";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [sensitiveDataLeakPlugin()],
    }),
  ],
});
```

The admin UI is built with React, so the host project needs the `@astrojs/react` integration enabled.

## How It Works

Every field of an entry is serialised and scanned on the `content:beforeSave` hook.
When a pattern matches, the plugin appends a record — timestamp, collection, entry title and the
matched pattern names — to its own KV storage. The most recent 50 warnings are kept.

The hook only receives the entry's field data, so the title is used to identify the entry;
the entry id is not available at that point.

The save itself always goes through.

## Admin UI

| Surface | Description |
|---|---|
| Dashboard widget | Full-width list of recent detections |
| `/warnings` page | The same history on a dedicated admin page |
| Toast notification | Appears at the bottom right when a new detection arrives, and disappears after 5 seconds |

The widget polls for new warnings every 3 seconds.

## License

MIT

***

# @snack222/plugin-emdash-sensitive-data-leak（日本語）

[emdash CMS](https://emdash.dev) 用の機密情報検出プラグインです。
コンテンツの保存時に機密情報が含まれていないかをスキャンし、検出した内容を管理画面に表示します。

**保存はブロックしません。** 誤検出で編集者の作業が止まる方が問題なので、
拒否ではなく警告を記録する設計にしています。警告を確認して対応してください。

***

## 検出対象

| 種類 | パターン |
|---|---|
| APIキー (OpenAI) | `sk-` で始まる32文字以上の文字列 |
| GitHub Token | `ghp_` で始まる36文字の文字列 |
| JWT Token | `eyJ...` 形式の3セクション文字列 |

## 前提

`emdash` は peer dependency です。ホスト側のプロジェクトに導入されている必要があります。

## インストール

```bash
pnpm add @snack222/plugin-emdash-sensitive-data-leak
```

## 使い方

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { sensitiveDataLeakPlugin } from "@snack222/plugin-emdash-sensitive-data-leak";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [sensitiveDataLeakPlugin()],
    }),
  ],
});
```

管理画面は React で作られているため、ホスト側で `@astrojs/react` が有効になっている必要があります。

## 動作

保存前（`content:beforeSave`）にコンテンツ全体を文字列化してスキャンします。
パターンに一致した場合、検出日時・コレクション・エントリのタイトル・一致したパターン名を
プラグイン専用の KV ストレージに記録します。保持するのは直近50件です。

フックに渡るのはエントリのフィールドデータだけなので、識別にはタイトルを使います。
この時点ではエントリIDは取得できません。

保存処理そのものは必ず完了します。

## 管理画面

| 表示場所 | 内容 |
|---|---|
| ダッシュボードウィジェット | 最近の検出履歴を全幅で表示 |
| `/warnings` ページ | 同じ履歴を専用ページで表示 |
| トースト通知 | 新しい検出があると右下に表示され、5秒で消えます |

ウィジェットは3秒間隔で新しい警告を取得します。

## ライセンス

MIT
