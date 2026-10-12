// 本文中のインラインコードのうち Uiua のものに uiua クラスを付ける(blog.css で Uiua386 フォントを当てるため)。
// インラインコードには言語を書けないので、次のどちらかに当てはまるものを Uiua とみなす
// - <summary>Uiua</summary> の <details>(Uiua の解答コードとその説明)の中にある
// - Uiua の記号を含む

// Uiua の記号が入っている範囲(¯ ° × ÷、ギリシャ文字、矢印・数学記号・図形など)
const UIUA_GLYPH = /[\u00AF\u00B0\u00D7\u00F7\u0370-\u03FF\u2190-\u2BFF]/;

function textOf(node) {
	if (node.type === 'text') return node.value;
	return (node.children ?? []).map(textOf).join('');
}

// Markdown 中の <details> は要素にならず、開きタグ・閉じタグがそれぞれ raw ノードとして並ぶ。
// そのため、兄弟を順に見て <summary>Uiua</summary> から </details> までを Uiua の範囲とする
const UIUA_DETAILS_START = /<summary>\s*Uiua\s*<\/summary>/;
const DETAILS_END = /<\/details>/;

function visit(node, parent, inUiua) {
	if (node.type === 'element' && node.tagName === 'code' && parent?.tagName !== 'pre') {
		if (inUiua || UIUA_GLYPH.test(textOf(node))) {
			const className = node.properties.className ?? [];
			node.properties.className = [...className, 'uiua'];
		}
		return;
	}
	let childInUiua = inUiua;
	for (const child of node.children ?? []) {
		if (child.type === 'raw') {
			if (UIUA_DETAILS_START.test(child.value)) childInUiua = true;
			else if (DETAILS_END.test(child.value)) childInUiua = inUiua;
		}
		visit(child, node, childInUiua);
	}
}

export default function rehypeUiuaInlineCode() {
	return (tree) => visit(tree, null, false);
}
