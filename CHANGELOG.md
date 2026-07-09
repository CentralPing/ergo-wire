# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0-beta.2] - TBD

### Changed

- `fingerprint()` now throws `TypeError` for unsupported body types instead of silently coercing via `TextEncoder` ([#9](https://github.com/CentralPing/ergo-wire/issues/9))

## [0.1.0-beta.1] - 2026-07-08

### Added

- Initial release: idempotency sf-string parse/format, Link format/parse, pagination wire
  keys, Retry-After parse/format, Web Crypto fingerprint, shared quoted-string scanner
- Ergo Stack Wire Profile v1 documented in `dot-cursor/decisions/ergo-wire.md`
- Round-trip test vectors in `test/vectors/`
