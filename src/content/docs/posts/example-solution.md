---
title: ABC000 A - 解法記事のサンプル
date: 2026-10-05
draft: true
tags: [サンプル, DP]
problem: https://atcoder.jp/contests/abc000/tasks/abc000_a
contest: ABC000
difficulty: 400
---

解法記事の書き方のサンプルです。`draft: true` の記事は `npm run dev` では表示されますが、公開サイトには出ません。

## 問題

$N$ 個の整数 $A_1, \ldots, A_N$ が与えられます。…

## 考察

$dp[i]$ を「$i$ 番目まで見たときの最大値」とすると、

$$
dp[i] = \max(dp[i-1], dp[i-2] + A_i)
$$

:::tip[ヒント]
隣り合う 2 つを同時に選べないことに注目します。
:::

## 解答コード

<details>
<summary>C++</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n), dp(n + 1);
    for (auto &x : a) cin >> x;
    for (int i = 0; i < n; i++) {
        dp[i + 1] = max(dp[i], (i >= 1 ? dp[i - 1] : 0) + a[i]);
    }
    cout << dp[n] << endl;
}
```

</details>
