import {describe, it} from 'node:test';
import assert from 'node:assert/strict';

import {sanitizeQuotedString, parseQuotedString, scanToken, skipOWS} from './quoted-string.js';

describe('[Boundary] lib/quoted-string', () => {
  it('sanitizeQuotedString escapes quotes and backslashes', () => {
    assert.equal(sanitizeQuotedString('a"b\\c'), 'a\\"b\\\\c');
  });

  it('parseQuotedString round-trips sanitized values', () => {
    const raw = 'next';
    const sanitized = sanitizeQuotedString(raw);
    const {value} = parseQuotedString(`"${sanitized}"`, 0);
    assert.equal(value, raw);
  });

  it('parseQuotedString returns undefined for unterminated strings', () => {
    const {value} = parseQuotedString('"abc', 0);
    assert.equal(value, undefined);
  });

  it('parseQuotedString rejects invalid quoted-pair targets', () => {
    const invalid = `"a\\${String.fromCharCode(0x01)}b"`;
    const {value} = parseQuotedString(invalid, 0);
    assert.equal(value, undefined);
  });

  it('parseQuotedString rejects control characters in qdtext', () => {
    const {value} = parseQuotedString('"\x7fa"', 0);
    assert.equal(value, undefined);
  });

  it('skipOWS and scanToken work on tokens', () => {
    const str = '  next  ';
    const start = skipOWS(str, 0);
    const end = scanToken(str, start);
    assert.equal(str.slice(start, end), 'next');
  });
});
