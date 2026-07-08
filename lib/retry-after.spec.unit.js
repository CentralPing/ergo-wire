import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

import {parseRetryAfter, formatRetryAfter} from './retry-after.js';

const vectors = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../test/vectors/retry-after.json'),
    'utf8'
  )
);

describe('[Boundary] lib/retry-after', () => {
  for (const {input, expectedMs} of vectors.seconds.filter((v) => v.expectedMs !== undefined)) {
    it(`parses seconds ${input}`, () => {
      assert.equal(parseRetryAfter(input), expectedMs);
    });
  }

  for (const {input, minMs} of vectors.seconds.filter((v) => v.minMs !== undefined)) {
    it(`parses seconds ${input} with minimum bound`, () => {
      const delay = parseRetryAfter(input);
      assert.ok(delay >= minMs);
    });
  }

  for (const invalid of vectors.invalid) {
    it(`rejects ${JSON.stringify(invalid)}`, () => {
      assert.equal(parseRetryAfter(invalid), undefined);
    });
  }

  it('formatRetryAfter round-trips integer seconds', () => {
    assert.equal(formatRetryAfter(60), '60');
    assert.equal(parseRetryAfter(formatRetryAfter(60)), 60_000);
  });

  it('formatRetryAfter formats Date', () => {
    const date = new Date('Wed, 01 Jan 2030 00:00:00 GMT');
    assert.equal(formatRetryAfter(date), date.toUTCString());
  });

  it('formatRetryAfter rejects invalid values', () => {
    assert.throws(() => formatRetryAfter(-1), TypeError);
    assert.throws(() => formatRetryAfter('x'), TypeError);
    assert.throws(() => formatRetryAfter(new Date('invalid')), TypeError);
  });

  for (const {input} of vectors.dates) {
    it(`parses IMF-fixdate ${input}`, () => {
      const delay = parseRetryAfter(input);
      assert.ok(typeof delay === 'number');
      assert.ok(delay >= 0);
    });
  }

  it('returns undefined for nullish and blank values', () => {
    assert.equal(parseRetryAfter(null), undefined);
    assert.equal(parseRetryAfter(undefined), undefined);
    assert.equal(parseRetryAfter('   '), undefined);
  });

  it('clamps IMF-fixdate delays to zero when date is in the past', () => {
    assert.equal(parseRetryAfter('Wed, 01 Jan 2020 00:00:00 GMT'), 0);
  });
});
