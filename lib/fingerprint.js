/**
 * @fileoverview SHA-256 body fingerprint via Web Crypto.
 * @module @centralping/ergo-wire/lib/fingerprint
 */

/**
 * Computes the SHA-256 hex digest of a request body using Web Crypto.
 *
 * @param {string | ArrayBuffer | Uint8Array} body - Serialized request body.
 * @returns {Promise<string>} - Hex-encoded SHA-256 digest.
 */
export async function fingerprint(body) {
  let bytes;

  if (typeof body === 'string') {
    bytes = new TextEncoder().encode(body);
  } else if (body instanceof Uint8Array) {
    bytes = body;
  } else if (body instanceof ArrayBuffer) {
    bytes = new Uint8Array(body);
  } else {
    bytes = new TextEncoder().encode(body ?? '');
  }

  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  const view = new Uint8Array(buffer);
  let hex = '';

  for (let i = 0; i < view.length; i++) {
    hex += view[i].toString(16).padStart(2, '0');
  }

  return hex;
}
