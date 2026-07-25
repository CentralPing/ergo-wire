# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0-beta.3] - 2026-07-25

### Fixed

- Ship generated TypeScript declarations in the git tree so GitHub installs
  (`github:CentralPing/ergo-wire#tag`) include `types/**/*.d.ts` even when consumers
  use `npm ci --ignore-scripts` ([#20](https://github.com/CentralPing/ergo-wire/issues/20))

## [0.1.0-beta.2] - 2026-07-09

### Added

- `serializeCursorParams` — symmetric serializer for cursor pagination wire keys (`cursor`,
  `limit`), matching `parseCursorParams`

### Changed

- `fingerprint()` now throws `TypeError` for unsupported body types instead of silently coercing via `TextEncoder` ([#9](https://github.com/CentralPing/ergo-wire/issues/9))

## [0.1.0-beta.1] - 2026-07-08

### Added

- Initial release: idempotency sf-string parse/format, Link format/parse, pagination wire
  keys, Retry-After parse/format, Web Crypto fingerprint, shared quoted-string scanner
- Ergo Stack Wire Profile v1 documented in `dot-cursor/decisions/ergo-wire.md`
- Round-trip test vectors in `test/vectors/`
