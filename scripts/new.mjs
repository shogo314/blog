// 新しい記事のファイルを作る
//   npm run new                → ふつうの記事
//   npm run new -- <問題のURL> [問題名] → 解法記事(problem などを記入済みにする)
// ファイル名(= URL)は日本時間の現在時刻を ISO 8601 基本形式にしたもの(例: 20261005T1930)
import { existsSync, writeFileSync } from 'node:fs';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'node:net';
import { getSiteName } from '../src/lib/sites.ts';

// 既定(250ms)では WSL などで接続が間に合わず fetch が失敗することがあるため延ばす
setDefaultAutoSelectFamilyAttemptTimeout(2000);

const POSTS_DIR = 'src/content/docs/posts';
const MINUTE = 60 * 1000;
const JST_OFFSET = 9 * 60 * MINUTE;

const [problem, nameArg] = process.argv.slice(2);

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

// ページを取得して HTML を返す(失敗したら undefined)
const fetchHtml = async (url, headers = {}) => {
	try {
		return await (await fetch(url, { headers, signal: AbortSignal.timeout(10000) })).text();
	} catch {
		return undefined;
	}
};

// よく出る文字参照だけ戻す
const unescape = (s) =>
	s
		?.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&#x27;', "'")
		.replaceAll('&amp;', '&');

// ページを取得して <title> の中身を返す(失敗したら undefined)
const fetchTitle = async (url) => unescape((await fetchHtml(url))?.match(/<title>([^<]*)<\/title>/)?.[1].trim());

let title = '';
let extra = '';
if (problem) {
	let contest = '';
	let index = '';
	let name = nameArg ?? '';
	let isAtCoder = false;
	const atcoder = problem.match(/^https:\/\/atcoder\.jp\/contests\/([^/]+)\/tasks\/([^/?#]+)/);
	if (atcoder) {
		// abc434 / abc434_f → ABC434 F
		isAtCoder = true;
		contest = atcoder[1].toUpperCase();
		index = (atcoder[2].startsWith(`${atcoder[1]}_`) ? atcoder[2].slice(atcoder[1].length + 1) : atcoder[2]).toUpperCase();
		// 問題ページの <title> は "F - 問題名"
		const pageTitle = await fetchTitle(problem);
		const m = pageTitle?.match(/^\S+ - (.+)$/);
		if (!nameArg && m) name = m[1];
	}
	const eolymp = problem.match(/^https:\/\/(?:www\.)?eolymp\.com\/(?:[a-z]{2}\/)?compete\/([^/]+)\/problems\/(\d+)/);
	if (eolymp) {
		// 問題ページはログインが必要だが、<title> からコンテスト名は取れる(例: "Blitz Round #25 — Basecamp")
		// 問題名は取れないので引数で渡す
		contest = (await fetchTitle(problem))?.match(/^(.*?)\s*—\s*Basecamp$/)?.[1] ?? eolymp[1];
		// URL の番号は 1 始まりで、コンテスト内では A, B, … と表示される
		index = String.fromCharCode('A'.charCodeAt(0) + Number(eolymp[2]) - 1);
	}
	const samcoding = problem.match(/^https:\/\/(?:www\.)?samcoding\.uz\/contests\/(\d+)\/problems\/([^/?#]+)/);
	if (samcoding) {
		// コンテストページの <title> は "SamCoding | コンテスト名"
		contest =
			(await fetchTitle(`https://samcoding.uz/contests/${samcoding[1]}`))?.match(/^SamCoding \| (.+)$/)?.[1] ??
			samcoding[1];
		index = samcoding[2].toUpperCase();
		// 問題ページの <title> には問題名がないので本文の "A. 問題名" から取る。既定はウズベク語なので英語にする
		const html = await fetchHtml(problem, { Cookie: 'django_language=en' });
		const m = html?.match(new RegExp(`>\\s*${index}\\.\\s*([^<]+?)\\s*<`));
		if (!nameArg && m) name = unescape(m[1]);
	}
	// コンテストの問題でなければ、コンテスト名の代わりにサイト名を使う
	title = ([contest, index].filter(Boolean).join(' ') || getSiteName(problem)) + ` - ${name}`;
	extra =
		`problem: ${problem}\n` +
		(contest ? `contest: ${quote(contest)}\n` : '') +
		(index ? `index: ${quote(index)}\n` : '') +
		`name: ${quote(name)}\n` +
		(isAtCoder ? `# difficulty: \n` : '');
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
