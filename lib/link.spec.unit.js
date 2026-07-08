import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

import {formatLinkHeader, parseLinkHeader, paginationLinks, cursorPaginationLinks} from './link.js';

const vectors = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../test/vectors/link.json'), 'utf8')
);

describe('[Boundary] lib/link', () => {
  for (const {links, rel, href} of vectors.roundTrip) {
    it(`round-trips rel=${rel}`, () => {
      const header = formatLinkHeader(links);
      const parsed = parseLinkHeader(header);
      assert.equal(parsed.get(rel)?.href, href);
    });
  }

  it('paginationLinks uses per_page on wire', () => {
    const links = paginationLinks({baseUrl: '/items', page: 2, perPage: 25, total: 100});
    const header = formatLinkHeader(links);
    assert.ok(header.includes('per_page=25'));
    assert.ok(!header.includes('perPage'));
  });

  it('formatLinkHeader rejects invalid href', () => {
    assert.throws(() => formatLinkHeader([{href: '', rel: 'next'}]), TypeError);
  });

  it('cursorPaginationLinks emits cursor params', () => {
    const links = cursorPaginationLinks({
      baseUrl: '/items',
      nextCursor: 'abc',
      prevCursor: 'def'
    });
    const header = formatLinkHeader(links);
    assert.ok(header.includes('cursor=abc'));
    assert.ok(header.includes('rel="prev"'));
  });

  it('parseLinkHeader resolves relative href with base URL', () => {
    const header = '</items?page=2>; rel="next"';
    const parsed = parseLinkHeader(header, 'https://api.example.com/v1');
    assert.equal(parsed.get('next')?.href, 'https://api.example.com/items?page=2');
  });

  it('parseLinkHeader skips malformed link-values', () => {
    const parsed = parseLinkHeader('not-a-link, </ok>; rel="next"');
    assert.equal(parsed.get('next')?.href, '/ok');
  });

  it('formatLinkHeader rejects invalid parameter keys', () => {
    assert.throws(() => formatLinkHeader([{href: '/x', rel: 'next', 'bad key': 'v'}]), TypeError);
  });

  it('formatLinkHeader rejects disallowed href characters', () => {
    assert.throws(() => formatLinkHeader([{href: '/x y', rel: 'next'}]), TypeError);
  });

  it('formatLinkHeader includes optional link parameters', () => {
    const header = formatLinkHeader([{href: '/x', rel: 'next', title: 'page 2'}]);
    assert.ok(header.includes('title="page 2"'));
  });

  it('paginationLinks omits prev on first page and next on last', () => {
    const first = paginationLinks({baseUrl: '/i', page: 1, perPage: 10, total: 30});
    const firstRels = first.map((l) => l.rel);
    assert.ok(!firstRels.includes('prev'));
    assert.ok(firstRels.includes('next'));

    const last = paginationLinks({baseUrl: '/i', page: 3, perPage: 10, total: 30});
    const lastRels = last.map((l) => l.rel);
    assert.ok(!lastRels.includes('next'));
    assert.ok(lastRels.includes('prev'));
  });

  it('paginationLinks preserves existing search params', () => {
    const links = paginationLinks({
      baseUrl: '/i',
      page: 2,
      perPage: 10,
      total: 30,
      searchParams: 'filter=active'
    });
    assert.ok(links[0].href.includes('filter=active&page=1'));
  });

  it('cursorPaginationLinks uses searchParams separator', () => {
    const links = cursorPaginationLinks({
      baseUrl: '/i',
      searchParams: 'sort=name',
      nextCursor: 'tok'
    });
    assert.ok(links.some((l) => l.rel === 'next' && l.href.includes('sort=name&cursor=tok')));
  });

  it('cursorPaginationLinks without cursors emits first only', () => {
    const links = cursorPaginationLinks({baseUrl: '/i'});
    assert.deepEqual(
      links.map((l) => l.rel),
      ['first']
    );
  });

  it('parseLinkHeader returns empty map for empty header', () => {
    assert.equal(parseLinkHeader('').size, 0);
  });

  it('parseLinkHeader throws for invalid requestUrl', () => {
    assert.throws(() => parseLinkHeader('</a>; rel="next"', 'not-a-url'), TypeError);
  });

  it('parseLinkHeader handles multiple rel values and extra params', () => {
    const header = '</a>; rel="next prev"; title="page2"';
    const parsed = parseLinkHeader(header);
    assert.equal(parsed.get('next')?.title, 'page2');
    assert.equal(parsed.get('prev')?.title, 'page2');
  });

  it('parseLinkHeader accepts token parameter values', () => {
    const parsed = parseLinkHeader('</a>; rel=next');
    assert.equal(parsed.get('next')?.href, '/a');
  });

  it('parseLinkHeader skips links with malformed quoted parameters', () => {
    const parsed = parseLinkHeader('</bad>; title="\x01"; rel="next", </ok>; rel="next"');
    assert.equal(parsed.get('next')?.href, '/ok');
  });

  it('parseLinkHeader preserves raw href when resolution fails', () => {
    const parsed = parseLinkHeader('<http://a b.com>; rel="next"', 'https://api.example.com');
    assert.equal(parsed.get('next')?.href, 'http://a b.com');
  });

  it('parseLinkHeader ignores links without rel', () => {
    const parsed = parseLinkHeader('</a>; title="x"');
    assert.equal(parsed.size, 0);
  });

  it('parseLinkHeader keeps first duplicate parameter value', () => {
    const parsed = parseLinkHeader('</a>; rel="next"; title="first"; title="second"');
    assert.equal(parsed.get('next')?.title, 'first');
  });
});
