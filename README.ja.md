# jsBinarySchemaParser

[
![npm version](https://img.shields.io/npm/v/js-binary-schema-parser.svg)
](https://www.npmjs.com/package/js-binary-schema-parser)
[
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
](https://opensource.org/licenses/MIT)

JavaScript向けの宣言型・スキーマベースのバイナリファイルパーサーです。バイナリデータを構造化された読みやすいオブジェクトへ簡単に変換できます。

## 特徴

-   **宣言型スキーマ**: シンプルなJavaScriptのオブジェクトと関数を使用して、バイナリデータの構造を定義できます。
-   **複雑な構造**: ネストされたデータ、条件分岐、ループをネイティブにサポートし、動的なフォーマットを処理できます。
-   **豊富なパーサー群**: `Uint8Array`ストリーム用の包括的な組み込みパーサーが含まれています:
    -   単一バイト、バイト配列、文字列の読み込み（read）および先読み（peek）。
    -   符号なし整数（ビッグエンディアンまたはリトルエンディアン）の解析。
    -   ビットマスクスキーマによるビットレベルデータの処理。
    -   固定長または動的サイズの配列の解析。
-   **軽量**: 依存関係はありません（ゼロディペンデンシー）。
-   **拡張性**: 独自のカスタムパーサー関数を簡単に追加できます。
-   **サンプル同梱**: GIFファイルを解析するための完全なスキーマが含まれています。

## インストール

npmを使用してインストールします:

```bash
npm install js-binary-schema-parser
```

または、ブラウザやDeno環境では直接インポートすることも可能です:

```javascript
import { parse } from 'https://code4fukui.github.io/jsBinarySchemaParser/src/index.js';
import { buildStream, readByte } from 'https://code4fukui.github.io/jsBinarySchemaParser/src/parsers/uint8.js';
```

## クイックスタート

1.  バイナリフォーマットの**スキーマを定義**します。スキーマはオブジェクトの配列であり、各オブジェクトのキーが最終的に解析されたオブジェクトのキーになります。

2.  `buildStream`を使用して、`Uint8Array`データから**ストリームを作成**します。

3.  ストリームとスキーマを引数にして**`parse`を呼び出し**ます。

```javascript
// Node.js/npmの場合、バンドラーやCJSを使用する際はインポートパスを調整してください
import { parse } from 'js-binary-schema-parser/src/index.js';
import {
  buildStream,
  readString,
  readByte,
  readUnsigned
} from 'js-binary-schema-parser/src/parsers/uint8.js';

// 1. カスタムファイルフォーマットのスキーマを定義します。
const mySchema = [
  { header: [
      { signature: readString(3) },      // 3バイトを文字列として読み込みます
      { version: readByte() }            // 次の1バイトを数値として読み込みます
  ]},
  { dataLength: readUnsigned(false) },   // 2バイトをビッグエンディアンの符号なし整数として読み込みます
  // ... ファイルの残りの部分に対するパーサーを追加します
];

// 2. データソースを作成します（例: ファイルやネットワークから）。
// このバッファは「"FOO"、バージョン1、長さ256」を表します。
const binaryData = new Uint8Array([0x46, 0x4F, 0x4F, 0x01, 0x01, 0x00]);

// 3. ストリームを作成し、データを解析します。
const stream = buildStream(binaryData);
const result = parse(stream, mySchema);

console.log(JSON.stringify(result, null, 2));
/*
{
  "header": {
    "signature": "FOO",
    "version": 1
  },
  "dataLength": 256
}
*/
```

## APIリファレンス

### コア関数

これらの関数は、スキーマを構築するための基本要素です。

-   `parse(stream, schema)`: メインの解析関数です。
