import type { Request } from 'express';

/**
 * Raw request bytes, held between the body parser and the request pipeline.
 *
 * A signature is computed over the bytes a sender actually transmitted, not
 * over a re-serialization of the object we parsed them into. `JSON.stringify`
 * of a parsed body reorders keys, normalizes numbers and drops whitespace, and
 * any one of those makes a valid signature fail.
 *
 * The parser is the only place those bytes exist, so they are captured there
 * and handed on through this map. A `WeakMap` rather than a property on the
 * request object, because the request state is rebuilt by the context
 * middleware and a property would be lost in that rebuild. Entries disappear
 * when the request is collected; nothing has to remember to clean up.
 */
const RAW_BODIES = new WeakMap<Request, Buffer>();

export function rememberRawBody(request: Request, body: Buffer): void {
  RAW_BODIES.set(request, body);
}

export function takeRawBody(request: Request): Buffer | undefined {
  return RAW_BODIES.get(request);
}
