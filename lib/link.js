/**
 * @fileoverview RFC 8288 Web Linking format and parse primitives.
 * @module @centralping/ergo-wire/lib/link
 */

import {parseQuotedString, sanitizeQuotedString, scanToken, skipOWS} from './quoted-string.js';

const TOKEN_RE = /^[!#$%&'*+\-.^_`|~\w]+$/;
const URI_REF_CHARS_RE = /^(?:%[0-9A-Fa-f]{2}|[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=])+$/;

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
export function formatLinkHeader(links) {
  return links
    .map(({href, rel, ...params}) => {
      const hrefText = String(href);
      if (hrefText.length === 0) {
        throw new TypeError('Link href must be a non-empty URI-reference');
      }
      if (!URI_REF_CHARS_RE.test(hrefText)) {
        throw new TypeError('Link href contains characters not permitted in a URI-reference');
      }
      let entry = `<${hrefText}>; rel="${sanitizeQuotedString(rel)}"`;
      for (const [key, value] of Object.entries(params)) {
        if (!TOKEN_RE.test(key)) {
          throw new TypeError(`Link parameter key "${key}" is not a valid token`);
        }
        entry += `; ${key}="${sanitizeQuotedString(value)}"`;
      }
      return entry;
    })
    .join(', ');
}

/**
 * Generates pagination link objects for offset pagination.
 *
 * @param {{baseUrl: string, page: number, perPage: number, total: number, searchParams?: string}} options - Pagination parameters.
 * @returns {Array<{href: string, rel: string}>} - Link objects.
 */
export function paginationLinks({baseUrl, page, perPage, total, searchParams = ''}) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const sep = searchParams ? '&' : '';
  const prefix = `${baseUrl}?${searchParams}${sep}`;
  const buildHref = (p) => `${prefix}page=${p}&per_page=${perPage}`;

  const links = [{href: buildHref(1), rel: 'first'}];

  if (page > 1) {
    links.push({href: buildHref(Math.min(page - 1, lastPage)), rel: 'prev'});
  }

  if (page < lastPage) {
    links.push({href: buildHref(page + 1), rel: 'next'});
  }

  links.push({href: buildHref(lastPage), rel: 'last'});
  return links;
}

/**
 * Generates cursor-based pagination link objects.
 *
 * @param {{baseUrl: string, searchParams?: string, nextCursor?: string, prevCursor?: string}} options - Cursor pagination parameters.
 * @returns {Array<{href: string, rel: string}>} - Link objects.
 */
export function cursorPaginationLinks({baseUrl, searchParams = '', nextCursor, prevCursor}) {
  const base = searchParams ? `${baseUrl}?${searchParams}` : baseUrl;
  const sep = searchParams ? '&' : '?';

  const links = [{href: base, rel: 'first'}];

  if (prevCursor !== undefined) {
    links.push({
      href: `${base}${sep}cursor=${encodeURIComponent(prevCursor)}`,
      rel: 'prev'
    });
  }

  if (nextCursor !== undefined) {
    links.push({
      href: `${base}${sep}cursor=${encodeURIComponent(nextCursor)}`,
      rel: 'next'
    });
  }

  return links;
}

/**
 * @param {string} str - Input string.
 * @param {number} start - Start position.
 * @returns {number} - Position of comma or end.
 */
function skipToNextComma(str, start) {
  let i = start;
  while (i < str.length) {
    const ch = str.charCodeAt(i);
    if (ch === 0x2c) return i;
    if (ch === 0x22) {
      const qs = parseQuotedString(str, i);
      i = qs.end;
      continue;
    }
    i++;
  }
  return i;
}

/**
 * Parses an RFC 8288 Link header value.
 *
 * @param {string} headerValue - Raw Link header value.
 * @param {string} [requestUrl] - Base URL for resolving relative URI-references.
 * @returns {Map<string, Readonly<LinkObject>>} - Links keyed by relationship type.
 * @throws {TypeError} When requestUrl is provided but invalid.
 */
export function parseLinkHeader(headerValue, requestUrl) {
  const result = new Map();

  if (typeof headerValue !== 'string' || headerValue.length === 0) {
    return result;
  }

  let baseUrl;
  if (requestUrl !== undefined) {
    if (typeof requestUrl !== 'string' || requestUrl.length === 0) {
      throw new TypeError('requestUrl must be a non-empty string when provided');
    }
    baseUrl = new URL(requestUrl).href;
  }

  const len = headerValue.length;
  let pos = 0;

  while (pos < len) {
    pos = skipOWS(headerValue, pos);
    if (pos >= len) break;

    if (headerValue.charCodeAt(pos) === 0x2c) {
      pos++;
      continue;
    }

    if (headerValue.charCodeAt(pos) !== 0x3c) {
      pos = skipToNextComma(headerValue, pos);
      continue;
    }

    const closeAngle = headerValue.indexOf('>', pos + 1);
    if (closeAngle === -1) break;

    const rawHref = headerValue.slice(pos + 1, closeAngle);
    pos = closeAngle + 1;

    const params = Object.create(null);
    let skipLink = false;

    while (pos < len) {
      pos = skipOWS(headerValue, pos);
      if (pos >= len) break;

      const ch = headerValue.charCodeAt(pos);
      if (ch === 0x2c) break;
      if (ch !== 0x3b) break;
      pos++;
      pos = skipOWS(headerValue, pos);

      const nameEnd = scanToken(headerValue, pos);
      if (nameEnd === pos) break;
      const name = headerValue.slice(pos, nameEnd).toLowerCase();
      pos = nameEnd;
      pos = skipOWS(headerValue, pos);

      let value;
      if (pos >= len || headerValue.charCodeAt(pos) !== 0x3d) {
        value = '';
      } else {
        pos++;
        pos = skipOWS(headerValue, pos);
        if (pos < len && headerValue.charCodeAt(pos) === 0x22) {
          const qs = parseQuotedString(headerValue, pos);
          pos = qs.end;
          if (qs.value === undefined) {
            pos = skipToNextComma(headerValue, pos);
            skipLink = true;
            break;
          }
          value = qs.value;
        } else {
          const valueEnd = scanToken(headerValue, pos);
          value = headerValue.slice(pos, valueEnd);
          pos = valueEnd;
        }
      }

      if (!(name in params)) {
        params[name] = value;
      }
    }

    if (skipLink) continue;

    if (pos < len && headerValue.charCodeAt(pos) === 0x2c) {
      pos++;
    }

    if (!params.rel) continue;

    let href = rawHref;
    if (baseUrl) {
      try {
        href = new URL(rawHref, baseUrl).href;
      } catch {
        // preserve raw href
      }
    }

    for (const rel of params.rel.split(/\s+/)) {
      if (!rel) continue;
      const canonicalRel = rel.toLowerCase();
      const link = Object.create(null);
      link.href = href;
      link.rel = canonicalRel;
      for (const key of Object.keys(params)) {
        if (key === 'rel' || key === 'href') continue;
        link[key] = params[key];
      }
      result.set(canonicalRel, Object.freeze(link));
    }
  }

  return result;
}
