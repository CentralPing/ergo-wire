import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {Buffer} from 'node:buffer';

import {fingerprint} from './fingerprint.js';

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const HELLO_SHA256 = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

describe('[Boundary] lib/fingerprint', () => {
  it('hashes string bodies', async () => {
    const hex = await fingerprint('hello');
    assert.equal(hex, HELLO_SHA256);
  });

  it('hashes empty body', async () => {
    const hex = await fingerprint('');
    assert.equal(hex, EMPTY_SHA256);
  });

  it('hashes Uint8Array bodies', async () => {
    const bytes = new TextEncoder().encode('hello');
    const hex = await fingerprint(bytes);
    assert.equal(hex, HELLO_SHA256);
  });

  it('hashes ArrayBuffer bodies', async () => {
    const bytes = new TextEncoder().encode('hello');
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const hex = await fingerprint(buffer);
    assert.equal(hex, HELLO_SHA256);
  });

  it('hashes Buffer bodies (Uint8Array subclass)', async () => {
    const bufferHex = await fingerprint(Buffer.from('hello'));
    assert.equal(bufferHex, HELLO_SHA256);
  });

  it('rejects null', async () => {
    await assert.rejects(() => fingerprint(null), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('rejects undefined', async () => {
    await assert.rejects(() => fingerprint(undefined), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('rejects plain objects', async () => {
    await assert.rejects(() => fingerprint({}), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('rejects arrays', async () => {
    await assert.rejects(() => fingerprint([]), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('rejects numbers', async () => {
    await assert.rejects(() => fingerprint(42), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('rejects booleans', async () => {
    await assert.rejects(() => fingerprint(true), {
      name: 'TypeError',
      message: /body must be a string, Uint8Array, or ArrayBuffer/
    });
  });

  it('does not collapse distinct plain objects to the same hash', async () => {
    // Under coercion, both would hash TextEncoder("[object Object]").
    await assert.rejects(() => fingerprint({a: 1}), {name: 'TypeError'});
    await assert.rejects(() => fingerprint({b: 2}), {name: 'TypeError'});
  });
});
