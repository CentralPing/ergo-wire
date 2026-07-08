import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

import {fingerprint} from './fingerprint.js';

describe('[Boundary] lib/fingerprint', () => {
  it('hashes string bodies', async () => {
    const hex = await fingerprint('hello');
    assert.equal(hex.length, 64);
    assert.match(hex, /^[0-9a-f]+$/);
  });

  it('hashes empty body', async () => {
    const hex = await fingerprint('');
    assert.equal(hex, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes Uint8Array bodies', async () => {
    const bytes = new TextEncoder().encode('hello');
    const hex = await fingerprint(bytes);
    assert.equal(hex.length, 64);
  });

  it('hashes ArrayBuffer bodies', async () => {
    const bytes = new TextEncoder().encode('hello');
    const hex = await fingerprint(bytes.buffer);
    assert.equal(hex.length, 64);
  });

  it('coerces unknown body values to empty string', async () => {
    const hex = await fingerprint(null);
    assert.equal(hex, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});
