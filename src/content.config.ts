import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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
					index: z.string().optional(), // 問題番号(A, F など)
					name: z.string().optional(), // 問題名
					difficulty: z.number().int().optional(), // AtCoder のときだけ書く(AtCoder Problems の difficulty)
				}),
		}),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
