import { Module } from '@nestjs/common';

import {
  DeveloperAppsController,
  DeveloperGrantsController,
} from './developer-apps.controller.js';
import { DeveloperAppsService } from './developer-apps.service.js';

@Module({
  controllers: [DeveloperAppsController, DeveloperGrantsController],
  providers: [DeveloperAppsService],
})
export class DeveloperAppsModule {}
