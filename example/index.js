import { parse } from '../src/index.js'
import { buildStream } from '../src/parsers/uint8.js'
import GIF from '../src/schemas/gif.js'

const data = await Deno.readFile('./example/dog.gif')
const result = parse(buildStream(new Uint8Array(data)), GIF)
console.log(result)
