# jsBinarySchemaParser

[
![npm version](https://img.shields.io/npm/v/js-binary-schema-parser.svg)
](https://www.npmjs.com/package/js-binary-schema-parser)
[
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
](https://opensource.org/licenses/MIT)

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A declarative, schema-based binary file parser for JavaScript. Convert binary data into well-structured, readable objects with ease.

## Features

-   **Declarative Schemas**: Define the structure of your binary data using simple JavaScript objects and functions.
-   **Complex Structures**: Natively supports nested data, conditionals, and loops for handling dynamic formats.
-   **Rich Parser Set**: Includes a comprehensive set of built-in parsers for `Uint8Array` streams:
    -   Read/peek single bytes, byte arrays, and strings.
    -   Parse unsigned integers (big or little endian).
    -   Handle bit-level data with a bitmask schema.
    -   Parse fixed-size or dynamically-sized arrays.
-   **Lightweight**: Zero dependencies.
-   **Extensible**: Easily add your own custom parser functions.
-   **Example Included**: Comes with a complete schema for parsing GIF files.

## Installation

Install using npm:

```bash
npm install js-binary-schema-parser
```

Alternatively, for browsers or Deno, you can import it directly:

```javascript
import { parse } from 'https://code4fukui.github.io/jsBinarySchemaParser/src/index.js';
import { buildStream, readByte } from 'https://code4fukui.github.io/jsBinarySchemaParser/src/parsers/uint8.js';
```

## Quick Start

1.  **Define a schema** for your binary format. A schema is an array of objects, where each object key becomes a key in the final parsed object.

2.  **Create a stream** from your `Uint8Array` data using `buildStream`.

3.  **Call `parse`** with the stream and schema.

```javascript
// For Node.js/npm, adjust import paths if using a bundler or CJS
import { parse } from 'js-binary-schema-parser/src/index.js';
import {
  buildStream,
  readString,
  readByte,
  readUnsigned
} from 'js-binary-schema-parser/src/parsers/uint8.js';

// 1. Define a schema for a custom file format.
const mySchema = [
  { header: [
      { signature: readString(3) },      // Reads 3 bytes as a string
      { version: readByte() }            // Reads the next byte as a number
  ]},
  { dataLength: readUnsigned(false) },   // Reads 2 bytes as a big-endian unsigned int
  // ... add more parsers for the rest of the file
];

// 2. Create a data source (e.g., from a file or network).
// This buffer represents: "FOO", version 1, length 256
const binaryData = new Uint8Array([0x46, 0x4F, 0x4F, 0x01, 0x01, 0x00]);

// 3. Create a stream and parse the data.
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

## API Reference

### Core Functions

These functions are the building blocks for your schemas.

-   `parse(stream, schema)`: The main parsing function. It