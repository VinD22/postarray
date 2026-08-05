import { Controller, Get, Inject, Res } from '@nestjs/common';
import { detectCapabilities, type RelayConfig, type RuntimeCapabilities } from '@relay/config';
import { buildHealthReport, healthHttpStatus, type HealthReport } from '@relay/observability';
import type { Response } from 'express';

import type { Clock, Services } from '../../application/port';
import { CLOCK, RELAY_CONFIG, SERVICES } from '../../application/tokens';
import { Public } from '../../common/decorators';

/**
 * Liveness, readiness and the runtime capability report.
 *
 * These are the only routes in the API that answer without a credential, and
 * they are deliberately boring: a load balancer must be able to ask "are you
 * alive" without holding a secret, and an operator must be able to see which
 * subsystems degraded without opening a dashboard.
 *
 * The capability report keeps apart the three states the product never merges:
 * a subsystem that is live, one the environment has not configured, and one we
 * have not built. A connector missing its client secret is not the same fact as
 * a connector that does not exist yet, and an operator needs to tell them apart
 * at 03:00.
 */
@Controller()
export class HealthController {
  private readonly startedAt: number;

  constructor(
    @Inject(SERVICES) private readonly services: Services,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {
    this.startedAt = this.clock.now().getTime();
  }

  /** Liveness. True as soon as the process can serve a request. */
  @Public()
  @Get('healthz')
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  /**
   * Readiness. Aggregates every dependency the application layer declares. The
   * HTTP status follows the report, so an orchestrator never has to parse a
   * body to decide whether to send traffic.
   */
  @Public()
  @Get('readyz')
  async ready(@Res({ passthrough: true }) response: Response): Promise<HealthReport> {
    const report = await this.services.health.report();
    response.status(healthHttpStatus(report));
    return report;
  }

  /** The same report under the versioned public path. */
  @Public()
  @Get('v1/health')
  health(@Res({ passthrough: true }) response: Response): Promise<HealthReport> {
    return this.ready(response);
  }

  /**
   * Which subsystems and connectors this deployment can actually use. Derived
   * from configuration presence, never from a hopeful default.
   */
  @Public()
  @Get('v1/capabilities')
  capabilities(): RuntimeCapabilities {
    return detectCapabilities(this.config);
  }

  /**
   * The status-page view: capability levels and uptime, with no dependency
   * check internals, so it is safe to render publicly.
   */
  @Public()
  @Get('v1/status')
  status(): HealthReport {
    return buildHealthReport(detectCapabilities(this.config), [], {
      service: 'api',
      startedAt: this.startedAt,
      now: () => this.clock.now(),
    });
  }
}
