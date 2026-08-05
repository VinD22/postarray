/**
 * Test setup.
 *
 * The suite must never reach a network. `fetch` is replaced with a function
 * that throws, so a code path that quietly acquired an outbound call fails
 * loudly in CI instead of passing on a developer machine with credentials in
 * the environment and failing in the pipeline without them.
 *
 * A test that genuinely needs to observe an outbound call injects a fake
 * implementation, which is what the identity provider double does.
 */
const forbiddenFetch = (): never => {
  throw new Error(
    'Network access is not permitted in the API test suite. Inject a double instead.',
  );
};

globalThis.fetch = forbiddenFetch as unknown as typeof globalThis.fetch;
