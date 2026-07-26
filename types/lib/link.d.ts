/**
 * @fileoverview RFC 8288 Web Linking format and parse primitives.
 * @module @centralping/ergo-wire/lib/link
 */
export type LinkObject = {
    /**
     * - Resolved target URI.
     */
    href: string;
    /**
     * - Relationship type.
     */
    rel: string;
};
/**
 * @typedef {object} LinkObject
 * @property {string} href - Resolved target URI.
 * @property {string} rel - Relationship type.
 */
/**
 * Formats link objects into an RFC 8288 Link header value.
 *
 * @param {Array<{href: string, rel: string}>} links - Link descriptors.
 * @returns {string} - Formatted header value.
 * @throws {TypeError} When href or parameter keys are invalid.
 */
export declare function formatLinkHeader(links: Array<{
    href: string;
    rel: string;
}>): string;
/**
 * Generates pagination link objects for offset pagination.
 *
 * @param {{baseUrl: string, page: number, perPage: number, total: number, searchParams?: string}} options - Pagination parameters.
 * @returns {Array<{href: string, rel: string}>} - Link objects.
 */
export declare function paginationLinks({ baseUrl, page, perPage, total, searchParams }: {
    baseUrl: string;
    page: number;
    perPage: number;
    total: number;
    searchParams?: string;
}): Array<{
    href: string;
    rel: string;
}>;
/**
 * Generates cursor-based pagination link objects.
 *
 * @param {{baseUrl: string, searchParams?: string, nextCursor?: string, prevCursor?: string}} options - Cursor pagination parameters.
 * @returns {Array<{href: string, rel: string}>} - Link objects.
 */
export declare function cursorPaginationLinks({ baseUrl, searchParams, nextCursor, prevCursor }: {
    baseUrl: string;
    searchParams?: string;
    nextCursor?: string;
    prevCursor?: string;
}): Array<{
    href: string;
    rel: string;
}>;
/**
 * Parses an RFC 8288 Link header value.
 *
 * Returns a Map keyed by relationship type. When multiple link-values share the
 * same `rel`, the last occurrence wins (`Map.set` overwrite). This last-wins
 * contract is intentional for Ergo Stack Wire Profile v1 — pagination helpers
 * emit at most one link per rel. Multi-valued same-rel preservation is tracked
 * separately (see CentralPing/ergo-wire#22).
 *
 * @param {string} headerValue - Raw Link header value.
 * @param {string} [requestUrl] - Base URL for resolving relative URI-references.
 * @returns {Map<string, Readonly<LinkObject>>} - Links keyed by relationship type (last-wins).
 * @throws {TypeError} When requestUrl is provided but invalid.
 */
export declare function parseLinkHeader(headerValue: string, requestUrl?: string): Map<string, Readonly<LinkObject>>;
