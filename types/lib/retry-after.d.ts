/**
 * @fileoverview Retry-After header parse/format primitives.
 * @module @centralping/ergo-wire/lib/retry-after
 */
/**
 * Parses a Retry-After header value into milliseconds.
 *
 * @param {string | null | undefined} value - Raw Retry-After header value.
 * @returns {number | undefined} - Delay in milliseconds, or undefined if unparseable.
 */
export declare function parseRetryAfter(value: string | null | undefined): number | undefined;
/**
 * Formats a Retry-After value for an HTTP header.
 *
 * @param {number | Date} value - Delay in seconds or an HTTP-date.
 * @returns {string} - Header value.
 * @throws {TypeError} When value is not a non-negative integer or valid Date.
 */
export declare function formatRetryAfter(value: number | Date): string;
