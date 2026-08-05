import {
  Module,
  type DynamicModule,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { RuntimeModule, type RuntimeOptions } from './application/runtime.module.js';
import { ActorContextFactory } from './common/actor-context.factory.js';
import { ContextEnrichmentInterceptor } from './common/context-enrichment.interceptor.js';
import { ProblemJsonFilter } from './common/problem.filter.js';
import { RequestContextMiddleware } from './common/request-context.middleware.js';
import { AuthGuard } from './guards/auth.guard.js';
import { CsrfGuard } from './guards/csrf.guard.js';
import { EntitlementGuard } from './guards/entitlement.guard.js';
import { IdempotencyInterceptor } from './guards/idempotency.interceptor.js';
import { RateLimitGuard } from './guards/rate-limit.guard.js';
import { ScopeGuard } from './guards/scope.guard.js';
import { StepUpGuard } from './guards/step-up.guard.js';
import { WorkspaceGuard } from './guards/workspace.guard.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { ApiKeysModule } from './modules/api-keys/api-keys.module.js';
import { ApprovalsModule } from './modules/approvals/approvals.module.js';
import { AuditModule } from './modules/audit/audit.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AutomationRulesModule } from './modules/automation-rules/automation-rules.module.js';
import { BillingModule } from './modules/billing/billing.module.js';
import { BrandsModule } from './modules/brands/brands.module.js';
import { ConnectionsModule } from './modules/connections/connections.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { DeveloperAppsModule } from './modules/developer-apps/developer-apps.module.js';
import { GrowthModule } from './modules/growth/growth.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { PublishingModule } from './modules/publishing/publishing.module.js';
import { RssModule } from './modules/rss/rss.module.js';
import { SchedulingModule } from './modules/scheduling/scheduling.module.js';
import { ShortLinksModule } from './modules/short-links/short-links.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';
import { WorkspacesModule } from './modules/workspaces/workspaces.module.js';
import { OAuthProviderModule } from './oauth-provider/oauth-provider.module.js';
import { OpenApiModule } from './openapi/openapi.module.js';
import { SecurityModule } from './security/security.module.js';

/**
 * The composed application.
 *
 * ## Guard order
 *
 * Nest runs global guards in registration order, and that order is a security
 * property rather than a preference:
 *
 * 1. `AuthGuard` resolves who is calling. Nothing downstream can run without it.
 * 2. `CsrfGuard` protects the ambient-credential case. It needs to know the
 *    credential kind, so it cannot run first.
 * 3. `WorkspaceGuard` pins exactly one workspace and builds the `ActorContext`,
 *    narrowing scopes to that workspace.
 * 4. `ScopeGuard` checks the narrowed scopes, so a scope held in workspace A
 *    cannot authorize a call against workspace B.
 * 5. `StepUpGuard` demands a fresh factor for consequential routes.
 * 6. `EntitlementGuard` asks billing last, because a 402 is only meaningful
 *    once the caller is known to be authorized in the first place.
 * 7. `RateLimitGuard` runs last so a counter is spent on requests that would
 *    otherwise have succeeded, not on ones already rejected as unauthorized.
 *
 * `IdempotencyInterceptor` wraps the handler, after every guard has passed.
 * Reserving an idempotency key for a request that is about to be rejected would
 * burn the caller's key for nothing.
 */
@Module({})
export class AppModule implements NestModule {
  static forRoot(options: RuntimeOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        RuntimeModule.forRoot(options),
        SecurityModule,
        HealthModule,
        OpenApiModule,
        AuthModule,
        WorkspacesModule,
        BrandsModule,
        ConnectionsModule,
        ContentModule,
        ApprovalsModule,
        SchedulingModule,
        PublishingModule,
        MediaModule,
        AnalyticsModule,
        ShortLinksModule,
        AutomationRulesModule,
        RssModule,
        GrowthModule,
        WebhooksModule,
        BillingModule,
        ApiKeysModule,
        DeveloperAppsModule,
        AuditModule,
        OAuthProviderModule,
      ],
      providers: [
        ActorContextFactory,
        { provide: APP_FILTER, useClass: ProblemJsonFilter },
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: CsrfGuard },
        { provide: APP_GUARD, useClass: WorkspaceGuard },
        { provide: APP_GUARD, useClass: ScopeGuard },
        { provide: APP_GUARD, useClass: StepUpGuard },
        { provide: APP_GUARD, useClass: EntitlementGuard },
        { provide: APP_GUARD, useClass: RateLimitGuard },
        // Runs first, so every log line and span from a handler carries the
        // workspace and the actor.
        { provide: APP_INTERCEPTOR, useClass: ContextEnrichmentInterceptor },
        { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
      ],
      exports: [ActorContextFactory],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    // Every route, including the discovery documents and the health checks: a
    // request without a correlation id is a request that cannot be traced when
    // it goes wrong, and those are exactly the ones that do.
    consumer.apply(RequestContextMiddleware).forRoutes('*path');
  }
}
