# @centralping/ergo-wire

Symmetric HTTP wire-format primitives for the [Ergo](https://github.com/CentralPing/ergo) stack.

Zero runtime dependencies. Works in Node.js 22+ and modern browsers.

## Install

```bash
npm install @centralping/ergo-wire
```

## Usage

```js
import {
  formatIdempotencyKey,
  parseIdempotencyKey,
  serializeOffsetParams,
  parseLinkHeader,
  formatLinkHeader,
  parseRetryAfter
} from '@centralping/ergo-wire';

formatIdempotencyKey('my-key'); // "\"my-key\""
serializeOffsetParams({page: 2, perPage: 25}); // { page: 2, per_page: 25 }
```

## Ergo Stack Wire Profile

| Concern | Wire keys / format |
| --- | --- |
| Offset pagination | `page`, `per_page` |
| Cursor pagination | `cursor`, `limit` |
| Idempotency-Key | RFC 8941 quoted sf-string |
| Link | RFC 8288 |

## Package size

The published package contains only pure JS primitives under `lib/` (~15KB uncompressed source).

## License

MIT
