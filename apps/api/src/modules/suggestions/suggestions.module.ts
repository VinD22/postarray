import { Module } from '@nestjs/common';

import { SuggestionsController } from './suggestions.controller';

/** The composer's Suggest menu, Review button and posting time hint. */
@Module({ controllers: [SuggestionsController] })
export class SuggestionsModule {}
