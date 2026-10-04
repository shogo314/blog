// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
	site: 'https://shogo314.github.io',
	base: '/blog',
	// ブログのトップは記事一覧にする
	redirects: {
		'/': '/blog/posts/',
	},
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: 'shogo314 のブログ',
			defaultLocale: 'root',
			locales: {
				root: { label: '日本語', lang: 'ja' },
			},
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			customCss: ['katex/dist/katex.min.css', './src/styles/blog.css'],
			social: [
				{ icon: 'open-book', label: 'ホーム', href: 'https://shogo314.github.io/' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/shogo314' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/shogo3142' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@shogo3142' },
			],
			plugins: [
				starlightBlog({
					title: 'ブログ',
					prefix: 'posts',
					navigation: 'none',
				}),
			],
		}),
	],
});
