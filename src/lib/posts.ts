// ブログの記事を集めて、メインページやコンテスト別ページで使う形にする
import { getCollection, type CollectionEntry } from 'astro:content';
import { slug } from 'github-slugger';
import { getSiteName } from './sites';

export type Post = CollectionEntry<'docs'>;

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 公開する記事(開発中は下書きも含む)を新しい順に返す */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection(
		'docs',
		(entry) => entry.id.startsWith('posts/') && (import.meta.env.DEV || !entry.data.draft),
	);
	return posts.sort((a, b) => b.data.date!.getTime() - a.data.date!.getTime());
}

export const postUrl = (post: Post) => `${BASE}/${post.id}/`;

// starlight-blog と同じ規則でタグページの URL を作る
export const tagUrl = (tag: string) => `${BASE}/posts/tags/${slug(tag)}/`;

export interface Contest {
	site: string;
	name: string;
	slug: string;
	posts: Post[];
}

/** 解法記事・参加記をコンテストごとにまとめる(最新の記事が新しいコンテストから順に並ぶ) */
export function groupByContest(posts: Post[]): Contest[] {
	const map = new Map<string, Contest>();
	for (const post of posts) {
		const { contest } = post.data;
		const siteUrl = postSiteUrl(post);
		if (!siteUrl || !contest) continue;
		const site = getSiteName(siteUrl);
		const key = contestSlug(site, contest);
		if (!map.has(key)) map.set(key, { site, name: contest, slug: key, posts: [] });
		map.get(key)!.posts.push(post);
	}
	return [...map.values()];
}

const contestSlug = (site: string, name: string) => slug(`${site} ${name}`);

export const contestUrl = (contest: Pick<Contest, 'slug'>) => `${BASE}/contests/${contest.slug}/`;

/** サイト名を決める URL(問題の URL、なければコンテストの URL) */
const postSiteUrl = (post: Post) => post.data.problem ?? post.data.contestUrl;

/** サイトを決める URL(problem か contestUrl)とコンテスト名から、コンテストページの URL を作る */
export const contestUrlOf = (siteUrl: string, contest: string) =>
	contestUrl({ slug: contestSlug(getSiteName(siteUrl), contest) });

/** タグごとの記事数(多い順、同数なら名前順) */
export function countTags(posts: Post[]): [string, number][] {
	const count = new Map<string, number>();
	for (const post of posts) for (const tag of post.data.tags ?? []) count.set(tag, (count.get(tag) ?? 0) + 1);
	return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'));
}

export const formatDate = (date: Date) =>
	date.toLocaleDateString('ja-JP', { dateStyle: 'long', timeZone: 'Asia/Tokyo' });

export const formatTime = (date: Date) =>
	date.toLocaleTimeString('ja-JP', { timeStyle: 'short', timeZone: 'Asia/Tokyo' });

/** 記事の日付(日本時間)の年・月・日 */
export function postDay(post: Post): { year: number; month: number; day: number } {
	const [year, month, day] = post.data
		.date!.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })
		.split('-')
		.map(Number);
	return { year, month, day };
}

export interface Month {
	year: number;
	month: number;
	posts: Post[];
}

/** 記事を月ごとにまとめる(新しい月から順。posts は新しい順に渡す) */
export function groupByMonth(posts: Post[]): Month[] {
	const months: Month[] = [];
	for (const post of posts) {
		const { year, month } = postDay(post);
		const last = months.at(-1);
		if (last && last.year === year && last.month === month) last.posts.push(post);
		else months.push({ year, month, posts: [post] });
	}
	return months;
}

/** 月を年ごとにまとめる(新しい年から順) */
export function groupByYear(months: Month[]): { year: number; months: Month[] }[] {
	const years: { year: number; months: Month[] }[] = [];
	for (const m of months) {
		const last = years.at(-1);
		if (last && last.year === m.year) last.months.push(m);
		else years.push({ year: m.year, months: [m] });
	}
	return years;
}

export const archiveUrl = (year?: number, month?: number) =>
	year === undefined
		? `${BASE}/archive/`
		: `${BASE}/archive/${year}/${String(month).padStart(2, '0')}/`;

/** コンテスト別・月別のページで使うサイドバー(既定のままだと全記事が並んでしまう) */
export function navSidebar(posts: Post[]) {
	return [
		{ label: 'ホーム', link: '/' },
		{ label: 'すべての記事', link: '/posts/' },
		{ label: 'コンテスト別', link: '/contests/' },
		{ label: 'タグ', link: '/tags/' },
		{
			label: '月別アーカイブ',
			items: [
				{ label: 'すべての月', link: '/archive/' },
				...groupByMonth(posts).map((m) => ({
					label: `${m.year}年${m.month}月 (${m.posts.length})`,
					link: archiveUrl(m.year, m.month).slice(BASE.length),
				})),
			],
		},
	];
}
