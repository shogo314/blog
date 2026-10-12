// 本文中のインラインコードのうち、Uiua の記号を含むものに uiua クラスを付ける
// (blog.css で Uiua386 フォントを当てるため)。インラインコードには言語を書けないので、文字で判定する

// Uiua の記号が入っている範囲(¯ ° × ÷、ギリシャ文字、矢印・数学記号・図形など)
const UIUA_GLYPH = /[¯°×÷Ͱ-Ͽ←-⯿]/;

function textOf(node) {
	if (node.type === 'text') return node.value;
	return (node.children ?? []).map(textOf).join('');
}

function visit(node, parent) {
	if (node.type === 'element' && node.tagName === 'code' && parent?.tagName !== 'pre') {
		if (UIUA_GLYPH.test(textOf(node))) {
			const className = node.properties.className ?? [];
			node.properties.className = [...className, 'uiua'];
		}
		return;
	}
	for (const child of node.children ?? []) visit(child, node);
}

export default function rehypeUiuaInlineCode() {
	return (tree) => visit(tree, null);
}
