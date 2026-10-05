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

/** 解法記事をコンテストごとにまとめる(最新の記事が新しいコンテストから順に並ぶ) */
export function groupByContest(posts: Post[]): Contest[] {
	const map = new Map<string, Contest>();
	for (const post of posts) {
		const { problem, contest } = post.data;
		if (!problem || !contest) continue;
		const site = getSiteName(problem);
		const key = slug(`${site} ${contest}`);
		if (!map.has(key)) map.set(key, { site, name: contest, slug: key, posts: [] });
		map.get(key)!.posts.push(post);
	}
	return [...map.values()];
}

export const contestUrl = (contest: Contest) => `${BASE}/contests/${contest.slug}/`;

/** タグごとの記事数(多い順、同数なら名前順) */
export function countTags(posts: Post[]): [string, number][] {
	const count = new Map<string, number>();
	for (const post of posts) for (const tag of post.data.tags ?? []) count.set(tag, (count.get(tag) ?? 0) + 1);
	return [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'));
}

export const formatDate = (date: Date) =>
	date.toLocaleDateString('ja-JP', { dateStyle: 'long', timeZone: 'Asia/Tokyo' });
