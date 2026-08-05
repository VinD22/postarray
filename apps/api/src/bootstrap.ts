import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module.js';
import type { RuntimeOptions } from './application/runtime.module.js';
import { CSRF_HEADER } from './security/csrf.js';
import { WORKSPACE_HEADER } from './guards/workspace.guard.js';
import { API_HEADERS } from '@relay/contracts';
import { rememberRawBody } from './common/raw-body.js';

/**
 * Build the HTTP application.
 *
 * Separate from `main.ts` so the integration suite gets the real pipeline:
 * the real guards, the real filter, the real middleware and the real security
 * headers. A test that boots a different application than production runs is a
 * test that can pass while the product is broken.
 */

/** Bodies are bounded here, before any parser allocates for them. */
export const MAX_JSON_BODY_BYTES = 1_048_576;

/**
 * Routes whose raw bytes must survive parsing, because a signature is computed
 * over them. Verification happens before the JSON parse, so the buffer has to
 * be captured during it (`04-auth-oauth-and-security.md`, section 14.4).
 */
const RAW_BODY_PATHS: readonly string[] = ['/v1/webhooks/polar'];

function captureRawBody(request: Request, _response: Response, buffer: Buffer): void {
  if (RAW_BODY_PATHS.some((path) => request.path.startsWith(path))) {
    rememberRawBody(request, Buffer.from(buffer));
  }
}

export interface CreateAppOptions extends RuntimeOptions {
  /** Exact origins permitted to make a browser request. Never a wildcard. */
  readonly corsOrigins: readonly string[];
  /** Trust proxy hops, so `request.ip` is the client and not the load balancer. */
  readonly trustProxyHops?: number;
}

export async function createApiApp(options: CreateAppOptions): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot(options), {
    // The problem+json filter is the only thing that renders an error, and the
    // logger from @relay/observability is the only thing that records one.
    logger: false,
    bodyParser: false,
  });

  // `request.ip` drives rate limiting and API key CIDR restrictions. Trusting
  // an unbounded chain of forwarded addresses lets a caller choose their own
  // address, so the hop count is explicit.
  app.set('trust proxy', options.trustProxyHops ?? 1);
  app.disable('x-powered-by');

  app.use(express.json({ limit: MAX_JSON_BODY_BYTES, verify: captureRawBody }));
  app.use(express.urlencoded({ extended: false, limit: MAX_JSON_BODY_BYTES }));
  app.use(compression());

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          // This origin serves JSON and two documentation pages. It has no
          // reason to load a script, a font, a frame or an image from anywhere,
          // and saying so explicitly means a future template cannot quietly
          // start doing it.
          'default-src': ["'none'"],
          'base-uri': ["'none'"],
          'form-action': ["'none'"],
          'frame-ancestors': ["'none'"],
          'object-src': ["'none'"],
        },
      },
      // Two years, with preload. Downgrade attacks against an API that carries
      // publishing credentials are not a residual risk we accept.
      strictTransportSecurity: { maxAge: 63_072_000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginResourcePolicy: { policy: 'same-site' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      xContentTypeOptions: true,
      xFrameOptions: { action: 'deny' },
      // The API is not a browsing context and has no use for these.
      xDnsPrefetchControl: { allow: false },
    }),
  );

  app.use((_request: Request, response: Response, next: () => void) => {
    response.setHeader(
      'permissions-policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    );
    next();
  });

  app.enableCors({
    // Exact origins only. A reflected origin is not an allowlist, it is a
    // decoration, and with credentials enabled it is a cross-site read.
    origin: options.corsOrigins.length === 0 ? false : [...options.corsOrigins],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'content-type',
      'authorization',
      'accept-language',
      CSRF_HEADER,
      WORKSPACE_HEADER,
      API_HEADERS.idempotencyKey,
      API_HEADERS.correlationId,
    ],
    exposedHeaders: [
      API_HEADERS.correlationId,
      API_HEADERS.apiVersion,
      API_HEADERS.rateLimitRemaining,
      API_HEADERS.rateLimitReset,
    ],
    maxAge: 600,
  });

  // Drain in-flight requests on SIGTERM instead of cutting them off. A publish
  // that is halfway through a provider call is exactly the request that must
  // not be killed by a deploy.
  app.enableShutdownHooks();

  return app;
}
