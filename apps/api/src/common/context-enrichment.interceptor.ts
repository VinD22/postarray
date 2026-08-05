import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { runWithExtendedContext } from '@relay/observability';
import type { Request } from 'express';
import { Observable } from 'rxjs';

import { relayState } from './request.types';

/**
 * Carry the resolved actor and workspace into the ambient request context.
 *
 * A guard cannot do this. `runWithExtendedContext` scopes the extension to the
 * callback it is given, and a guard's callback ends when the guard returns, so
 * anything set there is gone before the handler runs. An interceptor wraps the
 * handler itself, which is exactly the scope the enrichment needs.
 *
 * Without it, every log line, span and metric from a handler would be missing
 * the workspace and the actor: the two fields that make an incident
 * investigable at all.
 */
@Injectable()
export class ContextEnrichmentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const state = relayState(context.switchToHttp().getRequest<Request>());
    const principal = state.principal;
    if (principal === undefined && state.workspaceId === undefined) {
      return next.handle();
    }
    const patch = {
      surface: state.surface,
      ...(principal === undefined
        ? {}
        : { actor: { type: principal.actorType, id: principal.actorId } }),
      ...(state.workspaceId === undefined ? {} : { workspaceId: state.workspaceId }),
    };

    // Subscription, not construction, is what starts the handler. Wrapping the
    // call to `next.handle()` alone would establish the context and leave it
    // again before anything ran, so the subscribe itself happens inside the
    // extended context and the handler's async continuations inherit it.
    return new Observable((subscriber) =>
      runWithExtendedContext(patch, () => next.handle().subscribe(subscriber)),
    );
  }
}
