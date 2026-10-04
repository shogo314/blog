# blog

https://shogo314.github.io/blog/ のソースです。[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + [starlight-blog](https://github.com/HiDeoo/starlight-blog) で作っています。

## 記事の書き方

```sh
npm run new                                                    # ふつうの記事
npm run new -- https://atcoder.jp/contests/abc434/tasks/abc434_f  # 解法記事
```

`src/content/docs/posts/` に記事のファイルが作られます。

- ファイル名は日本時間の作成時刻を ISO 8601 基本形式にしたもの(例: `20261005T1930.md`)で、そのまま URL になります(`/blog/posts/20261005T1930/`)。同じ分にすでに記事があれば、次の分にずらします。
- 解法記事は問題 URL から `problem` を記入します。AtCoder の URL なら `contest` とタイトルの頭(`ABC434 F - `)も記入します。
- 作った直後は `draft: true`(下書き)になっていて、`npm run dev` では表示されますが公開サイトには出ません。公開するときはこの行を消します。

```markdown
---
title: 'ABC434 F - ○○'
date: 2026-10-05T19:30:00+09:00
tags: [DP, 木DP]
problem: https://atcoder.jp/contests/abc434/tasks/abc434_f  # 解法記事のときだけ
contest: ABC434                                            # 解法記事のときだけ
difficulty: 1850                                           # 解法記事のときだけ
---
```

- 数式は `$...$` / `$$...$$`、注意書きは `:::tip` / `:::note` / `:::caution`、折りたたみは `<details>` で書けます。
- 記事どうしのリンクは `/blog/posts/20250301T1912/` のように書きます。

## ローカルで確認する

```sh
npm install
npm run dev    # http://localhost:4321/blog/ でプレビュー
npm run build  # dist/ にビルド
```

`main` に push すると GitHub Actions でビルドされ、GitHub Pages に公開されます。
