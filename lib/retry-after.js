/**
 * @fileoverview Retry-After header parse/format primitives.
 * @module @centralping/ergo-wire/lib/retry-after
 */

const IMF_FIXDATE_RE =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/;

/**
 * Parses a Retry-After header value into milliseconds.
 *
 * @param {string | null | undefined} value - Raw Retry-After header value.
 * @returns {number | undefined} - Delay in milliseconds, or undefined if unparseable.
 */
export function parseRetryAfter(value) {
  if (value == null) return undefined;

  const trimmed = value.trim();
  if (trimmed === '') return undefined;

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed);
    if (!Number.isFinite(seconds)) return undefined;
    const delayMs = seconds * 1000;
    return Number.isFinite(delayMs) ? delayMs : undefined;
  }

  if (IMF_FIXDATE_RE.test(trimmed)) {
    const date = Date.parse(trimmed);
    if (!Number.isNaN(date)) {
      return Math.max(0, date - Date.now());
    }
  }

  return undefined;
}

/**
 * Formats a Retry-After value for an HTTP header.
 *
 * @param {number | Date} value - Delay in seconds or an HTTP-date.
 * @returns {string} - Header value.
 * @throws {TypeError} When value is not a non-negative integer or valid Date.
 */
export function formatRetryAfter(value) {
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) {
      throw new TypeError('seconds must be a non-negative integer');
    }
    return String(value);
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError('date must be a valid Date');
    }
    return value.toUTCString();
  }

  throw new TypeError('value must be a non-negative integer or Date');
}
