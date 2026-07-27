/**
 * @fileoverview RFC 8941 sf-string primitives for Idempotency-Key headers.
 * @module @centralping/ergo-wire/lib/idempotency
 */
/**
 * Validates that a raw value is encodable as an RFC 8941 sf-string inner value.
 *
 * @param {string} value - Raw inner value.
 * @throws {TypeError} When value contains characters outside the sf-string allowlist.
 */
export declare function assertSfStringInner(value: string): void;
/**
 * Formats a raw value as an RFC 8941 quoted sf-string for HTTP headers.
 *
 * @param {string} value - Raw inner value.
 * @returns {string} - Quoted wire value (e.g. `"my-key"`).
 * @throws {TypeError} When value is not a valid sf-string inner value.
 */
export declare function formatIdempotencyKey(value: string): string;
/**
 * Parse an `Idempotency-Key` header value as an RFC 8941 sf-string.
 *
 * Accepts `null` so callers can pass `Headers.get(...)` without a cast.
 *
 * @param {string | null | undefined} header - Raw header value.
 * @returns {string | undefined} - Parsed key value, or undefined.
 */
export declare function parseIdempotencyKey(header: string | null | undefined): string | undefined;
