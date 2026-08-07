# Media V1 policy

This document records the V1 product decision for uploaded media, URL import and
in-app editing. It aligns with `docs/planning/16-launch-recovery-and-release-gates.md`.

## Uploaded and imported files

- **Direct upload** through signed storage tickets is supported end to end.
- **URL import** is **not implemented** in V1. The application service returns
  `CapabilityNotImplementedError` with message key
  `errors.media_url_import_not_implemented`. A future worker-backed fetch must use
  the same SSRF controls as `assertFetchable` and connector `safeFetch`.
- **AI image or video generation** is out of scope for V1. There is no dormant client,
  entitlement or UI path.

## Non-generative editing

- **Crop, resize, rotate, compress and convert** are planned as non-generative edits only.
- The `MediaService.edit` path is **not implemented** in V1 and returns
  `errors.media_editing_not_implemented`.
- When editing ships, it runs in the worker against stored bytes, never against a
  generative model.

## API and surfaces

- REST schemas for import and edit remain so OpenAPI stays stable. All five surfaces
  must call the same application service and receive the same capability errors until
  the worker paths exist.

## Verification

- SSRF tests for URL import belong in the worker fetch phase, not in the API handler.
- Editing tests must assert no generative provider is invoked.
