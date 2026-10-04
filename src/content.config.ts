import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
			// 既定ではファイル名が小文字にされるため、ISO 8601 の "T" を残すようにそのまま使う
			generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
		}),
		schema: docsSchema({
			extend: (context) =>
				blogSchema(context).extend({
					// 解法記事のための項目。problem があれば解法記事として扱う
					problem: z.url().optional(),
					contest: z.string().optional(),
					index: z.string().optional(), // 問題番号(A, F など)
					name: z.string().optional(), // 問題名
					difficulty: z.number().int().optional(), // AtCoder のときだけ書く(AtCoder Problems の difficulty)
				}),
		}),
	}),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
