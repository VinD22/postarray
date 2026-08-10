import {
  Module,
  type DynamicModule,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { RuntimeModule, type RuntimeOptions } from './application/runtime.module';
import { ActorContextFactory } from './common/actor-context.factory';
import { ContextEnrichmentInterceptor } from './common/context-enrichment.interceptor';
import { ProblemJsonFilter } from './common/problem.filter';
import { RequestContextMiddleware } from './common/request-context.middleware';
import { AuthGuard } from './guards/auth.guard';
import { CsrfGuard } from './guards/csrf.guard';
import { EntitlementGuard } from './guards/entitlement.guard';
import { IdempotencyInterceptor } from './guards/idempotency.interceptor';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { ScopeGuard } from './guards/scope.guard';
import { StepUpGuard } from './guards/step-up.guard';
import { WorkspaceGuard } from './guards/workspace.guard';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ActionCenterModule } from './modules/action-center/action-center.module';
import { AgentConfirmationsModule } from './modules/agent-confirmations/agent-confirmations.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { AutomationRulesModule } from './modules/automation-rules/automation-rules.module';
import { BillingModule } from './modules/billing/billing.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { ContentModule } from './modules/content/content.module';
import { DataModule } from './modules/data/data.module';
import { DeveloperAppsModule } from './modules/developer-apps/developer-apps.module';
import { GrowthModule } from './modules/growth/growth.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { PublishingModule } from './modules/publishing/publishing.module';
import { ImportModule } from './modules/import/import.module';
import { QueueRulesModule } from './modules/queue-rules/queue-rules.module';
import { RssModule } from './modules/rss/rss.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { ShortLinksModule } from './modules/short-links/short-links.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { OAuthProviderModule } from './oauth-provider/oauth-provider.module';
import { OpenApiModule } from './openapi/openapi.module';
import { SecurityModule } from './security/security.module';

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
        DataModule,
        ApprovalsModule,
        AgentConfirmationsModule,
        ActionCenterModule,
        SchedulingModule,
        ImportModule,
        QueueRulesModule,
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
