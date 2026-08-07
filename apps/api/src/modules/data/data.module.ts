import { Module } from '@nestjs/common';

import { DataController } from './data.controller';
import { DeletionController } from './deletion.controller';
import { DataService } from './data.service';

@Module({ controllers: [DataController, DeletionController], providers: [DataService] })
export class DataModule {}
