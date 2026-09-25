import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { API_HEADERS, RateLimitedError } from '@relay/contracts';
import type { Request, Response } from 'express';

import type { Clock, KeyValueStore } from '../application/port';
import { CLOCK, KEY_VALUE_STORE } from '../application/tokens';
import { PUBLIC_ROUTE_KEY, RATE_LIMIT_KEY, type RateLimitRule } from '../common/decorators';
import { instantAfter } from '../common/instant';
import { relayState } from '../common/request.types';

/**
 * Rate limiting keyed by workspace, credential, route and connector cost.
 *
 * Four dimensions rather than one, because they fail differently:
 *
 * - **Credential and route** stops one runaway client or one buggy loop.
 * - **Workspace** stops a customer's whole fleet of credentials from doing
 *   collectively what no single credential could.
 * - **Cost** is what makes a route that fans out to a metered provider spend
 *   more of the budget than a cheap read. A flat "requests per minute" treats
 *   `GET /v1/projects` and a 30-account publish as equivalent, and they are not.
 * - **Source address**, for unauthenticated routes, where there is no
 *   credential to key on yet.
 *
 * Counters are fixed windows in the key value store. A fixed window can permit
 * a burst of up to twice the limit across a boundary; that is an accepted
 * trade for an atomic, single-round-trip counter, because the control that
 * actually protects a provider account is the cadence budget in
 * `@relay/application`, not this one.
 *
 * A rejection carries `X-RateLimit-Remaining` and `X-RateLimit-Reset` so a
 * well-behaved client can back off precisely instead of retrying blindly.
 */

/** Applied to every authenticated route that does not declare its own rule. */
export const DEFAULT_RATE_LIMIT: RateLimitRule = { limit: 600, windowSeconds: 60, cost: 1 };

/** The shared per-workspace budget every route contributes to. */
export const WORKSPACE_RATE_LIMIT: RateLimitRule = { limit: 3000, windowSeconds: 60 };

/** The budget for routes that reach a metered provider. */
export const CONNECTOR_RATE_LIMIT: RateLimitRule = { limit: 120, windowSeconds: 60 };

interface CounterResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: string;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const state = relayState(request);

    const declared = this.reflector.getAllAndOverride<RateLimitRule>(RATE_LIMIT_KEY, targets);
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, targets) === true;
    const rule = declared ?? DEFAULT_RATE_LIMIT;
    const cost = Math.max(1, rule.cost ?? 1);

    const route = `${request.method}:${request.route?.path ?? request.path}`;
    const principal = state.principal;
    const credentialKey =
      principal === undefined ? `ip:${request.ip ?? 'unknown'}` : `cred:${principal.credentialId}`;

    const checks: { key: string; rule: RateLimitRule; cost: number }[] = [
      { key: `${credentialKey}|${route}`, rule, cost },
    ];
    if (state.workspaceId !== undefined) {
      checks.push({ key: `ws:${state.workspaceId}`, rule: WORKSPACE_RATE_LIMIT, cost });
    }
    if (rule.connectorBudget === true && state.workspaceId !== undefined) {
      checks.push({ key: `connector:${state.workspaceId}`, rule: CONNECTOR_RATE_LIMIT, cost });
    }
    if (isPublic && principal === undefined) {
      // An unauthenticated route is keyed on the source address alone, which is
      // the only stable thing we have before a credential is resolved.
      checks.push({
        key: `ip:${request.ip ?? 'unknown'}|${route}`,
        rule: { limit: 60, windowSeconds: 60 },
        cost,
      });
    }

    let tightest: CounterResult | null = null;
    for (const check of checks) {
      const result = await this.consume(check.key, check.rule, check.cost);
      if (tightest === null || result.remaining < tightest.remaining) {
        tightest = result;
      }
      if (!result.allowed) {
        this.writeHeaders(response, result);
        throw new RateLimitedError({
          details: { scope: check.key.split('|')[0] ?? 'request', resetAt: result.resetAt },
        });
      }
    }

    if (tightest !== null) {
      this.writeHeaders(response, tightest);
    }
    return true;
  }

  private writeHeaders(response: Response, result: CounterResult): void {
    if (response.headersSent) {
      return;
    }
    response.setHeader(API_HEADERS.rateLimitRemaining, String(Math.max(0, result.remaining)));
    response.setHeader(API_HEADERS.rateLimitReset, result.resetAt);
  }

  private async consume(key: string, rule: RateLimitRule, cost: number): Promise<CounterResult> {
    const now = this.clock.now();
    const windowIndex = Math.floor(now.getTime() / (rule.windowSeconds * 1000));
    const counterKey = `relay:ratelimit:${key}:${windowIndex}`;

    // One round trip whatever the cost. Charging a cost of ten used to mean
    // ten Redis calls on the request the limiter exists to make cheap.
    const used = await this.kv.incrementBy(counterKey, cost, {
      ttlSeconds: rule.windowSeconds * 2,
    });

    const windowEndsInSeconds =
      rule.windowSeconds - Math.floor((now.getTime() / 1000) % rule.windowSeconds);
    return {
      allowed: used <= rule.limit,
      remaining: rule.limit - used,
      resetAt: instantAfter(now, windowEndsInSeconds),
    };
  }
}
