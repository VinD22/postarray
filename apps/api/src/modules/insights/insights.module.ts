import { Module } from '@nestjs/common';

import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

/**
 * The digest routes.
 *
 * The `INSIGHTS_PORT` provider is supplied by whichever composition root
 * registers this module, the same way `SERVICES` is supplied today. Registering
 * the module without it fails at boot, loudly, rather than at the first
 * request.
 */
@Module({ controllers: [InsightsController], providers: [InsightsService] })
export class InsightsModule {}
