# Architectural Decisions: @centralping/ergo-wire

> Wire-format contract primitives shared by `@centralping/ergo` (server) and
> `@centralping/ergo-fetch` (client).

---

## 1. Critical Constraints

- **Zero runtime dependencies.** Web Platform APIs only (`crypto.subtle`). No `node:crypto`.
- **Pure ESM.** `"type": "module"`.
- **Symmetric primitives.** Every parse function has a matching format/serialize helper.
- **Null-prototype policy.** Returned wire objects use `Object.create(null)` + `Object.freeze()`.
- **Character-by-character parsing** for RFC grammars where applicable; no regex for Link parsing.
- **Graceful parse degradation.** Malformed wire input returns `undefined`. Format throws `TypeError`.
- **Ergo wire profile.** Offset: `page` + `per_page`. Cursor: `cursor` + `limit`.

---

## 2. Architecture

### Package Identity

`@centralping/ergo-wire` is the canonical HTTP wire contract for the Ergo stack.

### Consumers

| Package | Role |
| --- | --- |
| `@centralping/ergo` | Re-exports wire primitives from `lib/` shims; keeps server state machines |
| `@centralping/ergo-fetch` | Sole runtime dependency for wire format on the client |
| `@centralping/ergo-router` | Indirect via ergo |
| `@centralping/json-api-query` | Imports pagination strategy constants only |

---

## 3. Detailed Decisions

### Ergo Stack Wire Profile v1

- Idempotency-Key: RFC 8941 quoted sf-string (`formatIdempotencyKey` / `parseIdempotencyKey`)
- Link: RFC 8288 format + parse
- Pagination: `per_page` on wire; `perPage` accepted only in `serializeOffsetParams` options
- Retry-After: integer seconds or IMF-fixdate

### Testing

- `node:test` + `c8`, `*.spec.unit.js` in `lib/`
- Round-trip vectors in `test/vectors/`

---

## 4. Project Setup

| Field | Value |
| ----- | ----- |
| GitHub | `CentralPing/ergo-wire` |
| npm | `@centralping/ergo-wire` |

Repo settings mirror ergo — see ergo `DECISIONS.md` Section 4.
