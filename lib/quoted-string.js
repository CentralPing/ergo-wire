/**
 * @fileoverview RFC 9110 quoted-string and token scanning primitives.
 * @module @centralping/ergo-wire/lib/quoted-string
 */

/**
 * RFC 9110 Section 5.6.2 token character lookup.
 *
 * @type {ReadonlyArray<boolean>}
 */
export const TOKEN_CHARS = /* @__PURE__ */ (() => {
  const table = new Array(128).fill(false);
  const chars = "!#$%&'*+-.^_`|~";
  for (let i = 0; i < chars.length; i++) table[chars.charCodeAt(i)] = true;
  for (let c = 0x30; c <= 0x39; c++) table[c] = true;
  for (let c = 0x41; c <= 0x5a; c++) table[c] = true;
  for (let c = 0x61; c <= 0x7a; c++) table[c] = true;
  return Object.freeze(table);
})();

/**
 * Advances past optional whitespace (SP and HTAB).
 *
 * @param {string} str - Input string.
 * @param {number} start - Current position.
 * @returns {number} - Position after whitespace.
 */
export function skipOWS(str, start) {
  let i = start;
  while (i < str.length) {
    const ch = str.charCodeAt(i);
    if (ch !== 0x20 && ch !== 0x09) break;
    i++;
  }
  return i;
}

/**
 * Scans a run of RFC 9110 token characters starting at `start`.
 *
 * @param {string} str - Input string.
 * @param {number} start - Start position.
 * @returns {number} - End position (exclusive) of the token.
 */
export function scanToken(str, start) {
  let i = start;
  while (i < str.length) {
    const code = str.charCodeAt(i);
    if (code >= 128 || !TOKEN_CHARS[code]) break;
    i++;
  }
  return i;
}

/**
 * Escape a value for use inside a quoted-string per RFC 9110 section 5.6.4.
 *
 * @param {string} str - Raw value.
 * @returns {string} - Value safe for inclusion between double-quote delimiters.
 */
export function sanitizeQuotedString(str) {
  return String(str)
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll(/[^\t\x20-\x7e\x80-\xff]/g, '');
}

/**
 * Parses an RFC 9110 quoted-string starting at the opening `"`.
 *
 * @param {string} str - Input string.
 * @param {number} start - Position of the opening `"`.
 * @returns {{value: string | undefined, end: number}} - Parsed value and end position.
 */
export function parseQuotedString(str, start) {
  let i = start + 1;
  let value = '';
  let segmentStart = i;
  let valid = true;

  while (i < str.length) {
    const ch = str.charCodeAt(i);

    if (ch === 0x22) {
      value += str.slice(segmentStart, i);
      return {value: valid ? value : undefined, end: i + 1};
    }

    if (ch === 0x5c && i + 1 < str.length) {
      const next = str.charCodeAt(i + 1);
      if (next !== 0x09 && (next < 0x20 || next > 0x7e) && (next < 0x80 || next > 0xff)) {
        valid = false;
      }
      value += str.slice(segmentStart, i);
      i++;
      value += str[i];
      i++;
      segmentStart = i;
      continue;
    }

    if (ch !== 0x09 && (ch < 0x20 || ch > 0x7e) && (ch < 0x80 || ch > 0xff)) {
      valid = false;
    }

    i++;
  }

  return {value: undefined, end: i};
}
