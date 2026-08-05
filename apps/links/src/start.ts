import { getRootLogger } from '@relay/observability';

import { main } from './main.js';

/** Process entrypoint. Keeps `main` importable and testable. */
main().catch((error: unknown) => {
  getRootLogger().fatal({ event: 'shortlink.start_failed', error }, 'shortlink.start_failed');
  process.exitCode = 1;
});
