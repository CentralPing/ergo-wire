/**
 * @fileoverview RFC 9110 quoted-string and token scanning primitives.
 * @module @centralping/ergo-wire/lib/quoted-string
 */
/**
 * RFC 9110 Section 5.6.2 token character lookup.
 *
 * @type {ReadonlyArray<boolean>}
 */
export declare const TOKEN_CHARS: ReadonlyArray<boolean>;
/**
 * Advances past optional whitespace (SP and HTAB).
 *
 * @param {string} str - Input string.
 * @param {number} start - Current position.
 * @returns {number} - Position after whitespace.
 */
export declare function skipOWS(str: string, start: number): number;
/**
 * Scans a run of RFC 9110 token characters starting at `start`.
 *
 * @param {string} str - Input string.
 * @param {number} start - Start position.
 * @returns {number} - End position (exclusive) of the token.
 */
export declare function scanToken(str: string, start: number): number;
/**
 * Escape a value for use inside a quoted-string per RFC 9110 section 5.6.4.
 *
 * @param {string} str - Raw value.
 * @returns {string} - Value safe for inclusion between double-quote delimiters.
 */
export declare function sanitizeQuotedString(str: string): string;
/**
 * Parses an RFC 9110 quoted-string starting at the opening `"`.
 *
 * @param {string} str - Input string.
 * @param {number} start - Position of the opening `"`.
 * @returns {{value: string | undefined, end: number}} - Parsed value and end position.
 */
export declare function parseQuotedString(str: string, start: number): {
    value: string | undefined;
    end: number;
};
