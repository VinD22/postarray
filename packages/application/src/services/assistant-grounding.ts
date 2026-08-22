import type { CapabilitySnapshot, ProviderId, SlotProposal } from '@relay/contracts';
import type { ActorContext, ServiceDeps, UntrustedSourceInput } from '../types';
import type { BusinessProfileView, ConnectionView } from '../views';
import type { AssistantDelegates } from './assistant-types';

/**
 * What the assistant is allowed to know before it says anything.
 *
 * Every field here is read from a service that already exists, in the caller's
 * own tenancy, through the caller's own permissions. There is no separate
 * "assistant context" table and nothing is cached across workspaces.
 *
 * The parts a stranger could have influenced (a product description somebody
 * typed, a post body, a handle a provider returned) travel as `UntrustedSource`
 * so the gateway fences them with a per-call nonce. They are never concatenated
 * into instruction text.
 */

/** How many accounts we are willing to snapshot for one turn. */
const MAX_CONNECTIONS = 8;

export interface PlanContext {
  readonly profile: BusinessProfileView | null;
  readonly connections: readonly ConnectionView[];
  readonly capabilities: readonly CapabilitySnapshot[];
  readonly slot: SlotProposal | null;
  readonly sources: readonly UntrustedSourceInput[];
}

function source(
  id: string,
  origin: UntrustedSourceInput['origin'],
  label: string,
  text: string,
  retrievedAt: string,
): UntrustedSourceInput {
  return { id, origin, label, text, retrievedAt };
}

export async function gatherPlanContext(
  deps: ServiceDeps,
  ctx: ActorContext,
  delegates: AssistantDelegates,
  projectId: string,
): Promise<PlanContext> {
  const retrievedAt = deps.clock.now().toISOString();
  const [profile, connectionPage] = await Promise.all([
    delegates.growth.getBusinessProfile(ctx),
    delegates.connections.list(ctx, { projectId, limit: MAX_CONNECTIONS }),
  ]);

  const usable = connectionPage.data.filter((connection) => connection.health !== 'disconnected');
  const capabilities = await Promise.all(
    usable.map(async (connection) => delegates.connections.getCapabilities(ctx, connection.id)),
  );

  // A project with no queue rules still gets a slot, labelled as the fallback,
  // so the plan proposes a real time rather than a made up one.
  const slot = await delegates.queueRules.previewSlot(ctx, { projectId }).catch(() => null);

  const sources: UntrustedSourceInput[] = [];
  if (profile !== null) {
    sources.push(
      source(
        'business_profile',
        'user_note',
        'Business profile',
        [profile.productName, profile.description, profile.idealCustomer, profile.objective].join(
          '\n',
        ),
        retrievedAt,
      ),
    );
  }
  for (const connection of usable) {
    sources.push(
      source(
        `connection:${connection.id}`,
        'provider_response',
        'Connected account',
        `${connection.provider} ${connection.handle ?? connection.displayName}`,
        retrievedAt,
      ),
    );
  }

  return { profile, connections: usable, capabilities, slot, sources };
}

export function connectedProviders(context: PlanContext): readonly ProviderId[] {
  return [...new Set(context.connections.map((connection) => connection.provider))];
}

/** The queue's reason keys for the proposed time. i18n keys, never prose. */
export function slotReasonKeys(slot: SlotProposal | null): readonly string[] {
  return slot === null ? [] : slot.reasons.map((reason) => reason.key);
}

/** `HH:MM` of the proposed slot in its own zone, or a labelled default. */
export function slotLocalTime(slot: SlotProposal | null): string {
  if (slot === null) {
    return '09:00';
  }
  const match = /(\d{2}):(\d{2})/.exec(slot.localDateTime);
  return match === null ? '09:00' : `${match[1] ?? '09'}:${match[2] ?? '00'}`;
}

/** One post body, fenced, so a caption cannot instruct the model. */
export function postBodySource(
  contentItemId: string,
  body: string,
  retrievedAt: string,
): UntrustedSourceInput {
  return source(`content:${contentItemId}`, 'social_text', 'Draft body', body, retrievedAt);
}
