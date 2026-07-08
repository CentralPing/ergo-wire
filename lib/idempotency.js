/**
 * @fileoverview RFC 8941 sf-string primitives for Idempotency-Key headers.
 * @module @centralping/ergo-wire/lib/idempotency
 */

// RFC 8941 §3.3.3 unescaped + escaped
const SF_STRING_RE = /^"((?:[\x20-\x21\x23-\x5B\x5D-\x7E]|\\["\\])*)"$/;

/**
 * Validates that a raw value is encodable as an RFC 8941 sf-string inner value.
 *
 * @param {string} value - Raw inner value.
 * @throws {TypeError} When value contains characters outside the sf-string allowlist.
 */
export function assertSfStringInner(value) {
  if (typeof value !== 'string') {
    throw new TypeError('value must be a string');
  }

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 0x20 && code <= 0x7e) continue;
    throw new TypeError('value must be an RFC 8941 sf-string value (visible ASCII)');
  }
}

/**
 * Formats a raw value as an RFC 8941 quoted sf-string for HTTP headers.
 *
 * @param {string} value - Raw inner value.
 * @returns {string} - Quoted wire value (e.g. `"my-key"`).
 * @throws {TypeError} When value is not a valid sf-string inner value.
 */
export function formatIdempotencyKey(value) {
  assertSfStringInner(value);
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * Parse an `Idempotency-Key` header value as an RFC 8941 sf-string.
 *
 * @param {string | undefined} header - Raw header value.
 * @returns {string | undefined} - Parsed key value, or undefined.
 */
export function parseIdempotencyKey(header) {
  if (!header) return undefined;

  const trimmed = header.trim();
  const match = SF_STRING_RE.exec(trimmed);
  if (!match) return undefined;

  return match[1].replace(/\\(["\\])/g, '$1');
}
