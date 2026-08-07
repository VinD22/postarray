import { Module } from '@nestjs/common';

import { DataController } from './data.controller';
import { DataExportContentController } from './data-export-content.controller';
import { DeletionController } from './deletion.controller';
import { DataService } from './data.service';

@Module({
  controllers: [DataController, DataExportContentController, DeletionController],
  providers: [DataService],
})
export class DataModule {}
