// 問題 URL のホスト名からコンテストサイト名を決める
const SITES: Record<string, string> = {
	'atcoder.jp': 'AtCoder',
	'codeforces.com': 'Codeforces',
	'eolymp.com': 'EOLYMP',
	'basecamp.eolymp.com': 'EOLYMP',
	'yukicoder.me': 'yukicoder',
	'judge.yosupo.jp': 'Library Checker',
	'onlinejudge.u-aizu.ac.jp': 'AOJ',
};

export function getSiteName(problemUrl: string): string {
	const host = new URL(problemUrl).hostname.replace(/^www\./, '');
	return SITES[host] ?? host;
}
