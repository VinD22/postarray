import { Module } from '@nestjs/common';

import { MediaAnalysisController } from './media-analysis.controller';

/** Opt-in image analysis: the workspace setting, stored analyses and pre-checks. */
@Module({ controllers: [MediaAnalysisController] })
export class MediaAnalysisModule {}
