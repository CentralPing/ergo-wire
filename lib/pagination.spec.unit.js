import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

import {
  parseOffsetParams,
  serializeOffsetParams,
  parseCursorParams,
  JSON_API_PAGE_STRATEGY_GROUPS
} from './pagination.js';

const vectors = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../test/vectors/pagination.json'),
    'utf8'
  )
);

describe('[Boundary] lib/pagination', () => {
  for (const {input, wire} of vectors.serialize) {
    it(`serializeOffsetParams ${JSON.stringify(input)}`, () => {
      const result = serializeOffsetParams(input);
      assert.equal(result.page, wire.page);
      assert.equal(result.per_page, wire.per_page);
    });
  }

  for (const {query, expected} of vectors.parse) {
    it(`parseOffsetParams ${JSON.stringify(query)}`, () => {
      assert.deepEqual(parseOffsetParams(query), expected);
    });
  }

  it('serializeOffsetParams validates integers', () => {
    assert.throws(() => serializeOffsetParams({page: 0, perPage: 10}), TypeError);
    assert.throws(() => serializeOffsetParams({page: 1, perPage: -1}), TypeError);
  });

  it('exports JSON_API_PAGE_STRATEGY_GROUPS', () => {
    assert.equal(JSON_API_PAGE_STRATEGY_GROUPS.length, 3);
  });

  it('parseCursorParams clamps limit', () => {
    const result = parseCursorParams({cursor: 'tok', limit: '500'});
    assert.equal(result.cursor, 'tok');
    assert.equal(result.limit, 100);
  });

  it('parseOffsetParams uses defaults for missing query', () => {
    const result = parseOffsetParams();
    assert.deepEqual(result, {page: 1, perPage: 20, offset: 0, limit: 20});
  });

  it('serializeOffsetParams uses defaults', () => {
    const result = serializeOffsetParams({});
    assert.equal(result.page, 1);
    assert.equal(result.per_page, 20);
  });

  it('parseCursorParams uses default limit when limit is missing', () => {
    const result = parseCursorParams({cursor: 'tok'});
    assert.equal(result.limit, 20);
  });
});
