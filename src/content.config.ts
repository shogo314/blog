import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';
import yaml from 'js-yaml';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';
import { getLastUpdated } from './lib/last-updated';

const loader = docsLoader({
	// 既定ではファイル名が小文字にされるため、ISO 8601 の "T" を残すようにそのまま使う
	generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
});

export const collections = {
	docs: defineCollection({
		loader: {
			...loader,
			// frontmatter に lastUpdated がなければ git の履歴から入れる(starlight-blog が投稿日の横に出す)
			load: (context) =>
				loader.load({
					...context,
					parseData: ({ data, filePath, ...rest }) =>
						context.parseData({
							...rest,
							filePath,
							data: { lastUpdated: filePath && getLastUpdated(filePath), ...data },
						}),
				}),
		},
		schema: docsSchema({
			extend: (context) =>
				blogSchema(context).extend({
					// 解法記事のための項目。problem があれば解法記事として扱う
					problem: z.url().optional(),
					standalone: z.url().optional(), // コンテストの問題がコンテストの外にも置かれているときの問題ページ
					contest: z.string().optional(),
					// コンテストのページ。参加記など problem がない記事でコンテストを示すときに書く(サイト名はここから決める)
					contestUrl: z.url().optional(),
					index: z.string().optional(), // 問題番号(A, F など)
					name: z.string().optional(), // 問題名
					difficulty: z.number().int().optional(), // AtCoder のときだけ書く(AtCoder Problems の difficulty)
				}),
		}),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
	// タグのメタ情報(キーがタグの名前)。種類の意味は src/data/tags.yaml の先頭に書いてある
	tags: defineCollection({
		loader: file('src/data/tags.yaml'),
		schema: z.object({
			kind: z.enum(['article', 'algorithm', 'problem']),
		}),
	}),
	// 講座の分野と並び順(id が分野の名前)。書き方は src/data/lectures.yaml の先頭に書いてある
	// getCollection は id の順に並べ替えるので、ファイルでの順番を order に入れておく
	lectures: defineCollection({
		loader: file('src/data/lectures.yaml', {
			parser: (text) => (yaml.load(text) as object[]).map((entry, order) => ({ ...entry, order })),
		}),
		schema: z.object({
			order: z.number().int(),
			posts: z.array(z.string()),
		}),
	}),
};
