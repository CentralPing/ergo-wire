import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

import * as pkg from './index.js';

describe('[Boundary] index exports', () => {
  it('exports wire primitives', () => {
    assert.equal(typeof pkg.parseIdempotencyKey, 'function');
    assert.equal(typeof pkg.formatIdempotencyKey, 'function');
    assert.equal(typeof pkg.parseLinkHeader, 'function');
    assert.equal(typeof pkg.formatLinkHeader, 'function');
    assert.equal(typeof pkg.serializeOffsetParams, 'function');
    assert.equal(typeof pkg.serializeCursorParams, 'function');
    assert.equal(typeof pkg.parseRetryAfter, 'function');
    assert.equal(typeof pkg.fingerprint, 'function');
  });
});
