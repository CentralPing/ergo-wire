/**
 * @fileoverview @centralping/ergo-wire public entry point.
 * @module @centralping/ergo-wire
 */

/**
 * @typedef {import('./lib/link.js').LinkObject} LinkObject
 * @typedef {import('./lib/pagination.js').OffsetParseOptions} OffsetParseOptions
 * @typedef {import('./lib/pagination.js').CursorParseOptions} CursorParseOptions
 * @typedef {import('./lib/pagination.js').OffsetWireQuery} OffsetWireQuery
 * @typedef {import('./lib/pagination.js').CursorWireQuery} CursorWireQuery
 */

export {assertSfStringInner, formatIdempotencyKey, parseIdempotencyKey} from './lib/idempotency.js';
export {fingerprint} from './lib/fingerprint.js';
export {
  formatLinkHeader,
  paginationLinks,
  cursorPaginationLinks,
  parseLinkHeader
} from './lib/link.js';
export {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  DEFAULT_CURSOR_LIMIT,
  MAX_CURSOR_LIMIT,
  OFFSET_PAGINATION_KEYS,
  CURSOR_PAGINATION_KEYS,
  JSON_API_PAGE_STRATEGY_GROUPS,
  parseOffsetParams,
  serializeOffsetParams,
  parseCursorParams,
  serializeCursorParams
} from './lib/pagination.js';
export {parseRetryAfter, formatRetryAfter} from './lib/retry-after.js';
export {
  TOKEN_CHARS,
  skipOWS,
  scanToken,
  sanitizeQuotedString,
  parseQuotedString
} from './lib/quoted-string.js';
