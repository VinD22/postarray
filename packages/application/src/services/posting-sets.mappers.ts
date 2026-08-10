import { postingSetTargetDefaultSchema, type PostingSetTargetDefault, type PostingSetView } from '@relay/contracts';

/**
 * Row shape, selection and projection for a Posting Set.
 *
 * Split out of the service the way `queue-rules.mappers.ts` is, so the service
 * file stays a list of use cases and the mapping stays somewhere a reviewer can
 * read in one sitting. Nothing here writes anything.
 */

export const SET_SELECT = {
  id: true,
  workspaceId: true,
  brandId: true,
  name: true,
  description: true,
  connectionIds: true,
  targetDefaults: true,
  signatureId: true,
  approvalPolicy: true,
  slotBehavior: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface PostingSetRow {
  id: string;
  workspaceId: string;
  brandId: string;
  name: string;
  description: string | null;
  connectionIds: string[];
  targetDefaults: unknown;
  signatureId: string | null;
  approvalPolicy: string;
  slotBehavior: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const APPROVAL_POLICIES = new Set([
  'none',
  'single_approver',
  'any_approver',
  'named_approver',
  'policy_auto',
]);

const SLOT_BEHAVIORS = new Set(['next_free_slot', 'pick_time', 'draft_only']);

/**
 * Stored defaults, read back defensively.
 *
 * The column is JSON, so a row written by an older release may carry a shape
 * this build does not recognise. An unparseable entry is dropped rather than
 * guessed at: seeding a composer with a value we could not read would be worse
 * than seeding it with nothing.
 */
export function readTargetDefaults(value: unknown): PostingSetTargetDefault[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const defaults: PostingSetTargetDefault[] = [];
  for (const entry of value) {
    const parsed = postingSetTargetDefaultSchema.safeParse(entry);
    if (parsed.success) {
      defaults.push(parsed.data);
    }
  }
  return defaults;
}

export function toPostingSetView(row: PostingSetRow): PostingSetView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    brandId: row.brandId,
    name: row.name,
    description: row.description,
    connectionIds: [...row.connectionIds],
    targetDefaults: readTargetDefaults(row.targetDefaults),
    signatureId: row.signatureId,
    approvalPolicy: APPROVAL_POLICIES.has(row.approvalPolicy)
      ? (row.approvalPolicy as PostingSetView['approvalPolicy'])
      : 'none',
    slotBehavior: SLOT_BEHAVIORS.has(row.slotBehavior)
      ? (row.slotBehavior as PostingSetView['slotBehavior'])
      : 'next_free_slot',
    archivedAt: row.archivedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

