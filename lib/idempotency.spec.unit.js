import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

import {assertSfStringInner, formatIdempotencyKey, parseIdempotencyKey} from './idempotency.js';

const vectors = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../test/vectors/idempotency.json'),
    'utf8'
  )
);

describe('[Boundary] lib/idempotency', () => {
  for (const {raw, quoted} of vectors.validRoundTrip) {
    it(`round-trips ${JSON.stringify(raw)}`, () => {
      assert.equal(formatIdempotencyKey(raw), quoted);
      assert.equal(parseIdempotencyKey(quoted), raw);
      assert.equal(parseIdempotencyKey(`  ${quoted}  `), raw);
    });
  }

  for (const invalid of vectors.invalidFormat) {
    it(`rejects invalid key ${JSON.stringify(invalid)}`, () => {
      assert.throws(() => formatIdempotencyKey(invalid), TypeError);
    });
  }

  it('parseIdempotencyKey returns undefined for malformed input', () => {
    assert.equal(parseIdempotencyKey(undefined), undefined);
    assert.equal(parseIdempotencyKey(''), undefined);
    assert.equal(parseIdempotencyKey('abc-123'), undefined);
    assert.equal(parseIdempotencyKey('"ab\\nc"'), undefined);
  });

  it('assertSfStringInner rejects non-strings', () => {
    assert.throws(() => assertSfStringInner(1), TypeError);
  });
});
