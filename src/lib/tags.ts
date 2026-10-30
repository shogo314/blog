// タグを種類(src/data/tags.yaml の kind)ごとにまとめる
import { getCollection } from 'astro:content';

export const TAG_KINDS = [
	{ kind: 'article', label: '記事の分類' },
	{ kind: 'algorithm', label: 'アルゴリズム・データ構造' },
	{ kind: 'problem', label: '問題の分野・特徴' },
	{ kind: 'unknown', label: '未分類' },
] as const;

export type TagKind = (typeof TAG_KINDS)[number]['kind'];

export interface TagGroup {
	kind: TagKind;
	label: string;
	tags: [string, number][];
}

/** countTags の結果を種類ごとに分ける(順番は保つ。空の種類は除く) */
export async function groupTagsByKind(tags: [string, number][]): Promise<TagGroup[]> {
	const kinds = new Map((await getCollection('tags')).map((entry) => [entry.id, entry.data.kind as TagKind]));
	const unknown = tags.filter(([tag]) => !kinds.has(tag)).map(([tag]) => tag);
	if (unknown.length) console.warn(`[tags] src/data/tags.yaml にないタグ: ${unknown.join(', ')}`);
	return TAG_KINDS.map(({ kind, label }) => ({
		kind,
		label,
		tags: tags.filter(([tag]) => (kinds.get(tag) ?? 'unknown') === kind),
	})).filter((group) => group.tags.length > 0);
}
