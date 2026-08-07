import { Module } from '@nestjs/common';

import { ActionCenterController } from './action-center.controller';
import { ActionCenterService } from './action-center.service';

@Module({ controllers: [ActionCenterController], providers: [ActionCenterService] })
export class ActionCenterModule {}
