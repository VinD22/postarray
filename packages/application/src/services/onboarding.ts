import { z } from 'zod';

import type { ActorContext, OnboardingService, ServiceDeps } from '../types';
import { ONBOARDING_USE_CASES, type OnboardingStateView, type OnboardingUseCase } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid } from '../internal/errors';
import { requireProjectOwnership } from '../internal/project-ownership';
import { authorized, type ActorSnapshot, type Db } from '../internal/runtime';

/**
 * Onboarding.
 *
 * The first sixty seconds are real product state, so they are stored like it:
 * one row per person per workspace (`app.onboarding_states`, migration 0076),
 * upserted as each step finishes, so closing the tab mid-setup and coming back
 * resumes rather than restarts.
 *
 * Three rules shape everything below.
 *
 *  1. **Per person, never per workspace.** Two people who join the same
 *     workspace each walk their own first run. The row is keyed on the acting
 *     user and the database enforces that a second time with self-row policies,
 *     so a bug here cannot expose or overwrite a teammate's progress.
 *
 *  2. **Counts come from rows, never from flags.** `connectionCount` and
 *     `firstPostScheduled` are read from the connections and content tables on
 *     every call. A stored "connected: true" that disagrees with the
 *     connections list is worse than no flag at all, and this is the screen
 *     where that disagreement would be most visible.
 *
 *  3. **An established account is never sent back to step one.** See
 *     `deriveOnboardingComplete`.
 */

const useCaseSchema = z.enum(ONBOARDING_USE_CASES);

/**
 * Step ids the first-run sequence may record.
 *
 * The list lives in the web app as product copy; what the service guarantees is
 * only the shape, so a renamed step is a catalog edit rather than a migration.
 * The database applies the same bound a second time.
 */
const stepSchema = z
  .string()
  .trim()
  .min(1)
  .max(32)
  .regex(/^[a-z][a-z0-9-]*$/);

/** The states a content item is in once its first post is genuinely scheduled. */
const SCHEDULED_OR_LATER = [
  'scheduled',
  'preparing_media',
  'dispatching',
  'provider_processing',
  'published',
  'partially_published',
] as const;

/**
 * Signals that an established account has already finished its first run, even
 * though no explicit record exists.
 *
 * This is the derivation rule, and it is the load-bearing decision in this
 * file. `onboardingComplete` gates a redirect on every signed-in page, so
 * getting it wrong does not produce a wrong number on a screen: it dumps every
 * existing customer into a setup wizard they finished months ago.
 *
 * The rule is deliberately conservative in that direction:
 *
 *  - An explicit `completedAt` is the answer whenever there is one.
 *  - Otherwise, a workspace that already has an active project **and** at least
 *    one social connection is treated as onboarded. Those two together are the
 *    only thing the sequence actually produces that is checkable afterwards,
 *    and a workspace holding both cannot plausibly be on step one.
 *  - Otherwise it is incomplete, which is the correct answer for a genuinely
 *    new account: no project, no connection, nothing to show on Home.
 *
 * Note what is *not* in the rule: a subscription. A workspace can be trialing,
 * past due or paid and still be brand new, so billing state says nothing about
 * whether a person has been shown the product.
 */
export function deriveOnboardingComplete(signals: {
  readonly explicitlyCompleted: boolean;
  readonly activeProjectCount: number;
  readonly connectionCount: number;
}): boolean {
  if (signals.explicitlyCompleted) {
    return true;
  }
  return signals.activeProjectCount > 0 && signals.connectionCount > 0;
}

interface StateRow {
  readonly useCase: string | null;
  readonly completedSteps: readonly string[];
  readonly checkoutConfirmedAt: Date | null;
  readonly completedAt: Date | null;
}

const STATE_SELECT = {
  id: true,
  useCase: true,
  completedSteps: true,
  checkoutConfirmedAt: true,
  completedAt: true,
} as const;

function requirePerson(actor: ActorSnapshot): string {
  if (actor.userId === null) {
    // Onboarding belongs to a person. A service account or an agent has no
    // first run, and writing one under a machine identity would create progress
    // nobody can see, resume or discard.
    throw invalid('errors.onboarding_requires_person', {});
  }
  return actor.userId;
}

function toUseCase(value: string | null): OnboardingUseCase | null {
  const parsed = useCaseSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Everything the view needs that is counted rather than recorded. */
async function readSignals(
  db: Db,
  workspaceId: string,
): Promise<{
  readonly activeProjectCount: number;
  readonly connectionCount: number;
  readonly firstPostScheduled: boolean;
  readonly firstReceiptId: string | null;
  readonly subscribed: boolean;
}> {
  const [activeProjectCount, connectionCount, scheduledCount, receipt, subscriptionCount] =
    await Promise.all([
      db.project.count({ where: { archivedAt: null } }),
      db.socialConnection.count({ where: { status: { not: 'disconnected' } } }),
      db.contentItem.count({ where: { state: { in: [...SCHEDULED_OR_LATER] } } }),
      db.publicationReceipt.findFirst({
        where: { workspaceId },
        orderBy: { publishedAt: 'desc' },
        select: { id: true },
      }),
      db.subscription.count({
        where: { workspaceId, status: { in: ['trialing', 'active', 'past_due'] } },
      }),
    ]);
  return {
    activeProjectCount,
    connectionCount,
    firstPostScheduled: scheduledCount > 0,
    firstReceiptId: receipt?.id ?? null,
    subscribed: subscriptionCount > 0,
  };
}

function toView(
  row: StateRow | null,
  signals: Awaited<ReturnType<typeof readSignals>>,
): OnboardingStateView {
  const steps = row?.completedSteps ?? [];
  const complete = deriveOnboardingComplete({
    explicitlyCompleted: row?.completedAt != null,
    activeProjectCount: signals.activeProjectCount,
    connectionCount: signals.connectionCount,
  });
  return {
    // Checkout is confirmed by the return from Polar, or by a subscription
    // already existing. The step being *opened* is not confirmation.
    checkoutConfirmed: row?.checkoutConfirmedAt != null || signals.subscribed,
    // Naming the workspace is the one step whose result is a fact about the
    // workspace rather than about this person, so an established workspace
    // reads as named without needing a row.
    workspaceNamed: steps.includes('workspace') || signals.activeProjectCount > 0,
    useCase: toUseCase(row?.useCase ?? null),
    connectionCount: signals.connectionCount,
    firstPostScheduled: signals.firstPostScheduled || steps.includes('compose'),
    firstReceiptId: signals.firstReceiptId,
    completedSteps: [...steps],
    complete,
  };
}

async function readRow(db: Db, workspaceId: string, userId: string): Promise<StateRow | null> {
  return db.onboardingState.findFirst({
    where: { workspaceId, userId },
    select: STATE_SELECT,
  });
}

/**
 * Upsert by hand rather than through `upsert`.
 *
 * The scoped client runs inside a transaction that row level security has
 * already narrowed to this workspace, and reading then writing keeps the shape
 * identical to the other self-row service in this package
 * (`remembered-targets.ts`), which matters more here than one fewer round trip.
 */
async function writeRow(
  db: Db,
  workspaceId: string,
  userId: string,
  patch: {
    readonly useCase?: OnboardingUseCase;
    readonly completedSteps?: readonly string[];
    readonly checkoutConfirmedAt?: Date;
    readonly completedAt?: Date;
  },
): Promise<void> {
  const existing = await db.onboardingState.findFirst({
    where: { workspaceId, userId },
    select: { id: true },
  });
  const data = {
    ...(patch.useCase === undefined ? {} : { useCase: patch.useCase }),
    ...(patch.completedSteps === undefined ? {} : { completedSteps: [...patch.completedSteps] }),
    ...(patch.checkoutConfirmedAt === undefined
      ? {}
      : { checkoutConfirmedAt: patch.checkoutConfirmedAt }),
    ...(patch.completedAt === undefined ? {} : { completedAt: patch.completedAt }),
  };
  if (existing === null) {
    await db.onboardingState.create({ data: { workspaceId, userId, ...data } });
    return;
  }
  await db.onboardingState.update({ where: { id: existing.id }, data });
}

export function createOnboardingService(deps: ServiceDeps): OnboardingService {
  return {
    async getState(ctx: ActorContext): Promise<OnboardingStateView> {
      return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
        const signals = await readSignals(db, actor.workspace.id);
        if (actor.userId === null) {
          // A machine caller gets the workspace's real signals and an empty
          // record, rather than an error: reading is harmless, and refusing
          // would make the endpoint useless to the CLI.
          return toView(null, signals);
        }
        const row = await readRow(db, actor.workspace.id, actor.userId);
        return toView(row, signals);
      });
    },

    async setUseCase(
      ctx: ActorContext,
      input: { readonly useCase: OnboardingUseCase; readonly projectId?: string },
    ): Promise<OnboardingStateView> {
      const useCase = useCaseSchema.parse(input.useCase);
      return authorized(
        deps,
        ctx,
        'workspace.read',
        input.projectId === undefined ? undefined : { projectId: input.projectId },
        async (db, actor) => {
          const userId = requirePerson(actor);
          // Only meaningful when the caller named one, and then it must be a
          // project this workspace actually owns, checked through the shared
          // helper rather than dropped into a `where` clause.
          if (input.projectId !== undefined) {
            await requireProjectOwnership(db, actor, input.projectId);
          }
          const before = await readRow(db, actor.workspace.id, userId);
          await writeRow(db, actor.workspace.id, userId, { useCase });
          await recordAudit(db, actor, {
            action: 'onboarding.use_case_recorded',
            targetType: 'onboarding',
            targetId: userId,
            before: { useCase: before?.useCase ?? null },
            after: { useCase },
          });
          const signals = await readSignals(db, actor.workspace.id);
          return toView(
            {
              useCase,
              completedSteps: before?.completedSteps ?? [],
              checkoutConfirmedAt: before?.checkoutConfirmedAt ?? null,
              completedAt: before?.completedAt ?? null,
            },
            signals,
          );
        },
      );
    },

    async completeStep(
      ctx: ActorContext,
      input: { readonly step: string },
    ): Promise<OnboardingStateView> {
      const step = stepSchema.parse(input.step);
      return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
        const userId = requirePerson(actor);
        const before = await readRow(db, actor.workspace.id, userId);
        const steps = mergeStep(before?.completedSteps ?? [], step);
        const at = deps.clock.now();
        // The receipt is the last step, so reaching it is what finishes the
        // sequence. Recorded once: a later edit never clears it, so finishing
        // onboarding is not something a refresh can undo.
        const finishing = step === 'done' && before?.completedAt == null;
        await writeRow(db, actor.workspace.id, userId, {
          completedSteps: steps,
          ...(step === 'plan' && before?.checkoutConfirmedAt == null
            ? { checkoutConfirmedAt: at }
            : {}),
          ...(finishing ? { completedAt: at } : {}),
        });
        await recordAudit(db, actor, {
          action: finishing ? 'onboarding.completed' : 'onboarding.step_completed',
          targetType: 'onboarding',
          targetId: userId,
          after: { step, completedSteps: steps },
        });
        const signals = await readSignals(db, actor.workspace.id);
        return toView(
          {
            useCase: before?.useCase ?? null,
            completedSteps: steps,
            checkoutConfirmedAt:
              step === 'plan'
                ? (before?.checkoutConfirmedAt ?? at)
                : (before?.checkoutConfirmedAt ?? null),
            completedAt: finishing ? at : (before?.completedAt ?? null),
          },
          signals,
        );
      });
    },

    async complete(ctx: ActorContext): Promise<OnboardingStateView> {
      return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
        const userId = requirePerson(actor);
        const before = await readRow(db, actor.workspace.id, userId);
        const at = before?.completedAt ?? deps.clock.now();
        const steps = mergeStep(before?.completedSteps ?? [], 'done');
        if (before?.completedAt == null) {
          await writeRow(db, actor.workspace.id, userId, {
            completedSteps: steps,
            completedAt: at,
          });
          await recordAudit(db, actor, {
            action: 'onboarding.completed',
            targetType: 'onboarding',
            targetId: userId,
            after: { completedSteps: steps },
          });
        }
        const signals = await readSignals(db, actor.workspace.id);
        return toView(
          {
            useCase: before?.useCase ?? null,
            completedSteps: steps,
            checkoutConfirmedAt: before?.checkoutConfirmedAt ?? null,
            completedAt: at,
          },
          signals,
        );
      });
    },
  };
}

/**
 * Append a step, once, keeping the order it was finished in.
 *
 * Re-finishing a step a person went back to is not an error and must not
 * reorder the list: the order is evidence of what happened, not a set.
 */
export function mergeStep(existing: readonly string[], step: string): readonly string[] {
  return existing.includes(step) ? [...existing] : [...existing, step];
}
