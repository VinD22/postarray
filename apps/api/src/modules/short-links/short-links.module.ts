import { Module } from '@nestjs/common';

import { ShortLinksController } from './short-links.controller.js';
import { ShortLinksService } from './short-links.service.js';

@Module({ controllers: [ShortLinksController], providers: [ShortLinksService] })
export class ShortLinksModule {}
