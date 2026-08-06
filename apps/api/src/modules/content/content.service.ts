import { Inject, Injectable } from '@nestjs/common';
import type {
  Paginated,
  PublishState,
  ValidationResult,
  VariantOverrides,
} from '@relay/contracts';

import type {
  ActorContext,
  CanonicalPreview,
  ContentItemView,
  ContentVersionView,
  CursorQuery,
  PostVariantView,
  Services,
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateDraftInput, TargetInput, UpdateMasterInput } from './content.schemas';

/**
 * Transport-level delegation for content.
 *
 * Override resolution, capability revalidation, duplicate detection and the
 * version freeze all live in `@relay/application`. The composer in the web app,
 * the `draft_post` MCP tool and `relay posts create` reach exactly these calls,
 * which is why a draft made from an agent behaves identically to one typed by a
 * person.
 */
@Injectable()
export class ContentService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  createDraft(ctx: ActorContext, input: CreateDraftInput): Promise<ContentItemView> {
    return this.services.content.createDraft(ctx, input);
  }

  get(ctx: ActorContext, contentItemId: string): Promise<ContentItemView> {
    return this.services.content.get(ctx, contentItemId);
  }

  list(
    ctx: ActorContext,
    query: CursorQuery & { state?: PublishState; brandId?: string; campaignId?: string },
  ): Promise<Paginated<ContentItemView>> {
    return this.services.content.list(ctx, query);
  }

  updateMaster(
    ctx: ActorContext,
    contentItemId: string,
    patch: UpdateMasterInput,
  ): Promise<ContentItemView> {
    return this.services.content.updateMaster(ctx, contentItemId, patch);
  }

  overrideVariant(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string; patch: VariantOverrides },
  ): Promise<PostVariantView> {
    return this.services.content.overrideVariant(ctx, input);
  }

  resetVariantToMaster(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string },
  ): Promise<PostVariantView> {
    return this.services.content.resetVariantToMaster(ctx, input);
  }

  setTargets(
    ctx: ActorContext,
    contentItemId: string,
    targets: readonly TargetInput[],
  ): Promise<ContentItemView> {
    return this.services.content.setTargets(ctx, contentItemId, targets);
  }

  applySet(ctx: ActorContext, contentItemId: string, setId: string): Promise<ContentItemView> {
    return this.services.content.applySet(ctx, contentItemId, setId);
  }

  applySignature(
    ctx: ActorContext,
    input: { contentItemId: string; signatureId: string; targetId?: string },
  ): Promise<ContentItemView> {
    return this.services.content.applySignature(ctx, input.contentItemId, input.signatureId);
  }

  freezeVersion(ctx: ActorContext, contentItemId: string): Promise<ContentVersionView> {
    return this.services.content.freezeVersion(ctx, contentItemId);
  }

  preview(
    ctx: ActorContext,
    input: { contentItemId: string; targetId: string },
  ): Promise<CanonicalPreview> {
    return this.services.content.preview(ctx, input);
  }

  delete(ctx: ActorContext, contentItemId: string): Promise<void> {
    return this.services.content.delete(ctx, contentItemId);
  }

  validate(ctx: ActorContext, contentItemId: string): Promise<ValidationResult> {
    return this.services.validation.validate(ctx, { contentItemId });
  }
}
