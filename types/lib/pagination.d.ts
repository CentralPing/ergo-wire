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
export type OffsetParseOptions = {
    /**
     * - Fallback page when query.page is absent/invalid.
     */
    defaultPage?: number;
    /**
     * - Fallback per-page when query.per_page is absent/invalid.
     */
    defaultPerPage?: number;
    /**
     * - Upper bound applied to the resolved per-page value.
     */
    maxPerPage?: number;
};
export type CursorParseOptions = {
    /**
     * - Fallback limit when query.limit is absent/invalid.
     */
    defaultLimit?: number;
    /**
     * - Upper bound applied to the resolved limit value.
     */
    maxLimit?: number;
};
export type OffsetWireQuery = {
    /**
     * - 1-based page number.
     */
    page?: string | number;
    /**
     * - Items per page.
     */
    per_page?: string | number;
};
export type CursorWireQuery = {
    /**
     * - Opaque cursor token.
     */
    cursor?: string;
    /**
     * - Items per page.
     */
    limit?: string | number;
};
/**
 * @typedef {object} OffsetParseOptions
 * @property {number} [defaultPage=DEFAULT_PAGE] - Fallback page when query.page is absent/invalid.
 * @property {number} [defaultPerPage=DEFAULT_PER_PAGE] - Fallback per-page when query.per_page is absent/invalid.
 * @property {number} [maxPerPage=MAX_PER_PAGE] - Upper bound applied to the resolved per-page value.
 */
/**
 * @typedef {object} CursorParseOptions
 * @property {number} [defaultLimit=DEFAULT_CURSOR_LIMIT] - Fallback limit when query.limit is absent/invalid.
 * @property {number} [maxLimit=MAX_CURSOR_LIMIT] - Upper bound applied to the resolved limit value.
 */
/**
 * Wire query shape for offset pagination keys (`page`, `per_page`).
 * Values may be strings (URLSearchParams) or numbers (pre-parsed query objects).
 *
 * @typedef {object} OffsetWireQuery
 * @property {string|number} [page] - 1-based page number.
 * @property {string|number} [per_page] - Items per page.
 */
/**
 * Wire query shape for cursor pagination keys (`cursor`, `limit`).
 *
 * @typedef {object} CursorWireQuery
 * @property {string} [cursor] - Opaque cursor token.
 * @property {string|number} [limit] - Items per page.
 */
/**
 * Parses offset pagination parameters from a query object.
 *
 * @param {OffsetWireQuery} [query] - Parsed query object.
 * @param {OffsetParseOptions} [options] - Override defaults and bounds.
 * @returns {{page: number, perPage: number, offset: number, limit: number}} - Parsed params.
 */
export declare function parseOffsetParams(query?: OffsetWireQuery, options?: OffsetParseOptions): {
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
 * @param {{page?: number, perPage?: number}} [params] - Pagination values (defaults applied when omitted).
 * @param {number} [params.page=DEFAULT_PAGE] - Page number (1-based).
 * @param {number} [params.perPage=DEFAULT_PER_PAGE] - Items per page.
 * @returns {Readonly<{page: number, per_page: number}>} - Wire query object.
 * @throws {TypeError} When page or perPage are not positive integers.
 */
export declare function serializeOffsetParams(params?: {
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
 * @param {{limit?: number, cursor?: string}} [params] - Pagination values (defaults applied when omitted).
 * @param {number} [params.limit=DEFAULT_CURSOR_LIMIT] - Items per page.
 * @param {string} [params.cursor] - Opaque cursor token.
 * @returns {Readonly<{limit: number, cursor?: string}>} - Wire query object.
 * @throws {TypeError} When limit is not a positive integer or cursor is not a string.
 */
export declare function serializeCursorParams(params?: {
    limit?: number;
    cursor?: string;
}): Readonly<{
    limit: number;
    cursor?: string;
}>;
/**
 * Parses cursor pagination parameters from a query object.
 *
 * @param {CursorWireQuery} [query] - Parsed query object.
 * @param {CursorParseOptions} [options] - Override defaults and bounds.
 * @returns {{cursor: string|undefined, limit: number}} - Parsed cursor and limit.
 */
export declare function parseCursorParams(query?: CursorWireQuery, options?: CursorParseOptions): {
    cursor: string | undefined;
    limit: number;
};
