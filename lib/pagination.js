/**
 * @fileoverview Ergo stack pagination wire-key primitives.
 * @module @centralping/ergo-wire/lib/pagination
 */

/** @type {number} */
export const DEFAULT_PAGE = 1;
/** @type {number} */
export const DEFAULT_PER_PAGE = 20;
/** @type {number} */
export const MAX_PER_PAGE = 100;
/** @type {number} */
export const DEFAULT_CURSOR_LIMIT = 20;
/** @type {number} */
export const MAX_CURSOR_LIMIT = 100;

/** @type {Readonly<{page: string, per_page: string}>} */
export const OFFSET_PAGINATION_KEYS = Object.freeze({page: 'page', per_page: 'per_page'});

/** @type {Readonly<{cursor: string, limit: string}>} */
export const CURSOR_PAGINATION_KEYS = Object.freeze({cursor: 'cursor', limit: 'limit'});

/**
 * Known JSON:API page parameter keys grouped by pagination strategy.
 *
 * @type {ReadonlyArray<ReadonlyArray<string>>}
 */
export const JSON_API_PAGE_STRATEGY_GROUPS = Object.freeze([
  Object.freeze(['number', 'size']),
  Object.freeze(['offset', 'limit']),
  Object.freeze(['cursor'])
]);

/**
 * Parses offset pagination parameters from a query object.
 *
 * @param {object} [query] - Parsed query object.
 * @param {object} [options] - Override defaults and bounds.
 * @returns {{page: number, perPage: number, offset: number, limit: number}} - Parsed params.
 */
export function parseOffsetParams(query, options) {
  const {
    defaultPage = DEFAULT_PAGE,
    defaultPerPage = DEFAULT_PER_PAGE,
    maxPerPage = MAX_PER_PAGE
  } = options ?? {};

  const rawPage = parseInt(query?.page, 10);
  const rawPerPage = parseInt(query?.per_page, 10);

  const perPage = Math.min(
    Math.max(1, Number.isNaN(rawPerPage) ? defaultPerPage : rawPerPage),
    maxPerPage
  );
  const page = Math.max(1, Number.isNaN(rawPage) ? defaultPage : rawPage);
  const offset = (page - 1) * perPage;

  return {page, perPage, offset, limit: perPage};
}

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
export function serializeOffsetParams(params) {
  const page = params?.page ?? DEFAULT_PAGE;
  const perPage = params?.perPage ?? DEFAULT_PER_PAGE;

  if (!Number.isInteger(page) || page < 1) {
    throw new TypeError('page must be a positive integer');
  }

  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new TypeError('perPage must be a positive integer');
  }

  const wire = Object.create(null);
  wire.page = page;
  wire.per_page = perPage;
  return Object.freeze(wire);
}

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
export function serializeCursorParams(params) {
  const limit = params?.limit ?? DEFAULT_CURSOR_LIMIT;

  if (!Number.isInteger(limit) || limit < 1) {
    throw new TypeError('limit must be a positive integer');
  }

  const wire = Object.create(null);
  wire.limit = limit;

  if (params?.cursor !== undefined) {
    const {cursor} = params;
    if (typeof cursor !== 'string') {
      throw new TypeError('cursor must be a string');
    }
    wire.cursor = cursor;
  }

  return Object.freeze(wire);
}

/**
 * Parses cursor pagination parameters from a query object.
 *
 * @param {object} [query] - Parsed query object.
 * @param {object} [options] - Override defaults and bounds.
 * @returns {{cursor: string|undefined, limit: number}} - Parsed cursor and limit.
 */
export function parseCursorParams(query, options) {
  const {defaultLimit = DEFAULT_CURSOR_LIMIT, maxLimit = MAX_CURSOR_LIMIT} = options ?? {};

  const rawLimit = parseInt(query?.limit, 10);
  const limit = Math.min(Math.max(1, Number.isNaN(rawLimit) ? defaultLimit : rawLimit), maxLimit);
  const cursor = query?.cursor;

  return {cursor, limit};
}
