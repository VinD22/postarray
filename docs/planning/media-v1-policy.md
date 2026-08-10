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

Implemented in phase A9. The rules below are what the code does, not a plan.

- **Crop, rotate, resize, convert and compress** are the only operations. The
  transport union is `mediaDerivativeOperationSchema` in `@relay/contracts`: a
  strict discriminated union with no prompt, model, seed or provider field, so a
  generative request has nowhere to travel.
- **The original is never overwritten.** An edit produces a `MediaDerivative`
  row plus a new object under the workspace prefix, addressed by the checksum of
  its own bytes. The `MediaAsset` row is not written to at all.
- **Idempotency is the unique constraint.** The preset key is a SHA-256 over the
  canonicalized, pipeline-ordered operation list, and
  `(media_asset_id, preset_key)` is unique, so the same edit requested twice
  returns the existing derivative and reprocesses nothing.
- **A row is written only on success.** A failed transform leaves no row and no
  object reference, because a row is a claim that a file exists.
- **Nothing enlarges.** A resize larger than the source is refused at the
  application boundary and again by the codec, because the extra pixels would be
  invented rather than the uploader's.
- Editing runs in the worker against stored bytes. `sharp` is a dependency of
  `apps/worker` only and must never reach `apps/web` or `apps/api`.
- **Video is out of scope.** The `transcode` derivative kind stays unused, and
  migration `0071` constrains a derivative's MIME type to the three image
  formats the pipeline can write.

## API and surfaces

- The REST schema returns a replay-safe operation handle for URL import. The web
  library calls that API rather than duplicating fetch or storage logic in the
  browser.
- Editing is `POST /v1/media/{id}/edits`, which returns a derivative handle:
  `ready` when the same edit already existed, `processing` when the transform
  was handed to the worker. `GET /v1/media/{id}/derivatives` lists them.
- Editing is not yet exposed on the CLI or MCP surfaces, so it is not
  five-surface complete.
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
- Editing tests must assert no generative provider is invoked. Three suites do:
  `packages/application/src/services/media-derivative-pipeline.test.ts` asserts
  the pipeline makes exactly one outbound call and that its input carries no
  prompt, model, seed or provider;
  `apps/worker/src/media-transform.test.ts` asserts the codec module names no
  generative provider, model or endpoint, that the worker manifest depends on no
  such package, and that a one-colour source comes back the same colour;
  `apps/api/src/modules/media/media.schemas.test.ts` asserts the transport
  refuses any operation carrying a prompt, a model or a seed.
- `apps/worker/src/testing/replay.test.ts` covers `mediaDerivativeWorkflow` and
  asserts the run is exactly one activity, so a retry cannot produce a second
  object.
