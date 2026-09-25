import { Module } from '@nestjs/common';

import type { Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import { InsightsController } from './insights.controller';
import { INSIGHTS_PORT, type InsightsPort } from './insights.port';
import { InsightsService } from './insights.service';

/**
 * Weekly digest, per-post "How it did", and "what works for you".
 *
 * `INSIGHTS_PORT` is bound to `services.insights`, so every route goes through
 * the same application service, authorization and tenancy as every other
 * surface.
 */
@Module({
  controllers: [InsightsController],
  providers: [
    InsightsService,
    {
      provide: INSIGHTS_PORT,
      useFactory: (services: Services): InsightsPort => services.insights,
      inject: [SERVICES],
    },
  ],
})
export class InsightsModule {}
