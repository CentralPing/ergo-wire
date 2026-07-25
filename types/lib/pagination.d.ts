/**
 * @fileoverview Ergo stack pagination wire-key primitives.
 * @module @centralping/ergo-wire/lib/pagination
 */
/** @type {number} */
export declare const DEFAULT_PAGE: number;
/** @type {number} */
export declare const DEFAULT_PER_PAGE: number;
/** @type {number} */
export declare const MAX_PER_PAGE: number;
/** @type {number} */
export declare const DEFAULT_CURSOR_LIMIT: number;
/** @type {number} */
export declare const MAX_CURSOR_LIMIT: number;
/** @type {Readonly<{page: string, per_page: string}>} */
export declare const OFFSET_PAGINATION_KEYS: Readonly<{
    page: string;
    per_page: string;
}>;
/** @type {Readonly<{cursor: string, limit: string}>} */
export declare const CURSOR_PAGINATION_KEYS: Readonly<{
    cursor: string;
    limit: string;
}>;
/**
 * Known JSON:API page parameter keys grouped by pagination strategy.
 *
 * @type {ReadonlyArray<ReadonlyArray<string>>}
 */
export declare const JSON_API_PAGE_STRATEGY_GROUPS: ReadonlyArray<ReadonlyArray<string>>;
/**
 * Parses offset pagination parameters from a query object.
 *
 * @param {object} [query] - Parsed query object.
 * @param {object} [options] - Override defaults and bounds.
 * @returns {{page: number, perPage: number, offset: number, limit: number}} - Parsed params.
 */
export declare function parseOffsetParams(query?: object, options?: object): {
    page: number;
    perPage: number;
    offset: number;
    limit: number;
};
/**
 * Serializes offset pagination parameters for wire transport.
 *
 * Accepts ergonomic `perPage` and emits canonical `per_page`.
 *
 * @param {object} params - Pagination values.
 * @param {number} [params.page=DEFAULT_PAGE] - Page number (1-based).
 * @param {number} [params.perPage=DEFAULT_PER_PAGE] - Items per page.
 * @returns {Readonly<{page: number, per_page: number}>} - Wire query object.
 * @throws {TypeError} When page or perPage are not positive integers.
 */
export declare function serializeOffsetParams(params: {
    page?: number;
    perPage?: number;
}): Readonly<{
    page: number;
    per_page: number;
}>;
/**
 * Serializes cursor pagination parameters for wire transport.
 *
 * Emits canonical {@link CURSOR_PAGINATION_KEYS} (`cursor`, `limit`) on the wire.
 *
 * @param {object} params - Pagination values.
 * @param {number} [params.limit=DEFAULT_CURSOR_LIMIT] - Items per page.
 * @param {string} [params.cursor] - Opaque cursor token.
 * @returns {Readonly<{limit: number, cursor?: string}>} - Wire query object.
 * @throws {TypeError} When limit is not a positive integer or cursor is not a string.
 */
export declare function serializeCursorParams(params: {
    limit?: number;
    cursor?: string;
}): Readonly<{
    limit: number;
    cursor?: string;
}>;
/**
 * Parses cursor pagination parameters from a query object.
 *
 * @param {object} [query] - Parsed query object.
 * @param {object} [options] - Override defaults and bounds.
 * @returns {{cursor: string|undefined, limit: number}} - Parsed cursor and limit.
 */
export declare function parseCursorParams(query?: object, options?: object): {
    cursor: string | undefined;
    limit: number;
};
