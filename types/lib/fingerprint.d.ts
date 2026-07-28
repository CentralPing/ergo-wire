/**
 * @fileoverview SHA-256 body fingerprint via Web Crypto.
 * @module @centralping/ergo-wire/lib/fingerprint
 */
/**
 * Computes the SHA-256 hex digest of a request body using Web Crypto.
 *
 * @param {string | ArrayBuffer | Uint8Array} body - Serialized request body. Pass explicit `''` for an empty body.
 * @returns {Promise<string>} - Hex-encoded SHA-256 digest.
 * @throws {TypeError} When body is not a string, Uint8Array, or ArrayBuffer.
 */
export declare function fingerprint(body: string | ArrayBuffer | Uint8Array): Promise<string>;
