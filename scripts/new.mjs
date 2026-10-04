// 新しい記事のファイルを作る
//   npm run new                → ふつうの記事
//   npm run new -- <問題のURL> → 解法記事(problem などを記入済みにする)
// ファイル名(= URL)は日本時間の現在時刻を ISO 8601 基本形式にしたもの(例: 20261005T1930)
import { existsSync, writeFileSync } from 'node:fs';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'node:net';

// 既定(250ms)では WSL などで接続が間に合わず fetch が失敗することがあるため延ばす
setDefaultAutoSelectFamilyAttemptTimeout(2000);

const POSTS_DIR = 'src/content/docs/posts';
const MINUTE = 60 * 1000;
const JST_OFFSET = 9 * 60 * MINUTE;

const problem = process.argv[2];

// YAML の単一引用符で囲む("#" や ":" を含んでも壊れないように)
const quote = (s) => `'${s.replaceAll("'", "''")}'`;

// 日本時間の年月日時分を取り出す
const parts = (time) => {
	const d = new Date(time + JST_OFFSET);
	const pad = (n) => String(n).padStart(2, '0');
	return {
		y: d.getUTCFullYear(),
		mo: pad(d.getUTCMonth() + 1),
		d: pad(d.getUTCDate()),
		h: pad(d.getUTCHours()),
		mi: pad(d.getUTCMinutes()),
	};
};

// 同じ分の記事がすでにあれば次の分にずらす
let time = Math.floor(Date.now() / MINUTE) * MINUTE;
let p = parts(time);
let id = `${p.y}${p.mo}${p.d}T${p.h}${p.mi}`;
while (existsSync(`${POSTS_DIR}/${id}.md`)) {
	time += MINUTE;
	p = parts(time);
	id = `${p.y}${p.mo}${p.d}T${p.h}${p.mi}`;
}
const date = `${p.y}-${p.mo}-${p.d}T${p.h}:${p.mi}:00+09:00`;

let title = '';
let extra = '';
if (problem) {
	let contest = '';
	const atcoder = problem.match(/^https:\/\/atcoder\.jp\/contests\/([^/]+)\/tasks\/([^/?#]+)/);
	if (atcoder) {
		// abc434 / abc434_f → ABC434 F
		contest = atcoder[1].toUpperCase();
		const index = atcoder[2].startsWith(`${atcoder[1]}_`) ? atcoder[2].slice(atcoder[1].length + 1) : atcoder[2];
		title = `${contest} ${index.toUpperCase()} - `;
	}
	const eolymp = problem.match(/^https:\/\/(?:www\.)?eolymp\.com\/(?:[a-z]{2}\/)?compete\/([^/]+)\/problems\/([^/?#]+)/);
	if (eolymp) {
		// 問題ページはログインが必要だが、<title> からコンテスト名は取れる(例: "Blitz Round #25 — Basecamp")
		contest = eolymp[1];
		try {
			const html = await (await fetch(problem, { signal: AbortSignal.timeout(10000) })).text();
			const name = html.match(/<title>([^<]*?)\s*—\s*Basecamp<\/title>/)?.[1];
			if (name) contest = name;
		} catch {
			// 取得できなければ URL 中のコンテスト ID を使う
		}
		title = `${contest} ${eolymp[2]} - `;
	}
	extra = `problem: ${problem}\n` + (contest ? `contest: ${quote(contest)}\n` : '') + `# difficulty: \n`;
}

const path = `${POSTS_DIR}/${id}.md`;
writeFileSync(
	path,
	`---
title: ${quote(title)}
date: ${date}
draft: true
tags: []
${extra}---

`,
);
console.log(`作成しました: ${path}`);
console.log(`公開するときは draft: true の行を消してください`);
