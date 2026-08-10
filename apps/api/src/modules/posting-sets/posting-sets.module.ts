import { Module } from '@nestjs/common';

import { PostingSetsController } from './posting-sets.controller';
import { PostingSetsService } from './posting-sets.service';
import { TargetMemoryController } from './target-memory.controller';
import { TargetMemoryService } from './target-memory.service';

/**
 * Posting Sets and the composer's remembered target selection.
 *
 * They ship together because they answer the same question from two
 * directions: "who am I posting this to". A Set is the deliberate, shared,
 * reviewable answer; the remembered selection is the private, per-person
 * convenience. Neither carries any campaign content.
 */
@Module({
  controllers: [PostingSetsController, TargetMemoryController],
  providers: [PostingSetsService, TargetMemoryService],
})
export class PostingSetsModule {}
