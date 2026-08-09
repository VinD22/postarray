# Media V1 policy

This document records the V1 product decision for uploaded media, URL import and
in-app editing. It aligns with `docs/planning/16-launch-recovery-and-release-gates.md`.

## Uploaded and imported files

- **Direct upload** through signed storage tickets is supported end to end.
- **URL import** is implemented locally through the shared application service.
  The fetch uses connector `safeFetch`, which rechecks DNS and every redirect,
  blocks private and metadata networks, limits response bytes and does not
  forward credentials. The media boundary then validates the allow-listed MIME
  type against the file signature, enforces the 20 MiB non-video or 500 MiB
  video limit, stores the bytes under a workspace-scoped SHA-256 content
  address, records the final source URL without query credentials and emits an
  audit event.
- The REST and web paths are wired. CLI and MCP commands, worker-backed
  streaming for large remote videos, production Storage evidence and the
  safety-scan worker remain release gates. Until those are complete, URL import
  is a locally implemented prelaunch capability, not a production-supported
  claim.
- **AI image or video generation** is out of scope for V1. There is no dormant client,
  entitlement or UI path.

## Non-generative editing

- **Crop, resize, rotate, compress and convert** are planned as non-generative edits only.
- The `MediaService.edit` path is **not implemented** in V1 and returns
  `errors.media_editing_not_implemented`.
- When editing ships, it runs in the worker against stored bytes, never against a
  generative model.

## API and surfaces

- The REST schema returns a replay-safe operation handle. The web library calls
  that API rather than duplicating fetch or storage logic in the browser.
- Non-generative editing remains an explicit capability error on every surface.
- URL import cannot be called five-surface complete until CLI and MCP expose the
  same application service. Signed webhooks report the resulting media and audit
  events; they are not an ingestion command surface.

## Verification

- Network policy stays in the shared fetch adapter, not the API handler. Its
  tests cover private addresses, redirect revalidation, DNS pinning and byte
  limits. Application tests cover type/signature mismatch, size boundaries,
  content-addressed storage and safe display filenames.
- Before production, move the fetch/write loop to a worker-owned streaming
  primitive so a 500 MiB remote video is never buffered in an API process.
- Editing tests must assert no generative provider is invoked.
