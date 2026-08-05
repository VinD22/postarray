import {
  detectCapabilities,
  loadConfigFor,
  parseBooleanish,
  requireConfigValue,
} from '@relay/config';
import { buildHealthReport, createLogger } from '@relay/observability';
import type { HealthReport } from '@relay/observability';

import { createIntrospectionVerifier } from './auth/verifier';
import type { IntrospectionTransport } from './auth/verifier';
import { createMemoryConfirmationStore } from './confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from './dispatch';
import { createMcpHttpService } from './http';
import { createSandboxServices } from './sandbox';
import { createToolRegistry } from './tools/index';
import type { AuditSink, RelayServicePort } from './ports';

/**
 * The composition root.
 *
 * Two modes. In sandbox mode everything is wired to the in-memory fake provider
 * so an agent can be developed against a real protocol surface without touching
 * a platform. In normal mode the deployment supplies the application services
 * and the audit writer; the rules, the scopes and the confirmations are
 * identical in both.
 */

const DEFAULT_PORT = 8082;

const systemClock = { now: () => Date.now() };

export interface StartOptions {
  /**
   * The real application services, adapted with `toRelayServicePort`. Omitted
   * in sandbox mode, where the fake provider stands in for everything.
   */
  readonly services?: RelayServicePort | undefined;
  readonly auditSink?: AuditSink | undefined;
}

function fetchTransport(): IntrospectionTransport {
  return {
    async post(url, form) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        body: new URLSearchParams(form).toString(),
      });
      return { status: response.status, body: await response.text() };
    },
  };
}

export async function main(options: StartOptions = {}): Promise<void> {
  const config = loadConfigFor('mcp');
  const logger = createLogger(
    { service: 'mcp' },
    { level: config.core.logLevel, environment: config.core.nodeEnv },
  );

  const sandbox = parseBooleanish(process.env['MCP_SANDBOX']) === true;
  const resourceUrl = requireConfigValue(process.env['MCP_RESOURCE_URL'], 'API_URL');
  const issuerUrl = requireConfigValue(
    config.oauth.issuerUrl ?? config.core.apiUrl,
    'OAUTH_ISSUER_URL',
  );

  if (sandbox && config.core.isProduction) {
    // Sandbox mode is a development affordance. Running it in production would
    // silently stop real posts from being published.
    throw new Error('MCP_SANDBOX_NOT_ALLOWED_IN_PRODUCTION');
  }

  const sandboxServices = sandbox
    ? createSandboxServices({
        clock: systemClock,
        workspaceId: process.env['MCP_SANDBOX_WORKSPACE_ID'] ?? 'ws_sandbox',
      })
    : null;

  const services = sandboxServices ?? options.services;
  const auditSink = sandboxServices?.auditSink ?? options.auditSink;
  if (services === undefined || services === null || auditSink === undefined) {
    throw new Error('MCP_SERVICES_NOT_WIRED');
  }

  const verifier = createIntrospectionVerifier({
    introspectionUrl: new URL('/oauth/introspect', issuerUrl).toString(),
    resourceUrl,
    transport: fetchTransport(),
    clientId: requireConfigValue(process.env['MCP_CLIENT_ID'], 'OAUTH_ISSUER_URL'),
    clientSecret: requireConfigValue(process.env['MCP_CLIENT_SECRET'], 'OAUTH_ISSUER_URL'),
    clock: systemClock,
  });

  const confirmations = createMemoryConfirmationStore({
    clock: systemClock,
    confirmUrlTemplate: (confirmationId) =>
      `${(config.core.appUrl ?? '').replace(/\/$/, '')}/confirm/${confirmationId}`,
  });

  const dispatcher = createDispatcher({
    registry: createToolRegistry(),
    services,
    auditSink,
    confirmations,
    logger,
    clock: systemClock,
    killSwitch: createWorkspaceKillSwitch(),
    sandbox,
  });

  const startedAt = systemClock.now();
  const health = (): HealthReport =>
    buildHealthReport(detectCapabilities(config), [], { service: 'mcp', startedAt });

  const { server } = createMcpHttpService({
    registry: createToolRegistry(),
    dispatcher,
    verifier,
    logger,
    resourceUrl,
    issuerUrl,
    sandbox,
    health,
  });

  const port = Number(process.env['PORT'] ?? DEFAULT_PORT);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '0.0.0.0', resolve);
  });
  logger.info({ event: 'mcp.started', port, sandbox }, 'mcp.started');

  const shutdown = (signal: string): void => {
    logger.info({ event: 'mcp.stopping', signal }, 'mcp.stopping');
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
