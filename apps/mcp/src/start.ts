import { getRootLogger } from '@relay/observability';
import { parseBooleanish } from '@relay/config';

import { main } from './main';
import { createProductionMcpOptions } from './production';

/**
 * Process entrypoint.
 *
 * Sandbox mode stays in memory. Normal mode builds the canonical application
 * runtime, durable confirmation adapter and audit writer before the server
 * accepts traffic. The composition remains outside the tool implementations,
 * so they are still testable without infrastructure.
 */
async function start(): Promise<void> {
  if (parseBooleanish(process.env['MCP_SANDBOX']) === true) {
    await main();
    return;
  }
  const options = await createProductionMcpOptions();
  try {
    await main(options);
  } catch (error) {
    await options.close?.();
    throw error;
  }
}

start().catch((error: unknown) => {
  getRootLogger().fatal({ event: 'mcp.start_failed', error }, 'mcp.start_failed');
  process.exitCode = 1;
});
