// 講座(tags に「講座」を付けた記事)を、src/data/lectures.yaml の分野と順番でまとめる
import { getCollection } from 'astro:content';
import type { Post } from './posts';

export const LECTURE_TAG = '講座';

export interface LectureCategory {
	name: string;
	posts: Post[];
}

const isLecture = (post: Post) => post.data.tags?.includes(LECTURE_TAG) ?? false;

/**
 * 講座を分野ごとに返す(lectures.yaml の順)。posts は getPosts() の結果(公開する記事)を渡す
 * lectures.yaml にない講座は最後の「未分類」に入れ、警告を出す。lectures.yaml にあって記事がない ID はエラーにする
 */
export async function getLectureCategories(posts: Post[]): Promise<LectureCategory[]> {
	const byId = new Map(posts.map((post) => [post.id.replace(/^posts\//, ''), post]));
	// 下書きは getPosts() の結果に入らないので、存在しない ID と区別するために全記事の ID も見る
	const allIds = new Set((await getCollection('docs')).map((entry) => entry.id.replace(/^posts\//, '')));
	const listed = new Set<string>();
	const categories: LectureCategory[] = [];
	const entries = (await getCollection('lectures')).sort((a, b) => a.data.order - b.data.order);
	for (const entry of entries) {
		const list: Post[] = [];
		for (const id of entry.data.posts) {
			if (!allIds.has(id)) throw new Error(`[lectures] src/data/lectures.yaml の記事がありません: ${id}`);
			listed.add(id);
			const post = byId.get(id);
			if (!post) continue; // 下書き
			if (!isLecture(post)) console.warn(`[lectures] 講座タグがない記事が lectures.yaml にあります: ${id}`);
			list.push(post);
		}
		if (list.length) categories.push({ name: entry.id, posts: list });
	}
	const unlisted = [...byId].filter(([id, post]) => isLecture(post) && !listed.has(id));
	if (unlisted.length) {
		console.warn(`[lectures] src/data/lectures.yaml にない講座: ${unlisted.map(([id]) => id).join(', ')}`);
		categories.push({ name: '未分類', posts: unlisted.map(([, post]) => post) });
	}
	return categories;
}

/** 講座の記事数 */
export const countLectures = (posts: Post[]) => posts.filter(isLecture).length;
