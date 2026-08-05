import { Module } from '@nestjs/common';

import { DeveloperAppsController, DeveloperGrantsController } from './developer-apps.controller';
import { DeveloperAppsService } from './developer-apps.service';

@Module({
  controllers: [DeveloperAppsController, DeveloperGrantsController],
  providers: [DeveloperAppsService],
})
export class DeveloperAppsModule {}
