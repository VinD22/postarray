import { getRootLogger } from '@relay/observability';

import { main } from './main.js';

/**
 * Process entrypoint.
 *
 * In sandbox mode `main` needs nothing else. In normal mode the deployment
 * passes the application services, adapted with `toRelayServicePort`, and the
 * audit writer. Keeping that out of here is what lets the whole server be
 * tested without a database, a Temporal client or a connector.
 */
main().catch((error: unknown) => {
  getRootLogger().fatal({ event: 'mcp.start_failed', error }, 'mcp.start_failed');
  process.exitCode = 1;
});
