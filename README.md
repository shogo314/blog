# blog

https://shogo314.github.io/blog/ のソースです。[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) + [starlight-blog](https://github.com/HiDeoo/starlight-blog) で作っています。

## 記事の書き方

```sh
npm run new                                                       # ふつうの記事
npm run new -- https://atcoder.jp/contests/abc434/tasks/abc434_f  # 解法記事
npm run new -- https://eolymp.com/compete/br25/problems/1 'Sum vs MEX'  # 問題名を自動で取れないサイトは引数で渡す
```

`src/content/docs/posts/` に記事のファイルが作られます。

- ファイル名は日本時間の作成時刻を ISO 8601 基本形式にしたもの(例: `20261005T1930.md`)で、そのまま URL になります(`/blog/posts/20261005T1930/`)。同じ分にすでに記事があれば、次の分にずらします。
- 作った直後は `draft: true`(下書き)になっていて、`npm run dev` では表示されますが公開サイトには出ません。公開するときはこの行を消します。

### 解法記事

```markdown
---
title: 'ABC434 F - Concat (2nd)'   # contest・index・name から自動で作る
date: 2026-10-05T19:30:00+09:00
tags: [DP, 木DP]
problem: https://atcoder.jp/contests/abc434/tasks/abc434_f
contest: 'ABC434'
index: 'F'                          # 問題番号
name: 'Concat (2nd)'                # 問題名
difficulty: 1850                    # AtCoder のときだけ書く(AtCoder Problems の difficulty)
---
```

- `problem` がある記事には、タイトルの下に「サイト・コンテスト・問題・難易度」の枠が自動で表示されます。サイト名は URL から判定します(`src/lib/sites.ts`)。
- 難易度の行は AtCoder の問題のときだけ表示されます(未記入なら `-`)。
- `npm run new` は、AtCoder なら問題名まで、Eolymp ならコンテスト名と問題番号(URL の `1` → `A`)まで自動で記入します。

### 書き方

- 数式は `$...$` / `$$...$$`、注意書きは `:::tip` / `:::note` / `:::caution`、折りたたみは `<details>` で書けます。
- 記事どうしのリンクは `/blog/posts/20250301T1912/` のように書きます。

## ページ構成

- `/blog/` … メインページ(最近の記事・コンテスト別・タグ・解法以外の記事)。記事の frontmatter から自動で作る(`src/components/home/`、`src/lib/posts.ts`)
- `/blog/posts/` … すべての記事
- `/blog/posts/tags/<タグ>/` … タグ別
- `/blog/contests/<サイト>-<コンテスト>/` … コンテスト別(問題番号順、`src/pages/contests/`)

## ローカルで確認する

```sh
npm install
npm run dev    # http://localhost:4321/blog/ でプレビュー
npm run build  # dist/ にビルド
```

`main` に push すると GitHub Actions でビルドされ、GitHub Pages に公開されます。
