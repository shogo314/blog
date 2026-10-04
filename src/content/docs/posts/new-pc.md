---
title: パソコンを買いました。
date: 2023-09-02
tags: [雑記]
---

:::note
この記事は 2023年9月2日 に[はてなブログ](https://shogo314.hatenablog.com/entry/2023/09/02/203050)で公開した記事の転載です。
:::

競技プログラミング用にパソコンを買ったので、環境構築を全部書きます。

目標はWSL+VSCodeでC++を実行できるようにして、atcoder-cliで提出出来るようにすることです。

## パソコン

Lenovo IdeaPad Slim 170 14型 (AMD) 49,830円  
プロセッサー: AMD Ryzen™ 5 7520U (2.80 GHz 最大 4.30 GHz)  
初期導入OS: Windows 11 Home 64bit  
グラフィックカード: AMD Radeon™ 610M グラフィックス  
メモリー: 8 GB LPDDR5-5500MHz (オンボード)  
ストレージ1: 512 GB SSD, M.2 PCIe-NVMe Gen4 QLC  
ディスプレイ: 14" FHD液晶 (1920 x 1080)  
重さ: 1.4kg

パソコンに詳しくないので、5万円以下でなるべく性能がいいらしいものを買いました。[（参考）](https://github.com/Reputeless/Laptops)  
普段使いは生協で買ったLIFEBOOKなので、重さに驚きました。

## パソコンのセットアップ

地域を設定したりします。

デバイスの名前は`LAPTOP-KP-shogo`にしました（後から変更できます）。

Microsoftアカウントは既に持っていますが、新規にメールアドレスを取得してみます。名前を姓名別に入力させるフォーム…。

サインインしてPINを設定出来たらあとは全部スキップして完了。

## WSLをインストール

PowerShellを管理者として実行

```
wsl --install
```

指示通り再起動する

```
Restart-Computer
```

これで再起動できる（手動でいい）。
再起動すると、Ubuntuのターミナルが開かれた状態でusernameを入力するよう指示があるので入力する。次にパスワードを入力するよう指示があるので入力する（入力時、画面に文字が出ない）。もう一回パスワードを入力すると設定完了。
パスワードは簡単にしておいた方がいい。

## VS Codeをインストール

Microsoft Storeにもありますが、公式ページからインストーラーをダウンロードしている人が多いのでそっちにします。

<https://code.visualstudio.com/download>

にアクセスして、WindowsのUser Installerのx64をクリック。
`VSCodeUserSetup-x64-1.81.1.exe`がダウンロードされるので実行。

使用許諾契約書が出るので同意

インストール先を指定できますが、デフォルトの
`C:\Users\username\AppData\Local\Programs\Microsoft VS Code`にしておきます。

追加タスクを選択できます。せっかくなので全部チェックしておきます。

インストールを押して完了です。

## VS Codeに拡張機能を追加

拡張機能の

- [WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

をインストール

## VSCodeとWSLの連携をとる?

左下の><みたいなのを押して、Connect to WSLを選択

左下が><WSL-Ubuntuになる

これでVSCodeからWSLのファイルを触れるようになる

ターミナルを開いて

```
shogo314@LAPTOP-KP-shogo:~$
```

のように表示されている

## コンパイラをインストール

ターミナルで

```
sudo apt-get update
sudo apt install build-essential -y
sudo apt install gdb -y
```

を実行

```
g++ --version
```

で正しく表示されたらOK

## VS Codeに拡張機能を追加2

- [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

を入れる

## 試してみる

```
shogo314@LAPTOP-KP-shogo:~$ mkdir AtCoder/ABC/abc211/a -p
shogo314@LAPTOP-KP-shogo:~$ cd AtCoder/ABC/abc211/a
shogo314@LAPTOP-KP-shogo:~/AtCoder/ABC/abc211/a$
```

VSCodeで`/AtCoder/ABC/abc211/`を開いて`a/`に`main.cpp`を作る

```cpp
#include <iostream>
int main()
{
    int A,B;
    std::cin >> A >> B;
    std::cout << (float)(A - B) / 3 + B << std::endl;
}
```

拡張機能が働いていることがわかる。
ファイルを保存して下を実行

```
$ g++ a/main.cpp
$ ./a.out
300 50
133.333
```

g++がちゃんと使えている

## atcoder-cliをインストール

### Python3をインストール

```
sudo apt install python3
```

既にインストールされてる?

```
$ python3 --version
Python 3.10.12
```

Pythonをインストールするとpipもついてくるはずだけど、なかったのでインストール。

#### pip3をインストール

```
sudo apt install python3-pip -y
```

### Node.jsをインストール

curlは既にインストールされている
node.jsはバージョンが結構複雑らしい

#### Node Version Managerをインストール

<https://github.com/nvm-sh/nvm>

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

#### Node.jsをインストール

ターミナルを開き直す

```
nvm install node
npm install -g npm
```

### online-judge-toolsをインストール

```
pip3 install online-judge-tools
```

pip listだと表示されるがojが認識されない。
ターミナルを開き直せば使えた。

### atcoder-cliをインストール

```
npm install -g atcoder-cli
```

## 試してみる

```
oj login https://atcoder.jp
acc login
```

ログイン

```
$ cd ~/AtCoder/ABC
$ acc new abc210
```

`abc210/a`の中に`main.cpp`を作る

```cpp
#include <iostream>
int main()
{
    int N, A, X, Y;
    std::cin >> N >> A >> X >> Y;
    std::cout << std::min(N, A) * X + std::max(0, N - A) * Y << std::endl;
}
```

```
oj t
```

が実行できない
テストケースのディレクトリが`tests`に作られたのに`test`を参照している。とりあえずディレクトリ名を変更して実行。
正常に動くことが確認できる。

```
acc submit main.cpp
```

提出成功。テストケースのディレクトリ名を変えたせいでテストしてないけど大丈夫?みたいなのが出た。

## atcoder-cliの設定

```
$ acc config default-test-dirname-format test
$ acc config default-task-choice all
```

テストケースのディレクトリ名を変更する。
コンテストを選んだときすべての問題のディレクトリが作成されるようにする。

```
$ acc config-dir
```

で設定用のディレクトリがわかるので、それを開く。
`~/.config/atcoder-cli-nodejs`
ここに`cpp`ディレクトリを作り`template.json`を置く

```json
{
    "task":{
        "program": ["main.cpp"],
        "submit": "main.cpp"
    }
}
```

`main.cpp`も作る。
テンプレートを適当に作る。

```
acc config default-template cpp
```

これで設定したテンプレートが使用できる。

## ライブラリを使えるようにする

仮にac-libraryを使ってみる

```
$ cd ~
$ mkdir library
$ cd library
$ git clone https://github.com/atcoder/ac-library.git
```

```
$ cd ~/AtCoder/ABC
$ acc new abc206
```

`abc206`を開く
`d/main.cpp`を

```cpp
#include <bits/stdc++.h>
#include "atcoder/dsu"

int main()
{
    using namespace std;
    int N;
    cin >> N;
    vector<int> A(N);
    for (int i; i < N; i++)
        cin >> A[i];
    atcoder::dsu uf(200001);
    int ans = 0;
    for (int i = 0; i < N / 2; i++)
    {
        if (!uf.same(A[i], A[N - i - 1]))
        {
            uf.merge(A[i], A[N - i - 1]);
            ans++;
        }
    }
    cout << ans << endl;
}
```

にする

```
$ cd d
$ g++ main.cpp -I ~/library/ac-library
$ oj t
```

ac-libraryをコンパイル出来ている。

## verification-helperをインストール

これだとAtCoderにしか提出出来ないので、インクルードしているものを自動で展開できるようにする。

```
$ pip3 install online-judge-verify-helper
```

これでインストールできる。念のためターミナルを開き直して

```
$ oj-bundle main.cpp -I ~/library/ac-library > a.cpp
```

展開したものが標準出力に出るので`> a.cpp`を付けて出力先をファイルにする。
展開したいものは`<atcoder/dsu>`のように`<>`で囲んでいると駄目で、`""`で囲む必要がある。

## CPLUS\_INCLUDE\_PATHを設定

これまでだとVSCodeの拡張機能が"atcoder/dsu"を認識できておらずエラーが出ていた。
ホームディレクトリに`.bash_profile`を作り

```
export CPLUS_INCLUDE_PATH=~/library/ac-library
```

と書く。2つ以上設定したい場合は`:`で区切るらしい。'/home'から書いた方が確実かも。
ここのファイルはbashを起動したときに実行されるのでターミナルを開き直す。

```
echo $CPLUS_INCLUDE_PATH
```

で表示されてたら成功。

これでエラーが出なくなった。また`g++`を実行するときに`-I ~/library/ac-library`を書かずとも動くようになった。
しかし、`oj-bundle`は書く必要がある。

## 設定を調整

```
if(1)
{
}
```

より

```
if(1){
}
```

が好きなのでフォーマッタの設定を変える。
設定を開く。`Ctrl+,`で開ける。
`C_Cpp: Clang_format_fallback Style`がデフォルトだと`Visual Studio`になっているので`Google`に変える。

## トラブル発生

VSCodeを開き直すと急に`oj`や`oj-bundle`が使えなくなった。`acc check-oj`は使えるし、動いているのでPATHの問題っぽい。
`home/shogo314/.local/bin/oj --version`が動くのでこれを呼べるようにすればよい。
`~/.bash_profile`に

```
export PATH="~/.local/bin:$PATH"
```

を追加する。

## おわり

結構大変だった。

ライブラリを作る（執筆中）に続く…
