# blog

https://shogo314.github.io/blog/ のソースです。[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + [starlight-blog](https://github.com/HiDeoo/starlight-blog) で作っています。

## 記事の書き方

`src/content/docs/posts/` に Markdown ファイルを置きます。ファイル名がそのまま URL になります(`abc434-f.md` → `/blog/posts/abc434-f/`)。

```markdown
---
title: ABC434 F - ○○
date: 2026-10-05
tags: [DP, 木DP]
problem: https://atcoder.jp/contests/abc434/tasks/abc434_f  # 解法記事のときだけ
contest: ABC434                                            # 解法記事のときだけ
difficulty: 1850                                           # 解法記事のときだけ
---
```

- `draft: true` を付けると下書きになり、`npm run dev` では表示されますが公開サイトには出ません。
- 数式は `$...$` / `$$...$$`、注意書きは `:::tip` / `:::note` / `:::caution` で書けます。
- サンプルは `src/content/docs/posts/example-*.md` にあります。

## ローカルで確認する

```sh
npm install
npm run dev    # http://localhost:4321/blog/ でプレビュー
npm run build  # dist/ にビルド
```

`main` に push すると GitHub Actions でビルドされ、GitHub Pages に公開されます。
